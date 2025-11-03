<template>
  <div :class="computedClasses">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * FzButtonGroup Component
 *
 * Container for grouping buttons with flexible layout orientation and spacing control.
 * Supports horizontal and vertical layouts with configurable gaps. When gap is disabled,
 * buttons connect seamlessly with shared borders.
 *
 * @component
 * @example
 * <FzButtonGroup gap size="md">
 *   <FzButton>Button 1</FzButton>
 *   <FzButton>Button 2</FzButton>
 * </FzButtonGroup>
 */
import { computed } from 'vue'
import type { FzButtonGroupProps } from './types'
import { buttonGapConfig } from './utils'

const props = withDefaults(
  defineProps<FzButtonGroupProps>(),
  {
    horizontal: true,
    gap: false,
    size: 'md'
  }
)

/**
 * Determines if buttons should be arranged horizontally
 * 
 * Used to simplify conditional logic for layout classes.
 */
const isHorizontal = computed(() => props.horizontal)

/**
 * Determines if spacing should be applied between buttons
 * 
 * Used to simplify conditional logic for gap classes.
 */
const hasGap = computed(() => props.gap)

/**
 * Generates layout classes based on orientation
 * 
 * Returns flexbox direction classes and orientation marker for CSS targeting.
 */
const layoutClasses = computed(() => {
  if (isHorizontal.value) {
    return 'flex flex-row horizontal'
  }
  return 'flex flex-col vertical'
})

/**
 * Generates gap classes based on spacing configuration
 * 
 * Returns either gap-disabled class or size-based gap class from configuration.
 */
const gapClasses = computed(() => {
  if (!hasGap.value) {
    return 'gap-disabled'
  }
  return buttonGapConfig[props.size]
})

const computedClasses = computed(() => {
  return {
    [layoutClasses.value]: true,
    [gapClasses.value]: true
  }
})
</script>

<style scoped>
/**
 * Styles for gap-disabled mode (attached buttons with seamless borders)
 * 
 * When gap is disabled, buttons connect seamlessly creating a unified control group.
 * Border radius is removed at connection points and negative margins eliminate
 * double borders between adjacent buttons.
 */

/**
 * Middle buttons in attached groups have no border radius
 * 
 * Buttons between first and last have all corners squared to create seamless connections.
 */
.gap-disabled :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0;
}

/**
 * Horizontal layout: first button loses right-side radius
 * 
 * Removes top-right and bottom-right corners to connect with next button.
 */
.gap-disabled.horizontal :deep(button:first-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/**
 * Horizontal layout: last button loses left-side radius
 * 
 * Removes top-left and bottom-left corners to connect with previous button.
 */
.gap-disabled.horizontal :deep(button:last-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/**
 * Horizontal layout: negative margin eliminates double borders
 * 
 * Overlaps adjacent buttons by 1px so shared borders merge into single visible border.
 * Prevents double-border visual artifact between connected buttons.
 */
.gap-disabled.horizontal :deep(button:not(:first-child)) {
  margin-left: -1px;
}

/**
 * Vertical layout: first button loses bottom radius
 * 
 * Removes bottom-left and bottom-right corners to connect with button below.
 */
.gap-disabled.vertical :deep(button:first-child) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/**
 * Vertical layout: last button loses top radius
 * 
 * Removes top-left and top-right corners to connect with button above.
 */
.gap-disabled.vertical :deep(button:last-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/**
 * Vertical layout: negative margin eliminates double borders
 * 
 * Overlaps adjacent buttons by 1px so shared borders merge into single visible border.
 * Prevents double-border visual artifact between connected buttons.
 */
.gap-disabled.vertical :deep(button:not(:first-child)) {
  margin-top: -1px;
}
</style>
