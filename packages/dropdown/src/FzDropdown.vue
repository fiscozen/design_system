<template>
  <FzFloating
    :isOpen
    :position="floatingPosition"
    ref="container"
    overrideContentClass
    contentClass="fixed pt-4 z-10"
  >
    <template #opener>
      <slot name="opener" :isOpen="isOpen">
        <FzButton
          icon-position="after"
          :icon-name="buttonIconName"
          @click="isOpen = !isOpen"
          :size
          :disabled="openerDisabled"
          :class="openerClass"
        >
          <slot :isOpen="isOpen"></slot>
        </FzButton>
      </slot>
    </template>
    <FzActionlist :items="actions" :label="actionsLabel" @fzaction:click="handleActionClick" />
  </FzFloating>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, computed, ref } from 'vue'
import { FzButton } from '@fiscozen/button'
import { FzActionlist, ActionlistItem } from '@fiscozen/actionlist'
import { FzFloating, useClickOutside } from '@fiscozen/composables'
import { FzDropdownProps, FzDropdownSlots } from './types'

const props = withDefaults(defineProps<FzDropdownProps>(), {
  size: 'md',
  closeOnActionClick: true
})

const emit = defineEmits<{
  'fzaction:click': [index: number, action: ActionlistItem]
}>()

const slots = defineSlots<FzDropdownSlots>()

const isOpen = ref(false)
const container = ref<ComponentPublicInstance>()
const containerDom = computed(() => container.value?.$el)
const buttonIconName = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
const floatingPosition = computed(() => (props.align === 'left' ? 'bottom-start' : 'bottom-end'))

useClickOutside(containerDom, () => {
  isOpen.value = false
})

function handleActionClick(index: number, action: ActionlistItem) {
  emit('fzaction:click', index, action)
  if (props.closeOnActionClick) {
    isOpen.value = false
  }
}
</script>
