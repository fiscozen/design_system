<template>
  <button type="button" :disabled="disabled" :class="[staticClasses, classes]">
    <div :class="beforeClasses">
      <slot name="before"></slot>
    </div>
    <slot>
      {{ label }}
    </slot>
    <div :class="afterClasses">
      <slot name="after"></slot>
    </div>
    <span class="hidden h-0 w-0">{{ tooltip }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import type { ButtonVariant } from './types'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label?: string
    /**
     * The tooltip of the button will be shown on hover
     */
    tooltip: string
    /**
     * primary or secondary button
     */
    variant?: ButtonVariant
    /**
     * size of the button
     */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /**
     * whether action is enabled or not
     */
    disabled: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false
  }
)

const slots = useSlots()

const customVariantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return {
        'bg-blue-500': true,
        'hover:bg-blue-600': true,
        'disabled:bg-blue-200': true,
        'text-core-white': true,
        'focus:bg-blue-500': !props.disabled
      }
      break
    case 'secondary':
      return {
        'text-grey-500': true,
        'bg-core-white': true,
        '!border-grey-200': true,
        'hover:bg-grey-100': !props.disabled,
        'focus:!border-blue-600': !props.disabled,
        'disabled:text-grey-100': true
      }
      break
    case 'invisible':
      return {
        'text-grey-500': true,
        'bg-transparent': true,
        'border-transparent': true,
        'hover:bg-grey-100': !props.disabled,
        'focus:!border-blue-600': !props.disabled,
        'disabled:text-grey-100': true
      }
      break
    case 'danger':
      return {
        'text-core-white': true,
        'temporary-bg-red': true,
        'temporary-border-red': !props.disabled,
        'bg-semantic-error': true
      }
      break
    case 'success':
      return {
        'text-core-white': true,
        'temporary-bg-green': true,
        'temporary-border-green': !props.disabled,
        'bg-semantic-success': true
      }
      break
    default:
      return {}
      break
  }
})

const iconAndLabel = () => (props.label || slots.defatult) && (slots.before || slots.after)

const staticClasses = [
  'relative',
  'rounded',
  'flex',
  'flex-shrink',
  'items-center',
  'justify-center',
  'font-medium',
  'border-1',
  'border-transparent'
]

const classes = computed(() => ({
  'h-24 text-xs': props.size === 'xs',
  'h-28 text-sm': props.size === 'sm',
  'h-32': props.size === 'md',
  'h-40 text-lg': props.size === 'lg',
  'focus:border-blue-600': !props.disabled,
  'focus:border-solid': !props.disabled,
  'focus:border-1': !props.disabled,
  'px-12': props.size === 'xs' && !iconAndLabel,
  'px-14': props.size === 'sm' && !iconAndLabel,
  'px-16': props.size === 'md' && !iconAndLabel,
  'px-20': props.size === 'lg' && !iconAndLabel,
  ...customVariantClasses.value
}))

const beforeClasses = computed(() => ({
  'mr-8': props.size === 'lg',
  'mr-6': props.size === 'md',
  'mr-4': props.size === 'sm' || props.size === 'xs',
  'pl-12': props.size === 'lg' && iconAndLabel,
  'pl-10': (props.size === 'md' || props.size === 'sm') && iconAndLabel,
  'pl-8': props.size === 'xs' && iconAndLabel
}))

const afterClasses = computed(() => ({
  'ml-8': props.size === 'lg',
  'ml-6': props.size === 'md',
  'ml-4': props.size === 'sm' || props.size === 'xs',
  'pr-12': props.size === 'lg' && iconAndLabel,
  'pr-10': (props.size === 'md' || props.size === 'sm') && iconAndLabel,
  'pr-8': props.size === 'xs' && iconAndLabel
}))
</script>

<style>
.temporary-bg-red:hover {
  background-color: #aa2f2f;
}
.temporary-bg-red:disabled {
  background-color: #f8baba;
}
.temporary-border-red:focus {
  border-color: #aa2f2f;
}
.temporary-bg-green:hover {
  background-color: #0b7763;
}
.temporary-bg-green:disabled {
  background-color: #b5d8ce;
}
.temporary-border-green:focus {
  border-color: #0b7763;
}
</style>