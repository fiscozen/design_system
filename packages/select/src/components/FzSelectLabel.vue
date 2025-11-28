<script setup lang="ts">
/**
 * FzSelectLabel Component
 *
 * Presentational component for the FzSelect label.
 * Renders the label text with required indicator.
 * Handles its own styling based on disabled/readonly state.
 *
 * @component
 * @internal
 */
import { computed } from "vue";
import type { FzSelectLabelProps } from "./types";

const props = defineProps<FzSelectLabelProps>();

/**
 * Base text classes shared across all text elements
 */
const baseTextClasses = "text-base leading-5";

/**
 * Computes label classes based on interactive state
 *
 * Uses Representation-First pattern to map visual states.
 * Readonly uses the same style as disabled for consistency.
 */
const labelClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case props.disabled:
    case props.readonly:
      baseClasses.push("text-grey-300");
      break;

    default:
      baseClasses.push("text-core-black");
      break;
  }

  return baseClasses;
});
</script>

<template>
  <label :id="labelId" :for="openerId" :class="labelClass">
    {{ label }}{{ required ? " *" : "" }}
  </label>
</template>
