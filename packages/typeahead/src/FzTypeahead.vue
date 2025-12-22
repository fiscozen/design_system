<script setup lang="ts">
/**
 * FzTypeahead Component
 *
 * A dropdown typeahead component with floating panel positioning, lazy loading, and keyboard navigation.
 * Supports grouped options, custom icons, error/help states, and environment-based styling.
 *
 * Features:
 * - Environment-aware styling (backoffice/frontoffice)
 * - Lazy loading for large option lists
 * - Grouped options with label separators
 * - Custom icons (left and right positions)
 * - Error and help states with custom slots
 * - Full keyboard navigation support
 * - Focus management with focus trap
 * - Readonly state support
 * - WCAG 2.1 AA compliant accessibility
 *
 * @component
 * @example
 * <FzTypeahead
 *   v-model="selectedValue"
 *   :options="options"
 *   label="Select an option"
 *   placeholder="Choose..."
 *   environment="frontoffice"
 * />
 */
import {
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  Ref,
} from "vue";
import {
  FzTypeaheadProps,
  FzTypeaheadOptionsProps,
  FzTypeaheadOptionProps,
} from "./types";
import {
  FzFloating,
  FzFloatingPosition,
  useClickOutside,
} from "@fiscozen/composables";
import {
  calculateContainerWidth,
  MIN_WIDTH,
  OPTIONS_HEIGHT,
  OPTIONS_BUFFER,
} from "./common";
import FzTypeaheadLabel from "./components/FzTypeaheadLabel.vue";
import FzTypeaheadButton from "./components/FzTypeaheadButton.vue";
import FzTypeaheadHelpError from "./components/FzTypeaheadHelpError.vue";
import FzTypeaheadOptionsList from "./components/FzTypeaheadOptionsList.vue";
import Fuse from "fuse.js";
import { debounce } from "./utils";

const props = withDefaults(defineProps<FzTypeaheadProps>(), {
  clearable: true,
  delayTime: 500,
  disabled: false,
  disableTruncate: false,
  environment: "frontoffice",
  error: false,
  filtrable: true,
  noResultsMessage: "Nessun risultato trovato",
  optionsToShow: 25,
  position: "auto-vertical-start",
  readonly: false,
  required: false,
  rightIconButton: false,
  rightIconButtonVariant: "invisible",
  teleport: true,
  variant: "normal",
});

const model = defineModel<string | undefined>({
  required: true,
  default: undefined,
});

// ============================================================================
// STATE
// ============================================================================

const isOpen = ref(false);
const buttonRef = ref<InstanceType<typeof FzTypeaheadButton>>();
const optionsListRef = ref<InstanceType<typeof FzTypeaheadOptionsList>>();
const containerWidth = ref<string>(`${MIN_WIDTH}px`);
const openerMaxWidth = ref<string>("none");
const loadedOptionsCount = ref<number>(0);
const focusedIndex = ref<number>(-1);
const optionRefs = ref<Map<string, HTMLElement>>(new Map());
const maxHeight = ref("");
const floatingRef = ref<InstanceType<typeof FzFloating>>();
const isScrollingToFocus = ref(false);
const searchValue = ref<string>("");
const debouncedSearchValue = ref<string>("");
const internalFilteredOptions = ref<FzTypeaheadOptionsProps[] | undefined>(
  undefined
);

/**
 * Fuse.js options for fuzzy search
 */
const fuseOptions = {
  keys: ["label"],
};

/**
 * Debounced function to update debouncedSearchValue after user stops typing
 * Recreated when delayTime changes
 */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Reconstructs grouped options structure after filtering
 *
 * Filters only selectable options (not labels), then rebuilds groups
 * keeping only labels for groups that contain at least one filtered option.
 *
 * @param allOptions - Original options array (with labels and options)
 * @param filteredSelectableOptions - Filtered selectable options only (no labels)
 * @returns Reconstructed options array with labels and filtered options
 */
