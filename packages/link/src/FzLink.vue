<template>
  <span v-if="disabled" :class="spanClass">
    <slot></slot>
  </span>
  <a v-else-if="external" :href="to.toString()" :class="linkClass" :target>
    <slot></slot>
  </a>
  <router-link v-else :to :replace :class="linkClass" :target>
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FzLinkProps } from './types'

const props = withDefaults(defineProps<FzLinkProps>(), {
  type: 'default',
  style: 'default',
  size: 'lg',
  disabled: false,
  replace: false,
  external: false,
})

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
