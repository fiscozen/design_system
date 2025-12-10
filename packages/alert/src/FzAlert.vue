<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'
import { AlertProps, AlertVariant } from './types'
import { FzLink } from '@fiscozen/link'
import type { ButtonEnvironment } from '@fiscozen/button'
import { FzContainer } from '@fiscozen/container'

const props = withDefaults(defineProps<AlertProps>(), {
  alertStyle: 'default',
  size: 'lg',
  defaultOpen: true,
  showButtonAction: true,
  environment: 'frontoffice'
})

const emit = defineEmits(['fzAlert:click', 'fzAlert:dismiss'])
const isOpen = ref(props.defaultOpen)

const mapToneToContainerClass = {
  info: 'bg-semantic-info-50 border-semantic-info',
  error: 'bg-semantic-error-50 border-semantic-error',
  danger: 'bg-semantic-error-50 border-semantic-error',
  warning: 'bg-semantic-warning-50 border-semantic-warning',
  success: 'bg-semantic-success-50 border-semantic-success'
}

const sizeToEnvironmentMapping = {
  sm: 'backoffice',
  md: 'frontoffice',
  lg: 'frontoffice'
}

const containerClass = computed(() => [
  'flex select-none gap-12 rounded justify-between',
  mapToneToContainerClass[props.tone],
  safeEnvironment.value === 'backoffice' ? 'p-6' : '',
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
    })[props.tone]
)

const iconClass = computed(() => [
  {
    info: 'text-semantic-info',
    error: 'text-semantic-error',
    danger: 'text-semantic-error',
    warning: 'text-semantic-warning',
    success: 'text-semantic-success'
  }[props.tone]
])


const descriptionClass = computed(() => [
  'font-normal',
  '!leading-[20px]',
  {
    'mt-8': props.title,
    'mb-16': (props.showButtonAction || props.showLinkAction)
  }
])

const showAction = computed(() => {
  if (safeVariant.value === 'background') return true
  return isOpen.value
})
const collapseIcon = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
const rightIconName = computed(() => {
  if (safeVariant.value === 'accordion') return collapseIcon.value
  if (props.isDismissible) return 'xmark'
})
const showDescription = computed(() => {
  if (props.alertStyle !== 'collapsable') return true
  return isOpen.value
})
const showCollapseIcon = computed(() => safeVariant.value === 'accordion')

function handleButtonClick(event: Event) {
  event.stopPropagation()
  emit('fzAlert:click')
}

const safeEnvironment = computed<ButtonEnvironment>(() => {
  if (props.environment) {
    return props.environment
  }
  return props.size ? sizeToEnvironmentMapping[props.size] as ButtonEnvironment : 'frontoffice'
})

const safeVariant = computed<AlertVariant>(() => {
  if (props.variant) {
    return props.variant
  }
  return ['default', 'simple'].includes(props.alertStyle) ? 'background' : 'accordion'
})

const hasRightIcon = computed(() => safeVariant.value === 'accordion' || props.isDismissible)
const handleRightIconClick = () => {
  if (safeVariant.value === 'accordion') {
    isOpen.value = !isOpen.value
  }
  if (props.isDismissible) {
    emit('fzAlert:dismiss')
  }
}
</script>

<template>
  <div :class="containerClass" @click="isOpen = !isOpen">
    <FzContainer horizontal gap="sm" :class="['flex-1', props.environment === 'backoffice' ? 'p-6' : 'p-12']" alignItems="start">
      <FzIcon :name="iconName" size="md" :class="iconClass" />
      <div class="flex flex-col flex-1">
        <p v-if="title" v-bold class="leading-[20px]">
          {{ title }}
        </p>

        <p v-if="showDescription" :class="descriptionClass">
          <slot></slot>
        </p>

        <slot name="action" v-if="showAction">
          <FzContainer horizontal gap="sm">
            <FzButton
              v-if="showButtonAction"
              @click="handleButtonClick"
              :tooltip="buttonActionTooltip"
              :environment="safeEnvironment"
              variant="secondary"
              >{{ buttonActionLabel }}</FzButton
            >
            <FzLink
              v-if="showLinkAction"
              :to="linkActionLocation!"
              @click="handleButtonClick"
              size="md"
              :target="linkActionTarget"
              :external="linkActionExternal"
              >{{ linkActionLabel }}</FzLink
            >
          </FzContainer>
        </slot>
      </div>
    </FzContainer>
    <FzIconButton v-if="hasRightIcon"
      :iconName="rightIconName!"
      :environment="safeEnvironment"
      variant="invisible"
      @click.stop="handleRightIconClick" />
  </div>
</template>


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