const reconstructGroupedOptions = (
  allOptions: FzTypeaheadOptionsProps[],
  filteredSelectableOptions: FzTypeaheadOptionProps[]
): FzTypeaheadOptionsProps[] => {
  const result: FzTypeaheadOptionsProps[] = [];
  const filteredValues = new Set(
    filteredSelectableOptions.map((opt) => opt.value)
  );

  let currentGroupLabel: FzTypeaheadOptionsProps | null = null;
  let labelAdded = false; // Track if current group label has been added

  for (const item of allOptions) {
    if (item.kind === "label") {
      // Start new group - reset tracking
      currentGroupLabel = item;
      labelAdded = false;
    } else if (isSelectableOption(item)) {
      // Check if this option is in the filtered list
      if (filteredValues.has(item.value)) {
        // Add group label only once, before the first filtered option in the group
        if (currentGroupLabel && !labelAdded) {
          result.push(currentGroupLabel);
          labelAdded = true;
        }
        // Add the filtered option
        result.push(item);
      }
    }
  }

  return result;
};

/**
 * Updates internal filtered options based on search value
 *
 * Applies filtering logic based on filtrable prop, custom filterFn, or Fuse.js search.
 * When input is empty, shows all available options.
 * Handles both sync and async filterFn.
 *
 * For grouped options, filters only selectable options and reconstructs groups
 * keeping only labels for groups that contain at least one filtered option.
 *
 * Note: If filterFn is async and called multiple times rapidly, we simply show
 * the last result received. Race condition handling is the developer's responsibility.
 */
const updateFilteredOptions = async () => {
  // If options is undefined, keep internalFilteredOptions as undefined (will show FzProgress)
  if (props.options === undefined) {
    internalFilteredOptions.value = undefined;
  } else if (props.filtrable) {
    if (props.filterFn) {
      // Custom filter function takes precedence (can be async)
      internalFilteredOptions.value = undefined;
      try {
        const result = await props.filterFn(debouncedSearchValue.value);
        internalFilteredOptions.value = result || [];
      } catch (error) {
        console.error("[FzTypeahead] Error in filterFn:", error);
        internalFilteredOptions.value = [];
      }
    } else if (
      debouncedSearchValue.value &&
      debouncedSearchValue.value.trim() !== ""
    ) {
      // Only filter when input has a value (using debounced value)
      // Filter only selectable options (exclude labels)
      const selectableOptions = props.options.filter(isSelectableOption);
      const fuse = new Fuse(selectableOptions, fuseOptions);
      const filteredSelectable = fuse
        .search(debouncedSearchValue.value)
        .map((searchRes: { item: FzTypeaheadOptionProps }) => searchRes.item);

      // Reconstruct grouped structure if original had groups
      const hasGroups = props.options.some((opt) => opt.kind === "label");
      if (hasGroups) {
        internalFilteredOptions.value = reconstructGroupedOptions(
          props.options,
          filteredSelectable
        );
      } else {
        internalFilteredOptions.value = filteredSelectable;
      }
    } else {
      // When filtrable but input is empty, show all options
      internalFilteredOptions.value = props.options;
    }
  } else {
    // Default: show all options (when not filtrable)
    internalFilteredOptions.value = props.options;
  }
};

/**
 * Watch searchValue and update debouncedSearchValue after delay
 */
watch(
  searchValue,
  (newValue) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (props.filtrable) {
      // Apply debounce when filtrable
      debounceTimer = setTimeout(() => {
        debouncedSearchValue.value = newValue;
      }, props.delayTime);
    } else {
      // If not filtrable, update immediately
      debouncedSearchValue.value = newValue;
    }
  },
  { immediate: true }
);

/**
 * Watch debouncedSearchValue and update filtered options
 */
watch(
  debouncedSearchValue,
  () => {
    updateFilteredOptions();
  },
  { immediate: true }
);

/**
 * Watch props.options to update filtered options when options change
 * When filtrable is false, also reset loadedOptionsCount (like FzSelect)
 */
watch(
  () => props.options,
  () => {
    updateFilteredOptions();
    // When not filtrable, reset loaded count when options change (like FzSelect)
    if (!props.filtrable) {
      loadedOptionsCount.value = Math.min(
        props.optionsToShow,
        props.options?.length || 0
      );
    }
  },
  { immediate: true }
);

/**
 * Computed ref to the actual HTML element inside FzTypeaheadOptionsList
 */
const containerElement = computed(
  () =>
    optionsListRef.value?.containerElement?.containerElement as
      | HTMLElement
      | undefined
);

