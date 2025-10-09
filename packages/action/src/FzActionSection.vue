<template>
  <div class="flex flex-col gap-4">
    <div v-if="label || $slots.label" class="text-grey-400 flex items-center px-12 py-6 text-xs">
      <slot name="label">{{ label }}</slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { FzActionSectionProps } from './types'

withDefaults(defineProps<FzActionSectionProps>(), {
  label: ''
})
</script>
