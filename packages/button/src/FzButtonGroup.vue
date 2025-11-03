<script lang="ts" setup>
/**
 * FzButtonGroup Component
 *
 * Container for grouping buttons in a horizontal layout with fixed spacing.
 * Displays buttons in a row with consistent gap between them.
 * Children divide available space equally and never wrap to a new line.
 * Component occupies 100% width of its container.
 *
 * Validates that slot contains only FzButton components (2-3 buttons required).
 *
 * @component
 * @example
 * <FzButtonGroup>
 *   <FzButton>Button 1</FzButton>
 *   <FzButton>Button 2</FzButton>
 * </FzButtonGroup>
 */
import { nextTick, onMounted, useSlots, watch } from 'vue'
import { FzContainer } from '@fiscozen/container'
import type { FzButtonGroupProps } from './types'
import { validateButtonGroupSlot } from './utils'

const props = withDefaults(defineProps<FzButtonGroupProps>(), {
  horizontal: undefined,
  gap: undefined,
  size: undefined
})

const slots = useSlots()

/**
 * Validates slot content on mount and warns if invalid.
 * 
 * Uses nextTick to ensure slot is available before validation.
 */
onMounted(() => {
  nextTick(() => {
    const vnodes = slots.default?.()
    const validation = validateButtonGroupSlot(vnodes || [])
    
    if (!validation.valid && validation.error) {
      console.warn(validation.error)
    }
  })
})

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

<template>
  <FzContainer horizontal gap="sm" layout="expand-all" class="w-full">
    <slot></slot>
  </FzContainer>
</template>