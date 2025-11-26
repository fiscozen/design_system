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
        :class="['text-sm', computedLabelClass]"
      >
        {{ label }}{{ required ? " *" : "" }}
      </label>
    </template>
    <template #opener="{ floating }" class="flex">
      <div class="w-full flex flex-col gap-8" ref="openerContainer">
        <slot name="opener" :handlePickerClick :isOpen :floating>
          <button
            :id="openerId"
            @click="handlePickerClick"
            test-id="fzselect-opener"
            type="button"
            :size="size"
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
            :aria-disabled="props.disabled ? 'true' : 'false'"
          >
            <FzIcon v-if="leftIcon" :name="leftIcon" :size="size" />
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
              v-if="rightIcon && !rightIconLast"
              :name="rightIcon"
              :size="size"
            />
            <FzIcon
              :name="isOpen ? 'chevron-up' : 'chevron-down'"
              :size="size"
            />
            <FzIcon
              v-if="rightIcon && rightIconLast && !rightIconButton"
              :name="rightIcon"
              :size="mappedSize"
            />
            <FzIconButton
              v-if="rightIconButton && rightIconLast && rightIcon"
              :class="{ 'bg-grey-100 text-gray-300': disabled }"
              :iconName="rightIcon"
              :size="mappedSize"
              :variant="disabled ? 'invisible' : rightIconButtonVariant"
              @click.stop="emit('fzselect:right-icon-click')"
            />
          </button>
        </slot>
      </div>
    </template>
    <template #opener-end>
      <div
        v-if="error && $slots.error"
        class="flex gap-4"
        :style="{ 'max-width': containerWidth }"
      >
        <FzIcon
          name="triangle-exclamation"
          class="text-semantic-error"
          :size="size"
        />
        <div :class="['mt-1', computedErrorClass]">
          <slot name="error"></slot>
        </div>
      </div>
      <span
        v-else-if="$slots.help"
        :class="[computedHelpClass]"
        :style="{ 'max-width': containerWidth }"
      >
        <slot name="help"></slot>
      </span>
    </template>
    <div
      role="listbox"
      :aria-labelledby="openerId"
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
            :size="size"
          />
          <FzSelectOption
            v-else
            @click="() => handleSelect(option.value)"
            :option="option"
            :size="size"
            :disableTruncate="disableTruncate"
            :selectedValue="model"
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
          :size="size"
          :selectedValue="model"
        />
      </template>
    </div>
  </FzFloating>
</template>

<script setup lang="ts">
/**
 * FzSelect Component
 *
 * A dropdown select component with floating panel, lazy loading, and keyboard navigation.
 * Supports grouped options, custom icons, error states, and floating label variant.
 *
 * @component
 * @example
 * <FzSelect
 *   v-model="selectedValue"
 *   :options="options"
 *   label="Select an option"
 *   placeholder="Choose..."
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
  FzRect,
  useClickOutside,
} from "@fiscozen/composables";
import FzSelectOption from "./components/FzSelectOption.vue";
import {
  calculateContainerWidth,
  MIN_WIDTH,
  selectSizeConfig,
  selectIconSizeMap,
} from "./common";
import FzSelectLabel from "./components/FzSelectLabel.vue";

const props = withDefaults(defineProps<FzSelectProps>(), {
  size: "md",
  optionsToShow: 25,
  teleport: true,
  variant: "normal",
  rightIconVariant: "invisible",
});
const model = defineModel({
  required: true,
  default: "",
});
const isOpen = ref(false);
const opener = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();
const containerWidth = ref<string>(`${MIN_WIDTH}px`);
const openerMaxWidth = ref<string>("none");
const openerContainer = ref<HTMLElement>();
const visibleOptions = ref<FzSelectOptionsProps[]>([]);
const OPTIONS_HEIGHT = 20;
const OPTIONS_BUFFER = 5;
const maxHeight = ref("");
const floatingRef = ref<InstanceType<typeof FzFloating>>();

/**
 * Unique IDs for accessibility attributes
 * Generated once per component instance to ensure stability
 */
