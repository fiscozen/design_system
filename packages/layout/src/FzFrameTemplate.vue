<script setup lang="ts">
/**
 * FzFrameTemplate — the backoffice application frame.
 *
 * A persistent icon `nav` rail, a slim app-level `header` toolbar, the page, and
 * an optional 400px `aside` holding tools that are available everywhere (AI
 * chat, user messages). Page layouts — `FzThreeColumnsTemplate`,
 * `FzListTemplate`, `FzDetailTemplate` — nest *inside* the default slot.
 * Presentation-only: it owns the aside's open state and the responsive flag but
 * imports no store/router/API, and injects no chrome of its own.
 *
 * WHY THIS IS NOT `FzAppTemplate`. The frame's real job is not the chrome, it is
 * the HEIGHT CONTRACT it hands to the page. Every other shell in this package is
 * `owns-viewport` in the *`min-h-dvh` + document scroll* sense: a root that grows
 * with its content, i.e. an ancestor with an **indefinite** height. A
 * `fills-parent` layout mounted inside one (`FzThreeColumnsTemplate`, whose
 * manifest entry carried an empty `nestWithin` precisely because no host had ever
 * been verified) collapses to zero and its regions never scroll — which is why
 * the app that needed it measured `window.innerHeight - rect.top` by hand, with a
 * resize listener to keep it true.
 *
 * So this shell inverts the model: the root is `h-dvh` and **clips**, and the
 * content region is the app's single scroll container. `contentHeight` picks
 * which of the two contracts that region offers — see `FzFrameContentHeight`.
 * One prop separates the two worlds, which is what makes an incremental
 * migration possible: a page opts into `bounded` when it is ported, and every
 * other page keeps the scrolling region and behaves as it did.
 *
 * `h-dvh` is viewport-relative on purpose: the shell does NOT depend on the
 * app-global `html, body, #app { height: 100% }` reset that RFC §6.2 names as a
 * prerequisite for the sticky/scroll contract. With `h-dvh` it is not one.
 *
 * SCROLL OWNERSHIP. Under `contentHeight="scroll"` the **window no longer
 * scrolls** — `window.scrollTo(0, 0)` becomes a no-op and browser scroll
 * restoration on back/forward, which only ever restores the document scroller,
 * stops reaching the page. The shell therefore `provide()`s its content region
 * through `FZ_PAGE_SCROLL_TARGET` (the pattern `FzAppTemplate` already uses for
 * `FZ_BOTTOM_BAR_TARGET`) so the app can scroll the page and wire its router's
 * `scrollBehavior` against it. `scrollIntoView` call sites are unaffected: they
 * walk to the nearest scrollable ancestor either way.
 *
 * PREFLIGHT. This shell must stay independent of Tailwind's Preflight, and
 * anything added to it later must too. The backoffice scopes Preflight to the
 * `.twp` class (`tailwindcss-scoped-preflight`), and putting that class on an
 * ancestor of the page slot would apply the reset to hundreds of legacy
 * components at once and strip the Bootstrap styling they still rely on. So the
 * shell paints no `twp`, states `border-solid` explicitly (without the reset the
 * initial `border-style` is `none`) and `box-border` explicitly (without it,
 * `box-sizing` is `content-box` and every sized-plus-padded region overflows by
 * its padding). The app puts `twp` on its own slot content, where its own
 * elements are.
 *
 * BREAKPOINT. The frame is a column below `lg` (1024px) and a row at and above
 * it, in CSS — no JS, no resize listener, nothing to mismatch on hydration.
 * `lg`, not the `desktop` (1200px) breakpoint `FzAppTemplate` switches at,
 * because the *injected nav* switches at `lg`: `FzNavbar` compacts to a
 * full-width bar there and, kept in a left column past that point, shrink-wraps
 * to a stub with an empty strip of page background beneath it. A frame that
 * disagrees with its nav about where the rail ends has no correct arrangement.
 * (That the design system has two competing "desktop" thresholds is a real
 * inconsistency, tracked separately — RFC §6.4.)
 */
