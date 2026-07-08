<script setup lang="ts">
/**
 * FzBlankTemplate — full-bleed page template with no chrome.
 *
 * The minimal page shell: a single full-height content region and nothing else
 * (no nav, header, aside, footer or bottom bar). Used for auth/login screens
 * and standalone tools that render their own self-contained UI.
 *
 * Owns a full-height root (`min-h-dvh`) so it establishes its own scroll/height
 * context and does NOT silently depend on app-global `#app { height: 100% }` /
 * `overflow-y: auto` CSS being present — that host contract is made explicit
 * here (RFC §2 principle 6, §6.2). `min-h` (not a fixed `h`) lets the page grow
 * with content that exceeds the viewport, so centered content never becomes
 * unreachable at the top when it overflows.
 */
import FzLayoutMain from './FzLayoutMain.vue'
import type { FzBlankTemplateProps, FzBlankTemplateSlots } from './types'

/**
 * `align` shares FzLayoutMain's alignment vocabulary (`center`/`top`), so it is
 * forwarded straight through. A consumer-supplied `aria-label`/`id`/`data-*`
 * falls through to the `<main>` landmark (the template's single root region).
 */
withDefaults(defineProps<FzBlankTemplateProps>(), {
  align: 'center'
})

defineSlots<FzBlankTemplateSlots>()
</script>

<template>
  <FzLayoutMain class="fz-blank-template min-h-dvh" :align="align" safe-area>
    <slot />
  </FzLayoutMain>
</template>
