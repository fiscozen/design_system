<script setup lang="ts">
/**
 * FzSelect Component
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
 * <FzSelect
 *   v-model="selectedValue"
 *   :options="options"
 *   label="Select an option"
 *   placeholder="Choose..."
 *   environment="frontoffice"
 * />
 */
import { computed, ref, watch, nextTick, onMounted, Ref } from "vue";

import type {
  FzSelectProps,
  FzSelectOptionsProps,
  FzSelectOptionProps,
} from "./types";

import {
  FzFloating,
  FzFloatingPosition,
  useClickOutside,
} from "@fiscozen/composables";

import {
  debounce,
  isSelectableOption,
  applyCustomFilter,
  filterSelectableOptions,
} from "./utils";

import {
  calculateContainerWidth,
  MIN_WIDTH,
  OPTIONS_HEIGHT,
  OPTIONS_BUFFER,
} from "./common";
import FzSelectLabel from "./components/FzSelectLabel.vue";
import FzSelectButton from "./components/FzSelectButton.vue";
import FzSelectHelpError from "./components/FzSelectHelpError.vue";
import FzSelectOptionsList from "./components/FzSelectOptionsList.vue";

const props = withDefaults(defineProps<FzSelectProps>(), {
  clearable: true,
  delayTime: 500,
  disabled: false,
  disableTruncate: false,
  fuzzySearch: true,
  environment: "frontoffice",
  error: false,
  filtrable: false,
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
const buttonRef = ref<InstanceType<typeof FzSelectButton>>();
const optionsListRef = ref<InstanceType<typeof FzSelectOptionsList>>();
const containerWidth = ref<string>(`${MIN_WIDTH}px`);
const openerMaxWidth = ref<string>("none");
const loadedOptionsCount = ref<number>(0);
const focusedIndex = ref<number>(-1);
const optionRefs = ref<Map<string, HTMLElement>>(new Map());
const maxHeight = ref("");
const isScrollingToFocus = ref(false);
const searchValue = ref<string>("");
const debouncedSearchValue = ref<string>("");
const internalFilteredOptions = ref<FzSelectOptionsProps[] | undefined>(
  undefined
);

/**
 * Updates filtered options based on search value
 *
 * Applies filtering strategy based on component configuration:
 * - Custom filterFn (if provided) - takes precedence, can be async
 * - Fuzzy search or simple search (when filtrable with search value)
 * - All options (when filtrable but search is empty, or when not filtrable)
 *
 * For grouped options, preserves labels only for groups with filtered results.
 * Empty input shows all options regardless of filtrable state.
 *
 * Priority: filterFn > fuzzy/simple search > all options
 */
const updateFilteredOptions = async () => {
  // If options is undefined, keep internalFilteredOptions as undefined (will show FzProgress)
  if (props.options === undefined) {
    internalFilteredOptions.value = undefined;
    return;
  }

  // When not filtrable, show all options
  if (!props.filtrable) {
    internalFilteredOptions.value = props.options;
    return;
  }

  // Custom filter function takes precedence (can be async)
  if (props.filterFn) {
    internalFilteredOptions.value = undefined;
    internalFilteredOptions.value = await applyCustomFilter(
      props.filterFn,
      debouncedSearchValue.value
    );
    return;
  }

  // When filtrable but input is empty, show all options
  if (!debouncedSearchValue.value || debouncedSearchValue.value.trim() === "") {
    internalFilteredOptions.value = props.options;
    return;
  }

  // Apply search-based filtering (fuzzy or simple)
  internalFilteredOptions.value = filterSelectableOptions(
    props.options,
    debouncedSearchValue.value,
    props.fuzzySearch ?? true
  );
};

/**
 * Debounced function to update debouncedSearchValue
 * Only used when filtrable is true
 */
const debouncedUpdateSearchValue = debounce(
  (value: unknown) => {
    debouncedSearchValue.value = value as string;
  },
  (props as any).delayTime ?? 500
);

watch(
  () => props.filtrable && searchValue.value,
  (newValue) => {
    // Only watch searchValue when filtrable is true
    // When filtrable is false, searchValue never changes (no input field visible)
    if (props.filtrable && newValue !== undefined) {
      debouncedUpdateSearchValue(newValue);
    }
  },
  { immediate: true }
);

watch(
  debouncedSearchValue,
  () => {
    updateFilteredOptions();
  },
  { immediate: true }
);

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

const containerElement = computed(
  () =>
    optionsListRef.value?.containerElement?.containerElement as
      | HTMLElement
      | undefined
);

const instanceId = Math.random().toString(36).substring(2, 9);
const openerId = `fzselect-opener-${instanceId}`;
const labelId = `fzselect-label-${instanceId}`;

// ============================================================================
// COMPUTED - State Flags
// ============================================================================

const isDisabled = computed(() => props.disabled);
const isReadonly = computed(() => props.readonly);
const isInteractive = computed(() => !isDisabled.value && !isReadonly.value);

// ============================================================================
// COMPUTED - Options
// ============================================================================

const selectedOption = computed(() => {
  if (!props.options || !model.value) return undefined;
  return props.options.find(
    (option): option is FzSelectOptionProps =>
      isSelectableOption(option) && option.value === model.value
  );
});

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

const selectableOptions = computed(() => {
  if (!visibleOptions.value) return [];
  return visibleOptions.value.filter(isSelectableOption);
});

const selectedOptionIndex = computed(() => {
  if (!selectedOption.value) return -1;
  return selectableOptions.value.findIndex(
    (option) => option.value === selectedOption.value?.value
  );
});

const focusedOptionValue = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return null;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return null;
  return selectable[focusedIndex.value]?.value ?? null;
});

