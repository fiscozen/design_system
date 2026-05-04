<script setup lang="ts">
/**
 * FzProgress Component
 *
 * Animated loading spinner indicator component.
 * Wraps FzIcon with spinning animation for use in loading states.
 * Exposes role="status" + visually-hidden label so the loading state is
 * announced by assistive technologies. Honors prefers-reduced-motion.
 *
 * @component
 * @example
 * <FzProgress />
 * <FzProgress size="xl" label="Caricamento risultati…" />
 */
import { FzProgressProps } from "./types";
import { FzIcon } from "@fiscozen/icons";

withDefaults(defineProps<FzProgressProps>(), {
  size: "lg",
  label: "Caricamento…",
});
</script>

<template>
  <span class="fz-progress inline-flex" role="status" :aria-label="label">
    <FzIcon name="spinner-third" variant="fas" spin :size="size" />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>

<style scoped>
.fz-progress {
  --fa-animation-duration: 0.86s;
  --fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85);
}
</style>
