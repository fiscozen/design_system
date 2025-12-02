<template>
  <div :class="classes">
    <FzIcon
      v-if="leftIcon"
      :name="leftIcon"
      :variant="leftIconVariant"
      size="sm"
    />
    <slot></slot>
    <FzIcon
      v-if="rightIcon"
      :name="rightIcon"
      :variant="rightIconVariant"
      size="sm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots, watch } from "vue";
import { FzIcon } from "@fiscozen/icons";
import type { FzBadgeProps, FzBadgeTone } from "./types";

const props = defineProps<FzBadgeProps>();

const slots = useSlots();
const label = computed(() => slots.default?.()[0].children?.toString());

// Map deprecated color to tone
const effectiveTone = computed(() => {
  if (props.tone) return props.tone;
  if (props.color) {
    const colorToToneMap: Record<string, FzBadgeTone> = {
      black: "dark",
      dark: "dark",
      light: "light",
      error: "error",
      warning: "warning",
      success: "success",
      info: "info",
      blue: "blue",
    };
    return colorToToneMap[props.color] || "dark";
  }
  return "dark";
});

// Determine variant automatically if not specified
const effectiveVariant = computed<"text" | "number">(() => {
  if (props.variant) return props.variant;

  // Auto-detect number variant if content is a single digit
  if (label.value && label.value.length === 1 && /^\d$/.test(label.value)) {
    return "number";
  }

  return "text";
});

// Map tone to CSS classes
const mapToneToClasses = {
  dark: "bg-grey-500 text-core-white",
  light: "bg-grey-100 text-core-black",
  info: "bg-semantic-info-200 text-core-white",
  blue: "bg-blue-500 text-core-white",
  success: "bg-semantic-success-200 text-core-white",
  warning: "bg-semantic-warning-200 text-core-black",
  error: "bg-semantic-error-200 text-core-white",
};

const classes = computed(() => {
  const baseClasses = [
    "flex items-center justify-center",
    "gap-4", // 4px gap between elements
    "text-sm", // number/small style
  ];

  // Variant-specific classes
  if (effectiveVariant.value === "number") {
    baseClasses.push(
      "size-24", // Fixed 24x24px for number variant
      "rounded-full",
    );
  } else {
    baseClasses.push(
      "py-4 px-12", // 4px vertical, 12px horizontal padding
      "h-24 w-fit", // Fixed 24px height
      "rounded-2xl", // 12px border radius
    );
  }

  // Tone classes
  baseClasses.push(mapToneToClasses[effectiveTone.value]);

  return baseClasses;
});
</script>
