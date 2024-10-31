<template>
  <div :class="computedClasses">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ButtonSize } from './types'

const props = withDefaults(
  defineProps<{
    /**
     * The direction of the button group. If true, buttons will be displayed horizontally, otherwise vertically
     */
    horizontal?: boolean
    /**
     * Whether to add a gap between buttons
     */
    gap?: boolean
    /**
     * The gap size between buttons
     */
    size?: ButtonSize
  }>(),
  {
    horizontal: true,
    size: 'md'
  }
)

const computedClasses = computed(() => {
  return {
    'flex flex-col vertical': !props.horizontal,
    'flex flex-row horizontal': props.horizontal,
    'gap-disabled': !props.gap,
    'gap-8': props.gap && props.size === 'xs',
    'gap-10': props.gap && props.size === 'sm',
    'gap-12': props.gap && props.size === 'md',
    'gap-16': props.gap && props.size === 'lg'
  }
})
</script>

<style scoped>
.gap-disabled :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0;
}

.gap-disabled.horizontal :deep(button:first-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.gap-disabled.horizontal :deep(button:last-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.gap-disabled.horizontal :deep(button:not(:first-child)) {
  margin-left: -1px;
}

.gap-disabled.vertical :deep(button:first-child) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.gap-disabled.vertical :deep(button:last-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.gap-disabled.vertical :deep(button:not(:first-child)) {
  margin-top: -1px;
}
</style>
