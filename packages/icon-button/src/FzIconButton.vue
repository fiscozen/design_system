<template>
  <button type="button" class="relative" :disabled="disabled" :class="classes">
    <fz-icon :name="iconName" :variant="iconVariant" :size="mappedIconSize" />
    <div
      class="-mr-2 -mt-2"
      v-if="variant === 'notification'"
      :class="notificationClasses"
    ></div>
    <span class="hidden h-0 w-0">{{ tooltip }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { IconButtonVariant } from './types'
import { FzIcon } from '@fiscozen/icons'
import type { IconVariant } from '@fiscozen/icons'

const props = withDefaults(
  defineProps<{
    /**
     * The tooltip of the button will be shown on hover
     */
    tooltip: string
    /**
     * primary or secondary button
     */
    variant?: IconButtonVariant
    /**
     * size of the button
     */
    size?: 'sm' | 'md' | 'lg'
    /**
     * whether action is enabled or not
     */
    disabled: boolean
    /**
     * Icon to be displayed. Use fontawesome search here https://fontawesome.com/v6/icons
     * Mind that not all of the icons and variants might be available.
     */
    iconName: string
    /**
     * Fontawesome icon variant: solid, regular, light, thin. Sharp subvariants are available as well
     */
    iconVariant?: IconVariant
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    iconVariant: 'fasl'
  }
)

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
        'border-1': true,
        'border-grey-200': true,
        'hover:bg-grey-100': !props.disabled,
        'focus:border-blue-600': !props.disabled,
        'disabled:text-grey-100': true
      }
      break
    case 'notification':
      return {
        'text-grey-500': true,
        'bg-core-white': true,
        'border-1': true,
        'border-grey-200': true,
        'hover:bg-grey-100': !props.disabled,
        'disabled:text-grey-100': true
      }
      break
    case 'invisible': 
      return {
        'text-grey-500': true,
        'bg-core-white': true,
        'border-grey-200': true,
        'hover:bg-grey-100': !props.disabled,
        'disabled:text-grey-100': true
      }
      break
    default:
      return {}
      break
  }
})

const classes = computed(() => ({
  relative: true,
  rounded: true,
  flex: true,
  'flex-shrink': true,
  'items-center': true,
  'justify-center': true,
  'w-28 h-28': props.size === 'sm',
  'w-32 h-32': props.size === 'md',
  'w-40 h-40': props.size === 'lg',
  'focus:border-blue-600': !props.disabled,
  'focus:border-solid': !props.disabled,
  'focus:border-1': !props.disabled,
  ...customVariantClasses.value
}))

const notificationClasses = computed(() => ({
  'rounded-full': true,
  'bg-blue-500': true,
  absolute: true,
  'top-0': true,
  'right-0': true,
  'w-6 h-6': props.size === 'sm',
  'w-8 h-8': props.size === 'md' || props.size === 'lg',
  'bg-grey-200': props.disabled
}))

const iconSizeMap = {
  sm: 'md',
  md: 'lg',
  lg: 'lg'
}

const mappedIconSize = computed(() => iconSizeMap[props.size])
</script>
