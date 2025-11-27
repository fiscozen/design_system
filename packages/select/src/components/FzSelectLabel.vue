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
 * Generates group label classes with conditional truncation
 *
 * Applies ellipsis only when disableTruncate is false, allowing long
 * group names to wrap when needed.
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
