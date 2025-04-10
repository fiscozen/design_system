<template>
  <button type="button" :disabled="disabled" :class="[staticClasses, classes]">
    <div v-if="iconAndLabel" :class="[staticIconClasses, beforeClasses]">
      <slot name="before">
        <FzIcon
          v-if="iconName && iconPosition === 'before'"
          :name="iconName"
          :size="mappedIconSize"
          :variant="iconVariant"
        />
      </slot>
    </div>
    <div :class="containerClass">
      <slot>
        {{ label }}
      </slot>
    </div>
    <div v-if="slots.after || iconAndLabel" :class="[staticIconClasses, afterClasses]">
      <slot name="after">
        <FzIcon
          v-if="iconName && iconPosition === 'after'"
          :name="iconName"
          :size="mappedIconSize"
        />
      </slot>
    </div>
    <span class="hidden h-0 w-0">{{ tooltip }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { type IconVariant, FzIcon } from '@fiscozen/icons'
import type { ButtonSize, ButtonVariant } from './types'
import { iconSizeMap } from './utils'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label?: string
    /**
     * The tooltip of the button will be shown on hover
     */
    tooltip?: string
    /**
     * primary or secondary button
     */
    variant?: ButtonVariant
    /**
     * size of the button
     */
    size?: ButtonSize
    /**
     * whether action is enabled or not
     */
    disabled?: boolean
    /**
     * Icon to be displayed. Use fontawesome search here https://fontawesome.com/v6/icons
     * Mind that not all of the icons and variants might be available.
     */
    iconName?: string
    /**
     * Fontawesome icon variant: solid, regular, light, thin. Sharp subvariants are available as well
     */
    iconVariant?: IconVariant
    /**
     * Positioning of the icon
     */
    iconPosition?: 'before' | 'after',
    /**
     * Define the css class for the default slot container
     */
    containerClass?: string
    /**
     * Whether to override internal container classes
     */
    overrideContainerClass?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    iconPosition: 'before',
  }
)
console.log('FzButton', props)
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
        'disabled:text-grey-100': true,
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

const iconAndLabel = computed(() => Boolean((props.label || slots.default) && props.iconName))
const mappedIconSize = computed(() => iconSizeMap[props.size])

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

const staticIconClasses = ['flex', 'items-center', 'justify-items-center']

const classes = computed(() => ({
  'h-24 text-xs': props.size === 'xs',
  'h-28 text-sm': props.size === 'sm',
  'h-32': props.size === 'md',
  'h-40 text-lg': props.size === 'lg',
  'focus:border-blue-600': !props.disabled,
  'focus:border-solid': !props.disabled,
  'focus:border-1': !props.disabled,
  'px-12': props.size === 'xs' && !iconAndLabel.value,
  'px-14': props.size === 'sm' && !iconAndLabel.value,
  'px-16': props.size === 'md' && !iconAndLabel.value,
  'px-20': props.size === 'lg' && !iconAndLabel.value,
  ...customVariantClasses.value
}))

const beforeClasses = computed(() => ({
  'mr-8': props.size === 'lg',
  'mr-6': props.size === 'md',
  'mr-4': props.size === 'sm' || props.size === 'xs',
  'pl-12': props.size === 'lg' && iconAndLabel.value,
  'pl-10': (props.size === 'md' || props.size === 'sm') && iconAndLabel.value,
  'pl-8': props.size === 'xs' && iconAndLabel.value
}))

const afterClasses = computed(() => ({
  'ml-8': props.size === 'lg',
  'ml-6': props.size === 'md',
  'ml-4': props.size === 'sm' || props.size === 'xs',
  'pr-12': props.size === 'lg' && iconAndLabel.value,
  'pr-10': (props.size === 'md' || props.size === 'sm') && iconAndLabel.value,
  'pr-8': props.size === 'xs' && iconAndLabel.value
}))

const containerClass = computed(() => {
  if (props.overrideContainerClass) {
    return props.containerClass
  }

  return ["truncate", props.containerClass]
});
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
