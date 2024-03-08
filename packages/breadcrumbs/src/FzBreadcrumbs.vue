<template>
  <div class="flex text-sm">
    <template v-for="(el, index) in breadcrumbs" :key="el.id">
      <slot name="bread-label" :bread="el" :isActive="index === breadcrumbs.length - 1">
        <div class="text-blue-500" :class="{ 'text-grey-500': index !== breadcrumbs.length - 1 }">
          {{ el.label }}
        </div>
      </slot>
      <template v-if="index !== breadcrumbs.length - 1">
        <slot name="bread-separator">
          <div class="text-grey-300 mx-4">{{ separator }}</div>
        </slot>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts" generic="T">
import { Breadcrumb } from './types'

withDefaults(
  defineProps<{
    /**
     * List of breadcrumbs
     */
    breadcrumbs: Breadcrumb<T>[]
    /**
     * Breadcrumb separator symbol
     */
    separator?: string
  }>(),
  {
    separator: '/'
  }
)
</script>
