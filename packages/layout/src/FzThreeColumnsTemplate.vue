<script setup lang="ts">
/**
 * FzThreeColumnsTemplate — presentation-only backoffice three-column workspace layout.
 *
 * The recurring shape of a backoffice "review workspace" page (e.g. accounting
 * document approval): a full-width header bar, a collapsible list/navigation
 * `sidebar`, and two equal-width content columns — a left column (e.g. a document
 * preview) and a right column with its own header row and an independently
 * scrollable body (e.g. the record being edited). Extracted from the app-internal
 * `@fzp/shared` `FzLayoutThreeColumns` so the shape lives in the design system
 * (RFC §4, Jira LIB-2696 / epic RT-2054).
 *
 * Presentation-only and *chrome-free*: it owns the structural scaffold (the flex
 * regions, the collapsible sidebar's width animation + `v-model:sidebarCollapsed`
 * state, the independent-scroll regions, the region borders and a11y landmarks)
 * but bakes in no back button, title, badge, filter widgets or toggle icon —
 * those are injected through slots (the `sidebar-header` slot receives
 * `{ collapsed, toggle }`). It holds no store/router/API and imports no other
 * `@fiscozen/*` component — only the `FzLayoutAside` region molecule.
 *
 * HEIGHT CONTRACT — unlike the "page-content" siblings (`FzListTemplate`/
 * `FzDetailTemplate`), which grow with their content and scroll the document,
 * this template *fills the height of its parent* (`h-full`) and gives each of its
 * three regions its own internal scroll. It therefore requires a **bounded-height
 * ancestor**: mounted in a box with an indefinite height it collapses to zero and
 * its regions never scroll. It deliberately does not own `min-h-dvh` (unlike the
 * top-level `FzAppTemplate`/`FzBlankTemplate`/`FzFocusTemplate` shells) because it
 * is designed to fill the space *below* an app header, not the whole viewport —
 * the host must establish the bounded height (e.g. a flex-`1` row inside a
 * viewport-height column). RFC §6.2.
 *
 * The root is a non-landmark container `<div>`, so consumer-supplied fall-through
 * attributes (`aria-label`, `id`, `data-*`, …) land on that container — not on the
 * inner `<main>`. The header bar is a plain container (not a `<header>` banner
 * landmark): this template renders below the app's own page header, which owns the
 * banner.
 *
 * NOTE — distinct from `FzLayout`'s `layout="threeColumns"` variant, which is a
 * CSS-grid primitive (menu/header/chat/main/footer regions). This is a standalone
 * page template: header + collapsible sidebar + two content columns.
 */
import FzLayoutAside from './FzLayoutAside.vue'
import type { FzThreeColumnsTemplateProps, FzThreeColumnsTemplateSlots } from './types'

/**
 * Whether the sidebar is collapsed. When collapsed the sidebar narrows to a rail
 * and its `sidebar-filter`/`sidebar-content` regions are hidden with `v-show`
 * (kept mounted, so scroll position and any consumer-wired observers on that
 * content survive a collapse/expand cycle). `v-model:sidebarCollapsed`.
 */
const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed', { default: false })

withDefaults(defineProps<FzThreeColumnsTemplateProps>(), {
  mainAs: 'main'
})

const slots = defineSlots<FzThreeColumnsTemplateSlots>()

/** Collapse/expand the sidebar. Pass a boolean to force a state; omit to toggle. */
function toggleSidebar(force?: boolean) {
  sidebarCollapsed.value = typeof force === 'boolean' ? force : !sidebarCollapsed.value
}
</script>

