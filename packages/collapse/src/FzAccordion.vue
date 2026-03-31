<script lang="ts" setup>
import { reactive, provide } from 'vue'
import { FzContainer } from '@fiscozen/container'
import { FzAccordionProps, ACCORDION_KEY, type AccordionContext } from './types'

const props = withDefaults(defineProps<FzAccordionProps>(), {
  multiple: false,
})

const children = reactive(new Map<string, () => void>())

const register = (id: string, close: () => void) => {
  children.set(id, close)
}

const unregister = (id: string) => {
  children.delete(id)
}

const notifyOpen = (id: string) => {
  if (props.multiple) return

  for (const [childId, close] of children.entries()) {
    if (childId !== id) {
      close()
    }
  }
}

provide<AccordionContext>(ACCORDION_KEY, {
  register,
  unregister,
  notifyOpen,
})
</script>

<template>
  <FzContainer gap="sm" data-e2e="accordion" role="group" v-bind="ariaLabel ? { 'aria-label': ariaLabel } : {}">
    <slot />
  </FzContainer>
</template>
