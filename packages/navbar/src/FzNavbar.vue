<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from 'vue'
import { FzIconButton } from '@fiscozen/icon-button'
import { FzNavbarProps } from './types'

const props = withDefaults(defineProps<FzNavbarProps>(), {
  variant: 'horizontal'
})

const width = ref(0)

const onResize = () => {
  width.value = window.innerWidth
}
onBeforeMount(() => {
  onResize()
})

onMounted(() => {
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const isMobile = computed(() => Boolean(width.value <= 1024))
const isVertical = computed(() => Boolean(props.variant === 'vertical'))
const isHorizontal = computed(() => Boolean(props.variant === 'horizontal'))
</script>

<template>
  <header
    class="flex px-12 py-12 shadow"
    :class="{
      'justify-between': isMobile,
      'h-full w-56 flex-col': isVertical && !isMobile,
      'h-56 w-full': isHorizontal || isMobile
    }"
  >
    <template v-if="!isMobile">
      <div :class="{ 'mr-32': isHorizontal, 'mb-32': isVertical }">
        <slot name="brand-logo" :isMobile></slot>
      </div>
      <div class="flex gap-4" :class="{ 'flex-row': isHorizontal, 'flex-col': isVertical }">
        <slot name="navigation"></slot>
      </div>
      <div
        class="flex gap-16"
        :class="{ 'ml-auto flex-row': isHorizontal, 'mt-auto flex-col': isVertical }"
      >
        <slot name="notifications"></slot>
        <slot name="user-menu"></slot>
      </div>
    </template>
    <template v-else>
      <FzIconButton iconName="bars" variant="secondary" tooltip="menu" :disabled="false" />
      <div>
        <slot name="brand-logo" :isMobile></slot>
      </div>
      <div>
        <slot :name="variant === 'horizontal' ? 'notifications' : 'user-menu'"></slot>
      </div>
    </template>
  </header>
</template>

<style></style>
