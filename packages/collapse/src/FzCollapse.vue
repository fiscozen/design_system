<script lang="ts" setup>
import { FzCollapseProps } from './types'
import { FzIcon } from '@fiscozen/icons'

defineProps<FzCollapseProps>()
const open = defineModel<boolean>('open')

const handleSummaryClick = () => {
  open.value = !open.value
}
</script>

<template>
  <details :open>
    <summary
      @click.prevent="handleSummaryClick"
      data-e2e-summary
      :class="summaryClass"
      class="text-grey-500 flex h-32 cursor-pointer list-none items-center text-sm"
    >
      <slot name="summary">{{ summary }}</slot>
      <slot name="icon">
        <fz-icon :name="open ? 'chevron-up' : 'chevron-down'" class="ml-32" :size="'md'"></fz-icon>
      </slot>
    </summary>
    <Transition>
      <div data-e2e-content v-show="open" class="text-sm">
        <slot name="content">{{ content }}</slot>
      </div>
    </Transition>
  </details>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
