/**
 * FzButton - Versatile button component with multiple variants and icon support
 * 
 * A comprehensive button component that supports multiple visual variants (primary, secondary,
 * invisible, danger, success), flexible sizing, and optional icon integration. The component
 * uses semantic color tokens for consistent theming and provides full accessibility support.
 * 
 * @example Basic usage
 * ```vue
 * <FzButton label="Click me" />
 * ```
 * 
 * @example With icon
 * ```vue
 * <FzButton label="Save" iconName="save" iconPosition="before" />
 * ```
 * 
 * @example Danger variant
 * ```vue
 * <FzButton variant="danger" label="Delete" :disabled="!confirmed" />
 * ```
 */
<script lang="ts" setup>
import { computed, useSlots, watch } from 'vue'
import { type IconVariant, FzIcon } from '@fiscozen/icons'
import type { ButtonSize, ButtonVariant } from './types'
import { iconSizeMap, buttonSizeConfig } from './utils'

const props = withDefaults(
  defineProps<{
    /**
     * Text label displayed on the button. Overridden by default slot if provided.
     */
    label?: string
    /**
     * @deprecated Use FzTooltip component to wrap the button instead.
     * A runtime warning will be displayed when this prop is used.
     */
    tooltip?: string
    /**
     * Visual style variant determining colors and interactive states
     * @default 'primary'
     */
    variant?: ButtonVariant
    /**
     * Button size affecting height, padding, and text size
     * @default 'md'
     */
    size?: ButtonSize
    /**
     * Disables interaction and applies disabled styling
     * @default false
     */
    disabled?: boolean
    /**
     * FontAwesome icon name (e.g., 'bell', 'save'). Search: https://fontawesome.com/v6/icons
     */
    iconName?: string
    /**
     * FontAwesome icon variant (e.g., 'fas', 'far', 'fal')
     */
    iconVariant?: IconVariant
    /**
     * Icon position relative to label
     * @default 'before'
     */
    iconPosition?: 'before' | 'after',
    /**
     * Additional CSS classes for label container. Merged with 'truncate' unless overrideContainerClass is true.
     */
    containerClass?: string
    /**
     * Replaces default container classes with containerClass instead of merging
     * @default false
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
const slots = useSlots()

/**
 * Emits deprecation warnings for deprecated props
 * 
 * Watches for tooltip prop usage and logs warning only when prop is provided.
 * Warning is shown once when component mounts or when tooltip changes.
 */
watch(() => props.tooltip, (tooltip) => {
  if (tooltip) {
    console.warn(
      '[FzButton] The "tooltip" prop is deprecated and will be removed in a future version. ' +
      'Please use the FzTooltip component to wrap your button instead.'
    )
  }
})

/**
 * Generates icon spacing classes based on position
 * 
 * Creates margin and padding classes for icon containers that scale with button size.
 * Margin provides separation between icon and label, while padding maintains button
 * dimensions when icons are present. Uses centralized buttonSizeConfig for consistent spacing.
 * 
 * @param position - Icon position relative to label ('before' or 'after')
 * @returns Object with conditional Tailwind classes
 */
const getIconSpacingClasses = (position: 'before' | 'after') => {
  const isBefore = position === 'before'
  const marginClass = isBefore ? 'mr' : 'ml'
  const paddingClass = isBefore ? 'pl' : 'pr'
  const config = buttonSizeConfig[props.size]
  
  return {
    [`${marginClass}-${config.iconMargin}`]: true,
    [`${paddingClass}-${config.iconPadding}`]: iconAndLabel.value
  }
}

/**
 * Computes CSS classes based on the selected variant
 * 
 * Returns dynamic classes for each variant, including background colors, text colors,
 * hover states, and focus states. Danger and success variants use semantic color tokens
 * (bg-semantic-error, bg-semantic-success) for consistent theming. Hover and focus classes
 * are conditionally applied based on the disabled state to prevent visual feedback on
 * non-interactive buttons.
 */
const customVariantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return {
        'bg-blue-500': true,
        'hover:bg-blue-600': true,
        'disabled:bg-blue-200': true,
        'text-core-white': true,
        'focus:bg-blue-500': isInteractive.value
      }
    case 'secondary':
      return {
        'text-grey-500': true,
        'bg-core-white': true,
        '!border-grey-200': true,
        'hover:bg-grey-100': isInteractive.value,
        'focus:!border-blue-600': isInteractive.value,
        'disabled:text-grey-100': true,
      }
    case 'invisible':
      return {
        'text-grey-500': true,
        'bg-transparent': true,
        'border-transparent': true,
        'hover:bg-grey-100': isInteractive.value,
        'focus:!border-blue-600': isInteractive.value,
        'disabled:text-grey-100': true
      }
    case 'danger':
      return {
        'text-core-white': true,
        'bg-semantic-error': true,
        'hover:bg-semantic-error-300': isInteractive.value,
        'disabled:bg-semantic-error-100': true,
        'focus:!border-semantic-error-300': isInteractive.value,
      }
    case 'success':
      return {
        'text-core-white': true,
        'bg-semantic-success': true,
        'hover:bg-semantic-success-300': isInteractive.value,
        'disabled:bg-semantic-success-100': true,
        'focus:!border-semantic-success-300': isInteractive.value,
      }
    default:
      return {}
  }
})