<template>
  <div class="fz-three-columns-template bg-core-white flex h-full min-h-0 flex-col">
    <!-- Header bar. A plain container, NOT a <header> banner landmark: the app's
         own page header owns the banner. Full-width bottom border stands in for
         the source's <FzDivider> (grey-200). `min-h-[64px]` is a floor, NOT a cap:
         the bar is 64px tall for short content but GROWS to fit taller injected
         chrome. A hard `max-h` was wrong here — max-height caps the box size but
         does not clip, so oversized header-left/header-right slot content (e.g. a
         default h-44 FzButton, or a two-line title) would bleed past the header
         into the body region below instead of pushing it down. -->
    <div
      class="fz-three-columns-template__header border-b-1 border-grey-200 flex min-h-[64px] shrink-0 items-center justify-between gap-8 border-solid px-16 py-16"
    >
      <div class="fz-three-columns-template__header-left flex min-w-0 items-center gap-8">
        <slot name="header-left" />
      </div>
      <div class="fz-three-columns-template__header-right flex shrink-0 items-center gap-8">
        <slot name="header-right" />
      </div>
    </div>

    <!-- Body: the collapsible sidebar + the two content columns. -->
    <div class="fz-three-columns-template__body flex min-h-0 flex-1 items-start overflow-hidden">
      <!-- Collapsible list/navigation sidebar (a complementary landmark). -->
      <FzLayoutAside
        class="fz-three-columns-template__sidebar flex h-full flex-col overflow-hidden transition-[width] duration-200 ease-in-out"
        :class="sidebarCollapsed ? 'w-64' : 'w-[300px]'"
        :aria-label="sidebarLabel"
      >
        <!-- Sidebar title row + collapse control. Always visible. Centered when
             collapsed (rail shows just the control), space-between when expanded. -->
        <div
          class="fz-three-columns-template__sidebar-header flex shrink-0 items-center gap-8 p-16"
          :class="sidebarCollapsed ? 'justify-center' : 'justify-between'"
        >
          <slot name="sidebar-header" :collapsed="sidebarCollapsed" :toggle="toggleSidebar" />
        </div>

        <!-- Filter row. v-show (not v-if) so consumer-wired refs on it survive a
             collapse/expand cycle. -->
        <div
          v-if="slots['sidebar-filter']"
          v-show="!sidebarCollapsed"
          class="fz-three-columns-template__sidebar-filter shrink-0 px-16 pb-16"
        >
          <slot name="sidebar-filter" />
        </div>

        <div class="border-b-1 border-grey-200 border-solid" />

        <!-- Scrollable sidebar body. v-show (NOT v-if): preserves DOM identity so
             scroll position and any IntersectionObserver a consumer wires against
             this content stay valid across collapse/expand. `tabindex="0"` keeps
             the scroll region reachable and scrollable by keyboard even when the
             slotted content has no focusable element (WCAG 2.1.1 Keyboard / axe
             scrollable-region-focusable). -->
        <div
          v-show="!sidebarCollapsed"
          tabindex="0"
          class="fz-three-columns-template__sidebar-content min-h-0 w-full flex-1 overflow-y-auto p-16"
        >
          <slot name="sidebar-content" />
        </div>
      </FzLayoutAside>

      <!-- The two content columns = the page's primary content, in a `main`
           landmark by default (set `mainAs="div"` when nested in a shell that
           already renders a <main>). Rendered as a plain element rather than
           `FzLayoutMain` because that molecule is column-flex; here the columns
           lay out horizontally. -->
      <component
        :is="mainAs"
        class="fz-three-columns-template__columns flex h-full min-w-0 flex-1 overflow-hidden"
      >
        <!-- Left column (e.g. a document preview). Bordered on both sides to draw
             the vertical dividers against the sidebar and the right column. -->
        <div
          class="fz-three-columns-template__column-left border-x-1 border-grey-200 flex h-full min-w-0 flex-1 flex-col overflow-hidden border-solid pb-8"
        >
          <slot name="column-left" />
        </div>

        <!-- Right column: its own header row + an independently scrollable body. -->
        <div class="fz-three-columns-template__column-right flex h-full min-w-0 flex-1 flex-col">
          <div class="fz-three-columns-template__column-right-header shrink-0 p-16">
            <slot name="column-right-header" />
          </div>

          <div class="border-b-1 border-grey-200 border-solid" />

          <!-- `tabindex="0"`: keep this independently scrollable body reachable and
               scrollable by keyboard even when the slotted content has no focusable
               element (WCAG 2.1.1 Keyboard / axe scrollable-region-focusable). -->
          <div
            tabindex="0"
            class="fz-three-columns-template__column-right-content min-h-0 flex-1 overflow-y-auto px-16 pb-16"
          >
            <slot name="column-right-content" />
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the right column's body, keyed to a stable BEM hook (not a
   concatenated Tailwind utility string). #d1dde6 is the grey-200 token. */
.fz-three-columns-template__column-right-content {
  scrollbar-color: #d1dde6 #fff;
}

.fz-three-columns-template__column-right-content::-webkit-scrollbar-track {
  background: transparent;
}

.fz-three-columns-template__column-right-content::-webkit-scrollbar-thumb {
  background-color: #d1dde6;
}
</style>
