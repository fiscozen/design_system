<template>
  <FzButton @click="(e) => $emit('click', e)" :class="classes" :disabled="disabled" :size="size" :tooltip="tooltip"
    :variant="variantMap" overrideContainerClass>
    <FzIcon :name="iconName" :size="iconSize || mappedIconSize" :variant="iconVariant" :class="props.iconClass" />
    <div class="-mr-2 -mt-2" v-if="variant === 'notification'" :class="notificationClasses"></div>
  </FzButton>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { IconButtonVariant, ButtonSize } from './types'
  import { FzIcon, IconSize, IconVariant } from '@fiscozen/icons'
  import FzButton from './FzButton.vue'
  import { iconSizeMap } from './utils'

  const props = withDefaults(
    defineProps<{
      /**
       * The tooltip of the button will be shown on hover
       */
      tooltip?: string
      /**
       * primary or secondary button
       */
      variant?: IconButtonVariant
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
      iconName: string
      /**
       * Fontawesome icon variant: solid, regular, light, thin. Sharp subvariants are available as well
       */
      iconVariant?: IconVariant
      /**
       * Icon size
       */
      iconSize?: IconSize
      /**
       * Positioning of the icon
       */
      iconPosition?: 'before' | 'after',
      /**
       * Additional class for the icon
       */
      iconClass?: string
    }>(),
    {
      variant: 'primary',
      size: 'md',
      disabled: false,
      iconVariant: 'far',
      iconPosition: 'before',
      iconClass: ''
    }
  )

  defineEmits(['click'])

  const variantMap = computed(() => {
    return props.variant === 'notification' ? 'secondary' : props.variant
  })

  const classes = computed(() => ({
    'size-24': props.size === 'xs',
    'w-28 h-28': props.size === 'sm',
    'w-32 h-32': props.size === 'md',
    'w-40 h-40': props.size === 'lg'
  }))

  const notificationClasses = computed(() => ({
    'rounded-full': true,
    'bg-blue-500': true,
    absolute: true,
    'top-0': true,
    'right-0': true,
    'size-4': props.size === 'xs',
    'w-6 h-6': props.size === 'sm',
    'w-8 h-8': props.size === 'md' || props.size === 'lg',
    'bg-grey-200': props.disabled
  }))

  const mappedIconSize = computed(() => iconSizeMap[props.size])
</script>
