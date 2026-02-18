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

/**
 * Disables automatic attribute inheritance to prevent props like 'color' from being
 * passed as HTML attributes to the root div element. The 'color' prop is only used
 * internally for computing the CSS class.
 */
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FzProgressBarProps>(), {
  max: 100,
  min: 0,
  name: "progress-bar",
  size: "md",
  color: "purple",
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
 * Color to Tailwind CSS class mapping
 *
 * Maps color prop values to complete Tailwind CSS background color classes.
 * Using explicit mapping ensures Tailwind can detect and include these classes
 * during compilation (dynamic template literals are not detected by Tailwind).
 */
const barColorClassMap = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  yellow: "bg-semantic-warning-200",
  grey: "bg-grey-500",
  red: "bg-semantic-error-200",
} as const;

/**
 * Background color to Tailwind CSS class mapping for progress bar container.
 *
 * Maps color prop values to Tailwind CSS background color classes for the bar's background.
 * This explicit mapping ensures proper inclusion by Tailwind at build time.
 */
const backgroundBarColorClassMap = {
  purple: "bg-purple-100",
  blue: "bg-blue-100",
  orange: "bg-orange-100",
  pink: "bg-pink-100",
  yellow: "bg-semantic-warning-100",
  grey: "bg-grey-100",
  red: "bg-semantic-error-100",
} as const;

/**
 * Computes background color class based on color prop
 *
 * Returns the corresponding Tailwind CSS background color class from the mapping.
 * Falls back to 'purple' if color is undefined or not in the mapping.
 *
 * @returns {string} Tailwind CSS class for progress bar color
 */
const progressBarColor = computed(() => {
  const color = props.color;

  if (!color || !(color in barColorClassMap)) {
    return barColorClassMap.purple;
  }

  return barColorClassMap[color as keyof typeof barColorClassMap];
});

/**
 * Computes background color class for the progress bar container based on color prop.
 *
 * Returns the corresponding Tailwind CSS background color class from the backgroundBarColorClassMap.
 * If the color prop is undefined or not found in the mapping, it falls back to 'purple'.
 *
 * @returns {string} Tailwind CSS class for progress bar background color
 */
const backgroundProgressBarColor = computed(() => {
  const color = props.color;

  if (!color || !(color in backgroundBarColorClassMap)) {
    return backgroundBarColorClassMap.purple;
  }

  return backgroundBarColorClassMap[
    color as keyof typeof backgroundBarColorClassMap
  ];
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
    class="fz-progress-bar w-full rounded-[4px]"
    :class="[progressBarSize, backgroundProgressBarColor]"
    role="progressbar"
    :aria-valuenow="ariaValuenow"
    :aria-valuemin="ariaValuemin"
    :aria-valuemax="ariaValuemax"
    :aria-label="props.name"
  >
    <div
      class="fz-progress-bar__progress-indicator h-full rounded-[4px] transition-all duration-300"
      :class="progressBarColor"
      :style="{ width: `${percentageProgress}%` }"
    ></div>
  </div>
</template>
