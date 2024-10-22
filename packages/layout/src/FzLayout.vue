<template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzLayoutProps } from './types'

const props = withDefaults(defineProps<FzLayoutProps>(), {})

const emit = defineEmits([])
</script>

<style scoped>
</style>
