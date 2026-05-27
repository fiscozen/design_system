<script lang="ts" setup>
import { computed } from 'vue'
import { FzIconButton } from '@fiscozen/button'
import { FzNavbarEmits, FzNavbarProps } from './types'
import { breakpoints } from '@fiscozen/style'
import { useBreakpoints } from '@fiscozen/composables'

const props = withDefaults(defineProps<FzNavbarProps>(), {
  variant: 'horizontal',
  breakpoints: undefined,
  mobileBreakpoint: undefined,
  position: 'static',
  respectSafeArea: false,
  environment: 'frontoffice'
})

const emit = defineEmits<FzNavbarEmits>()

if (props.breakpoints !== undefined) {
  // eslint-disable-next-line no-console
  console.warn(
    '[FzNavbar] The `breakpoints` prop is deprecated and will be removed in a future major. Use `mobileBreakpoint` instead.'
  )
}

const computedBreakpoints = computed(() => {
  if (props.mobileBreakpoint !== undefined) {
    const value =
      typeof props.mobileBreakpoint === 'number'
        ? (`${props.mobileBreakpoint}px` as `${number}px`)
        : props.mobileBreakpoint
    return { ...breakpoints, lg: value }
  }
  return {
    ...breakpoints,
    ...(props.breakpoints ?? {})
  }
})

const { isGreater } = useBreakpoints(computedBreakpoints.value)
const isGreaterThanLg = isGreater('lg')
const isMobile = computed(() => !isGreaterThanLg.value)
const isVertical = computed(() => props.variant === 'vertical')
const isHorizontal = computed(() => props.variant === 'horizontal')

const localMenuOpen = computed<boolean | undefined>({
  get: () => props.isMenuOpen,
  set: (value) => emit('update:isMenuOpen', Boolean(value))
})

function handleMenuButtonClick() {
  localMenuOpen.value = !localMenuOpen.value
  emit('fznavbar:menuButtonClick')
}
</script>

<template>
  <header
    class="fz-navbar z-10 m-0 box-border flex items-center border-0 p-12 shadow"
    :class="{
      'fz-navbar--fixed': position === 'fixed',
      'fz-navbar--sticky': position === 'sticky',
      'fz-navbar--safe-area': respectSafeArea,
      'justify-between': isMobile,
      'h-full w-56 flex-col': isVertical && !isMobile,
      'h-56 w-full': isHorizontal || isMobile
    }"
  >
    <template v-if="!isMobile">
      <div :class="{ 'mr-32': isHorizontal, 'mb-32': isVertical }">
        <slot name="brand-logo" :isMobile :isHorizontal :isVertical></slot>
      </div>
      <div
        class="flex items-center gap-8"
        :class="{ 'flex-row': isHorizontal, 'flex-col': isVertical }"
      >
        <slot name="navigation" :isVertical :isHorizontal :isMobile></slot>
      </div>
      <div
        class="flex items-center gap-16"
        :class="{ 'ml-auto flex-row': isHorizontal, 'mt-auto flex-col': isVertical }"
      >
        <slot name="notifications" :isHorizontal :isVertical :isMobile></slot>
        <slot name="user-menu" :isHorizontal :isMobile :isVertical></slot>
      </div>
    </template>
    <template v-else>
      <slot name="menu-button" :isOpen="Boolean(localMenuOpen)" :toggle="handleMenuButtonClick">
        <FzIconButton
          :iconName="localMenuOpen ? 'xmark' : 'bars'"
          variant="secondary"
          :environment="environment"
          tooltip="menu"
          @click="handleMenuButtonClick"
        />
      </slot>
      <div>
        <slot name="brand-logo" :isMobile :isHorizontal :isVertical></slot>
      </div>
      <div class="flex items-center gap-16">
        <slot name="notifications" :isHorizontal :isVertical :isMobile></slot>
        <slot name="user-menu" :isHorizontal :isMobile :isVertical></slot>
      </div>
    </template>
  </header>
</template>

<style>
/*
 * CSS custom properties — defaults are pinned to the `@fiscozen/style` pixel
 * spacing tokens that match the Tailwind utility classes used in the template
 * (p-12 = 12px, h-56/w-56 = 56px, mr-32/mb-32 = 32px, gap-16 = 16px). The
 * package's CSS rule `.fz-navbar.{w-56,h-56,...}` has higher specificity than
 * the consumer's generated Tailwind class on its own, so the fallback values
 * must match the design-system pixel scale — otherwise stock-Tailwind rem
 * defaults (14rem/3rem/8rem/4rem) leak through and the navbar renders ~4×
 * larger than intended.
 *
 * Consumers can still override per-instance via inline style or scoped CSS.
 */

.fz-navbar {
  z-index: var(--fz-navbar-z-index, 10);
  padding: var(--fz-navbar-padding, 12px);
  box-shadow: var(
    --fz-navbar-shadow,
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1)
  );
  background: var(--fz-navbar-bg, transparent);
}

.fz-navbar.h-56 {
  height: var(--fz-navbar-height, 56px);
}

.fz-navbar.w-56 {
  width: var(--fz-navbar-width, 56px);
}

.fz-navbar > .mr-32 {
  margin-right: var(--fz-navbar-brand-gap, 32px);
}

.fz-navbar > .mb-32 {
  margin-bottom: var(--fz-navbar-brand-gap, 32px);
}

.fz-navbar > .gap-16 {
  gap: var(--fz-navbar-actions-gap, 16px);
}

.fz-navbar--fixed {
  position: fixed;
  top: 0;
  left: 0;
}

.fz-navbar--sticky {
  position: sticky;
  top: 0;
}

.fz-navbar--safe-area {
  padding-top: calc(
    var(--fz-navbar-padding, 12px) +
      max(env(safe-area-inset-top, 0px), var(--safe-area-inset-top, 0px))
  );
  padding-left: calc(
    var(--fz-navbar-padding, 12px) +
      max(env(safe-area-inset-left, 0px), var(--safe-area-inset-left, 0px))
  );
  padding-right: calc(
    var(--fz-navbar-padding, 12px) +
      max(env(safe-area-inset-right, 0px), var(--safe-area-inset-right, 0px))
  );
}
</style>
