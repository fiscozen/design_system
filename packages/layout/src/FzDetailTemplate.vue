<script setup lang="ts">
/**
 * FzDetailTemplate — presentation-only backoffice detail-page layout.
 *
 * The recurring shape of a backoffice record-detail page (e.g. a single VAT
 * declaration): a persistent `sidebar` summary/context rail — the record's
 * identity, status, meta and actions — beside the detail body (typically
 * `FzTabs`/`FzCard`s and its trailing modals), plus an optional full-width
 * `banner` (page-level alerts) and an optional `header` toolbar. Extracted so the
 * backoffice detail pages — which today hand-roll the same rail/body split two
 * ways (`FzLayout leftShoulder` and a raw `flex` row) — converge on one
 * responsive layout (RFC §4, Jira LIB-2695).
 *
 * It is the sibling of `FzListTemplate` (LIB-2694): a list page pairs a *filter*
 * rail with a table, a detail page pairs a *summary/context* rail with the
 * record's content. Both compose the region molecules (`FzLayoutAside` for the
 * rail, `FzLayoutMain` for the content) rather than wrapping `FzLayout
 * leftShoulder` — that variant forces `100vh` mobile tracks and per-region
 * `overflow-auto` (independent scroll), whereas the detail pages want to grow
 * with their content and scroll the document. On narrow viewports the summary
 * rail stacks above the body; from `md` up it sits beside it (its natural height,
 * not stretched to the taller body).
 *
 * Like `FzListTemplate`, this is a *page-content* template designed to render
 * inside a shell's main region. It therefore does **not** force a viewport height
 * (`min-h-dvh`) and does not apply root safe-area insets — the shell owns the
 * scroll container, the full-height host contract, and device safe-area. Set
 * `mainAs="div"` when composing it inside a shell that already renders a `<main>`
 * (e.g. `FzAppTemplate`'s default slot) to avoid nested `main` landmarks.
 *
 * The root is a non-landmark container `<div>`, so consumer-supplied fall-through
 * attributes (`aria-label`, `id`, `data-*`, …) land on that container — not on
 * the inner `<main>`.
 *
 * The `sidebar` rail is a `complementary` landmark; pass `sidebarLabel` to give
 * it an accessible name (recommended when the page exposes more than one
 * complementary region — e.g. when nested inside a shell that renders its own
 * `aside` — so screen-reader users can tell the rails apart).
 */
import FzLayoutMain from './FzLayoutMain.vue'
import FzLayoutAside from './FzLayoutAside.vue'
import type { FzDetailTemplateProps, FzDetailTemplateSlots } from './types'

withDefaults(defineProps<FzDetailTemplateProps>(), {
  mainAs: 'main'
})

const slots = defineSlots<FzDetailTemplateSlots>()
</script>

<template>
  <div class="fz-detail-template flex flex-col gap-16">
    <div v-if="slots.banner" class="fz-detail-template__banner">
      <slot name="banner" />
    </div>

    <!-- Summary rail beside the body from `md` up, stacking above it on narrow
         viewports. `md:items-start` keeps the rail its natural height rather than
         stretching it to the (usually taller) detail body. -->
    <div class="fz-detail-template__body flex flex-col gap-16 md:flex-row md:items-start">
      <FzLayoutAside
        v-if="slots.sidebar"
        class="fz-detail-template__sidebar md:w-[340px] md:shrink-0"
        :aria-label="sidebarLabel"
      >
        <slot name="sidebar" />
      </FzLayoutAside>

      <FzLayoutMain :as="mainAs" class="fz-detail-template__main flex-1 gap-16">
        <!-- Content toolbar (title/actions). Deliberately a plain <div>, not a
             <header> banner: this template is nested inside a shell that already
             owns the page banner/breadcrumb. -->
        <div v-if="slots.header" class="fz-detail-template__header">
          <slot name="header" />
        </div>
        <slot />
      </FzLayoutMain>
    </div>
  </div>
</template>
