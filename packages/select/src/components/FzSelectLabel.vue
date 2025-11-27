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

const props = withDefaults(
  defineProps<{
    option: FzSelectLabelProps;
    disableTruncate?: boolean;
  }>(),
  {
    disableTruncate: false,
  }
);

/**
 * Computes label classes for text truncation
 *
 * Conditionally applies text truncation based on disableTruncate prop.
 */
const computedLabelClass = computed(() => {
  const baseClasses = [
    "text-grey-400",
    "flex",
    "items-center",
    "text-sm",
    "min-h-40",
    "px-20",
  ];

  if (!props.disableTruncate) {
    baseClasses.push("text-ellipsis", "whitespace-nowrap");
  }

  return baseClasses;
});
</script>

<template>
  <label
    disabled
    test-id="fzselect-label"
    @click.prevent.stop
    :title="props.option.label"
    :class="computedLabelClass"
  >
    {{ props.option.label }}
  </label>
</template>