/**
 * Unique IDs for accessibility attributes
 */
const instanceId = Math.random().toString(36).substring(2, 9);
const openerId = `fztypeahead-opener-${instanceId}`;
const labelId = `fztypeahead-label-${instanceId}`;

// ============================================================================
// COMPUTED - State Flags
// ============================================================================

const isDisabled = computed(() => props.disabled);
const isReadonly = computed(() => props.readonly);
const isInteractive = computed(() => !isDisabled.value && !isReadonly.value);

// ============================================================================
// COMPUTED - Options
// ============================================================================

/**
 * Type guard to filter selectable options
 */
const isSelectableOption = (
  option: FzTypeaheadOptionsProps
): option is FzTypeaheadOptionProps => option.kind !== "label";

/**
 * Finds the currently selected option from options list
 * When filtrable is false, uses props.options directly (like FzSelect)
 * When filtrable is true, uses internalFilteredOptions
 */
const selectedOption = computed(() => {
  // When not filtrable, behave exactly like FzSelect
  if (!props.filtrable) {
    if (!props.options) return undefined;
    return props.options.find(
      (option): option is FzTypeaheadOptionProps =>
        isSelectableOption(option) && option.value === model.value
    );
  }
  // When filtrable, use internal filtered options
  if (!internalFilteredOptions.value) return undefined;
  return internalFilteredOptions.value.find(
    (option): option is FzTypeaheadOptionProps =>
      isSelectableOption(option) && option.value === model.value
  );
});

/**
 * Computed property for visible options based on lazy loading count
 *
 * When filtrable is false, uses props.options directly (like FzSelect).
 * When filtrable is true, uses internalFilteredOptions.
 * Automatically updates when options or loadedOptionsCount changes.
 * Returns undefined when filtrable is true and internalFilteredOptions is undefined (loading state).
 */
const visibleOptions = computed(() => {
  // When not filtrable, behave exactly like FzSelect
  if (!props.filtrable) {
    if (!props.options) return [];
    return props.options.slice(0, loadedOptionsCount.value);
  }
  // When filtrable, use internal filtered options
  if (!internalFilteredOptions.value) return undefined;
  return internalFilteredOptions.value.slice(0, loadedOptionsCount.value);
});

/**
 * Gets list of selectable options (excluding labels) from visible options
 */
const selectableOptions = computed(() => {
  if (!visibleOptions.value) return [];
  return visibleOptions.value.filter(isSelectableOption);
});

/**
 * Gets list of enabled (non-disabled and non-readonly) selectable options
 * Used for internal logic (e.g., finding next enabled option when needed)
 * Note: Keyboard navigation now uses selectableOptions (includes disabled/readonly) for WCAG compliance
 */
const enabledOptions = computed(() => {
  return selectableOptions.value.filter(
    (option) => !option.disabled && !option.readonly
  );
});

/**
 * Gets the index of the selected option in selectableOptions (visible subset)
 */
const selectedOptionIndex = computed(() => {
  if (!selectedOption.value) return -1;
  return selectableOptions.value.findIndex(
    (option) => option.value === selectedOption.value?.value
  );
});

/**
 * Gets the value of the currently focused option (for ARIA activeDescendant)
 * Uses selectableOptions to navigate through all options (including disabled/readonly) for WCAG compliance
 */
const focusedOptionValue = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return null;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return null;
  return selectable[focusedIndex.value]?.value ?? null;
});

/**
 * Gets the ID of the currently active descendant (for ARIA activeDescendant)
 * Uses selectableOptions to navigate through all options (including disabled/readonly) for WCAG compliance
 */
const activeDescendantId = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return undefined;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return undefined;
  const focusedOption = selectable[focusedIndex.value];
  return focusedOption
    ? `${openerId}-option-${focusedOption.value}`
    : undefined;
});

// Styling logic moved to individual components (FzTypeaheadLabel, FzTypeaheadButton, FzTypeaheadHelpError)

/**
 * Type-safe access to variant prop (only available when filtrable is false)
 */
const variantProp = computed(() => (props as any).variant);

/**
 * Type-safe access to rightIconButton prop (only available when filtrable is false)
 */
const rightIconButtonProp = computed(() => (props as any).rightIconButton);

