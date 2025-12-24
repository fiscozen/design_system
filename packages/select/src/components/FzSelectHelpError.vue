<script setup lang="ts">
/**
 * FzSelectHelpError Component
 *
 * Presentational component for help text and error messages.
 * Error slot takes priority over help slot.
 *
 * @component
 * @internal
 */
import { computed } from "vue";
import { FzAlert } from "@fiscozen/alert";
import type { FzSelectHelpErrorProps } from "./types";

const props = defineProps<FzSelectHelpErrorProps>();

const baseTextClasses = "text-base leading-5";
const isInteractive = computed(() => !props.disabled && !props.readonly);

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
</script>

<template>
  <FzAlert v-if="error && $slots.error" tone="error" alertStyle="simple">
    <slot name="error"></slot>
  </FzAlert>
  <span v-else-if="$slots.help" :class="helpClass">
    <slot name="help"></slot>
  </span>
</template>
