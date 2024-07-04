<template>
  <div :class="containerClass" @click="isOpen = !isOpen">
    <FzIcon :name="iconName" :size="iconSize" :class="iconClass" />
    <div class="flex-1">
      <div class="flex">
        <p v-if="showTitle" class="flex-1 text-lg">
          {{ title }}
        </p>

        <FzIcon v-if="showCollapseIcon" :name="collapseIcon" />
      </div>

      <p v-if="showDescription" :class="descriptionClass">
        <slot></slot>
      </p>

      <slot name="action" v-if="showAction">
        <div class="flex gap-16">
          <FzButton
            v-if="showButtonAction"
            @click="handleButtonClick"
            :tooltip="buttonActionTooltip"
            size="sm"
            >{{ buttonActionLabel }}</FzButton
          >
          <FzLink
            v-if="showLinkAction"
            :to="linkActionLocation"
            @click="handleButtonClick"
            size="md"
            >{{ linkActionLabel }}</FzLink
          >
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { AlertProps } from './types'
import { FzLink } from '@fiscozen/link'

const props = withDefaults(defineProps<AlertProps>(), {
  alertStyle: 'default',
  size: 'lg',
  defaultOpen: true,
  showButtonAction: true
})

const emit = defineEmits(['fzaction:click'])
const isOpen = ref(props.defaultOpen)

const mapTypeToContainerClass = {
  info: 'bg-semantic-info-50 border-semantic-info',
  error: 'bg-semantic-error-50 border-semantic-error',
  danger: 'bg-semantic-error-50 border-semantic-error',
  warning: 'bg-semantic-warning-50 border-semantic-warning',
  success: 'bg-semantic-success-50 border-semantic-success'
}

const containerClass = computed(() => [
  'flex select-none',
  ...(props.alertStyle === 'simple'
    ? ['gap-6']
    : [mapTypeToContainerClass[props.type], 'border-l-4 p-12 gap-12 rounded']),
  ...(props.alertStyle === 'collapsable' ? ['cursor-pointer'] : [])
])

const iconName = computed(
  () =>
    ({
      info: 'circle-info',
      error: 'circle-xmark',
      danger: 'triangle-exclamation',
      warning: 'triangle-exclamation',
      success: 'circle-check'
    })[props.type]
)

const iconClass = computed(() => [
  {
    info: 'text-semantic-info',
    error: 'text-semantic-error',
    danger: 'text-semantic-error',
    warning: 'text-semantic-warning',
    success: 'text-semantic-success'
  }[props.type]
])

const iconSize = computed(() => (props.alertStyle === 'simple' ? props.size : 'lg'))
const showTitle = computed(() => props.alertStyle !== 'simple')

const descriptionClass = computed(() => [
  'font-normal',
  ...(props.alertStyle === 'simple'
    ? [
        {
          sm: 'text-xs',
          md: 'text-sm',
          lg: 'text-md'
        }[props.size]
      ]
    : []),
  {
    'mb-16': props.alertStyle !== 'simple' && (props.showButtonAction || props.showLinkAction)
  }
])

const showAction = computed(() => {
  if (props.alertStyle === 'simple') return false
  if (props.alertStyle === 'default') return true
  return isOpen.value
})
const collapseIcon = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
const showDescription = computed(() => {
  if (props.alertStyle !== 'collapsable') return true
  return isOpen.value
})
const showCollapseIcon = computed(() => props.alertStyle === 'collapsable')

function handleButtonClick(event: Event) {
  event.stopPropagation()
  emit('fzaction:click')
}
</script>

<style scoped>
.bg-semantic-info-50 {
  background-color: #f3f7ff;
}

.bg-semantic-error-50 {
  background-color: #fef3f3;
}

.bg-semantic-warning-50 {
  background-color: #fff8f3;
}

.bg-semantic-success-50 {
  background-color: #f2f8f6;
}
</style>