/**
 * Type-safe access to rightIconButtonVariant prop (only available when filtrable is false)
 */
const rightIconButtonVariantProp = computed(
  () => (props as any).rightIconButtonVariant
);

/**
 * Resolves the opener element reference
 */
const safeOpener = computed(() => {
  return props.extOpener
    ? props.extOpener
    : (buttonRef.value?.openerButton as HTMLElement | undefined);
});

useClickOutside(safeOpener, () => {
  isOpen.value = false;
});

const emit = defineEmits([
  "fztypeahead:select",
  "fztypeahead:right-icon-click",
]);

// ============================================================================
// FLOATING PANEL
// ============================================================================

/**
 * Calculates max height for floating panel based on available viewport space
 */
const calculateMaxHeight = (
  _rect: Ref<DOMRect | undefined>,
  openerRect: Ref<DOMRect | undefined>,
  _containerRect: Ref<DOMRect | undefined>,
  position: Ref<FzFloatingPosition>,
  actualPosition: Ref<FzFloatingPosition | undefined>
): void => {
  nextTick(() => {
    if (props.floatingPanelMaxHeight) {
      return;
    }
    const bottom = openerRect.value?.bottom ?? 0;
    const top = openerRect.value?.top ?? 0;
    const pos = actualPosition.value ? actualPosition.value : position.value;
    maxHeight.value = pos.includes("bottom")
      ? `calc(100vh - ${bottom}px - ${OPTIONS_BUFFER * OPTIONS_HEIGHT}px)`
      : `${top}px`;
  });
};

/**
 * Updates container width based on opener element dimensions
 */
function updateContainerWidth() {
  if (!safeOpener.value) return;

  const { minWidth, maxWidth } = calculateContainerWidth(safeOpener.value);

  containerWidth.value = `${minWidth}px`;
  openerMaxWidth.value = `${maxWidth}px`;
}

// ============================================================================
// EVENT HANDLERS - Opener
// ============================================================================

/**
 * Handles picker button click to toggle dropdown
 */
const handlePickerClick = () => {
  if (!isInteractive.value) return;
  const wasOpen = isOpen.value;
  isOpen.value = !isOpen.value;

  // Update container width when opening (not when closing)
  if (!wasOpen && isOpen.value) {
    nextTick(() => {
      updateContainerWidth();
    });
  }
};

/**
 * Handles keyboard events on opener button
 */
const handleOpenerKeydown = (event: KeyboardEvent) => {
  if (!isInteractive.value) return;

  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      if (!isOpen.value) {
        isOpen.value = true;
        updateContainerWidth();
      }
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        isOpen.value = false;
      }
      break;
  }
};

/**
 * Handles input focus event
 */
const handleInputFocus = (event: FocusEvent) => {
  if (!isInteractive.value) return;
  if (!isOpen.value) {
    isOpen.value = true;
    updateContainerWidth();
  }
};

/**
 * Handles input click event
 */
const handleInputClick = (event: MouseEvent) => {
  if (!isInteractive.value) return;
  if (!isOpen.value) {
    isOpen.value = true;
    updateContainerWidth();
  }
};

/**
 * Handles keyboard events on input element
 */
const handleInputKeydown = (event: KeyboardEvent) => {
  if (!isInteractive.value) return;

  if (!isOpen.value) {
    // If dropdown is closed, only handle keys that open it
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      isOpen.value = true;
      updateContainerWidth();
    }
  } else {
    // If dropdown is open
    if (props.filtrable && event.key === "Tab" && !event.shiftKey) {
      // When filtrable and Tab is pressed, move focus to selected option (or first)
      event.preventDefault();
      const selectable = selectableOptions.value;
      if (selectable.length > 0) {
        // Set focusedIndex to selected option index, or 0 if no selection
        focusedIndex.value =
          selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
        scrollToFocusedOption();
      }
    } else {
      // Delegate other keys to options keyboard handler
      handleOptionsKeydown(event);
    }
  }
};

// ============================================================================
// EVENT HANDLERS - Options
// ============================================================================

/**
 * Handles option selection
 */
