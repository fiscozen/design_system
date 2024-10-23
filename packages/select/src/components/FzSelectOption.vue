<template>
  <button
    :class="[staticClass, computedClass]"
    test-id="fzselect-option"
    type="button"
    :title="option.label"
    :disabled="option.disabled || option.readonly"
    @click="
      () => {
        $emit('click');
      }
    "
  >
    <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{
      option.label
    }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzSelectOptionsProps } from "../types";

const props = defineProps<{
  option: FzSelectOptionsProps;
  size: "sm" | "md" | "lg";
  selectedValue: string;
}>();

const staticClass =
  "flex items-center text-left h-40 font-medium cursor-pointer py-6 px-12 rounded";

const mappedClass = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};
const computedClass = computed(() => {
  const { disabled, readonly, value } = props.option;
  const isSelected = props.selectedValue === value
  return [
    {
      'text-grey-200': disabled,
      'text-core-black' : readonly,
      'bg-background-alice-blue text-blue-500': !disabled && !readonly && isSelected,
      'bg-white hover:!bg-background-alice-blue text-core-black hover:text-blue-500': !disabled && !readonly && !isSelected
    },
    mappedClass[props.size],
  ]
});
</script>
