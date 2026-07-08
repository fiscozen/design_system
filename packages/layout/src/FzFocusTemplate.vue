<script setup lang="ts">
/**
 * FzFocusTemplate — distraction-reduced flow template.
 *
 * A centered, low-chrome page shell for guided flows (onboarding) and auth
 * screens. An optional `topbar`, `aside` and `footer` frame a centered main
 * region; the `chrome` prop makes the content frame explicit — `card` for a
 * contained flow, `flat` for full-bleed (today's implicit "auth" branch, RFC §4).
 *
 * Composes the region molecules (`FzLayoutHeader`/`FzLayoutMain`/`FzLayoutAside`/
 * `FzLayoutFooter`). Owns a full-height root (`min-h-dvh`, not a fixed `h`) so it
 * establishes its own height context and does not depend on app-global
 * `#app { height: 100% }` / `overflow-y: auto` CSS (RFC §2 principle 6, §6.2).
 * Safe-area insets are applied once at the root, keeping the whole shell clear of
 * device notches/home indicators.
 *
 * Optional regions render only when their slot is provided. On narrow viewports
 * the `aside` stacks below the content; from `lg` up it sits beside it.
 *
 * Unlike `FzBlankTemplate` (whose single root IS the `<main>` region), this
 * template's root is a non-landmark container `<div>`, so consumer-supplied
 * fall-through attributes (`aria-label`, `id`, `data-*`, …) land on that root
 * container — not on the inner `<main>`. Label the flow content itself if a
 * `main` accessible name is required.
 */
import { computed } from 'vue'
import FzLayoutHeader from './FzLayoutHeader.vue'
import FzLayoutMain from './FzLayoutMain.vue'
import FzLayoutAside from './FzLayoutAside.vue'
import FzLayoutFooter from './FzLayoutFooter.vue'
import type { FzFocusTemplateProps, FzFocusTemplateSlots } from './types'

const props = withDefaults(defineProps<FzFocusTemplateProps>(), {
  chrome: 'card'
})

const slots = defineSlots<FzFocusTemplateSlots>()

const contentClass = computed(() => [
  `fz-focus-template__content--${props.chrome}`,
  props.chrome === 'card' ? 'w-full max-w-[640px] bg-core-white rounded-lg shadow p-24' : 'w-full'
])
</script>

<template>
  <div class="fz-focus-template flex min-h-dvh flex-col">
    <FzLayoutHeader v-if="slots.topbar" class="fz-focus-template__topbar shrink-0">
      <slot name="topbar" />
    </FzLayoutHeader>

    <div class="fz-focus-template__body flex min-h-0 flex-1 flex-col lg:flex-row">
      <FzLayoutMain align="center" class="fz-focus-template__main flex-1">
        <div class="fz-focus-template__content" :class="contentClass">
          <slot />
        </div>
      </FzLayoutMain>

      <FzLayoutAside v-if="slots.aside" class="fz-focus-template__aside shrink-0 lg:w-[360px]">
        <slot name="aside" />
      </FzLayoutAside>
    </div>

    <FzLayoutFooter v-if="slots.footer" class="fz-focus-template__footer shrink-0">
      <slot name="footer" />
    </FzLayoutFooter>
  </div>
</template>

<style scoped>
/* Keep the whole shell clear of device notches/rounded corners/home
   indicators. Insets resolve to 0 where the platform does not report them.
   Applied once at the root (rather than per region) because the focus flow has
   no sticky chrome that needs its background to bleed under the inset. */
.fz-focus-template {
  padding-top: env(safe-area-inset-top, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
}
</style>
