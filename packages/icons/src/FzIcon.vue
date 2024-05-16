<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons'
import type { IconSize, IconVariant } from './types'

withDefaults(
  defineProps<{
    name: string | string[]
    size?: IconSize
    variant?: IconVariant
  }>(),
  { size: 'lg', variant: 'far' }
)
const staticContainerClasses = ['flex', 'items-center', 'justify-center']
const containerClassSizeMap: Record<IconSize, string> = {
  xs: 'size-[12.5px]',
  sm: 'w-[15px] h-[15px]',
  md: 'w-[20px] h-[20px]',
  lg: 'w-[25px] h-[25px]',
  xl: 'w-[32px] h-[32px]',
  '2xl': 'w-[40px] h-[40px]'
}
const iconClassSizeMap: Record<IconSize, string> = {
  xs: 'h-[10px]',
  sm: 'h-[12px]',
  md: 'h-[16px]',
  lg: 'h-[20px]',
  xl: 'h-[24px]',
  '2xl': 'h-[32px]'
}
</script>

<template>
  <div :class="[staticContainerClasses, containerClassSizeMap[size]]">
    <font-awesome-icon
      :class="iconClassSizeMap[size]"
      :icon="typeof name === 'string' ? byPrefixAndName[variant][name] : name"
      :size="size !== 'md' ? size : undefined"
    />
  </div>
</template>
