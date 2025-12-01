<script setup lang="ts">
/**
 * FzSelect Component
 *
 * A dropdown select component with floating panel positioning, lazy loading, and keyboard navigation.
 * Supports grouped options, custom icons, error/help states, floating label variant, and environment-based styling.
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
import {
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
  disabled: false,
  disableTruncate: false,
  environment: "frontoffice",
  error: false,
  noResultsMessage: "Nessun risultato trovato",
  optionsToShow: 25,
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
// DEPRECATION WARNINGS
// ============================================================================

// Track if we've already shown the deprecation warning for this instance
const sizeWarningShown = ref(false);
const rightIconLastWarningShown = ref(false);

// Warn if deprecated size prop is used
watch(
  () => props.size,
  (newSize) => {
    if (!sizeWarningShown.value && newSize !== undefined) {
      console.warn(
        `[FzSelect] The 'size' prop is deprecated and will be removed in a future version. ` +
          `The component now uses a fixed 'lg' size. Please remove the size prop from your usage.`
      );
      sizeWarningShown.value = true;
    }
  },
  { immediate: true }
);

// Warn if deprecated rightIconLast prop is used
watch(
  () => props.rightIconLast,
  (newValue) => {
    if (
      !rightIconLastWarningShown.value &&
      newValue !== undefined &&
      newValue !== false
    ) {
      console.warn(
        `[FzSelect] The 'rightIconLast' prop is deprecated and will be removed in a future version. ` +
          `The right icon is now always positioned before the chevron. Please remove the rightIconLast prop from your usage.`
      );
      rightIconLastWarningShown.value = true;
    }
  },
  { immediate: true }
);

// ============================================================================
// STATE
// ============================================================================

const isOpen = ref(false);
const buttonRef = ref<InstanceType<typeof FzSelectButton>>();
const optionsListRef = ref<InstanceType<typeof FzSelectOptionsList>>();
const containerWidth = ref<string>(`${MIN_WIDTH}px`);
const openerMaxWidth = ref<string>("none");
const visibleOptions = ref<FzSelectOptionsProps[]>([]);
const focusedIndex = ref<number>(-1);
const optionRefs = ref<Map<string, HTMLElement>>(new Map());
const maxHeight = ref("");
const floatingRef = ref<InstanceType<typeof FzFloating>>();
const isScrollingToFocus = ref(false);

/**
 * Computed ref to the actual HTML element inside FzSelectOptionsList
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

/**
 * Type guard to filter selectable options
 */
const isSelectableOption = (
  option: FzSelectOptionsProps
): option is FzSelectOptionProps => option.kind !== "label";

/**
 * Finds the currently selected option from options list
 */
const selectedOption = computed(() => {
  return props.options.find(
    (option): option is FzSelectOptionProps =>
      isSelectableOption(option) && option.value === model.value
  );
});

/**
 * Gets list of selectable options (excluding labels) from visible options
 */
const selectableOptions = computed(() => {
  return visibleOptions.value.filter(isSelectableOption);
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
 * Gets the value of the currently focused option
 */
const focusedOptionValue = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return null;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return null;
  return selectable[focusedIndex.value]?.value ?? null;
});

/**
 * Gets the ID of the currently focused option (for aria-activedescendant)
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

// Styling logic moved to individual components (FzSelectLabel, FzSelectButton, FzSelectHelpError)

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

const emit = defineEmits(["select", "fzselect:right-icon-click"]);

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
  isOpen.value = !isOpen.value;
  updateContainerWidth();
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

// ============================================================================
// EVENT HANDLERS - Options
// ============================================================================

/**
 * Handles option selection
 */
const handleSelect = (option: FzSelectOptionProps) => {
  if (props.clearable && model.value === option.value) {
    model.value = undefined;
  } else {
    model.value = option.value;
  }

  emit("select", model.value);
  isOpen.value = false;
};

/**
 * Handles keyboard events on options container
 */
