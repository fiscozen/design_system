<script setup lang="ts">
import { computed } from "vue";

import type { FzContainerProps, FzContainerSlots } from "./types";

const props = withDefaults(defineProps<FzContainerProps>(), {
  main: false,
  gap: "base",
  tag: "div",
});

defineSlots<FzContainerSlots>();

const containerClass = computed(() => {
  const type = props.main ? "main-content" : "section-content";
  return `gap-${type}-${props.gap}`;
});
</script>

<template>
  <component :is="tag" :class="['fz-container', containerClass]">
    <slot />
  </component>
</template>

<style scoped>
.fz-container {
  display: flex;
  flex-direction: column;
}
</style>
