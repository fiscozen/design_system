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
    color: "black" | "error" | "warning" | "success" | "info";
  }>(),
  {
    color: "black",
  },
);

const mapColorToClasses = {
  black: "bg-core-black text-core-white",
  error: "bg-semantic-error text-core-white",
  warning: "bg-semantic-warning",
  success: "bg-semantic-success text-core-white",
  info: "bg-semantic-info text-core-white",
};

const classes = computed(() => [
  "text-xs px-12 rounded-xl w-fit h-20 flex items-center font-medium",
  mapColorToClasses[props.color],
]);
</script>
