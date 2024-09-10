<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    /**
     * Color variant
     */
    color: "black" | "blue" | "error" | "warning" | "success" | "info" | "light" | "dark";
    /**
     * The badge size
     */
    size: "sm" | "md" | "lg";
  }>(),
  {
    color: "black",
    size: "md",
  },
);

const slots = useSlots();
const label = computed(() => slots.default?.()[0].children?.toString());
const variant = computed(() => label.value && label.value.length === 1 ? "rounded" : "default");

const mapColorToClasses = {
  black: "bg-core-black text-core-white",
  error: "bg-semantic-error text-core-white",
  warning: "bg-semantic-warning",
  success: "bg-semantic-success text-core-white",
  info: "bg-semantic-info text-core-white",
  blue: "bg-blue-500 text-core-white",
  light: "bg-grey-100 text-core-black",
  dark: "bg-grey-500 text-core-white",
};

const mapSizeToClasses = {
  sm: "text-xs px-8 h-16 w-16",
  md: "text-sm px-12 h-20 w-20",
  lg: "text-base px-14 h-28 w-28",
};

const mapVariantToClasses = {
  default: "rounded-2xl !w-fit",
  rounded: "rounded-full !px-0",
};

const classes = computed(() => [
  "flex items-center justify-center font-medium",
  mapSizeToClasses[props.size],
  mapVariantToClasses[variant.value],
  mapColorToClasses[props.color],
]);
</script>