<script setup lang="ts">
/**
 * FzLayoutBottomBar — the sticky bottom action-bar region molecule.
 *
 * A presentation-only region that pins a bar (primary/secondary actions) to the
 * bottom of the viewport while the page scrolls. Built just-in-time for
 * `FzAppTemplate`, which places it inside the main content column so it aligns
 * to that column automatically — the geometry is computed by the layout engine,
 * with no knowledge of the (app-injected) nav/aside rail widths (RFC §4
 * bottom-bar ADR, decision D2).
 *
 * Because it sticks in the normal flow it reserves its own height and an empty
 * bar collapses to zero — there is no manual bottom-padding "reservation" hack.
 * It relies on the document being the scroll container, so the composing
 * template keeps `overflow-x: clip` (not `-hidden`) on its content column
 * (RFC §6.2).
 *
 * The root element is exposed as `el` so `FzAppTemplate` can `provide()` it as
 * the bottom-bar teleport target (`FZ_BOTTOM_BAR_TARGET`); the `provide` lives on
 * the template — an ancestor of the page content — because provide/inject only
 * reaches descendants, and the page components that teleport a bar are
 * descendants of the template, not of this region.
 */
import { ref } from 'vue'
import type { FzLayoutBottomBarSlots } from './types'

defineSlots<FzLayoutBottomBarSlots>()

const el = ref<HTMLElement | null>(null)
defineExpose({ el })
</script>

<template>
  <div ref="el" class="fz-layout-bottom-bar">
    <slot />
  </div>
</template>

<style scoped>
.fz-layout-bottom-bar {
  position: sticky;
  bottom: 0;
  z-index: 10;
  /* Taps pass through the empty gutters to the content behind; the bar content
     itself (a direct child) is interactive again. */
  pointer-events: none;
  /* Directional safe-area: clear the home indicator / gesture bar. Resolves to
     0 where the platform does not report an inset. */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.fz-layout-bottom-bar > * {
  pointer-events: auto;
}

/* Hide when the viewport is very short (e.g. the mobile soft keyboard is open),
   so the bar never covers the field being edited. */
@media (max-height: 480px) {
  .fz-layout-bottom-bar {
    display: none;
  }
}
</style>
