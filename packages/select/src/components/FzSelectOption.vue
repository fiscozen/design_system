<script setup lang="ts">
/**
 * FzSelectOption Component
 *
 * Renders a single selectable option in the dropdown list.
 * Supports disabled, readonly, and selected states with subtitle display.
 *
 * @component
 */
import { computed, ref } from "vue";
import { FzSelectOptionProps } from "../types";

const props = defineProps<{
  option: FzSelectOptionProps;
  selectedValue: string;
  disableTruncate?: boolean;
  focused?: boolean;
  id?: string;
}>();

const buttonRef = ref<HTMLElement>();

defineExpose({
  buttonElement: buttonRef,
});

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
 * Maps each visual representation (disabled, readonly, selected, default, focused) to its styling.
 * This pattern makes it explicit when the option looks like each state.
 */
const computedClass = computed(() => {
  const baseClasses: string[] = ["text-lg px-20 py-8"];

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

  // Add focus ring when focused via keyboard navigation
  if (props.focused && !props.option.disabled && !props.option.readonly) {
    baseClasses.push("ring-2 ring-blue-500 ring-offset-2");
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
  const baseClasses: string[] = ["text-base"];

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

<template>
  <button
    ref="buttonRef"
    :id="props.id"
    role="option"
    :class="[staticClass, computedClass]"
    test-id="fzselect-option"
    type="button"
    :title="props.option.label"
    :disabled="props.option.disabled || props.option.readonly"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-disabled="props.option.disabled ? 'true' : 'false'"
    :tabindex="
      props.focused && !props.option.disabled && !props.option.readonly ? 0 : -1
    "
    @click="
      () => {
        $emit('click');
      }
    "
  >
    <span :class="computedValueClass">{{ props.option.label }}</span>
    <span v-if="props.option.subtitle" :class="computedSubtitleClass">
      {{ props.option.subtitle }}
    </span>
  </button>
</template>
