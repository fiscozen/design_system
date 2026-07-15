<script setup lang="ts">
/**
 * FzLayoutFooter — the footer region molecule.
 *
 * A presentation-only wrapper that renders a semantic `<footer>` (a
 * `contentinfo` landmark when it is a top-level footer) and a stable class hook.
 * Built just-in-time for `FzFocusTemplate`'s `footer` slot; layout-specific
 * sizing and padding are applied by the composing template through fall-through
 * attributes.
 */
import type { FzLayoutFooterProps, FzLayoutFooterSlots } from './types'

withDefaults(defineProps<FzLayoutFooterProps>(), { as: 'footer' })
defineSlots<FzLayoutFooterSlots>()
</script>

<template>
  <component :is="as" class="fz-layout-footer">
    <slot />
  </component>
</template>
