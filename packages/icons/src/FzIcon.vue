<script setup lang="ts">
/**
 * FzIcon – Design system icon component (Font Awesome).
 *
 * Renders a single icon with configurable size and variant. The root element is a
 * <span role="presentation"> so that v-color can be applied (e.g. <FzIcon v-color:blue="500" />)
 * and the icon can be nested inside <p> or <span> without invalid HTML. role="presentation"
 * removes semantics for accessibility.
 *
 * @component
 * @example
 * <FzIcon name="check" />
 * <p v-color:blue>Ciao <FzIcon name="check" v-color:yellow /></p>
 */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons'
import type { IconProps, IconSize } from './types'

withDefaults(
  defineProps<IconProps>(),
  { size: 'lg', variant: 'far' }
)

const staticContainerClasses = ['flex', 'items-center', 'justify-center', 'inline-flex']
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
  <span
    role="presentation"
    :class="[staticContainerClasses, containerClassSizeMap[size]]"
  >
    <FontAwesomeIcon
      :class="iconClassSizeMap[size]"
      :icon="typeof name === 'string' ? byPrefixAndName[variant][name] : name"
      :size="size !== 'md' ? size : undefined"
      :spin="spin"
    />
  </span>
</template>
