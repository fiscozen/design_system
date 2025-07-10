<template>
  <FzFloating :teleport="true" :is-open="isOpen" :position="position" class="fz__tooltip flex h-max"
    :contentClass="['rounded', '!p-0', 'm-4', classes, 'z-80']">
    <template #opener>
      <div @mouseover="isOpen = text || $slots.text ? true : false" @mouseleave="isOpen = false">
        <slot></slot>
      </div>
    </template>
    <div :class="staticClasses">
      <FzIcon v-if="showIcon" size="sm" :name="iconName"
        :class="['mr-8 grow-0 shrink-0', { 'text-core-black': props.status === 'alert' }]"></FzIcon>
      <span :class="['basis-0 grow shrink-0 fz__tooltip__text', { 'text-core-black': props.status === 'alert' }]">
        <slot name="text">
          {{ text }}
        </slot>
      </span>
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
          '!bg-core-black': true
        }
      case 'alert':
        return {
          'bg-semantic-warning': true
        }
      case 'positive':
        return {
          'bg-semantic-success': true
        }
      case 'error':
        return {
          'bg-semantic-error': true
        }
      case 'informative':
        return {
          'bg-semantic-info': true
        }
      default:
        return {}
    }
  })

  const isOpen = ref(false)

  const showIcon = computed(() => props.withIcon && props.status !== 'neutral');

  const staticClasses =
    'text-fzwhite-100 max-w-[200px] p-6 text-xs flex flex-row items-start justify-center'
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
