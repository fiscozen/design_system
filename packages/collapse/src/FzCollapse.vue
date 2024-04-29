<script lang="ts" setup>
import { FzCollapseProps } from './types'
import { FzIcon } from '@fiscozen/icons'

defineProps<FzCollapseProps>()
const isOpen = defineModel<boolean>('open')

const handleSummaryClick = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <details :open="isOpen" data-e2e="details" @toggle="handleSummaryClick">
    <summary
      data-e2e="summary"
      class="text-grey-500 flex h-32 cursor-pointer select-none list-none items-center text-sm rounded font-medium"
      :class="[summaryClass, {'bg-background-alice-blue !text-blue-500': isOpen}]"
    >
      <slot name="summary">{{ summary }}</slot>
      <slot name="icon">
        <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" class="ml-32" size="md"></FzIcon>
      </slot>
    </summary>
    <Transition>
      <div data-e2e="content" v-show="isOpen" class="text-sm">
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
