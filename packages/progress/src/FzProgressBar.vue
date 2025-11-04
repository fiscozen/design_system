<script lang="ts" setup>
/**
 * FzProgressBar Component
 *
 * Visual progress bar indicator displaying completion percentage.
 * Supports custom min/max ranges and calculates percentage position
 * automatically with smooth transitions.
 *
 * Note: We use div elements instead of HTML progress element for better
 * CSS cross-browser compatibility. The progress element requires browser-specific
 * pseudo-elements (::-webkit-progress-bar, ::-moz-progress-bar) which can be
 * inconsistent across browsers and harder to style with Tailwind.
 *
 * @component
 * @example
 * <FzProgressBar :current="50" />
 * <FzProgressBar :current="30" :min="-15" :max="50" />
 */
import { computed } from "vue";
import type { FzProgressBarProps } from "./types";

const props = withDefaults(defineProps<FzProgressBarProps>(), {
  max: 100,
  min: 0,
  name: "progress-bar",
});

/**
 * Computes progress percentage based on current value within min-max range
 *
 * Calculates percentage position of current value in the range [min, max],
 * clamping the result between 0 and 100 for CSS width percentage.
 * Handles edge cases: NaN, Infinity, and zero range.
 */
const percentageProgress = computed(() => {
  // Validate inputs to prevent NaN/Infinity
  if (
    !Number.isFinite(props.current) ||
    !Number.isFinite(props.max) ||
    !Number.isFinite(props.min)
  ) {
    return 0;
  }

  const range = props.max - props.min;
  if (range === 0) {
    return 0;
  }

  const progress = ((props.current - props.min) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
});
</script>

<template>
  <div
    class="fz-progress-bar w-full h-[20px] rounded-[4px] bg-grey-100"
    role="progressbar"
    :aria-valuenow="props.current"
    :aria-valuemin="props.min"
    :aria-valuemax="props.max"
    :aria-label="props.name"
  >
    <div
      class="fz-progress-bar__progress-indicator h-full rounded-[4px] bg-purple-500 transition-all duration-300"
      :style="{ width: `${percentageProgress}%` }"
    ></div>
  </div>
</template>
