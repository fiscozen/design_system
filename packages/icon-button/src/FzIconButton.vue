<template>
  <button
    type="button"
    class="fz__iconbtn relative"
    :disabled="disabled"
    :class="classes"> 
      <fz-icon 
        class="fz__iconbtn__icon"
        :name="iconName"
        :variant="iconVariant"
        :size="mappedIconSize"/>
      <div class="fz__iconbtn__notification" 
        v-if="variant === IconButtonVariant.notification"
        :class="notificationClasses">
      </div>
      <span class="hidden w-0 h-0">{{ tooltip }}</span>
    </button>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {IconButtonVariant} from './types';
import {FzIcon } from '@fiscozen/icons';
import type { IconVariants } from '@fiscozen/icons';

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
    size?: 'sm' | 'md' | 'lg',
    /**
     * whether action is enabled or not
     */
    disabled: boolean,
    /**
     * Icon to be displayed. Use fontawesome search here https://fontawesome.com/v6/icons
     * Mind that not all of the icons and variants might be available.
     */
    iconName: string,
    /**
     * Fontawesome icon variant: solid, regular, light, thin. Sharp subvariants are available as well
     */
    iconVariant?: IconVariants,
  }>(),
  { 
    variant: IconButtonVariant.primary,
    size: 'md',
    disabled: false,
    iconVariant: 'fasl',
  }
)

const customVariantClasses = computed(() => ({
  [IconButtonVariant.primary]: {
    'bg-blue-500': true,
    'hover:bg-blue-600': true,
    'disabled:bg-blue-200': true, 
    'text-core-white': true, 
    'focus:bg-blue-500': !props.disabled,
  },
  [IconButtonVariant.secondary]: {
    'text-grey-500': true, 
    'bg-core-white': true,
    'border-1': true,
    'border-grey-200': true,
    'hover:bg-grey-100': !props.disabled, 
    'focus:border-blue-600': !props.disabled,
    'disabled:text-grey-100': true,
  },
  [IconButtonVariant.notification]: {
    'text-grey-500': true, 
    'bg-core-white': true,
    'border-1': true,
    'border-grey-200': true,
    'hover:bg-grey-100': !props.disabled, 
    'disabled:text-grey-100': true,
  },
  [IconButtonVariant.invisible]: {
    'text-grey-500': true, 
    'bg-core-white': true,
    'border-grey-200': true,
    'hover:bg-grey-100': !props.disabled, 
    'disabled:text-grey-100': true,
  },
}));

const classes = computed(() => ({
  'relative': true,
  'rounded': true,
  'flex': true,
  'flex-shrink': true,
  'items-center': true,
  'justify-center': true,
  'w-28 h-28': props.size === 'sm',
  'w-32 h-32': props.size === 'md',
  'w-40 h-40': props.size === 'lg',
  'focus:border-blue-600': !props.disabled,
  'focus:border-solid': !props.disabled,
  'focus:border-1': !props.disabled,
  ...customVariantClasses.value[props.variant],
}))

const notificationClasses = computed(() => ({
  'rounded-full': true, 
  'bg-blue-500': true,
  'absolute': true,
  'top-0': true,
  'right-0': true,
  'w-6 h-6': props.size === 'sm',
  'w-8 h-8': props.size === 'md',
  'w-10 h-10': props.size === 'lg',
  'bg-grey-200': props.disabled,
}))

const iconSizeMap = {
  sm: 'md',
  lg: 'lg'
}

const mappedIconSize = computed(() => iconSizeMap[props.size] as 'sm'|'lg'|undefined)

</script>

<style>
.fz__iconbtn__notification {
    margin-top: -2px;
    margin-right: -2px;
}
</style>