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

const classMap: Record<FzFloatingPosition, string> = {
  left: 'pr-4',
  'left-start': 'pr-4',
  'left-end': 'pr-4',
  right: 'pl-4',
  'right-start': 'pl-4',
  'right-end': 'pl-4',
  top: 'pb-4',
  'top-start': 'pb-4',
  'top-end': 'pb-4',
  bottom: 'pt-4',
  'bottom-start': 'pt-4',
  'bottom-end': 'pt-4',
  auto: '',
  "auto-end": '',
  'auto-start': ''
}
const classes = computed(() => classMap[props.position])
</script>

<template>
  <div>
    <div ref="opener" class="inline-flex">
      <slot name="opener" :isOpen :floating></slot>
    </div>
    <div
      ref="content"
      v-show="!$slots.opener || ($slots.opener && isOpen)"
      class="bg-core-white"
      :class="classes"
    >
      <slot :isOpen :floating></slot>
    </div>
  </div>
</template>

<style></style>
