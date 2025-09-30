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

<style scoped lang="css">
.fz-container {
  display: flex;
  flex-direction: column;
}

/**
 * Applica margin-top solo ai paragrafi seguiti da altri paragrafi negli slot
 * 
 * :deep() permette di applicare gli stili solo a elementi negli slot mantenendo l'incapsulamento
 * Elimina il gap tra gli elementi p (0px - --gap)
 * Aggiunge il margine desiderato (8px)
 */
.fz-container.gap-main-content-sm :deep(p + p) {
  margin-top: calc((0px - var(--main-content-sm)) + 8px);
}

.fz-container.gap-main-content-base :deep(p + p) {
  margin-top: calc((0px - var(--main-content-base)) + 8px);
}

.fz-container.gap-main-content-lg :deep(p + p) {
  margin-top: calc((0px - var(--main-content-lg)) + 8px);
}

.fz-container.gap-section-content-sm :deep(p + p) {
  margin-top: calc((0px - var(--section-content-sm)) + 8px);
}

.fz-container.gap-section-content-base :deep(p + p) {
  margin-top: calc((0px - var(--section-content-base)) + 8px);
}

.fz-container.gap-section-content-lg :deep(p + p) {
  margin-top: calc((0px - var(--section-content-lg)) + 8px);
}
</style>
