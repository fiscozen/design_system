<script lang="ts" setup>
import { ref, useSlots, watch, toRef, computed, onBeforeUnmount, onMounted, toRefs } from 'vue'
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
let isMounted = false

// Observers for reactive repositioning
let resizeObserver: ResizeObserver | null = null
let openerResizeObserver: ResizeObserver | null = null

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
  if (scheduledAnimationFrame || !isMounted) {
    return
  }

  scheduledAnimationFrame = true
  requestAnimationFrame(() => {
    if (isMounted && props.isOpen) {
      floating.setPosition()
    }
    scheduledAnimationFrame = false
  })
}

onMounted(() => {
  isMounted = true
})

// Scroll handler that catches scroll events on any scrollable parent
const handleScroll = () => {
  setPositionWhenOpen()
}

// Window resize handler
const handleResize = () => {
  setPositionWhenOpen()
}

// Setup all event listeners and observers
const setupEventListeners = () => {
  // Window scroll and resize
  window.addEventListener('scroll', handleScroll, true) // capture phase for nested scrollables
  window.addEventListener('resize', handleResize)

  // ResizeObserver for floating content (handles content size changes)
  if (content.value && !resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      setPositionWhenOpen()
    })
    resizeObserver.observe(content.value)
  }

  // ResizeObserver for opener (handles opener size/position changes)
  if (opener.value && !openerResizeObserver) {
    openerResizeObserver = new ResizeObserver(() => {
      setPositionWhenOpen()
    })
    openerResizeObserver.observe(opener.value)
  }
}

// Cleanup all event listeners and observers
const cleanupEventListeners = () => {
  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (openerResizeObserver) {
    openerResizeObserver.disconnect()
    openerResizeObserver = null
  }
}

watch(
  () => props.position,
  () => setPositionWhenOpen()
)
watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal || !content.value || !isMounted) {
      cleanupEventListeners()
      return
    }
    
    setupEventListeners()
    
    const openerRect = opener.value?.getBoundingClientRect()
    // CRITICAL: Set position fixed immediately to prevent layout shift
    content.value.style.position = 'fixed'
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
  isMounted = false
  cleanupEventListeners()
})

// Reactive ref to track the margin class based on actual resolved position
// This is updated after setPosition() completes to ensure correct margin direction
const resolvedMarginClass = ref('mt-4')

// Helper function to get margin class from position
const getMarginClassForPosition = (position: string): string => {
  if (position.startsWith('bottom')) return 'mt-4' // margin-top only
  if (position.startsWith('top')) return 'mb-4'    // margin-bottom only
  if (position.startsWith('left')) return 'mr-4'   // margin-right only
  if (position.startsWith('right')) return 'ml-4'  // margin-left only
  return 'mt-4' // default fallback
}

// Watch actualPosition to update margin class when auto-positioning resolves
watch(
  () => floating.actualPosition?.value,
  (newPosition) => {
    if (newPosition) {
      resolvedMarginClass.value = getMarginClassForPosition(newPosition)
    }
  },
  { immediate: true }
)

// Also update margin class when props.position changes (for non-auto positions)
watch(
  () => props.position,
  (newPosition) => {
    if (!newPosition.startsWith('auto')) {
      resolvedMarginClass.value = getMarginClassForPosition(newPosition)
    }
  },
  { immediate: true }
)

const contentClass = computed(() => {
  if (props.overrideContentClass) {
    return props.contentClass
  }

  return ['bg-core-white fixed', resolvedMarginClass.value, props.contentClass]
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
