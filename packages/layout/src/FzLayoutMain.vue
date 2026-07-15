<script setup lang="ts">
/**
 * FzLayoutMain — the "main" region molecule of the layout system.
 *
 * A presentation-only wrapper for a page's primary content region. It renders a
 * semantic landmark (`<main>` by default) and owns the region-level concerns
 * the page templates need — content alignment and device safe-area insets — so
 * those concerns are declared once here instead of being re-implemented ad hoc
 * in every app layout. It holds no state and imports no store/router/API.
 *
 * Built just-in-time for its first consumer (`FzBlankTemplate`); further region
 * concerns (padding, internal scroll, max-width, sticky) are added as later
 * templates require them.
 */
import { computed } from 'vue'
import type { FzLayoutMainProps, FzLayoutMainSlots } from './types'

const props = withDefaults(defineProps<FzLayoutMainProps>(), {
  as: 'main',
  align: 'stretch',
  safeArea: false
})

defineSlots<FzLayoutMainSlots>()

const regionClass = computed(() => [
  `fz-layout-main--${props.align}`,
  { 'fz-layout-main--safe-area': props.safeArea }
])
</script>

<template>
  <component :is="as" class="fz-layout-main" :class="regionClass">
    <slot />
  </component>
</template>

<style scoped>
.fz-layout-main {
  display: flex;
  flex-direction: column;
  /* Let content shrink instead of forcing overflow when placed inside a grid
     track (min-width/min-height default to `auto` for flex items). */
  min-width: 0;
}

/* Content flows from the top and fills the inline size — the neutral column. */
.fz-layout-main--stretch {
  align-items: stretch;
  justify-content: flex-start;
}

/* Inline-centered, pinned to the top. */
.fz-layout-main--top {
  align-items: center;
  justify-content: flex-start;
}

/* Centered on both axes (e.g. a login card in a full-height page). */
.fz-layout-main--center {
  align-items: center;
  justify-content: center;
}

/* Keep content clear of notches/rounded corners/home indicators. Insets
   resolve to 0 where the platform does not report them. */
.fz-layout-main--safe-area {
  padding-top: env(safe-area-inset-top, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
}
</style>
