<script setup lang="ts">
/**
 * FzLayoutHeader — the top-bar region molecule.
 *
 * A presentation-only wrapper that renders a semantic `<header>` (a `banner`
 * landmark when it is a top-level header) and a stable class hook. Built
 * just-in-time for `FzFocusTemplate`'s `topbar` slot; layout-specific sizing and
 * padding are applied by the composing template through fall-through attributes.
 */
import type { FzLayoutHeaderProps, FzLayoutHeaderSlots } from './types'

withDefaults(defineProps<FzLayoutHeaderProps>(), { as: 'header' })
defineSlots<FzLayoutHeaderSlots>()
</script>

<template>
  <component :is="as" class="fz-layout-header">
    <slot />
  </component>
</template>
