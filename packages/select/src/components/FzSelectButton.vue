<script setup lang="ts">
/**
 * FzSelectButton Component
 *
 * Presentational component for the FzSelect opener button.
 * Renders the button with icons, placeholder, and selected value.
 * Handles its own styling based on state (disabled, readonly, error).
 *
 * @component
 * @internal
 */
import { ref, computed } from "vue";
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import type { FzSelectButtonProps } from "./types";

const props = withDefaults(defineProps<FzSelectButtonProps>(), {
  variant: "normal",
  environment: "frontoffice",
});

const emit = defineEmits<{
  click: [];
  keydown: [event: KeyboardEvent];
  "right-icon-click": [];
}>();

const openerButton = ref<HTMLButtonElement>();

/**
 * Computed state flags
 */
const isDisabled = computed(() => props.disabled);
const isReadonly = computed(() => props.readonly);
const isInteractive = computed(() => !isDisabled.value && !isReadonly.value);
const isError = computed(() => props.error && isInteractive.value);
const isSelectedValue = computed(
  () => props.selectedOption && isInteractive.value
);

/**
 * Determines if normal placeholder should be shown
 */
const showNormalPlaceholder = computed(() => {
  return (
    !(props.variant === "floating-label") ||
    (props.variant === "floating-label" && !props.selectedOption)
  );
});

/**
 * Base classes for picker button
 */
const staticPickerClass =
  "flex justify-between items-center px-10 bg-core-white rounded border-1 border-grey-300 w-full gap-8 text-left relative outline-none focus:outline-none";

/**
 * Environment-based picker button classes
 */
const environmentPickerClasses = {
  backoffice: "h-32 text-base",
  frontoffice: "h-44 text-lg",
} as const;

/**
 * Computes picker button state classes using Representation-First pattern
 */
const pickerStateClasses = computed(() => {
  switch (true) {
    case isDisabled.value:
    case isReadonly.value:
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed focus:border-grey-100";

    case isError.value:
      return "border-semantic-error-200 bg-white text-core-black cursor-pointer focus:border-semantic-error-300";

    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer focus:border-blue-500";
  }
});

/**
 * Computes picker button classes based on variant and environment
 */
const computedPickerClass = computed(() => [
  props.variant === "floating-label"
    ? "h-40 text-sm pr-6"
    : environmentPickerClasses[props.environment],
  pickerStateClasses.value,
]);

/**
 * Base text classes
 */
const baseTextClasses = "text-base leading-5";

/**
 * Static CSS classes for the span
 */
const staticSpanClass =
  "overflow-hidden text-ellipsis whitespace-nowrap flex-[1] font-normal";

/**
 * Computes span classes for selected option display
 */
const spanClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case isDisabled.value:
    case isReadonly.value:
      baseClasses.push("text-grey-300");
      break;

    case isSelectedValue.value:
      baseClasses.push("text-core-black");
      break;

    default:
      // Placeholder state
      baseClasses.push("text-grey-300");
      break;
  }

  return baseClasses;
});

/**
 * Computes icon color classes based on component state
 *
 * Returns core-black for interactive state, grey-300 for disabled/readonly states.
 */
const iconColorClass = computed(() => {
  if (isDisabled.value || isReadonly.value) {
    return "text-grey-300";
  }
  return "text-core-black";
});

const handleClick = () => {
  emit("click");
};

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event);
};

const handleRightIconClick = (event: Event) => {
  event.stopPropagation();
  emit("right-icon-click");
};

defineExpose({
  openerButton,
});
</script>

<template>
  <slot :handleClick :isOpen>
    <button
      ref="openerButton"
      :id="openerId"
      @click="handleClick"
      @keydown="handleKeydown"
      test-id="fzselect-opener"
      type="button"
      :disabled="isDisabled"
      :class="[staticPickerClass, ...computedPickerClass, pickerClass]"
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
      :aria-disabled="isInteractive ? 'false' : 'true'"
    >
      <FzIcon
        v-if="leftIcon"
        :name="leftIcon"
        size="md"
        :class="iconColorClass"
      />
      <div class="flex flex-col min-w-0 grow">
        <span
          v-if="!showNormalPlaceholder"
          :class="[staticSpanClass, 'text-grey-300 text-xs']"
          >{{ placeholder }}</span
        >
        <span :class="[staticSpanClass, ...spanClass]">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>
      </div>
      <FzIcon
        v-if="rightIcon && !rightIconButton"
        :name="rightIcon"
        size="md"
        :class="iconColorClass"
      />
      <FzIconButton
        v-if="rightIcon && rightIconButton"
        :class="{ 'bg-grey-100 text-gray-300': !isInteractive }"
        :iconName="rightIcon"
        size="md"
        :variant="isInteractive ? rightIconButtonVariant : 'invisible'"
        @click="handleRightIconClick"
      />
      <FzIcon
        :name="isOpen ? 'chevron-up' : 'chevron-down'"
        size="md"
        :class="iconColorClass"
      />
    </button>
  </slot>
</template>
