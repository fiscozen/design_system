<script setup lang="ts">
/**
 * FzLayoutAside — the complementary region molecule.
 *
 * A presentation-only wrapper that renders a semantic `<aside>` (a
 * `complementary` landmark) and a stable class hook. Built just-in-time for
 * `FzFocusTemplate`'s `aside` slot; layout-specific sizing and padding are
 * applied by the composing template through fall-through attributes.
 */
import type { FzLayoutAsideProps, FzLayoutAsideSlots } from './types'

withDefaults(defineProps<FzLayoutAsideProps>(), { as: 'aside' })
defineSlots<FzLayoutAsideSlots>()
</script>

<template>
  <component :is="as" class="fz-layout-aside">
    <slot />
  </component>
</template>
