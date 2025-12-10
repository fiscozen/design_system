<script setup lang="ts">
/**
 * FzSelectHelpError Component
 *
 * Presentational component for the FzSelect help text and error message.
 * Renders either error message or help text based on error state.
 * Handles its own styling based on disabled/readonly state.
 *
 * @component
 * @internal
 */
import { computed } from "vue";
import { FzAlert } from "@fiscozen/alert";
import type { FzSelectHelpErrorProps } from "./types";

const props = defineProps<FzSelectHelpErrorProps>();

/**
 * Base text classes
 */
const baseTextClasses = "text-base leading-5";

/**
 * Computed state flag
 */
const isInteractive = computed(() => !props.disabled && !props.readonly);

/**
 * Computes help text classes based on interactive state
 */
const helpClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case props.disabled:
    case props.readonly:
      baseClasses.push("text-grey-300");
      break;

    case isInteractive.value:
      baseClasses.push("text-grey-500");
      break;
  }

  return baseClasses;
});

/**
 * Computes error text classes based on interactive state
 */
const errorClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case props.disabled:
    case props.readonly:
      baseClasses.push("text-grey-300");
      break;

    case isInteractive.value:
      baseClasses.push("text-core-black");
      break;
  }

  return baseClasses;
});
</script>

<template>
  <FzAlert v-if="error && $slots.error" type="error" alertStyle="simple">
    <slot name="error"></slot>
  </FzAlert>
  <span v-else-if="$slots.help" :class="helpClass">
    <slot name="help"></slot>
  </span>
</template>
