<template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzDatepickerProps } from './types'

const props = withDefaults(defineProps<FzDatepickerProps>(), {})

const emit = defineEmits([])
</script>

<style scoped>
</style>
