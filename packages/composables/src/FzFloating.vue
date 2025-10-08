<script lang="ts" setup>
import { ref, useSlots, watch, toRef, computed, onBeforeUnmount, toRefs, defineExpose } from 'vue'
import { useFloating } from './composables'
import { FzFloatingProps, FzUseFloatingArgs } from './types'
import { useMediaQuery } from './composables'
import { breakpoints } from '@fiscozen/style'

const props = withDefaults(defineProps<FzFloatingProps>(), {
  position: 'auto',
  isOpen: false,
  teleport: false
})

const emits = defineEmits(['fzfloating:setPosition'])

const content = ref<HTMLElement | null>(null)
const opener = ref<HTMLElement | null>(null)

const slots = useSlots()

const xs = useMediaQuery(`(max-width: ${breakpoints.xs})`)

let scheduledAnimationFrame = false

const useFloatingOpts: FzUseFloatingArgs = {
  position: props.position,
  element: {
    // @ts-ignore
    domRef: content
  },
  container: {
    // @ts-ignore
    domRef: toRef(props.container || document.body)
  },
  opener: {
    domRef: toRef(null)
  },
  useViewport: props.useViewport,
  callback(...args) {
    emits('fzfloating:setPosition', ...args)
  }
}

const dynamicOpts = toRefs(useFloatingOpts)
if (slots.opener) {
  useFloatingOpts.opener = {
    // @ts-ignore
    domRef: opener
  }
}

const floating = useFloating(dynamicOpts)

const setPositionWhenOpen = () => {
  if (scheduledAnimationFrame) {
    return
  }

  scheduledAnimationFrame = true
  requestAnimationFrame(() => {
    props.isOpen && floating.setPosition()
    scheduledAnimationFrame = false
  })
}

watch(
  () => props.position,
  () => setPositionWhenOpen()
)
watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal || !content.value) {
      window.removeEventListener('scroll', setPositionWhenOpen)
      return
    }
    window.addEventListener('scroll', setPositionWhenOpen)
    const openerRect = opener.value?.getBoundingClientRect()
    content.value.style.top = '0px'
    content.value.style.left = '0px'
    content.value.style.transform = 'none'
    content.value.style.width = xs.value ? openerRect?.width + 'px' : 'auto'
    floating.setPosition()
  }
)
watch(
  () => props.overrideOpener,
  (newVal) => {
    if (!newVal) {
      return
    }
    if (dynamicOpts.opener && dynamicOpts.opener.value) {
      dynamicOpts.opener.value = {
        domRef: newVal
      }
    }
  }
)
onBeforeUnmount(() => {
  window.removeEventListener('scroll', setPositionWhenOpen)
})

const contentClass = computed(() => {
  if (props.overrideContentClass) {
    return props.contentClass
  }

  return ['bg-core-white fixed p-4', props.contentClass]
})

defineExpose({
  setPosition: floating.setPosition
})
</script>

<template>
  <div>
    <slot name="opener-start"></slot>
    <div ref="opener" class="inline-flex w-full sm:w-auto">
      <slot name="opener" :isOpen :floating></slot>
    </div>
    <slot name="opener-end"></slot>
    <div
      v-if="!teleport"
      ref="content"
      v-show="$slots.default && (!$slots.opener || ($slots.opener && isOpen))"
      class="fz__floating__content w-full sm:w-auto"
      :class="contentClass"
    >
      <slot :isOpen :floating></slot>
    </div>
    <Teleport to="body" v-if="teleport">
      <div
        ref="content"
        v-show="$slots.default && (!$slots.opener || ($slots.opener && isOpen))"
        class="fz__floating__content"
        :class="contentClass"
      >
        <slot :isOpen :floating></slot>
      </div>
    </Teleport>
  </div>
</template>

<style></style>