const activeDescendantId = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return undefined;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return undefined;
  const focusedOption = selectable[focusedIndex.value];
  return focusedOption
    ? `${openerId}-option-${focusedOption.value}`
    : undefined;
});

const variantProp = computed(() => (props as any).variant);
const rightIconButtonProp = computed(() => props.rightIconButton);
const rightIconButtonVariantProp = computed(() => props.rightIconButtonVariant);

const safeOpener = computed(() => {
  return props.extOpener
    ? props.extOpener
    : (buttonRef.value?.openerButton as HTMLElement | undefined);
});

useClickOutside(safeOpener, () => {
  isOpen.value = false;
});

const emit = defineEmits(["fzselect:select", "fzselect:right-icon-click"]);

// ============================================================================
// FLOATING PANEL
// ============================================================================

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

function updateContainerWidth() {
  if (!safeOpener.value) return;

  const { minWidth, maxWidth } = calculateContainerWidth(safeOpener.value);

  containerWidth.value = `${minWidth}px`;
  openerMaxWidth.value = `${maxWidth}px`;
}

// ============================================================================
// EVENT HANDLERS - Opener
// ============================================================================

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
 * Opens dropdown if closed and component is interactive
 *
 * Checks interactivity state and opens the dropdown if it's currently closed,
 * then updates container width for proper positioning.
 */
function openDropdownIfClosed() {
  if (!isInteractive.value) return;
  if (!isOpen.value) {
    isOpen.value = true;
    updateContainerWidth();
  }
}

const handleInputFocus = (event: FocusEvent) => {
  openDropdownIfClosed();
};

const handleInputClick = (event: MouseEvent) => {
  openDropdownIfClosed();
};

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

const handleSelect = (option: FzSelectOptionProps) => {
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

  emit("fzselect:select", model.value);
  isOpen.value = false;
};

/**
 * Handles clear icon click
 *
 * Resets the selected value and related state when user clicks the clear icon.
 */
const handleClearClick = () => {
  if (!isInteractive.value) return;

  model.value = undefined;
  searchValue.value = "";
  internalFilteredOptions.value = props.options;

  emit("fzselect:select", model.value);
  isOpen.value = false;
};

