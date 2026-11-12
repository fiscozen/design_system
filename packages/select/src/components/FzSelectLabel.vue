<script setup lang="ts">
/**
 * FzSelectLabel Component
 *
 * Presentational component for the label row: label, required indicator and aside.
 *
 * @component
 * @internal
 */
import { computed } from "vue";
import { FzInputLabel } from "@fiscozen/input";
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

/** The `aside` and `asideId` FzInputLabel takes together, or neither. */
const asideProps = computed(() =>
  props.aside ? { aside: props.aside, asideId: props.asideId } : {},
);
</script>

<template>
  <FzInputLabel
    :class="labelClass"
    :label
    :labelId
    :controlId="openerId"
    :required
    :truncate
    v-bind="asideProps"
  />
</template>
