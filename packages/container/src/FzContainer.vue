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
  const type = props.main ? "main" : "section";
  return `fz-container--${type}-${props.gap}`;
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

.fz-container--main-sm {
  gap: var(--spacing-fz-container-main-content-sm);
}

.fz-container--main-base {
  gap: var(--spacing-fz-container-main-content-base);
}

.fz-container--main-lg {
  gap: var(--spacing-fz-container-main-content-lg);
}

.fz-container--section-sm {
  gap: var(--spacing-fz-container-section-content-sm);
}

.fz-container--section-base {
  gap: var(--spacing-fz-container-section-content-base);
}

.fz-container--section-lg {
  gap: var(--spacing-fz-container-section-content-lg);
}
</style>
