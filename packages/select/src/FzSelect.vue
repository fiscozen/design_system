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
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import {
  FzFloating,
  FzFloatingPosition,
  useClickOutside,
  useKeyDown,
} from "@fiscozen/composables";
import FzSelectOption from "./components/FzSelectOption.vue";
import {
  calculateContainerWidth,
  MIN_WIDTH,
  OPTIONS_HEIGHT,
  OPTIONS_BUFFER,
} from "./common";
import FzSelectLabel from "./components/FzSelectLabel.vue";

const props = withDefaults(defineProps<FzSelectProps>(), {
  disabled: false,
  disableTruncate: false,
  environment: "frontoffice",
  error: false,
  optionsToShow: 25,
  readonly: false,
  required: false,
  rightIconButton: false,
  rightIconButtonVariant: "invisible",
  teleport: true,
  variant: "normal",
});

const model = defineModel({
  required: true,
  default: "",
});

// Track if we've already shown the deprecation warning for this instance
const sizeWarningShown = ref(false);
const rightIconLastWarningShown = ref(false);

// Warn if deprecated size prop is used
watch(
  () => props.size,
  (newSize) => {
    // Warn once per component instance if size prop is provided
    // Note: withDefaults always provides a value, so we warn if it's not the default 'md'
    // or if it's explicitly set to something else
    if (!sizeWarningShown.value && newSize !== "md") {
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

const isOpen = ref(false);
const opener = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();
const containerWidth = ref<string>(`${MIN_WIDTH}px`);
const openerMaxWidth = ref<string>("none");
const visibleOptions = ref<FzSelectOptionsProps[]>([]);
const focusedIndex = ref<number>(-1);
const optionRefs = ref<Map<string, HTMLElement>>(new Map());
const maxHeight = ref("");
const floatingRef = ref<InstanceType<typeof FzFloating>>();
const isScrollingToFocus = ref(false);

/**
 * Generates unique ID for an option element
 *
 * Used for aria-activedescendant to indicate focused option to screen readers.
 *
 * @param value - Option value
 * @returns Unique ID string
 */
const getOptionId = (value: string) => {
  return `${openerId}-option-${value}`;
};

/**
 * Gets the ID of the currently focused option
 *
 * Used for aria-activedescendant on listbox.
 * Returns undefined when no option is focused.
 */
const activeDescendantId = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return undefined;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return undefined;
  const focusedOption = selectable[focusedIndex.value];
  return focusedOption ? getOptionId(focusedOption.value) : undefined;
});

/**
 * Unique IDs for accessibility attributes
 * Generated once per component instance to ensure stability
 */
const instanceId = Math.random().toString(36).substring(2, 9);
const openerId = `fzselect-opener-${instanceId}`;
const labelId = `fzselect-label-${instanceId}`;

/**
 * Determines if normal placeholder should be shown
 *
 * In floating-label variant, placeholder is only shown when no value is selected.
 * In normal variant, placeholder is always shown when no value is selected.
 */
const showNormalPlaceholder = computed(() => {
  return (
    !(props.variant === "floating-label") ||
    (props.variant === "floating-label" && !model.value)
  );
});

/**
 * Calculates max height for floating panel based on available viewport space
 *
 * Dynamically adjusts panel height to prevent overflow when positioned above or below opener.
 * Uses OPTIONS_BUFFER to reserve space for smooth scrolling near viewport edges.
 *
 * @param _rect - Floating container rect (unused but required by FzFloating callback)
 * @param openerRect - Opener element rect for position calculation
 * @param _containerRect - Container rect (unused but required by FzFloating callback)
 * @param position - Preferred floating position
 * @param actualPosition - Actual floating position after auto-adjustment
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
    // REMOVED: floatingRef.value?.setPosition() - this caused infinite loop
    // setPosition is already called by FzFloating when needed
  });
};

/**
 * Resolves the opener element reference
 *
 * Uses external opener if provided, otherwise falls back to internal ref.
 * This allows the select to be controlled by an external element when needed.
 */
const safeOpener = computed(() => {
  return props.extOpener ? props.extOpener : opener.value;
});

useClickOutside(safeOpener, () => {
  isOpen.value = false;
});

const emit = defineEmits(["select", "fzselect:right-icon-click"]);

/**
 * Whether the select is interactive (not disabled)
 */
const isInteractive = computed(() => !props.disabled && !props.readonly);

/**
 * Base classes for picker button
 *
 * Common styling shared across all environments:
 * - Padding: 10px left/right
 * - Background: core-white
 * - Border: 1px solid grey-300, 4px radius
 * - Gap: 8px between elements
 * - Vertical alignment: centered
 */
const staticPickerClass =
  "flex justify-between items-center px-10 bg-core-white rounded border-1 border-grey-300 w-full gap-8 text-left relative outline-none focus:outline-none";

/**
 * Environment-based picker button classes
 *
 * Defines styling classes for backoffice and frontoffice environments.
 * Both environments share the same base styling with padding, background, border, gap, and vertical alignment.
 * Heights differ: backoffice uses 32px, frontoffice uses 44px.
 */
const environmentPickerClasses = {
  backoffice: "h-32 text-base",
  frontoffice: "h-44 text-lg",
} as const;

/**
 * Computes picker button classes based on variant and environment
 *
 * Applies environment-specific height and text size:
 * - Floating-label variant: fixed height 40px
 * - Normal variant: environment-based (backoffice: 32px, frontoffice: 44px)
 * Combines with state classes from evaluateProps().
 */
const computedPickerClass = computed(() => [
  props.variant === "floating-label"
    ? "h-40 text-sm pr-6"
    : environmentPickerClasses[props.environment],
  evaluateProps(),
]);

/**
 * Base text classes shared across label, span, help, and error text
 *
 * Uniform styling across both environments:
 * - font-size: 16px (text-base)
 * - line-height: 20px (leading-5)
 */
const baseTextClasses = "text-base leading-5";

/**
 * Generic helper functions to identify component state using Representation-First pattern
 *
 * These functions check the component's interactive state regardless of context (text, value, picker).
 * Unified to avoid duplication and improve maintainability.
 */
const isDisabled = (p: typeof props) => p.disabled;
const isReadonly = (p: typeof props) => p.readonly;
const isInteractiveState = (p: typeof props) => !p.disabled && !p.readonly;

/**
 * Helper functions specific to value/placeholder visual states
 *
 * Value/placeholder has special logic: it's grey-300 when disabled/readonly OR when no value is selected.
 */
const isSelectedValue = () => selectedOption.value && isInteractive.value;
const isPlaceholderValue = () => !selectedOption.value || !isInteractive.value;

/**
 * Computes label classes using Representation-First pattern
 *
 * Maps visual representation (disabled, readonly, active) to styling.
 * Readonly uses the same style as disabled for visual consistency.
 */
const computedLabelClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case isDisabled(props):
    case isReadonly(props):
      baseClasses.push("text-grey-300");
      break;

    case isInteractiveState(props):
      baseClasses.push("text-core-black");
      break;
  }

  return baseClasses;
});