const handleSelect = (option: FzTypeaheadOptionProps) => {
  // Don't select if option is disabled or readonly
  if (option.disabled || option.readonly) return;

  if (props.clearable && model.value === option.value) {
    // Deselect if clicking the same option and clearable is enabled
    model.value = undefined;
  } else {
    // Select the option (or re-select if already selected and clearable is false)
    model.value = option.value;
  }

  // Reset search value and filtered options when selection is made
  searchValue.value = "";
  // Reset internalFilteredOptions to show all options on next open
  internalFilteredOptions.value = props.options;

  emit("fztypeahead:select", model.value);
  isOpen.value = false;
};

/**
 * Handles keyboard events on options container
 * Navigates through all selectable options (including disabled/readonly) for WCAG compliance
 * Escape key is handled first to ensure dropdown can always be closed
 */
const handleOptionsKeydown = (event: KeyboardEvent) => {
  const selectable = selectableOptions.value;
  if (selectable.length === 0) {
    // If no options, only allow Escape to close
    if (event.key === "Escape") {
      event.preventDefault();
      isOpen.value = false;
      focusedIndex.value = -1;
    }
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      // If no option is focused yet, start from selected option (or first if none selected)
      if (focusedIndex.value < 0) {
        focusedIndex.value =
          selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
      } else {
        focusedIndex.value =
          focusedIndex.value < selectable.length - 1
            ? focusedIndex.value + 1
            : 0;
      }
      scrollToFocusedOption();
      break;

    case "ArrowUp":
      event.preventDefault();
      // If no option is focused yet, start from selected option (or last if none selected)
      if (focusedIndex.value < 0) {
        focusedIndex.value =
          selectedOptionIndex.value >= 0
            ? selectedOptionIndex.value
            : selectable.length - 1;
      } else {
        focusedIndex.value =
          focusedIndex.value > 0
            ? focusedIndex.value - 1
            : selectable.length - 1;
      }
      scrollToFocusedOption();
      break;

    case "Home":
      event.preventDefault();
      focusedIndex.value = 0;
      scrollToFocusedOption();
      break;

    case "End":
      event.preventDefault();
      focusedIndex.value = selectable.length - 1;
      scrollToFocusedOption();
      break;

    case "Enter":
    case " ":
      event.preventDefault();
      if (focusedIndex.value >= 0 && focusedIndex.value < selectable.length) {
        handleSelect(selectable[focusedIndex.value]);
      }
      break;

    case "Escape":
      event.preventDefault();
      isOpen.value = false;
      focusedIndex.value = -1;
      break;

    case "Tab":
      // Focus trap: prevent Tab from leaving dropdown
      event.preventDefault();
      // If no option is focused yet, start from selected option (or first if none selected)
      if (focusedIndex.value < 0) {
        focusedIndex.value =
          selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
      } else if (event.shiftKey) {
        // Shift+Tab: move to previous option (traverse all options, including disabled/readonly)
        if (focusedIndex.value <= 0) {
          focusedIndex.value = selectable.length - 1;
        } else {
          focusedIndex.value--;
        }
      } else {
        // Tab: move to next option (traverse all options, including disabled/readonly)
        if (focusedIndex.value >= selectable.length - 1) {
          focusedIndex.value = 0;
        } else {
          focusedIndex.value++;
        }
      }
      // Force focus update even if current option is disabled/readonly
      scrollToFocusedOption();
      break;
  }
};

/**
 * Handles ref registration from FzTypeaheadOptionsList
 */
const handleRegisterRef = (value: string, element: HTMLElement | undefined) => {
  if (element) {
    optionRefs.value.set(value, element);
  } else {
    optionRefs.value.delete(value);
  }
};

/**
 * Handles option focus event
 * Updates focusedIndex when user tabs to an option (especially when filtrable is true)
 */
const handleOptionFocus = (value: string) => {
  if (!isOpen.value) return;
  const selectable = selectableOptions.value;
  const index = selectable.findIndex((opt) => opt.value === value);
  if (index >= 0) {
    focusedIndex.value = index;
  }
};

/**
 * Scrolls the focused option into view
 * Applies native focus for visual state (focus:!border-blue-200) and accessibility
 * The visual focus state is managed via native focus and CSS classes, not focused prop
 */
