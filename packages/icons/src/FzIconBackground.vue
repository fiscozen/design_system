<script setup lang="ts">
import { computed } from 'vue'
import type { IconBackgroundProps } from './types'
import FzIcon from './FzIcon.vue'

const props = withDefaults(defineProps<IconBackgroundProps>(), {
  size: 'lg',
  variant: 'far',
  backgroundColor: 'core-white'
})

const iconClasses = computed(() => {
  return ['box-content', 'p-[8px]', 'rounded-full', `bg-${props.backgroundColor}`]
})

/** Props passed to FzIcon; excludes backgroundColor to avoid fallthrough to DOM. */
const iconProps = computed(() => {
  const { backgroundColor: _bg, ...rest } = props
  return rest
})
</script>

<template>
  <FzIcon :class="iconClasses" v-bind="iconProps" />
</template>
