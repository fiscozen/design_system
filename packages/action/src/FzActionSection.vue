<template>
  <div class="flex flex-col gap-4" role="group" :aria-labelledby="uniqueId">
    <div
      v-if="label || $slots.label"
      class="text-grey-400 flex items-center px-12 py-6 text-sm"
      :id="uniqueId"
    >
      <slot name="label">{{ label }}</slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { FzActionSectionProps } from "./types";

withDefaults(defineProps<FzActionSectionProps>(), {
  label: "",
});

const uniqueId = `fz-action-section-label-${Math.random().toString(36).slice(2, 9)}`;
</script>
