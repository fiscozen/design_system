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

const props = withDefaults(
  defineProps<{
    /**
     * Type of the topbar which dictates the appearance
     */
    type: 'info' | 'error' | 'danger' | 'warning' | 'success'
    /**
     * Style which dictates the action rendered
     */
    style?: 'default' | 'collapsable' | 'simple'
    /**
     * Action label
     */
    actionLabel?: string
    /**
     * Action tooltip
     */
    actionTooltip?: string
    /**
     * Size of the alert (applies only if style is simple)
     */
    size?: 'sm' | 'md' | 'lg'
    /**
     * Title of the alert (applies only if style is not simple)
     */
    title?: string
  }>(),
  {
    style: 'default',
    size: 'md'
  }
)

const emit = defineEmits(['actionClick'])
const isOpen = ref(true)

const containerClass = computed(() => [
  'rounded flex gap-12 p-12 border-l-4 select-none',
  {
    info: 'bg-semantic-info-50 border-semantic-info',
    error: 'bg-semantic-error-50 border-semantic-error',
    danger: 'bg-semantic-error-50 border-semantic-error',
    warning: 'bg-semantic-warning-50 border-semantic-warning',
    success: 'bg-semantic-success-50 border-semantic-success'
  }[props.type],
  props.style === 'simple' ? 'w-max' : 'w-[800px]'
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
  emit('actionClick')
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