/**
 * Determines if both icon and label/slot content are present
 * 
 * Icons are only rendered when accompanied by text content to ensure proper
 * spacing and layout. This prevents icon containers from rendering unnecessarily.
 */
const iconAndLabel = computed(() => Boolean((props.label || slots.default) && props.iconName))

/**
 * Determines if the button is in an interactive state
 * 
 * Returns true when the button is not disabled, allowing hover and focus
 * visual feedback. Used throughout the component to conditionally apply
 * interactive classes.
 */
const isInteractive = computed(() => !props.disabled)

/**
 * Maps button size to appropriate icon size
 * 
 * Uses the iconSizeMap utility to ensure icons are proportionally sized
 * relative to the button dimensions.
 */
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

/**
 * Computes dynamic size-based classes for the button
 * 
 * Applies height, text size, focus states, and horizontal padding based on the size prop.
 * Uses centralized buttonSizeConfig for consistent sizing. Padding is adjusted when icons
 * are present to maintain visual balance. Focus border classes are only applied when the
 * button is not disabled.
 */
const classes = computed(() => {
  const config = buttonSizeConfig[props.size]
  const heightClass = `h-${config.height}`
  const textSizeClass = config.textSize ? `text-${config.textSize}` : null
  const paddingClass = `px-${config.padding}`
  
  return {
    [heightClass]: true,
    ...(textSizeClass ? { [textSizeClass]: true } : {}),
    'focus:border-blue-600': isInteractive.value,
    'focus:border-solid': isInteractive.value,
    'focus:border-1': isInteractive.value,
    [paddingClass]: !iconAndLabel.value,
    ...customVariantClasses.value
  }
})

/**
 * Computes classes for the label/slot container
 * 
 * By default, includes 'truncate' class to handle text overflow with ellipsis.
 * When overrideContainerClass is true, only the custom containerClass is applied,
 * allowing full control over container styling. Otherwise, custom classes are merged
 * with the default truncate behavior.
 */
const containerClass = computed(() => {
  if (props.overrideContainerClass) {
    return props.containerClass
  }

  return ["truncate", props.containerClass]
});
</script>

<template>
  <button type="button" :disabled="disabled" :class="[staticClasses, classes]">
    <div v-if="iconAndLabel" :class="[staticIconClasses, getIconSpacingClasses('before')]">
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
    <div v-if="slots.after || iconAndLabel" :class="[staticIconClasses, getIconSpacingClasses('after')]">
      <slot name="after">
        <FzIcon
          v-if="iconName && iconPosition === 'after'"
          :name="iconName"
          :size="mappedIconSize"
          :variant="iconVariant"
        />
      </slot>
    </div>
  </button>
</template>