/**
 * Handles keyboard navigation in options list
 *
 * Navigates through all options (including disabled/readonly) for WCAG compliance.
 * Escape always closes dropdown, even when no options are available.
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

const handleRegisterRef = (value: string, element: HTMLElement | undefined) => {
  if (element) {
    optionRefs.value.set(value, element);
  } else {
    optionRefs.value.delete(value);
  }
};

const handleOptionFocus = (value: string) => {
  if (!isOpen.value) return;
  const selectable = selectableOptions.value;
  const index = selectable.findIndex((opt) => opt.value === value);
  if (index >= 0) {
    focusedIndex.value = index;
  }
};

/**
 * Scrolls focused option into view and applies native focus
 *
 * Uses native focus() for visual state and accessibility.
 * Blurs current element first to ensure Tab navigation works with disabled options.
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
            console.warn("[FzSelect] Failed to focus option:", error);
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

function resetScrollPosition() {
  nextTick(() => {
    const container = containerElement.value;
    if (container) {
      container.scrollTop = 0;
    }
  });
}

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
              // Check again in case selectedOption was cleared during nextTick
              if (!selectedOption.value) {
                resetScrollPosition();
                return;
              }
              const selectedOptionElement = optionRefs.value.get(
                selectedOption.value.value
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
                    "[FzSelect] Failed to scroll to selected option:",
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
  if (props.size !== undefined) {
    console.warn(
      `[FzSelect] The 'size' prop is deprecated and will be removed in a future version. ` +
        `The component now uses a fixed 'lg' size. Please remove the size prop from your usage.`
    );
  }

  if (props.selectProps !== undefined) {
    console.warn(
      `[FzSelect] The 'selectProps' prop is deprecated and will be removed in a future version. ` +
        `Please use the 'options' prop instead.`
    );
  }

  if (props.inputProps !== undefined) {
    console.warn(
      `[FzSelect] The 'inputProps' prop is deprecated and will be removed in a future version. ` +
        `Please use the 'options' prop instead.`
    );
  }

  if (props.filteredOptions !== undefined) {
    console.warn(
      `[FzSelect] The 'filteredOptions' prop is deprecated and will be removed in a future version. ` +
        `Please use the 'options' prop instead.`
    );
  }

  if (props.disableEmitOnFocus !== undefined) {
    console.warn(
      `[FzSelect] The 'disableEmitOnFocus' prop is deprecated and will be removed in a future version. ` +
        `The component no longer emits input events on focus, so this prop has no effect. Please remove it from your usage.`
    );
  }

  if (props.emptySearchNoFilter !== undefined) {
    console.warn(
      `[FzSelect] The 'emptySearchNoFilter' prop is deprecated and will be removed in a future version. ` +
        `The component now always shows all options when the input is empty, so this prop has no effect. Please remove it from your usage.`
    );
  }

  if (
    (props as any).rightIconLast !== undefined &&
    (props as any).rightIconLast !== false
  ) {
    console.warn(
      `[FzSelect] The 'rightIconLast' prop is deprecated and will be removed in a future version. ` +
        `The right icon is now always positioned before the chevron. Please remove the rightIconLast prop from your usage.`
    );
  }

  if (props.floatingPanelMaxHeight) {
    maxHeight.value = props.floatingPanelMaxHeight;
  }
  nextTick(() => {
    updateContainerWidth();
  });
});

// ============================================================================
// EXPOSE
// ============================================================================

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
    @fzfloating:setPosition="calculateMaxHeight"
  >
    <template #opener-start>
      <FzSelectLabel
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
      <FzSelectButton
        v-model="searchValue"
        :clearable
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
        @right-icon-click="emit('fzselect:right-icon-click')"
        @clear-click="handleClearClick"
        ref="buttonRef"
      >
        <template #default="slotProps">
          <slot name="opener" v-bind="{ ...slotProps, floating }" />
        </template>
      </FzSelectButton>
    </template>

    <template #opener-end>
      <FzSelectHelpError :error :disabled :readonly>
        <template #error>
          <slot name="error" />
        </template>
        <template #help>
          <slot name="help" />
        </template>
      </FzSelectHelpError>
    </template>

    <FzSelectOptionsList
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
