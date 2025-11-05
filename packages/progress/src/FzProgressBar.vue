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
  size: "md",
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

const progressBarSize = computed(() => {
  return props.size === "sm" ? "h-[8px]" : "h-[20px]";
});

/**
 * Sanitizes value for ARIA attributes
 *
 * Converts NaN and Infinity to 0 to ensure valid ARIA attribute values.
 * ARIA attributes must be valid numbers per WCAG 2.1 AA standards.
 */
const sanitizeAriaValue = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return value;
};

/**
 * Sanitized current value for aria-valuenow
 *
 * Returns 0 if current is NaN or Infinity to ensure valid ARIA attribute.
 */
const ariaValuenow = computed(() => sanitizeAriaValue(props.current));

/**
 * Sanitized min value for aria-valuemin
 *
 * Returns 0 if min is NaN or Infinity to ensure valid ARIA attribute.
 */
const ariaValuemin = computed(() => sanitizeAriaValue(props.min));

/**
 * Sanitized max value for aria-valuemax
 *
 * Returns 0 if max is NaN or Infinity to ensure valid ARIA attribute.
 */
const ariaValuemax = computed(() => sanitizeAriaValue(props.max));
</script>

<template>
  <div
    class="fz-progress-bar w-full rounded-[4px] bg-grey-100"
    :class="progressBarSize"
    role="progressbar"
    :aria-valuenow="ariaValuenow"
    :aria-valuemin="ariaValuemin"
    :aria-valuemax="ariaValuemax"
    :aria-label="props.name"
  >
    <div
      class="fz-progress-bar__progress-indicator h-full rounded-[4px] bg-purple-500 transition-all duration-300"
      :style="{ width: `${percentageProgress}%` }"
    ></div>
  </div>
</template>
