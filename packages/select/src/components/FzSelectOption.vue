<template>
  <button
    :class="[staticClass, computedClass]"
    test-id="fzselect-option"
    type="button"
    :title="option.label"
    @click="
      () => {
        if (option.disabled || option.readonly) {
          return;
        }
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
  let res: string[] = [];
  if (props.option.disabled) {
    res = ['text-grey-200']
  } else if (props.option.readonly) {
    res = ['text-core-black']
  } else {
    res = [
      props.selectedValue === props.option.value
        ? "bg-background-alice-blue text-blue-500"
        : "bg-white hover:!bg-background-alice-blue text-core-black hover:text-blue-500",
    ]
  }
  res.push(mappedClass[props.size]);
  return res;
});
</script>
