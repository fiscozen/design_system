<script lang="ts" setup>
/**
 * FzButtonGroup Component
 *
 * Container for grouping buttons in a horizontal layout with fixed spacing.
 * Displays buttons in a row with consistent gap between them.
 * Buttons maintain fixed widths (50% for 2 buttons, 33.333% for 3 buttons)
 * regardless of content, with text truncation handled by FzButton component.
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
  <FzContainer horizontal gap="sm" class="fz-button-group w-full">
    <slot></slot>
  </FzContainer>
</template>

<style scoped>
/**
 * Fixed width sizing for button group children
 * 
 * Uses CSS selectors to detect number of children and apply appropriate widths:
 * - 2 buttons: 50% each
 * - 3 buttons: 33.333% each
 * 
 * flex-basis sets initial size, flex-grow: 0 prevents expansion beyond flex-basis.
 * flex-shrink: 1 allows shrinking to prevent overflow when content exceeds available space.
 * Selectors use :nth-child() and :nth-last-child() for cross-browser compatibility.
 */

/* 2 buttons: first child is second-to-last */
.fz-button-group :deep(> *:nth-child(1):nth-last-child(2)),
.fz-button-group :deep(> *:nth-child(1):nth-last-child(2) ~ *) {
  flex-basis: 50%;
  flex-grow: 0;
  flex-shrink: 1;
}

/* 3 buttons: first child is third-to-last */
.fz-button-group :deep(> *:nth-child(1):nth-last-child(3)),
.fz-button-group :deep(> *:nth-child(1):nth-last-child(3) ~ *) {
  flex-basis: 33.333%;
  flex-grow: 0;
  flex-shrink: 1;
}
</style>