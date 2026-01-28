<script setup lang="ts">
import { computed } from "vue";
import { FzDividerProps } from "./types";

const props = withDefaults(defineProps<FzDividerProps>(), {
  margin: "base",
});

const emit = defineEmits([]);

const marginClass = computed(() => {
  return props.margin === "base" ? "my-16" : "my-0";
});
</script>

<style scoped></style>

<template>
  <div
    v-if="props.label"
    :class="['w-full', 'flex', 'items-center', 'gap-6', marginClass]"
  >
    <div class="flex-1 border-solid border-t-1 border-grey-200"></div>
    <span class="text-md" :class="labelClass">
      {{ label }}
    </span>
    <div class="flex-1 border-solid border-t-1 border-grey-200"></div>
  </div>
  <div v-else :class="['w-full', marginClass]">
    <div class="border-solid border-t-1 border-grey-200"></div>
  </div>
</template>
