<script lang="ts" setup>
import { ref, useSlots, watch, toRef, computed } from 'vue'
import { useFloating } from './composables'
import { FzFloatingProps, FzUseFloatingArgs } from './types'

const props = withDefaults(defineProps<FzFloatingProps>(), {
  position: 'auto',
  isOpen: false
})

const opener = ref(null)
const content = ref<HTMLElement|null>(null)

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
  (newVal) => {
    if (!newVal || !content.value) {
      return;
    }
    content.value.style.top = '0px';
    content.value.style.left = '0px';
    content.value.style.transform = 'none';
    floating.setPosition()
  }
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
      :class="contentClass"
    >
      <slot :isOpen :floating></slot>
    </div>
  </div>
</template>

<style></style>