const scrollToFocusedOption = () => {
  if (isScrollingToFocus.value) return;

  nextTick(() => {
    if (!isOpen.value || focusedIndex.value < 0) return;
    const container = containerElement.value;
    if (!container) return;

    const selectable = selectableOptions.value;
    if (focusedIndex.value >= selectable.length || selectable.length === 0)
      return;

    const focusedOption = selectable[focusedIndex.value];
    if (!focusedOption) return;

    // Blur currently focused element to ensure Tab navigation works
    // even when current option is disabled/readonly
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }

    const focusedButton = optionRefs.value.get(focusedOption.value);
    if (focusedButton && document.contains(focusedButton)) {
      isScrollingToFocus.value = true;

      requestAnimationFrame(() => {
        if (isOpen.value && document.contains(focusedButton)) {
          try {
            // Apply focus first for visual state (focus:!border-blue-200), then scroll
            // Even if option is disabled/readonly, we allow focus for keyboard navigation
            focusedButton.focus({ preventScroll: false });
            focusedButton.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          } catch (error) {
            console.warn("[FzTypeahead] Failed to focus option:", error);
          }
        }
        isScrollingToFocus.value = false;
      });
    } else {
      isScrollingToFocus.value = false;
    }
  });
};

// ============================================================================
// LAZY LOADING
// ============================================================================

/**
 * Handles scroll events to trigger lazy loading of options
 *
 * Called via @scroll event from FzTypeaheadOptionsList component.
 * No need for manual addEventListener as Vue handles event cleanup automatically.
 */
function handleScroll() {
  const container = containerElement.value;
  if (!container) return;

  const { scrollTop, scrollHeight, clientHeight } = container;
  if (
    scrollTop + clientHeight >=
    scrollHeight - OPTIONS_BUFFER * OPTIONS_HEIGHT
  ) {
    updateVisibleOptions();
  }
}

/**
 * Resets scroll position of the options container to top
 */
function resetScrollPosition() {
  nextTick(() => {
    const container = containerElement.value;
    if (container) {
      container.scrollTop = 0;
    }
  });
}

/**
 * Loads next batch of options for lazy rendering
 *
 * Increments loadedOptionsCount, which automatically updates visibleOptions
 * computed property through reactive dependency.
 * When filtrable is false, uses props.options directly (like FzSelect)
 */
function updateVisibleOptions() {
  // When not filtrable, behave exactly like FzSelect
  if (!props.filtrable) {
    if (!props.options) return;
    // Guard: don't load if all options are already visible
    if (loadedOptionsCount.value >= props.options.length) {
      return;
    }
    // Increment count to load next batch
    loadedOptionsCount.value = Math.min(
      loadedOptionsCount.value + props.optionsToShow,
      props.options.length
    );
    return;
  }

  // When filtrable, use internal filtered options
  if (!internalFilteredOptions.value) return;

  // Guard: don't load if all options are already visible
  if (loadedOptionsCount.value >= internalFilteredOptions.value.length) {
    return;
  }

  // Increment count to load next batch
  loadedOptionsCount.value = Math.min(
    loadedOptionsCount.value + props.optionsToShow,
    internalFilteredOptions.value.length
  );
}

/**
 * Ensures the selected option is in the visible range
 * Loads enough options to include the selected option if it's beyond the current visible range
 * When filtrable is false, uses props.options directly (like FzSelect)
 */
