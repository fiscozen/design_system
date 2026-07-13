<script setup lang="ts">
/**
 * FzListTemplate — presentation-only backoffice list-page layout.
 *
 * The recurring shape of a backoffice list page: an optional full-width `banner`
 * (alerts, action cards), an optional `filters` rail, an optional `header`
 * toolbar (title/search/actions) and the list content itself (typically an
 * `FzTable` and its trailing modals). Extracted so the ~34 backoffice list pages
 * — which today hand-roll the same rail/table shape three different ways
 * (`FzLayout leftShoulder`, `grid-cols-4`, `flex w-[300px]`) — converge on one
 * responsive layout (RFC §4, Jira LIB-2694).
 *
 * Composes the region molecules (`FzLayoutAside` for the filter rail,
 * `FzLayoutMain` for the content) rather than wrapping `FzLayout leftShoulder`:
 * that variant forces `100vh` mobile tracks and per-region `overflow-auto`
 * (independent scroll), whereas backoffice list pages want to grow with their
 * content and scroll the document — exactly why the hand-rolled pages avoid it.
 *
 * Unlike the top-level templates (`FzBlankTemplate`/`FzFocusTemplate`), this is a
 * *page-content* template designed to render inside a shell's main region. It
 * therefore does **not** force a viewport height (`min-h-dvh`) and does not apply
 * root safe-area insets — the shell owns the scroll container, the full-height
 * host contract, and device safe-area. Set `mainAs="div"` when composing it
 * inside a shell that already renders a `<main>` (e.g. `FzAppTemplate`'s default
 * slot) to avoid nested `main` landmarks.
 *
 * The root is a non-landmark container `<div>`, so consumer-supplied fall-through
 * attributes (`aria-label`, `id`, `data-*`, …) land on that container — not on
 * the inner `<main>`.
 *
 * The optional `filters` rail is a `complementary` landmark; pass `filtersLabel`
 * to give it an accessible name (recommended when the page exposes more than one
 * complementary region — e.g. when nested inside a shell that renders its own
 * `aside` — so screen-reader users can tell the rails apart).
 */
import { computed } from 'vue'
import FzLayoutMain from './FzLayoutMain.vue'
import FzLayoutAside from './FzLayoutAside.vue'
import type { FzListTemplateProps, FzListTemplateSlots } from './types'

const props = withDefaults(defineProps<FzListTemplateProps>(), {
  filtersPosition: 'left',
  mainAs: 'main'
})

const slots = defineSlots<FzListTemplateSlots>()

// Each variant carries a stable per-position modifier hook (mirroring
// `FzFocusTemplate`'s `--${chrome}` and `FzLayoutMain`'s `--${align}`) so tests,
// stories and future overrides target intent rather than the raw responsive
// utilities — keeping the rail width a single source of truth here.
// `left`: rail beside the content from `md` up, stacking above it on narrow
// viewports (`md:items-start` keeps the rail its natural height rather than
// stretching to the list). `top`: a full-width filter row above the content.
const bodyClass = computed(() => [
  `fz-list-template__body--${props.filtersPosition}`,
  props.filtersPosition === 'left' ? 'md:flex-row md:items-start' : ''
])

const filtersClass = computed(() => [
  `fz-list-template__filters--${props.filtersPosition}`,
  props.filtersPosition === 'left' ? 'md:w-[300px] md:shrink-0' : 'w-full'
])
</script>

<template>
  <div class="fz-list-template flex flex-col gap-16">
    <div v-if="slots.banner" class="fz-list-template__banner">
      <slot name="banner" />
    </div>

    <div class="fz-list-template__body flex flex-col gap-16" :class="bodyClass">
      <FzLayoutAside
        v-if="slots.filters"
        class="fz-list-template__filters"
        :class="filtersClass"
        :aria-label="filtersLabel"
      >
        <slot name="filters" />
      </FzLayoutAside>

      <FzLayoutMain :as="mainAs" class="fz-list-template__main flex-1 gap-16">
        <!-- Content toolbar (title/search/actions). Deliberately a plain <div>,
             not a <header> banner: this template is nested inside a shell that
             already owns the page banner/breadcrumb. -->
        <div v-if="slots.header" class="fz-list-template__header">
          <slot name="header" />
        </div>
        <slot />
      </FzLayoutMain>
    </div>
  </div>
</template>
