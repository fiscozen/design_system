<template>
  <button
    disabled
    test-id="fzselect-label"
    :title="option.label"
    :class="computedClass"
  >
    {{ option.label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzSelectLabelProps } from "../types";

const props = defineProps<{
  option: FzSelectLabelProps;
  size: "sm" | "md" | "lg";
}>();

const staticClass =
  "text-grey-400 flex items-center text-ellipsis whitespace-nowrap";

const mappedClass = {
  sm: "text-xs h-24 px-12",
  md: "text-sm h-32 px-14",
  lg: "text-md h-40 px-16",
};
const computedClass = computed(() => {
  return [staticClass, mappedClass[props.size]];
});
</script>
