<script setup lang="ts">
/**
 * FzProgress Component
 *
 * Animated loading spinner indicator component.
 * Wraps FzIcon with spinning animation for use in loading states.
 *
 * @component
 * @example
 * <FzProgress />
 * <FzProgress size="lg" />
 */
import { FzProgressProps } from "./types";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzProgressProps>(), {
  name: "spinner-third",
});
</script>

<template>
  <FzIcon
    v-bind="props"
    variant="fas"
    spin
    style="
      --fa-animation-duration: 0.86s;
      --fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85);
    "
  />
</template>