/**
 * Base classes for selected value span
 *
 * Handles text overflow and layout:
 * - Overflow: hidden with ellipsis
 * - Flex: grows to fill available space
 * - Font-weight: normal (400)
 */
const staticSpanClass =
  "overflow-hidden text-ellipsis whitespace-nowrap flex-[1] font-normal";

/**
 * Computes span classes for selected option display using Representation-First pattern
 *
 * Maps visual representation (disabled, readonly, selected value, placeholder) to styling.
 * Readonly uses the same style as disabled for visual consistency.
 */
const computedSpanClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case isDisabled(props):
    case isReadonly(props):
      baseClasses.push("text-grey-300");
      break;

    case isSelectedValue():
      baseClasses.push("text-core-black");
      break;

    case isPlaceholderValue():
      baseClasses.push("text-grey-300");
      break;
  }

  return baseClasses;
});

/**
 * Computes help text classes using Representation-First pattern
 *
 * Maps visual representation (disabled, readonly, active) to styling.
 * Readonly uses the same style as disabled for visual consistency.
 */
const computedHelpClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case isDisabled(props):
    case isReadonly(props):
      baseClasses.push("text-grey-300");
      break;

    case isInteractiveState(props):
      baseClasses.push("text-grey-500");
      break;
  }

  return baseClasses;
});

/**
 * Computes error text classes using Representation-First pattern
 *
 * Maps visual representation (disabled, readonly, active) to styling.
 * Readonly uses the same style as disabled for visual consistency.
 */
const computedErrorClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case isDisabled(props):
    case isReadonly(props):
      baseClasses.push("text-grey-300");
      break;

    case isInteractiveState(props):
      baseClasses.push("text-core-black");
      break;
  }

  return baseClasses;
});

