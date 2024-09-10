<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /**
     * Color variant
     */
    color: "black" | "blue" | "error" | "warning" | "success" | "info" | "light" | "dark";
    /**
     * The badge content variant
     */
    variant: "default" | "rounded";
    /**
     * The badge size
     */
    size: "sm" | "md" | "lg";
  }>(),
  {
    color: "black",
    variant: "default",
    size: "md",
  },
);

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
  sm: "text-xs h-16 px-8",
  md: "text-sm h-20 px-12",
  lg: "text-base h-28 px-14",
};

const mapVariantToClasses = {
  default: "rounded-xl",
  rounded: "rounded-full !px-7",
};

const classes = computed(() => [
  "h-20 w-fit flex items-center justify-center font-medium",
  mapSizeToClasses[props.size],
  mapVariantToClasses[props.variant],
  mapColorToClasses[props.color],
]);
</script>
<style scoped>
.\!px-7 {
  padding: 0 7px !important;
}
</style>