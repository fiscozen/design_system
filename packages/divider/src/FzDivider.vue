<template>
  <div class="w-full my-16 relative">
    <hr />
    <span
      v-if="props.label"
      class="text-md font-medium absolute px-8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-core-white"
      :class="labelClass"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { FzDividerProps } from "./types";

const props = withDefaults(defineProps<FzDividerProps>(), {});

const emit = defineEmits([]);
</script>

<style scoped></style>
