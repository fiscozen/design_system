<script setup lang="ts">
/**
 * FzTypeaheadLabel Component
 *
 * Presentational component for the label with required indicator.
 *
 * @component
 * @internal
 */
import { computed } from "vue";
import type { FzTypeaheadLabelProps } from "./types";

const props = defineProps<FzTypeaheadLabelProps>();

const baseTextClasses = "text-base leading-5";

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
