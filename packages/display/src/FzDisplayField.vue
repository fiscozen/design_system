<script setup lang="ts">
import { computed } from "vue";
import { FzDisplayFieldProps } from "./types";

const props = withDefaults(defineProps<FzDisplayFieldProps>(), {
  size: "normal",
  isEmphasized: false,
  gap: "none",
});

const gapClass = computed(() => {
  const map: Record<string, string> = {
    none: "gap-0",
    small: "gap-8",
    medium: "gap-12",
  };
  return map[props.gap];
});

const labelClass = computed(() => {
  return props.size === "small" ? "text-sm" : "text-base";
});

const valueClass = computed(() => {
  return props.isEmphasized ? "text-base font-semibold" : "text-base font-normal";
});
</script>

<template>
  <div :class="['flex', 'flex-col', gapClass]" data-testid="fz-display-field">
    <span :class="['text-grey-500', labelClass]">
      {{ label }}
    </span>
    <span :class="['text-core-black', valueClass]">
      {{ value }}
    </span>
  </div>
</template>
