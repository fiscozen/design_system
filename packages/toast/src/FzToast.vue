<template>
  <div :class="containerClass">
    <FzIcon :name="iconName" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzToastProps } from "./types";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzToastProps>(), {});
const emit = defineEmits([]);

const containerClass = computed(() => [
  "w-[320px] p-12 flex gap-8 text-sm items-center rounded border-1 border-grey-100",
  {
    success: "bg-semantic-success text-core-white",
    warning: "bg-semantic-warning",
    error: "bg-semantic-error text-core-white",
  }[props.type],
]);

const iconName = computed(
  () =>
    ({
      success: "circle-check",
      warning: "triangle-exclamation",
      error: "circle-xmark",
    })[props.type],
);
</script>

<style scoped></style>