/**
 * Finds the currently selected option from options list
 *
 * Filters out label items and matches by value against model.
 * Returns undefined if no option matches current model value.
 */
const selectedOption = computed(() => {
  const options = props.options.filter(
    (option): option is FzSelectOptionProps => option.kind !== "label"
  );
  return options.find((option) => option.value === model.value);
});

/**
 * Gets list of selectable options (excluding labels)
 *
 * Used for keyboard navigation to skip non-interactive items.
 */
const selectableOptions = computed(() => {
  return visibleOptions.value.filter(
    (option): option is FzSelectOptionProps => option.kind !== "label"
  );
});

/**
 * Gets the index of the selected option in selectableOptions
 *
 * Used to initialize focusedIndex when dropdown opens.
 */
const selectedOptionIndex = computed(() => {
  if (!selectedOption.value) return -1;
  return selectableOptions.value.findIndex(
    (option) => option.value === selectedOption.value?.value
  );
});

/**
 * Creates a Set of focused option values for O(1) lookup
 *
 * Used to efficiently determine if an option is focused during rendering.
 * Avoids calling findIndex() for every option in the template.
 */
const focusedOptionValue = computed(() => {
  if (focusedIndex.value < 0 || !isOpen.value) return null;
  const selectable = selectableOptions.value;
  if (focusedIndex.value >= selectable.length) return null;
  return selectable[focusedIndex.value]?.value ?? null;
});

watch(() => [model.value], updateContainerWidth);

watch(
  () => props.options,
  () => {
    visibleOptions.value = props.options.slice(0, props.optionsToShow);
  }
);

// Initialize focused index and manage focus when dropdown opens/closes
watch(isOpen, (newValue) => {
  if (newValue) {
    // When opening: set focused index and move focus to first/selected option
    nextTick(() => {
      focusedIndex.value =
        selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
      scrollToFocusedOption();
    });
  } else {
    // When closing: reset focused index and return focus to opener button
    focusedIndex.value = -1;
    nextTick(() => {
      opener.value?.focus();
    });
  }
});

onMounted(() => {
  if (props.floatingPanelMaxHeight) {
    maxHeight.value = props.floatingPanelMaxHeight;
  }
  updateContainerWidth();
  addScrollListener();
  updateVisibleOptions();
});

/**
 * Handles option selection
 *
 * Updates model value, emits select event, and closes dropdown.
 * Focus is returned to opener button via watch on isOpen.
 *
 * @param value - Selected option value
 */
const handleSelect = (value: string) => {
  model.value = value;
  emit("select", value);
  isOpen.value = false;
  // focusedIndex reset and focus return handled by watch(isOpen)
};

/**
 * Handles picker button click to toggle dropdown
 *
 * Focus management is handled by watch(isOpen) to avoid duplication.
 */
const handlePickerClick = () => {
  if (!isInteractive.value) return;
  isOpen.value = !isOpen.value;
  updateContainerWidth();
  // Focus management handled by watch(isOpen)
};

/**
 * Handles keyboard events on opener button
 *
 * Supports:
 * - Enter/Space: Open dropdown if closed
 * - Escape: Close dropdown if open
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

// Attach keyboard listener to opener button
// useKeyDown handles onMounted internally, so opener ref can be undefined at call time
useKeyDown(opener, handleOpenerKeydown);

/**
 * Handles keyboard events on options container
 *
 * Supports:
 * - ArrowDown: Move focus to next option
 * - ArrowUp: Move focus to previous option
 * - Home: Move focus to first option
 * - End: Move focus to last option
 * - Enter/Space: Select focused option
 * - Escape: Close dropdown without selecting
 * - Tab/Shift+Tab: Focus trap - wrap focus within dropdown
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
        handleSelect(selectable[focusedIndex.value].value);
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
        // Shift+Tab: move to last option if on first, otherwise previous
        if (focusedIndex.value <= 0) {
          focusedIndex.value = selectable.length - 1;
        } else {
          focusedIndex.value--;
        }
      } else {
        // Tab: move to first option if on last, otherwise next
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
 * Sets option element reference for keyboard navigation
 *
 * Called via template ref callback to register option DOM elements.
 * This allows us to focus options directly without querySelector.
 *
 * @param value - Option value used as key
 * @param componentInstance - FzSelectOption component instance or null
 */
