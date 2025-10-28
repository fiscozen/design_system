/**
 * FzButton - Versatile button component with multiple variants and environment-based sizing
 * 
 * A comprehensive button component supporting five visual variants (primary, secondary, invisible,
 * danger, success) and two environment-based sizes (backoffice, frontoffice). Features
 * include icon integration, multiple interactive states, and full accessibility support.
 * 
 * @example Basic usage (frontoffice default)
 * ```vue
 * <FzButton label="Click me" />
 * ```
 * 
 * @example Backoffice environment
 * ```vue
 * <FzButton environment="backoffice" label="Save" />
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
import { type IconVariant, type IconSize, FzIcon } from '@fiscozen/icons'
import type { ButtonSize, ButtonVariant, ButtonEnvironment } from './types'
import { sizeToEnvironmentMapping, buttonEnvironmentConfig } from './utils'

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
     * @deprecated Use the 'environment' prop instead. This prop will be removed in a future version.
     */
    size?: ButtonSize
    /**
     * Environment determining button size
     * @default 'frontoffice'
     */
    environment?: ButtonEnvironment
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
    disabled: false,
    iconPosition: 'before',
    // Note: environment has no default to allow deprecated size prop to work via effectiveEnvironment computed
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
 * Emits deprecation warnings for deprecated size prop
 * 
 * Watches for size prop usage and logs warning with migration path to environment prop.
 */
watch(() => props.size, (size) => {
  if (size !== undefined) {
    const mappedEnvironment = sizeToEnvironmentMapping[size]
    
    // Check if both environment and size are provided and conflict
    if (props.environment && props.environment !== mappedEnvironment) {
      console.warn(
        `[FzButton] Both "size" and "environment" props are provided. ` +
        `"environment=${props.environment}" will be used and "size=${size}" will be ignored. ` +
        `Please remove the deprecated "size" prop.`
      )
    } else {
      console.warn(
        `[FzButton] The "size" prop is deprecated and will be removed in a future version. ` +
        `Please use environment="${mappedEnvironment}" instead of size="${size}".`
      )
    }
  }
}, { immediate: true })


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
    case 'secondary':
      return {
        'bg-core-white': true,
        'text-grey-500': true,
        '!border-grey-200': true,
        'hover:bg-grey-100': isInteractive.value,
        'focus:bg-core-white': isInteractive.value,
        'focus:!border-grey-500': isInteractive.value,
        'disabled:bg-grey-50': true,
        'disabled:text-grey-200': true,
        'disabled:!border-grey-100': true,
      }
    case 'invisible':
      return {
        'bg-transparent': true,
        'text-grey-500': true,
        '!border-transparent': true,
        'hover:bg-grey-100': isInteractive.value,
        'focus:bg-transparent': isInteractive.value,
        'focus:!border-grey-500': isInteractive.value,
        'disabled:text-grey-200': true,
      }
    case 'danger':
      return {
        'bg-semantic-error-200': true,
        'text-core-white': true,
        'hover:bg-semantic-error-300': isInteractive.value,
        'focus:bg-semantic-error-200': isInteractive.value,
        'focus:!border-semantic-error-300': isInteractive.value,
        'disabled:bg-semantic-error-100': true,
      }
    case 'success':
      return {
        'bg-semantic-success-200': true,
        'text-core-white': true,
        'hover:bg-semantic-success-300': isInteractive.value,
        'focus:bg-semantic-success-200': isInteractive.value,
        'focus:!border-semantic-success-300': isInteractive.value,
        'disabled:bg-semantic-success-100': true,
      }
    case 'primary':
    default:
      return {
        'bg-blue-500': true,
        'text-core-white': true,
        'hover:bg-blue-600': isInteractive.value,
        'focus:bg-blue-500': isInteractive.value,
        'focus:!border-blue-600': isInteractive.value,
        'disabled:bg-blue-200': true,
      }
  }
})

/**
 * Determines the effective environment based on environment or size prop
 * 
 * Priority: environment prop > size prop mapped to environment > default 'frontoffice'.
 * The size prop is deprecated and only used for backward compatibility.
 */
const effectiveEnvironment = computed((): ButtonEnvironment => {
  if (props.environment) {
    return props.environment
  }
  if (props.size) {
    return sizeToEnvironmentMapping[props.size]
  }
  return 'frontoffice'
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

const staticClasses = [
  'relative',
  'rounded',
  'flex',
  'flex-shrink',
  'items-center',
  'justify-center',
  'font-normal',
  'border-1',
  'border-transparent',
  'gap-8'
]

const staticIconClasses = ['flex', 'items-center', 'justify-items-center']

/**
 * Computes dynamic size-based classes for the button
 * 
 * Applies fixed height, horizontal padding, and focus states based on the effective environment.
 * Focus border classes are only applied when the button is not disabled.
 */
const classes = computed(() => {
  const config = buttonEnvironmentConfig[effectiveEnvironment.value]
  const heightClass = `h-${config.height}`
  const paddingXClass = `px-${config.paddingX}`
  const minWidthClass = `min-w-${config.minWidth}`
  
  return {
    [heightClass]: true,
    [paddingXClass]: true,
    [minWidthClass]: true,
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
    <div v-if="slots.before || (iconAndLabel && iconPosition === 'before')" :class="staticIconClasses">
      <slot name="before">
        <FzIcon
          v-if="iconName && iconPosition === 'before'"
          :name="iconName"
          size="md"
          :variant="iconVariant"
        />
      </slot>
    </div>
    <div v-if="label || slots.default" :class="containerClass">
      <slot>
        {{ label }}
      </slot>
    </div>
    <div v-if="slots.after || (iconAndLabel && iconPosition === 'after')" :class="staticIconClasses">
      <slot name="after">
        <FzIcon
          v-if="iconName && iconPosition === 'after'"
          :name="iconName"
          size="md"
          :variant="iconVariant"
        />
      </slot>
    </div>
  </button>
</template>
