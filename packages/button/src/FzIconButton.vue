<script lang="ts" setup>
/**
 * Disables automatic attribute inheritance to prevent attrs from being applied
 * to the wrapper span element. All attrs (including event listeners) are explicitly
 * passed to FzButton via v-bind="$attrs" instead.
 */
defineOptions({
  inheritAttrs: false
})

/**
 * FzIconButton - Icon-only button component
 * 
 * A specialized button variant that displays only an icon, ideal for compact interfaces
 * and toolbars. Wraps FzButton and delegates icon rendering to FzButton's icon props.
 * Features include multiple variants, notification badge support, and full accessibility.
 * 
 * @example Basic usage
 * ```vue
 * <FzIconButton iconName="bell" />
 * ```
 * 
 * @example With notification badge
 * ```vue
 * <FzIconButton iconName="bell" hasNotification />
 * ```
 * 
 * @example With tooltip
 * ```vue
 * <FzTooltip content="Notifications">
 *   <FzIconButton iconName="bell" />
 * </FzTooltip>
 * ```
 */
import { computed, watch } from 'vue'
import type { FzIconButtonProps, ButtonEnvironment } from './types'
import FzButton from './FzButton.vue'
import { sizeToEnvironmentMapping } from './utils'

const props = withDefaults(
  defineProps<FzIconButtonProps>(),
  {
    variant: 'primary',
    disabled: false,
    iconVariant: 'far',
    hasNotification: false
    // Note: environment has no default to allow deprecated size prop to work via effectiveEnvironment computed
  }
)


/**
 * Emits deprecation warning for tooltip prop
 * 
 * Watches for tooltip prop usage and logs warning only when prop is provided.
 * Warning is shown once when component mounts or when tooltip changes.
 */
watch(() => props.tooltip, (tooltip) => {
  if (tooltip) {
    console.warn(
      '[FzIconButton] The "tooltip" prop is deprecated and will be removed in a future version. ' +
      'Please use the FzTooltip component to wrap your button instead.'
    )
  }
}, { immediate: true })

/**
 * Emits deprecation warning for deprecated size prop
 * 
 * Watches for size prop usage and logs warning with migration path to environment prop.
 */
watch(() => props.size, (size) => {
  if (size !== undefined) {
    const mappedEnvironment = sizeToEnvironmentMapping[size]
    
    // Check if both environment and size are provided and conflict
    if (props.environment && props.environment !== mappedEnvironment) {
      console.warn(
        `[FzIconButton] Both "size" and "environment" props are provided. ` +
        `"environment=${props.environment}" will be used and "size=${size}" will be ignored. ` +
        `Please remove the deprecated "size" prop.`
      )
    } else {
      console.warn(
        `[FzIconButton] The "size" prop is deprecated and will be removed in a future version. ` +
        `Please use environment="${mappedEnvironment}" instead of size="${size}".`
      )
    }
  }
}, { immediate: true })

/**
 * Emits deprecation warning for deprecated iconSize prop
 * 
 * Watches for iconSize prop usage and logs warning. IconSize prop will be removed in a future version.
 */
watch(() => props.iconSize, (iconSize) => {
  if (iconSize !== undefined) {
    console.warn(
      `[FzIconButton] The "iconSize" prop is deprecated and will be removed in a future version. ` +
      `Icon size has now a fixed dimension. Please remove the "iconSize" prop from your code.`
    )
  }
}, { immediate: true })

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
 * Computes aria-label for accessibility
 * 
 * Icon buttons require explicit labels for screen readers. Uses ariaLabel prop if provided.
 * If hasNotification is true, appends notification status to the label for screen reader
 * announcements.
 */
const ariaLabel = computed(() => {
  const baseLabel = props.ariaLabel || ''
  
  if (props.hasNotification) {
    return `${baseLabel}, hai delle notifiche`
  }

  return baseLabel
})

/**
 * Computes CSS classes for notification badge
 * 
 * Badge appears as a circular indicator in the top-right corner when hasNotification is true.
 */
const notificationBadgeClasses = computed(() => {
  const baseClasses = {
    'rounded-full': true,
    'w-8': true,
    'h-8': true,
    absolute: true,
    '-top-[2px]': true,
    '-right-[2px]': true
  }
  
  // Color based on variant and disabled state
  if (props.disabled) {
    if (props.variant === 'primary') {
      return {
        ...baseClasses,
        'bg-orange-200': true
      }
    }
    // secondary or invisible
    return {
      ...baseClasses,
      'bg-grey-200': true
    }
  }
  
  // Color based on variant
  if (props.variant === 'primary') {
    return {
      ...baseClasses,
      'bg-orange-500': true
    }
  }
  
  // secondary or invisible
  return {
    ...baseClasses,
    'bg-blue-500': true
  }
})
</script>

<template>
  <span :class="['fz-icon-button-wrapper', 'relative', {'fz-icon-button-wrapper--backoffice': effectiveEnvironment === 'backoffice', 'fz-icon-button-wrapper--frontoffice': effectiveEnvironment === 'frontoffice'}]">
    <FzButton 
      v-bind="$attrs"
      :disabled="props.disabled" 
      :environment="effectiveEnvironment" 
      :variant="props.variant" 
      :aria-label="ariaLabel"
      :icon-name="props.iconName"
      :icon-variant="props.iconVariant"
      icon-position="before"
      overrideContainerClass
    />
    <div 
      v-if="props.hasNotification" 
      :class="notificationBadgeClasses"
      aria-hidden="true"
    />
  </span>
</template>

<style scoped>
/**
 * Overrides FzButton styles for icon-only buttons
 */
.fz-icon-button-wrapper > :deep(button) {
  gap: 0 !important;
  min-width: 0 !important;
}

.fz-icon-button-wrapper--backoffice > :deep(button) {
  padding-left: 5px;
  padding-right: 5px;
}

.fz-icon-button-wrapper--frontoffice > :deep(button) {
  padding-left: 11px;
  padding-right: 11px;
}
</style>