function ensureSelectedOptionVisible() {
  if (!selectedOption.value) return; // No selection

  // When not filtrable, behave exactly like FzSelect
  if (!props.filtrable) {
    if (!props.options) return;
    // Find the index of the selected option in props.options (including labels)
    const optionIndexInFullArray = props.options.findIndex(
      (opt) =>
        isSelectableOption(opt) && opt.value === selectedOption.value?.value
    );

    if (optionIndexInFullArray < 0) return; // Should not happen, but safety check

    // Check if we need to load more options
    while (loadedOptionsCount.value <= optionIndexInFullArray) {
      if (loadedOptionsCount.value >= props.options.length) {
        break; // All options already loaded
      }
      updateVisibleOptions();
    }
    return;
  }

  // When filtrable, use internal filtered options
  if (!internalFilteredOptions.value) return;

  // Find the index of the selected option in internalFilteredOptions (including labels)
  const optionIndexInFullArray = internalFilteredOptions.value.findIndex(
    (opt) =>
      isSelectableOption(opt) && opt.value === selectedOption.value?.value
  );

  if (optionIndexInFullArray < 0) return; // Should not happen, but safety check

  // Check if we need to load more options
  while (loadedOptionsCount.value <= optionIndexInFullArray) {
    if (loadedOptionsCount.value >= internalFilteredOptions.value.length) {
      break; // All options already loaded
    }
    updateVisibleOptions();
  }
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(model, updateContainerWidth);

watch(
  () => internalFilteredOptions.value,
  (newValue, oldValue) => {
    // Reset scroll position when filtered options change (unless it's the initial load)
    if (oldValue !== undefined && newValue !== oldValue) {
      resetScrollPosition();
    }

    // Reset loaded count when filtered options change
    // visibleOptions computed will automatically update
    if (newValue === undefined) {
      loadedOptionsCount.value = 0;
    } else {
      loadedOptionsCount.value = Math.min(props.optionsToShow, newValue.length);
    }
  },
  { immediate: true }
);

watch(isInteractive, (newIsInteractive) => {
  if (!newIsInteractive && isOpen.value) {
    isOpen.value = false;
  }
});

watch(isOpen, (newValue) => {
  if (newValue) {
    // Ensure selected option is loaded before setting focus
    ensureSelectedOptionVisible();
    nextTick(() => {
      if (props.filtrable) {
        // When filtrable, focus the input instead of the optionlist
        const inputElement = buttonRef.value?.inputRef?.inputRef;
        if (inputElement) {
          inputElement.focus();
        }
        // Don't set focusedIndex when filtrable - user types in input
        focusedIndex.value = -1;

        // Scroll to selected option if one exists, otherwise reset to top
        // Do this without setting focusedIndex to avoid interfering with input focus
        if (selectedOption.value) {
          nextTick(() => {
            requestAnimationFrame(() => {
              const selectedOptionElement = optionRefs.value.get(
                selectedOption.value!.value
              );
              if (
                selectedOptionElement &&
                document.contains(selectedOptionElement)
              ) {
                try {
                  selectedOptionElement.scrollIntoView({
                    block: "nearest",
                    behavior: "auto", // Use 'auto' for instant scroll on open
                  });
                } catch (error) {
                  console.warn(
                    "[FzTypeahead] Failed to scroll to selected option:",
                    error
                  );
                  resetScrollPosition();
                }
              } else {
                // Option not found yet (lazy loading), reset scroll
                resetScrollPosition();
              }
            });
          });
        } else {
          // No selection: reset scroll to top
          resetScrollPosition();
        }
      } else {
        // When not filtrable, behave exactly like FzSelect
        const selectable = selectableOptions.value;
        if (selectable.length === 0) {
          focusedIndex.value = -1;
          return;
        }
        focusedIndex.value =
          selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
        scrollToFocusedOption();
      }
    });
  } else {
    focusedIndex.value = -1;
    // If internalFilteredOptions is empty (user filtered but didn't select), reset everything
    if (
      internalFilteredOptions.value &&
      internalFilteredOptions.value.length === 0
    ) {
      searchValue.value = "";
      internalFilteredOptions.value = props.options;
    }
    nextTick(() => {
      const openerButton = buttonRef.value?.openerButton;
      if (openerButton) {
        openerButton.focus();
      }
    });
  }
});

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Deprecation warnings
  if (props.size !== undefined) {
    console.warn(
      `[FzTypeahead] The 'size' prop is deprecated and will be removed in a future version. ` +
        `The component now uses a fixed 'lg' size. Please remove the size prop from your usage.`
    );
  }

  if (props.selectProps !== undefined) {
    console.warn(
      `[FzTypeahead] The 'selectProps' prop is deprecated and will be removed in a future version. ` +
        `Please use the 'options' prop instead.`
    );
  }

  if (props.inputProps !== undefined) {
    console.warn(
      `[FzTypeahead] The 'inputProps' prop is deprecated and will be removed in a future version. ` +
        `Please use the 'options' prop instead.`
    );
  }

  if (props.filteredOptions !== undefined) {
    console.warn(
      `[FzTypeahead] The 'filteredOptions' prop is deprecated and will be removed in a future version. ` +
        `Please use the 'options' prop instead.`
    );
  }

  if (props.disableEmitOnFocus !== undefined) {
    console.warn(
      `[FzTypeahead] The 'disableEmitOnFocus' prop is deprecated and will be removed in a future version. ` +
        `The component no longer emits input events on focus, so this prop has no effect. Please remove it from your usage.`
    );
  }

  if (props.emptySearchNoFilter !== undefined) {
    console.warn(
      `[FzTypeahead] The 'emptySearchNoFilter' prop is deprecated and will be removed in a future version. ` +
        `The component now always shows all options when the input is empty, so this prop has no effect. Please remove it from your usage.`
    );
  }

  if (
    (props as any).rightIconLast !== undefined &&
    (props as any).rightIconLast !== false
  ) {
    console.warn(
      `[FzTypeahead] The 'rightIconLast' prop is deprecated and will be removed in a future version. ` +
        `The right icon is now always positioned before the chevron. Please remove the rightIconLast prop from your usage.`
    );
  }

  // Initialization
  if (props.floatingPanelMaxHeight) {
    maxHeight.value = props.floatingPanelMaxHeight;
  }
  // Use nextTick to ensure refs are available
  nextTick(() => {
    updateContainerWidth();
  });
  // Note: Scroll events are handled via component event from FzTypeaheadOptionsList (@scroll="handleScroll")
  // Note: loadedOptionsCount is initialized by watch(() => internalFilteredOptions) with immediate: true
  // visibleOptions computed property automatically derives from loadedOptionsCount
});

