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

const props = withDefaults(
  defineProps<{
    option: FzSelectOptionProps;
    selectedValue: string | undefined;
    disableTruncate?: boolean;
    focused?: boolean;
    id?: string;
  }>(),
  {
    disableTruncate: false,
    focused: false,
  }
);

const buttonRef = ref<HTMLElement>();

defineExpose({
  buttonElement: buttonRef,
});

const staticClass =
  "group flex flex-col justify-center text-left font-normal cursor-pointer rounded outline-none focus:outline-none !border-1 !border-transparent";

/**
 * Checks if this option matches the currently selected value
 */
const isSelected = computed(() => props.selectedValue === props.option.value);

/**
 * Computed state flags using Representation-First pattern
 *
 * Each computed answers: "When does the option look like this state?"
 * Readonly is treated separately from disabled to maintain distinct visual feedback.
 * Memoized to avoid recalculation when used in computedClass.
 */
const isDisabledOption = computed(() => props.option.disabled);
const isReadonlyOption = computed(
  () => props.option.readonly && !props.option.disabled
);
const isInteractiveOption = computed(
  () => !isDisabledOption.value && !isReadonlyOption.value
);
const isSelectedOption = computed(
  () => isInteractiveOption.value && props.selectedValue === props.option.value
);

/**
 * Generates option button classes based on current state
 *
 * Uses Representation-First pattern to map visual states to styling.
 * Focus border is added only when keyboard-navigated and interactive.
 */
const computedClass = computed(() => {
  const baseClasses: string[] = ["text-lg px-20 py-8"];

  switch (true) {
    case isDisabledOption.value:
      baseClasses.push("text-grey-200");
      break;

    case isReadonlyOption.value:
      baseClasses.push("text-core-black");
      break;

    case isSelectedOption.value:
      baseClasses.push("bg-background-alice-blue", "text-blue-500");
      break;

    default:
      baseClasses.push(
        "bg-white",
        "hover:!bg-background-alice-blue",
        "text-core-black",
        "hover:text-blue-500"
      );
      break;
  }

  // Add focus border when focused via keyboard navigation
  if (props.focused && !isDisabledOption.value && !isReadonlyOption.value) {
    baseClasses.push("!border-1 !border-blue-500");
  }

  return baseClasses;
});

/**
 * Generates label span classes with conditional truncation
 *
 * Applies ellipsis only when disableTruncate is false.
 */
const computedValueClass = computed(() => ({
  "w-full overflow-hidden text-ellipsis whitespace-nowrap":
    !props.disableTruncate,
}));

/**
 * Checks if subtitle should show interactive styling
 *
 * Subtitles are interactive (hover effect) only when option is not disabled
 * and not currently selected.
 */
const isSubtitleInteractive = (option: typeof props.option) => {
  return !option.disabled && props.selectedValue !== option.value;
};

/**
 * Generates subtitle span classes with conditional truncation and interactivity
 *
 * Applies truncation unless disabled, and adds hover effects for interactive subtitles.
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
    :disabled="!isInteractiveOption"
    :aria-selected="isSelected ? 'true' : 'false'"
    :aria-disabled="isDisabledOption ? 'true' : 'false'"
    :tabindex="props.focused && isInteractiveOption ? 0 : -1"
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
