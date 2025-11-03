<template>
  <div class="flex flex-row gap-16">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * FzButtonGroup Component
 *
 * Container for grouping buttons in a horizontal layout with fixed spacing.
 * Displays buttons in a row with consistent 16px gap between them.
 *
 * @component
 * @example
 * <FzButtonGroup>
 *   <FzButton>Button 1</FzButton>
 *   <FzButton>Button 2</FzButton>
 * </FzButtonGroup>
 */
import { watch } from 'vue'
import type { FzButtonGroupProps } from './types'

const props = withDefaults(defineProps<FzButtonGroupProps>(), {
  horizontal: undefined,
  gap: undefined,
  size: undefined
})

/**
 * Emits deprecation warnings for deprecated props
 * 
 * Warns when deprecated props are used with non-undefined values.
 */
watch(
  () => props.horizontal,
  (value) => {
    if (value !== undefined) {
      console.warn(
        '[FzButtonGroup] The "horizontal" prop is deprecated and will be removed in a future version. ' +
        'Component is always horizontal. Please remove this prop.'
      )
    }
  },
  { immediate: true }
)

watch(
  () => props.gap,
  (value) => {
    if (value !== undefined) {
      console.warn(
        '[FzButtonGroup] The "gap" prop is deprecated and will be removed in a future version. ' +
        'Component always uses fixed gap spacing. Please remove this prop.'
      )
    }
  },
  { immediate: true }
)

watch(
  () => props.size,
  (value) => {
    if (value !== undefined) {
      console.warn(
        '[FzButtonGroup] The "size" prop is deprecated and will be removed in a future version. ' +
        'Component always uses fixed gap size. Please remove this prop.'
      )
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/**
 * Horizontal button group layout
 * 
 * Displays buttons in a row with fixed 16px gap spacing between them.
 * Uses flexbox for layout and Tailwind gap utility for consistent spacing.
 */
</style>
