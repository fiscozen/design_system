<template>
  <FzFloating :isOpen position="auto">
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
    <FzActionlist :items="actions" :label="actionsLabel" />
  </FzFloating>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FzButton, ButtonSize } from '@fiscozen/button'
import { FzActionlist, FzActionlistProps } from '@fiscozen/actionlist'
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
  }>(),
  {
    size: 'md'
  }
)

const isOpen = ref(false)
const buttonIconName = computed(() => (isOpen.value ? 'angle-up' : 'angle-down'))
</script>
