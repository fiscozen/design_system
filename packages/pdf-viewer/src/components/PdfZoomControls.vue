<template>
  <div class="flex items-center gap-8">
    <FzIconButton
      iconName="minus"
      iconVariant="fas"
      :environment="environment"
      variant="secondary"
      :disabled="scale <= minScale"
      aria-label="Zoom out"
      @click="emit('change', -scaleStep)"
    />
    <span :class="staticTextClass" data-testid="pdf-scale"
      >{{ Math.round(scale * 100) }} %</span
    >
    <FzIconButton
      iconName="plus"
      iconVariant="fas"
      :environment="environment"
      variant="secondary"
      :disabled="scale >= maxScale"
      aria-label="Zoom in"
      @click="emit('change', scaleStep)"
    />
  </div>
</template>

<script setup lang="ts">
import { FzIconButton } from "@fiscozen/button";

defineProps<{
  environment: "frontoffice" | "backoffice";
  scale: number;
  minScale: number;
  maxScale: number;
  scaleStep: number;
}>();

const emit = defineEmits<{
  change: [delta: number];
}>();

const staticTextClass =
  "text-grey-500 font-normal text-base leading-5 lining-nums tabular-nums";
</script>
