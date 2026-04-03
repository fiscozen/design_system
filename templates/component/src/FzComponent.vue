<template>
</template>

<script setup lang="ts">
import type { Fz{{pascalCase component}}Props } from './types'

const props = withDefaults(defineProps<Fz{{pascalCase component}}Props>(), {
  disabled: false,
  environment: 'frontoffice'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// For v-model support, use defineModel():
// const modelValue = defineModel<string>()
</script>

<style scoped>
</style>
