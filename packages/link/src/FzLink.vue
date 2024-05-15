<template>
  <span v-if="disabled" :class="spanClass">
    <slot></slot>
  </span>
  <router-link v-else :to :replace :class="linkClass">
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to: RouteLocationRaw
    /**
     * Calls `router.replace` instead of `router.push`.
     */
    replace?: boolean
    /**
     * The purpose of the link
     */
    type?: 'default' | 'danger'
    /**
     * The appearance of the link
     */
    style?: 'default' | 'underline'
    /**
     * Size of the link
     */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /**
     * Whether the link is disabled
     */
    disabled?: boolean
  }>(),
  {
    type: 'default',
    style: 'default',
    size: 'lg',
    disabled: false,
    replace: false
  }
)

const commonClass = computed(() => [
  'border-1 border-transparent',
  {
    'text-xs': props.size === 'xs',
    'text-sm': props.size === 'sm',
    'text-md': props.size === 'md',
    'text-lg': props.size === 'lg',
    underline: props.style === 'underline'
  }
])

const linkClass = computed(() => [
  ...commonClass.value,
  'hover:underline',
  {
    'text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:border-blue-600':
      props.type === 'default',
    'text-semantic-error hover:text-red-600 focus:text-red-600 focus:border-red-600':
      props.type === 'danger'
  }
])

const spanClass = computed(() => [
  ...commonClass.value,
  'cursor-not-allowed',
  {
    'text-red-200': props.type === 'danger',
    'text-blue-200': props.type === 'default'
  }
])
</script>