const handleOptionsKeydown = (event: KeyboardEvent) => {
  const selectable = selectableOptions.value;
  if (selectable.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      focusedIndex.value =
        focusedIndex.value < selectable.length - 1 ? focusedIndex.value + 1 : 0;
      scrollToFocusedOption();
      break;

    case "ArrowUp":
      event.preventDefault();
      focusedIndex.value =
        focusedIndex.value > 0 ? focusedIndex.value - 1 : selectable.length - 1;
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
      if (event.shiftKey) {
        if (focusedIndex.value <= 0) {
          focusedIndex.value = selectable.length - 1;
        } else {
          focusedIndex.value--;
        }
      } else {
        if (focusedIndex.value >= selectable.length - 1) {
          focusedIndex.value = 0;
        } else {
          focusedIndex.value++;
        }
      }
      scrollToFocusedOption();
      break;
  }
};

/**
 * Handles ref registration from FzSelectOptionsList
 */
const handleRegisterRef = (value: string, element: HTMLElement | undefined) => {
  if (element) {
    optionRefs.value.set(value, element);
  } else {
    optionRefs.value.delete(value);
  }
};

/**
 * Scrolls the focused option into view
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

    const focusedButton = optionRefs.value.get(focusedOption.value);
    if (focusedButton && document.contains(focusedButton)) {
      isScrollingToFocus.value = true;

      requestAnimationFrame(() => {
        if (isOpen.value && document.contains(focusedButton)) {
          try {
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

/**
 * Attaches scroll listener to options container for lazy loading
 */
function addScrollListener() {
  const element = containerElement.value;
  element?.addEventListener("scroll", handleScroll);
}

/**
 * Handles scroll events to trigger lazy loading of options
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
 * Loads next batch of options for lazy rendering
 */
function updateVisibleOptions() {
  // Guard: don't load if all options are already visible
  if (visibleOptions.value.length >= props.options.length) {
    return;
  }

  const nextItems = props.options.slice(
    visibleOptions.value.length,
    visibleOptions.value.length + props.optionsToShow
  );
  visibleOptions.value.push(...nextItems);
}

/**
 * Ensures the selected option is in the visible range
 * Loads enough options to include the selected option if it's beyond the current visible range
 */
function ensureSelectedOptionVisible() {
  if (!selectedOption.value) return; // No selection

  // Find the index of the selected option in props.options (including labels)
  const optionIndexInFullArray = props.options.findIndex(
    (opt) =>
      isSelectableOption(opt) && opt.value === selectedOption.value?.value
  );

  if (optionIndexInFullArray < 0) return; // Should not happen, but safety check

  // Check if we need to load more options
  // We want to ensure the option at optionIndexInFullArray is in visibleOptions
  while (visibleOptions.value.length <= optionIndexInFullArray) {
    if (visibleOptions.value.length >= props.options.length) {
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
  () => props.options,
  () => {
    visibleOptions.value = props.options.slice(0, props.optionsToShow);
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
      const selectable = selectableOptions.value;
      if (selectable.length === 0) {
        focusedIndex.value = -1;
        return;
      }
      focusedIndex.value =
        selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
      scrollToFocusedOption();
    });
  } else {
    focusedIndex.value = -1;
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
  if (props.floatingPanelMaxHeight) {
    maxHeight.value = props.floatingPanelMaxHeight;
  }
  updateContainerWidth();
  addScrollListener();
  // Note: visibleOptions is already initialized by watch(() => props.options)
  // No need to call updateVisibleOptions() here
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
    :position="position ?? 'auto-vertical-start'"
    ref="floatingRef"
    :isOpen
    class="flex flex-col gap-8 overflow-visible"
    :teleport="teleport"
    :useViewport="true"
    contentClass="z-70"
    @fzfloating:setPosition="calculateMaxHeight"
  >
    <template #opener-start>
      <FzSelectLabel
        v-if="label"
        :labelId
        :openerId
        :label
        :required
        :disabled
        :readonly
      />
    </template>

    <template #opener="{ floating }">
      <FzSelectButton
        :openerId
        :labelId
        :label
        :placeholder
        :selectedOption
        :isOpen
        :required
        :disabled
        :readonly
        :error
        :leftIcon
        :rightIcon
        :rightIconButton
        :rightIconButtonVariant
        :variant
        :environment
        :pickerClass
        @click="handlePickerClick"
        @keydown="handleOpenerKeydown"
        @right-icon-click="emit('fzselect:right-icon-click')"
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
      ref="optionsListRef"
    />
  </FzFloating>
</template>
