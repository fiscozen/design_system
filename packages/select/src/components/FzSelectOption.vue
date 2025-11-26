<template>
  <button
    role="option"
    :class="[staticClass, computedClass]"
    test-id="fzselect-option"
    type="button"
    :title="option.label"
    :disabled="option.disabled || option.readonly"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-disabled="option.disabled ? 'true' : 'false'"
    @click="
      () => {
        $emit('click');
      }
    "
  >
    <span :class="computedValueClass">{{ option.label }}</span>
    <span v-if="option.subtitle" :class="computedSubtitleClass">
      {{ option.subtitle }}
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * FzSelectOption Component
 *
 * Renders a single selectable option in the dropdown list.
 * Supports disabled, readonly, and selected states with subtitle display.
 *
 * @component
 */
import { computed } from "vue";
import { FzSelectOptionProps } from "../types";
import { selectSizeConfig } from "../common";

const props = defineProps<{
  option: FzSelectOptionProps;
  size: "sm" | "md" | "lg";
  selectedValue: string;
  disableTruncate?: boolean;
}>();

const staticClass =
  "group flex flex-col justify-center text-left font-normal cursor-pointer rounded";

/**
 * Whether this option is currently selected
 */
const isSelected = computed(() => props.selectedValue === props.option.value);

/**
 * Helper functions to identify option visual states
 */
const isDisabledOption = (option: typeof props.option) => option.disabled;
const isReadonlyOption = (option: typeof props.option) =>
  option.readonly && !option.disabled;
const isSelectedOption = (option: typeof props.option) => {
  return (
    !option.disabled && !option.readonly && props.selectedValue === option.value
  );
};
const isDefaultOption = (option: typeof props.option) => {
  return (
    !option.disabled && !option.readonly && props.selectedValue !== option.value
  );
};

/**
 * Computes option button classes using Representation-First pattern
 *
 * Maps each visual representation (disabled, readonly, selected, default) to its styling.
 * This pattern makes it explicit when the option looks like each state.
 */
const computedClass = computed(() => {
  const baseClasses: string[] = [selectSizeConfig.option[props.size]];

  switch (true) {
    case isDisabledOption(props.option):
      baseClasses.push("text-grey-200");
      break;

    case isReadonlyOption(props.option):
      baseClasses.push("text-core-black");
      break;

    case isSelectedOption(props.option):
      baseClasses.push("bg-background-alice-blue", "text-blue-500");
      break;

    case isDefaultOption(props.option):
      baseClasses.push(
        "bg-white",
        "hover:!bg-background-alice-blue",
        "text-core-black",
        "hover:text-blue-500"
      );
      break;
  }

  return baseClasses;
});

/**
 * Computes value span classes for text truncation
 */
const computedValueClass = computed(() => ({
  "w-full overflow-hidden text-ellipsis whitespace-nowrap":
    !props.disableTruncate,
}));

/**
 * Helper functions to identify subtitle visual states
 */
const isSubtitleInteractive = (option: typeof props.option) => {
  return !option.disabled && props.selectedValue !== option.value;
};

/**
 * Computes subtitle span classes using Representation-First pattern
 *
 * Maps visual representation (interactive vs non-interactive) to styling.
 */
const computedSubtitleClass = computed(() => {
  const baseClasses: string[] = [selectSizeConfig.subtitle[props.size]];

  if (!props.disableTruncate) {
    baseClasses.push(
      "w-full",
      "overflow-hidden",
      "text-ellipsis",
      "whitespace-nowrap"
    );
  }

  if (isSubtitleInteractive(props.option)) {
    baseClasses.push("text-grey-500", "group-hover:text-blue-500");
  }

  return baseClasses;
});
</script>
