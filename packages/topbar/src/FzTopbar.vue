<template>
  <div :class="containerClass">
    <span class="text-xs lg:text-sm">
      <slot></slot>
    </span>

    <slot name="action">
      <FzButton
        v-if="['button', 'hybrid'].includes(props.style)"
        :class="buttonClass"
        size="sm"
        :variant="buttonVariant"
        :tooltip="actionTooltip"
        @click="emit('actionClick')"
        >{{ actionLabel }}</FzButton
      >
      <FzIconButton
        v-if="['icon-button', 'hybrid'].includes(props.style)"
        :class="iconButtonClass"
        size="sm"
        :icon-name="actionIcon!"
        :variant="iconButtonVariant"
        :tooltip="actionTooltip"
        @click="emit('actionClick')"
      />
      <FzLink v-if="style === 'link'" :to="actionLink" size="sm" :type="linkType">{{
        props.actionLabel
      }}</FzLink>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzLink } from '@fiscozen/link'

const props = withDefaults(
  defineProps<{
    /**
     * Type of the topbar which dictates the appearance
     */
    type?: 'default' | 'danger'
    /**
     * Style which dictates the action rendered
     */
    style?: 'none' | 'button' | 'icon-button' | 'hybrid' | 'link'
    /**
     * Action label
     */
    actionLabel?: string
    /**
     * Action tooltip
     */
    actionTooltip?: string
    /**
     * Action link
     */
    actionLink?: string
    /**
     * Action link
     */
    actionIcon?: string
  }>(),
  {
    type: 'default',
    style: 'none'
  }
)

const emit = defineEmits(['actionClick'])

const containerClass = computed(() => [
  'flex px-24 py-12 gap-16 items-center justify-center',
  {
    'bg-white-smoke': props.type === 'default',
    'bg-danger': props.type === 'danger'
  }
])

const buttonVariant = computed(
  () =>
    (
      ({
        default: 'primary',
        danger: 'danger'
      }) as const
    )[props.type]
)

const buttonClass = computed(() => ({
  'hidden md:block': props.style === 'hybrid'
}))

const iconButtonVariant = computed(() => {
  switch (props.style) {
    case 'hybrid':
      return 'primary'
    default:
      return 'invisible'
  }
})

const iconButtonClass = computed(() => ({
  'md:hidden': props.style === 'hybrid'
}))

const linkType = computed(
  () =>
    (
      ({
        default: 'default',
        danger: 'danger'
      }) as const
    )[props.type]
)
</script>

<style scoped>
.bg-white-smoke {
  background-color: #f7f6f3;
}

.bg-danger {
  background-color: #fef3f3;
}
</style>