onBeforeUnmount(() => {
  // Clean up debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

// ============================================================================
// EXPOSE
// ============================================================================

/**
 * Programmatically opens the dropdown
 */
const forceOpen = () => {
  isOpen.value = true;
  if (safeOpener.value) {
    calculateContainerWidth(safeOpener.value);
  }
};

defineExpose({
  handlePickerClick,
  calculateContainerWidth,
  openerMaxWidth,
  forceOpen,
});
</script>

<template>
  <FzFloating
    :isOpen
    :position="position ?? 'auto-vertical-start'"
    :teleport="teleport"
    :useViewport="true"
    class="flex flex-col gap-8 overflow-visible"
    contentClass="z-70"
    ref="floatingRef"
    @fzfloating:setPosition="calculateMaxHeight"
  >
    <template #opener-start>
      <FzTypeaheadLabel
        v-if="label"
        :disabled
        :label
        :labelId
        :openerId
        :readonly
        :required
      />
    </template>

    <template #opener="{ floating }">
      <FzTypeaheadButton
        v-model="searchValue"
        :disabled
        :environment
        :error
        :filtrable
        :isOpen
        :label
        :labelId
        :leftIcon
        :leftIconVariant
        :openerId
        :pickerClass
        :placeholder
        :readonly
        :required
        :rightIcon
        :rightIconButton="rightIconButtonProp"
        :rightIconButtonVariant="rightIconButtonVariantProp"
        :rightIconVariant
        :selectedOption
        :variant="variantProp"
        @click="handlePickerClick"
        @keydown="handleOpenerKeydown"
        @input-focus="handleInputFocus"
        @input-click="handleInputClick"
        @input-keydown="handleInputKeydown"
        @right-icon-click="emit('fztypeahead:right-icon-click')"
        ref="buttonRef"
      >
        <template #default="slotProps">
          <slot name="opener" v-bind="{ ...slotProps, floating }" />
        </template>
      </FzTypeaheadButton>
    </template>

    <template #opener-end>
      <FzTypeaheadHelpError :error :disabled :readonly>
        <template #error>
          <slot name="error" />
        </template>
        <template #help>
          <slot name="help" />
        </template>
      </FzTypeaheadHelpError>
    </template>

    <FzTypeaheadOptionsList
      :openerId
      :visibleOptions
      :focusedOptionValue
      :selectedValue="model"
      :disableTruncate
      :noResultsMessage
      :containerWidth
      :openerMaxWidth
      :maxHeight
      :activeDescendantId
      @select="handleSelect"
      @keydown="handleOptionsKeydown"
      @scroll="handleScroll"
      @register-ref="handleRegisterRef"
      @focus="handleOptionFocus"
      ref="optionsListRef"
    />
  </FzFloating>
</template>
