<script setup lang="ts">
/**
 * FzSelectLabel Component
 *
 * Presentational component for the label with required indicator.
 *
 * @component
 * @internal
 */
import { computed } from "vue";
import { FzTruncatedLabel } from "@fiscozen/tooltip";
import type { FzSelectLabelProps } from "./types";

const props = defineProps<FzSelectLabelProps>();

const baseTextClasses = "font-normal text-base";

const labelClass = computed(() => {
  const baseClasses = [baseTextClasses, "mb-0"];

  switch (true) {
    case props.disabled:
    case props.readonly:
      baseClasses.push("text-grey-300");
      break;

    default:
      baseClasses.push("text-grey-500");
      break;
  }

  return baseClasses;
});
</script>

<template>
  <FzTruncatedLabel
    v-if="truncate"
    :class="labelClass"
    :label
    :labelId
    :controlId="openerId"
    :required
  />
  <label v-else :id="labelId" :for="openerId" :class="labelClass">
    {{ label }}{{ required ? " *" : "" }}
  </label>
</template>
