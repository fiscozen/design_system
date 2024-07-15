<template>
  <FzFloating :isOpen :position="floatingPosition" ref="container">
    <template #opener>
      <FzButton
        icon-position="after"
        :icon-name="buttonIconName"
        :size="props.size"
        @click="isOpen = !isOpen"
      >
        <slot></slot>
      </FzButton>
    </template>
    <FzActionlist :items="actions" :label="actionsLabel" @fzaction:click="handleActionClick" />
  </FzFloating>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, computed, onMounted, onUnmounted, ref } from 'vue'
import { FzButton, ButtonSize } from '@fiscozen/button'
import { FzActionlist, FzActionlistProps, ActionlistItem } from '@fiscozen/actionlist'
import { FzFloating } from '@fiscozen/composables'

const props = withDefaults(
  defineProps<{
    /**
     * Size of the dropdown trigger
     */
    size: ButtonSize
    /**
     * Label of the action list
     */
    actionsLabel?: string
    /**
     * List of actions
     */
    actions: FzActionlistProps['items']
    /**
     * Whether to align to the left or right
     */
    align: 'left' | 'right'
    /**
     * Whether to close the action list when an action is clicked
     */
    closeOnActionClick?: boolean
  }>(),
  {
    size: 'md',
    closeOnActionClick: true
  }
)

const emit = defineEmits<{
  'fzaction:click': [index: number, action: ActionlistItem]
}>()

const isOpen = ref(false)
const container = ref<ComponentPublicInstance>()
const buttonIconName = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
const floatingPosition = computed(() => (props.align === 'left' ? 'bottom-start' : 'bottom-end'))

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (!container.value) return

  const isClickOutside =
    container.value.$el !== event.target && !container.value.$el.contains(event.target)
  if (isClickOutside) {
    isOpen.value = false
  }
}

function handleActionClick(index: number, action: ActionlistItem) {
  emit('fzaction:click', index, action)
  if (props.closeOnActionClick) {
    isOpen.value = false
  }
}
</script>
