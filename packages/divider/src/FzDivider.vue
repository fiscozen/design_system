<template>
  <div v-if="props.label" class="w-full my-16 flex items-center gap-6">
    <div class="flex-1 border-solid border-t-1 border-grey-200"></div>
    <span class="text-md" :class="labelClass">
      {{ label }}
    </span>
    <div class="flex-1 border-solid border-t-1 border-grey-200"></div>
  </div>
  <div v-else class="w-full my-16">
    <div class="border-solid border-t-1 border-grey-200"></div>
  </div>
</template>

<script setup lang="ts">
import { FzDividerProps } from "./types";

const props = withDefaults(defineProps<FzDividerProps>(), {});

const emit = defineEmits([]);
</script>

<style scoped></style>
