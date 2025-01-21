<template>
  <label
    disabled
    test-id="fzselect-label"
    @click.prevent.stop
    :title="option.label"
    :class="computedClass"
  >
    {{ option.label }}
  </label>
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
  sm: "text-[10px] min-h-24 px-14",
  md: "text-xs min-h-32 px-16",
  lg: "text-sm min-h-40 px-20",
};
const computedClass = computed(() => {
  return [staticClass, mappedClass[props.size]];
});
</script>