const setOptionRef = (
  value: string,
  componentInstance: InstanceType<typeof FzSelectOption> | null
) => {
  // Access buttonElement exposed via defineExpose
  const buttonElement = componentInstance?.buttonElement;

  if (buttonElement) {
    optionRefs.value.set(value, buttonElement);
  } else {
    optionRefs.value.delete(value);
  }
};

/**
 * Scrolls the focused option into view
 *
 * Ensures the focused option is visible when navigating with keyboard.
 * Uses optionRefs map to directly access the DOM element by option value.
 * Includes safety checks to prevent calling focus() before DOM is ready
 * and prevent infinite loops.
 */
const scrollToFocusedOption = () => {
  // Prevent multiple simultaneous calls
  if (isScrollingToFocus.value) return;

  nextTick(() => {
    // Safety checks: ensure dropdown is open and DOM is ready
    if (!isOpen.value || focusedIndex.value < 0) return;
    if (!containerRef.value) return;

    const selectable = selectableOptions.value;
    if (focusedIndex.value >= selectable.length || selectable.length === 0)
      return;

    const focusedOption = selectable[focusedIndex.value];
    if (!focusedOption) return;

    const focusedButton = optionRefs.value.get(focusedOption.value);
    if (focusedButton && document.contains(focusedButton)) {
      isScrollingToFocus.value = true;

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        if (isOpen.value && document.contains(focusedButton)) {
          try {
            focusedButton.focus({ preventScroll: false });
            focusedButton.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          } catch (error) {
            // Silently handle focus errors (e.g., element not focusable)
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

// Attach keyboard listener to options container
useKeyDown(containerRef, handleOptionsKeydown);

/**
 * Programmatically opens the dropdown
 *
 * Updates container width calculation when opened externally.
 * Exposed via defineExpose for parent component control.
 */
const forceOpen = () => {
  isOpen.value = true;
  if (safeOpener.value) {
    calculateContainerWidth(safeOpener.value);
  }
};

/**
 * Helper functions to identify picker button visual states using Representation-First pattern
 *
 * Each function answers: "When does the button look like this state?"
 * This makes it explicit which prop combinations lead to each visual representation.
 */
const isDisabledPicker = (p: typeof props) => p.disabled;
const isReadonlyPicker = (p: typeof props) => p.readonly;
const isErrorPicker = (p: typeof props) =>
  p.error && !p.disabled && !p.readonly;
const isDefaultPicker = (p: typeof props) =>
  !p.disabled && !p.readonly && !p.error;

/**
 * Computes picker button state classes using Representation-First pattern
 *
 * Maps each visual representation (disabled, readonly, error, default) to its styling.
 * This pattern makes it explicit when the component looks like each state.
 * Readonly uses the same style as disabled for visual consistency.
 * Focus states are handled separately via focus:border-* classes.
 */
const evaluateProps = () => {
  switch (true) {
    case isDisabledPicker(props):
    case isReadonlyPicker(props):
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed focus:border-grey-100";

    case isErrorPicker(props):
      return "border-semantic-error-200 bg-white text-core-black cursor-pointer focus:border-semantic-error-300";

    case isDefaultPicker(props):
      return "border-grey-300 bg-white text-core-black cursor-pointer focus:border-blue-500";

    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer focus:border-blue-500";
  }
};

/**
 * Updates container width based on opener element dimensions
 *
 * Calculates min and max width constraints to ensure dropdown
 * matches opener width while respecting viewport boundaries.
 */
function updateContainerWidth() {
  if (!safeOpener.value) return;

  const { minWidth, maxWidth } = calculateContainerWidth(safeOpener.value);

  containerWidth.value = `${minWidth}px`;
  openerMaxWidth.value = `${maxWidth}px`;
}

/**
 * Attaches scroll listener to options container for lazy loading
 *
 * Enables progressive rendering of options as user scrolls.
 * Called once on mount to enable infinite scroll behavior.
 */
function addScrollListener() {
  containerRef.value?.addEventListener("scroll", handleScroll);
}

/**
 * Handles scroll events to trigger lazy loading of options
 *
 * Loads next batch of options when user scrolls near bottom.
 * Uses OPTIONS_BUFFER to trigger loading before reaching absolute bottom
 * for smoother user experience.
 */
function handleScroll() {
  if (!containerRef.value) return;

  const container = containerRef.value;
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
 *
 * Slices options array starting from current visible count.
 * Uses optionsToShow prop to determine batch size for performance.
 */
function updateVisibleOptions() {
  const nextItems = props.options.slice(
    visibleOptions.value.length,
    visibleOptions.value.length + props.optionsToShow
  );
  visibleOptions.value.push(...nextItems);
}

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
    :overrideOpener
    contentClass="z-70"
    @fzfloating:setPosition="calculateMaxHeight"
  >
    <template #opener-start>
      <label
        v-if="label"
        :id="labelId"
        :for="openerId"
        :class="computedLabelClass"
      >
        {{ label }}{{ required ? " *" : "" }}
      </label>
    </template>
    <template #opener="{ floating }" class="flex">
      <div class="w-full flex flex-col gap-8">
        <slot name="opener" :handlePickerClick :isOpen :floating>
          <button
            :id="openerId"
            @click="handlePickerClick"
            test-id="fzselect-opener"
            type="button"
            :class="[staticPickerClass, computedPickerClass, pickerClass]"
            ref="opener"
            :title="selectedOption ? selectedOption.label : placeholder"
            :aria-expanded="isOpen ? 'true' : 'false'"
            :aria-haspopup="'listbox'"
            :aria-labelledby="label ? labelId : undefined"
            :aria-label="
              !label
                ? selectedOption
                  ? selectedOption.label
                  : placeholder
                : undefined
            "
            :aria-required="required ? 'true' : 'false'"
            :aria-invalid="error ? 'true' : 'false'"
            :aria-disabled="props.disabled || props.readonly ? 'true' : 'false'"
          >
            <FzIcon v-if="leftIcon" :name="leftIcon" size="md" />
            <div class="flex flex-col min-w-0 grow">
              <span
                v-if="!showNormalPlaceholder"
                :class="[staticSpanClass, 'text-grey-300 text-xs']"
                >{{ placeholder }}</span
              >
              <span :class="[staticSpanClass, computedSpanClass]">
                {{ selectedOption ? selectedOption.label : placeholder }}
              </span>
            </div>
            <FzIcon
              v-if="rightIcon && !rightIconButton"
              :name="rightIcon"
              size="md"
            />
            <FzIconButton
              v-if="rightIcon && rightIconButton"
              :class="{ 'bg-grey-100 text-gray-300': disabled }"
              :iconName="rightIcon"
              size="md"
              :variant="disabled ? 'invisible' : rightIconButtonVariant"
              @click.stop="emit('fzselect:right-icon-click')"
            />
            <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" size="md" />
          </button>
        </slot>
      </div>
    </template>
    <template #opener-end>
      <div v-if="error && $slots.error" class="flex gap-6">
        <FzIcon name="circle-xmark" class="text-semantic-error-200" size="md" />
        <div :class="[computedErrorClass]">
          <slot name="error"></slot>
        </div>
      </div>
      <span v-else-if="$slots.help" :class="[computedHelpClass]">
        <slot name="help"></slot>
      </span>
    </template>
    <div
      role="listbox"
      :aria-labelledby="openerId"
      :aria-activedescendant="activeDescendantId"
      class="flex flex-col p-4 rounded shadow overflow-auto ml-[-2px] box-border max-h-min"
      :style="{ minWidth: containerWidth, maxWidth: openerMaxWidth, maxHeight }"
      ref="containerRef"
      test-id="fzselect-options-container"
    >
      <template v-if="visibleOptions.length">
        <template
          v-for="option in visibleOptions"
          :key="option.kind === 'label' ? option.label : option.value"
        >
          <FzSelectLabel
            v-if="option.kind === 'label'"
            :option="option"
            :disableTruncate="disableTruncate"
          />
          <FzSelectOption
            v-else
            @click="() => handleSelect(option.value)"
            :option="option"
            :disableTruncate="disableTruncate"
            :selectedValue="model"
            :focused="focusedOptionValue === option.value"
            :id="getOptionId(option.value)"
            :ref="
              (el) =>
                setOptionRef(
                  option.value,
                  el as InstanceType<typeof FzSelectOption> | null
                )
            "
          />
        </template>
      </template>
      <template v-else>
        <FzSelectOption
          :option="{
            label: 'Nessun risultato trovato',
            readonly: true,
            value: '',
          }"
          :disableTruncate="disableTruncate"
          :selectedValue="model"
          :focused="false"
        />
      </template>
    </div>
  </FzFloating>
</template>

<style scoped></style>
