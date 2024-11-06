<template>
    <FzIcon name="bell" spin  v-bind="props"/>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzProgressProps } from './types'
import { FzIcon } from '@fiscozen/icons'

const props = withDefaults(defineProps<FzProgressProps>(), {})

const emit = defineEmits([])
</script>

<style scoped>
</style>