import { computed, provide, ref, watch } from 'vue'
import { useMediaQuery } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import FzLayoutHeader from './FzLayoutHeader.vue'
import FzLayoutMain from './FzLayoutMain.vue'
import FzLayoutAside from './FzLayoutAside.vue'
import { FZ_PAGE_SCROLL_TARGET } from './keys'
import type { FzFrameTemplateProps, FzFrameTemplateSlots, FzFrameTemplateToggles } from './types'

const props = withDefaults(defineProps<FzFrameTemplateProps>(), {
  contentHeight: 'scroll',
  chrome: 'card',
  background: 'page',
  hasAside: false
})

const slots = defineSlots<FzFrameTemplateSlots>()

/** Whether the tools panel is open. `v-model:asideOpen`. */
const asideOpen = defineModel<boolean>('asideOpen', { default: false })

/** Open/close the tools panel. Pass a boolean to force a state; omit to toggle. */
function toggleAside(force?: boolean) {
  asideOpen.value = typeof force === 'boolean' ? force : !asideOpen.value
}

// Only for the `isDesktop` slot prop — the arrangement itself is pure CSS (see
// the component doc). Injected chrome needs the flag to branch (a toolbar can
// hide the aside trigger where the aside cannot open), and it is part of the
// toggle shape `FzAppTemplate` already exposes.
const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg})`)

const toggleProps = computed<FzFrameTemplateToggles>(() => ({
  isDesktop: isDesktop.value,
  asideOpen: asideOpen.value,
  toggleAside
}))

const isBounded = computed(() => props.contentHeight === 'bounded')

// The aside region is rendered whenever it *could* open, and hidden with
// `v-show` while closed — never `v-if`. The whole point of mounting the tools
// beside the page slot rather than inside it is that they keep their state; a
// `v-if` would preserve it across route changes but destroy it on every
// close/expand, which is the more frequent interaction. Same reasoning as
// `FzThreeColumnsTemplate`'s collapsible sidebar.
const hasAsideRegion = computed(() => props.hasAside && !!slots.aside)

const rootClass = computed(() => [
  'fz-frame-template box-border flex h-dvh flex-col overflow-hidden lg:flex-row',
  props.background === 'page' ? 'bg-background-white-smoke' : ''
])

// The single scroll container of the app — or, under `bounded`, the box that
// clips and hands its definite height down. `flex flex-col` there so a child
// that sizes itself with `flex-1` rather than `h-full` is stretched too.
const mainClass = computed(() => [
  'fz-frame-template__main box-border min-h-0 flex-1',
  isBounded.value ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'
])

// The inset surface. Under `scroll` it must be `min-h-full` and NOT `h-full`:
// the percentage resolves against the region's content box, so a short page
// still fills the frame while a long one grows past it — `h-full` would clip the
// overflow instead of scrolling it.
const surfaceClass = computed(() => [
  'fz-frame-template__surface box-border',
  props.chrome === 'card'
    ? 'fz-frame-template__surface--card bg-core-white border-1 border-grey-200 rounded-xl border-solid'
    : 'fz-frame-template__surface--flat',
  isBounded.value ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : 'min-h-full'
])

// -- Page scroll target (provide) ---------------------------------------------
const mainRegion = ref<{ $el?: HTMLElement } | null>(null)
const pageScrollTarget = ref<HTMLElement | null>(null)
// Provided as a plain ref; the injection key's type signals read-only intent.
provide(FZ_PAGE_SCROLL_TARGET, pageScrollTarget)
// The element is the same node in both contracts, so this does not re-fire when
// `contentHeight` flips — only when the region mounts or unmounts.
watch(
  () => mainRegion.value?.$el ?? null,
  (el) => {
    pageScrollTarget.value = el ?? null
  },
  { flush: 'post', immediate: true }
)
</script>

<template>
  <div :class="rootClass">
    <!-- Navigation: a rail from `lg` up, a full-width bar below it. A real
         `<nav>` so there is always a navigation landmark regardless of what the
         injected nav renders as its own root — and so `navLabel` is actually
         exposed, which `aria-label` on a plain `div` would not be. The injected
         nav owns its own width and its own compact behaviour, exactly as
         `FzAppTemplate` delegates them. -->
    <nav
      v-if="slots.nav"
      class="fz-frame-template__nav w-full shrink-0 lg:h-full lg:w-auto"
      :aria-label="navLabel"
    >
      <slot name="nav" v-bind="toggleProps" />
    </nav>

    <!-- Centre column: toolbar + the page. `min-h-0` as well as `min-w-0`: this
         is a flex item in a column below `lg` and in a row above it, and it has
         to be allowed to shrink on whichever axis is the main one, or its
         automatic minimum size defeats the content region's scroll/clip
         contract. -->
    <div class="fz-frame-template__col flex min-h-0 min-w-0 flex-1 flex-col">
      <!-- The app-level strip: back, breadcrumb, global search, the aside
           trigger. `min-h-[48px]` is a floor, NOT a cap — a fixed height would
           clip taller injected chrome rather than growing to fit it, the mistake
           `FzThreeColumnsTemplate`'s header comment was written after making.
           A single-cell `grid` so the injected toolbar fills the strip on both
           axes without having to ask for `w-full`/`h-full` itself. -->
      <FzLayoutHeader
        v-if="slots.header"
        class="fz-frame-template__header box-border grid min-h-[48px] shrink-0"
      >
        <slot name="header" v-bind="toggleProps" />
      </FzLayoutHeader>

      <FzLayoutMain ref="mainRegion" :class="mainClass">
        <div :class="surfaceClass">
          <slot />
        </div>
      </FzLayoutMain>
    </div>

    <!-- Tools panel: a fixed 400px column, a sibling of the page slot rather
         than something each page renders, so whatever is mounted in it keeps its
         state across navigation with no global store. Desktop-only: 400px of a
         stacked narrow viewport is not a panel, it is the page. Its own gutter
         meets the content region's, which is the 16px gap between the two cards
         the design has. -->
    <FzLayoutAside
      v-if="hasAsideRegion"
      v-show="asideOpen"
      class="fz-frame-template__aside box-border hidden h-full w-[400px] shrink-0 overflow-hidden lg:block"
      :aria-label="asideLabel"
    >
      <div
        class="fz-frame-template__aside-surface bg-core-white border-1 border-grey-200 box-border flex h-full flex-col overflow-hidden rounded-xl border-solid"
      >
        <slot name="aside" v-bind="toggleProps" />
      </div>
    </FzLayoutAside>
  </div>
</template>

<style scoped>
/* The gutter and the device safe-area live together here because they have to be
   one declaration: `env()` cannot be expressed as a Tailwind spacing token, and
   splitting them across a utility class and a scoped override leaves two rules
   fighting over the same property. The 8px is the `p-8` token — the design puts
   the page's container at an 8px inset inside the frame, and it is also close to
   the gutter the legacy backoffice pages had (Bootstrap's `.container-fluid`,
   15px). Losing it runs a page hard against the rail and the window edge.

   Directional insets: each region pads only the edge(s) it can bleed under, so a
   region's background still reaches the device edge while its content stays
   clear of notches, rounded corners and home indicators. Insets resolve to 0
   where the platform does not report them. The root clips at `h-dvh`, so unlike
   the `min-h-dvh` shells there is no scroll past the bottom inset. */
.fz-frame-template__main {
  padding: 8px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}

.fz-frame-template__aside {
  padding: 8px;
  padding-right: calc(8px + env(safe-area-inset-right, 0px));
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}

/* Below the breakpoint the nav is a full-width bar meeting the top edge; from it
   up it is a rail meeting the left one. 1024px is the `lg` token
   (`breakpoints.lg`), restated here because a media query cannot read it — keep
   the two in step with the `lg:` variants in the template above. */
.fz-frame-template__nav {
  padding-top: env(safe-area-inset-top, 0px);
}

@media (min-width: 1024px) {
  .fz-frame-template__nav {
    padding-top: 0;
    padding-left: env(safe-area-inset-left, 0px);
  }
}

.fz-frame-template__header {
  padding-top: env(safe-area-inset-top, 0px);
}
</style>
