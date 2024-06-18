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

      <FzButton @click="handleButtonClick" v-if="showButton" :tooltip="actionTooltip" size="sm">{{
        actionLabel
      }}</FzButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { AlertProps } from './types'

const props = withDefaults(defineProps<AlertProps>(), {
  style: 'default',
  size: 'lg'
})

const emit = defineEmits(['fzaction:click'])
const isOpen = ref(true)

const mapTypeToContainerClass = {
  info: 'bg-semantic-info-50 border-semantic-info',
  error: 'bg-semantic-error-50 border-semantic-error',
  danger: 'bg-semantic-error-50 border-semantic-error',
  warning: 'bg-semantic-warning-50 border-semantic-warning',
  success: 'bg-semantic-success-50 border-semantic-success'
}

const containerClass = computed(() => [
  'flex select-none',
  ...props.style === 'simple' ? [
    'gap-6'
  ] : [
    mapTypeToContainerClass[props.type],
    'border-l-4 p-12 gap-12 rounded'
  ],
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

const iconSize = computed(() => (props.style === 'simple' ? props.size : 'lg'))
const showTitle = computed(() => props.style !== 'simple')

const descriptionClass = computed(() => [
  'font-normal',
  ...(props.style === 'simple'
    ? [
        {
          sm: 'text-xs',
          md: 'text-sm',
          lg: 'text-md'
        }[props.size]
      ]
    : []),
  {
    'mb-16': props.style !== 'simple'
  }
])

const showButton = computed(() => {
  if (props.style === 'simple') return false
  if (props.style === 'default') return true
  return isOpen.value
})
const collapseIcon = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
const showDescription = computed(() => {
  if (props.style !== 'collapsable') return true
  return isOpen.value
})
const showCollapseIcon = computed(() => props.style === 'collapsable')

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
