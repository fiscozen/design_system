<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from 'vue'
import { FzIconButton } from '@fiscozen/button'
import { FzNavbarEmits, FzNavbarProps } from './types'
import {breakpoints} from '@fiscozen/style';
import {useBreakpoints} from '@fiscozen/composables';

const props = withDefaults(defineProps<FzNavbarProps>(), {
  variant: 'horizontal'
})

const emit = defineEmits<FzNavbarEmits>()

const {isGreater} = useBreakpoints(breakpoints);
const isGreaterThanLg = isGreater('lg');
const isMobile = computed(() => !isGreaterThanLg.value);
const isVertical = computed(() => Boolean(props.variant === 'vertical'))
const isHorizontal = computed(() => Boolean(props.variant === 'horizontal'))
</script>

<template>
  <header
    class="flex p-12 shadow z-10"
    :class="{
      'justify-between': isMobile,
      'h-full w-56 flex-col': isVertical && !isMobile,
      'h-56 w-full': isHorizontal || isMobile
    }"
  >
    <template v-if="!isMobile">
      <div :class="{ 'mr-32': isHorizontal, 'mb-32': isVertical }">
        <slot name="brand-logo" :isMobile :isHorizontal :isVertical></slot>
      </div>
      <div class="flex gap-4" :class="{ 'flex-row': isHorizontal, 'flex-col': isVertical }">
        <slot name="navigation" :isVertical :isHorizontal :isMobile></slot>
      </div>
      <div
        class="flex gap-16"
        :class="{ 'ml-auto flex-row': isHorizontal, 'mt-auto flex-col': isVertical }"
      >
        <slot name="notifications" :isHorizontal :isVertical :isMobile></slot>
        <slot name="user-menu" :isHorizontal :isMobile :isVertical></slot>
      </div>
    </template>
    <template v-else>
      <FzIconButton
        :iconName="isMenuOpen ? 'xmark' : 'bars'"
        variant="secondary"
        tooltip="menu"
        @click="emit('fznavbar:menuButtonClick')"
      />
      <div>
        <slot name="brand-logo" :isMobile :isHorizontal :isVertical></slot>
      </div>
      <div>
        <slot
          :name="isHorizontal ? 'notifications' : 'user-menu'"
          :isHorizontal
          :isVertical
          :isMobile
        ></slot>
      </div>
    </template>
  </header>
</template>

<style></style>
