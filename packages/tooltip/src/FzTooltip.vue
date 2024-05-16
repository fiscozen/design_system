<template>
  <FzFloating :is-open="isOpen" :position="position" class="flex h-max">
    <template #opener>
      <div @mouseover="isOpen = true" @mouseleave="isOpen = false">
        <slot></slot>
      </div>
    </template>
    <div :class="[staticClasses, classes]">
      <FzIcon v-if="withIcon" size="lg" :name="iconName" class="mr-8 grow-0 shrink-0"></FzIcon>
      <span class="basis-0 grow shrink-0 fz__tooltip__text">{{ text }}</span>
    </div>
  </FzFloating>
</template>

<script lang="ts" setup>
import { FzFloating } from '@fiscozen/composables'
import { FzIcon } from '@fiscozen/icons'
import { FzTooltipProps, FzTooltipStatus } from './types'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<FzTooltipProps>(), {
  position: 'auto',
  status: 'neutral'
})

const iconNameMap: Record<FzTooltipStatus, string> = {
  informative: 'circle-info',
  alert: 'triangle-exclamation',
  error: 'circle-exclamation',
  positive: 'circle-check',
  neutral: ''
}

const iconName = computed(() => iconNameMap[props.status])

const classes = computed(() => {
  switch (props.status) {
    case 'neutral':
      return {
        'bg-grey-500': true
      }
      break
    case 'alert':
      return {
        'bg-semantic-warning': true
      }
      break
    case 'positive':
      return {
        'bg-semantic-success': true
      }
      break
    case 'error':
      return {
        'bg-semantic-error': true
      }
      break
    case 'informative':
      return {
        'bg-semantic-info': true
      }
      break

    default:
      break
  }
})

const isOpen = ref(false)

const staticClasses =
  'text-fzwhite-100 max-w-[200px] p-6 text-xs rounded flex flex-row items-start justify-center'
</script>

<style scoped>
.text-fzwhite-100 {
  color: #fffefd;
}
.fz__tooltip__text {
  overflow-wrap: anywhere;
  word-break: normal;
}
</style>
