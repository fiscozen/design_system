<script lang="ts" setup>
import { ref } from 'vue'
import { FzCollapseProps } from './types'
import { FzIcon } from '@fiscozen/icons'

defineProps<FzCollapseProps>()
const isOpen = defineModel<boolean>('open', { default: false })
const detailsRef = ref<HTMLDetailsElement | null>(null)

const handleToggle = (e) => {
  if (e.newState === "open" && isOpen.value === false) {
    isOpen.value = true
  } else if (e.newState === "closed" && isOpen.value === true) {
    isOpen.value = false
  }
}

const handleClick = () => {
  if (detailsRef.value?.open) {
    isOpen.value = false
  } else {
    isOpen.value = true
  }
}
</script>

<template>
  <details ref="detailsRef" :open="isOpen" data-e2e="details" @toggle="handleToggle" @click.stop.prevent="handleClick">
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
    <div data-e2e="content" v-show="isOpen" :class="['text-sm', contentClass]">
      <slot name="content">{{ content }}</slot>
    </div>
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

/* Removes the default arrow icon for Webkit based browsers */
details > summary::-webkit-details-marker {
  display: none;
}
</style>
