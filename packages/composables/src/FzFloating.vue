<script lang="ts" setup>
import { ref, useSlots, watch, toRef, computed } from 'vue'
import { useFloating } from './composables'
import { FzFloatingPosition, FzFloatingProps, FzUseFloatingArgs } from './types'

const props = withDefaults(defineProps<FzFloatingProps>(), {
  position: 'auto',
  isOpen: false
})

const opener = ref(null)
const content = ref(null)

const slots = useSlots()

const useFloatingOpts: FzUseFloatingArgs = {
  position: computed(() => props.position),
  element: {
    domRef: content
  },
  container: {
    domRef: toRef(props.container || document.body)
  }
}
if (slots.opener) {
  useFloatingOpts.opener = {
    domRef: opener
  }
}

const floating = useFloating(useFloatingOpts)

watch(
  () => props.position,
  () => props.isOpen && floating.setPosition()
)
watch(
  () => props.isOpen,
  (newVal) => newVal && floating.setPosition()
)
</script>

<template>
  <div>
    <div ref="opener" class="inline-flex">
      <slot name="opener" :isOpen :floating></slot>
    </div>
    <div
      ref="content"
      v-show="!$slots.opener || ($slots.opener && isOpen)"
      class="bg-core-white absolute p-4"
    >
      <slot :isOpen :floating></slot>
    </div>
  </div>
</template>

<style></style>
