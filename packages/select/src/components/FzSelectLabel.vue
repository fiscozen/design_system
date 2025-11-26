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
/**
 * FzSelectLabel Component
 *
 * Displays a group label in the select options list.
 * Used to visually separate option groups.
 *
 * @component
 */
import { computed } from "vue";
import { FzSelectLabelProps } from "../types";
import { selectSizeConfig } from "../common";

const props = defineProps<{
  option: FzSelectLabelProps;
  size: "sm" | "md" | "lg";
}>();

const staticClass =
  "text-grey-400 flex items-center text-ellipsis whitespace-nowrap";

/**
 * Computes label classes based on size
 */
const computedClass = computed(() => {
  return [staticClass, selectSizeConfig.label[props.size]];
});
</script>