const instanceId = Math.random().toString(36).substring(2, 9);
const openerId = `fzselect-opener-${instanceId}`;
const labelId = `fzselect-label-${instanceId}`;

/**
 * Maps select size to icon size for consistent icon scaling
 */
const mappedSize = computed(() => {
  return selectIconSizeMap[props.size];
});

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
 * @param rect - Floating container rect (unused but required by FzFloating callback)
 * @param openerRect - Opener element rect for position calculation
 * @param containerRect - Container rect (unused but required by FzFloating callback)
 * @param position - Preferred floating position
 * @param actualPosition - Actual floating position after auto-adjustment
 */
const calculateMaxHeight = (
  rect: Ref<DOMRect | undefined>,
  openerRect: Ref<DOMRect | undefined>,
  containerRect: Ref<DOMRect | undefined>,
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
    floatingRef.value?.setPosition();
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
const isInteractive = computed(() => !props.disabled);

/**
 * Text size class mapping based on select size
 */
const sizeTextClass = computed(() => {
  const sizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };
  return sizeMap[props.size];
});

const staticPickerClass =
  "flex justify-between items-center px-10 border-1 w-full rounded gap-8 text-left relative";

/**
 * Computes picker button classes based on size and variant
 */
const computedPickerClass = computed(() => [
  props.variant === "floating-label"
    ? "h-40 text-sm pr-6"
    : selectSizeConfig.picker[props.size],
  evaluateProps(),
]);

/**
 * Computes label classes based on disabled state
 */
const computedLabelClass = computed(() => [
  props.disabled ? "text-grey-300" : "text-core-black",
]);

const staticSpanClass =
  "overflow-hidden text-ellipsis whitespace-nowrap flex-[1]";

/**
 * Computes span classes for selected option display
 */
const computedSpanClass = computed(() => [
  selectedOption.value && isInteractive.value
    ? "text-core-black font-medium"
    : "text-grey-300",
]);

/**
 * Computes help text classes based on size and disabled state
 */
const computedHelpClass = computed(() => [
  sizeTextClass.value,
  props.disabled ? "text-grey-300" : "text-grey-500",
]);

/**
 * Computes error text classes based on size and disabled state
 */
const computedErrorClass = computed(() => [
  sizeTextClass.value,
  props.disabled ? "text-grey-300" : "text-core-black",
]);

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

watch(() => [props.size, model.value], updateContainerWidth);
watch(
  () => props.options,
  () => {
    visibleOptions.value = props.options.slice(0, props.optionsToShow);
  }
);

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
 *
 * @param value - Selected option value
 */
const handleSelect = (value: string) => {
  model.value = value;
  emit("select", value);
  isOpen.value = false;
};

/**
 * Handles picker button click to toggle dropdown
 */
const handlePickerClick = () => {
  if (!isInteractive.value) return;
  isOpen.value = !isOpen.value;
  updateContainerWidth();
};

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
 * Helper functions to identify picker button visual states
 */
const isDisabledPicker = (p: typeof props) => p.disabled;
const isErrorPicker = (p: typeof props) => p.error && !p.disabled;
const isDefaultPicker = (p: typeof props) => !p.disabled && !p.error;

/**
 * Computes picker button state classes using Representation-First pattern
 *
 * Maps each visual representation (disabled, error, default) to its styling.
 * This pattern makes it explicit when the component looks like each state.
 */
const evaluateProps = () => {
  switch (true) {
    case isDisabledPicker(props):
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";

    case isErrorPicker(props):
      return "border-semantic-error bg-white text-core-black cursor-pointer";

    case isDefaultPicker(props):
      return "border-grey-300 bg-white text-core-black cursor-pointer";

    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer";
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
  const container = containerRef.value!;
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
<style scoped></style>
