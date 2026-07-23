<script setup lang="ts">
/**
 * FzSidebarTemplate — the collapsible-sidebar application shell.
 *
 * A full-height page shell for internal-tool / console apps whose chrome is a
 * single persistent side rail: a template-owned colored sidebar in three vertical
 * zones — `brand` (top), `nav` (the scrollable middle) and `footer` (pinned
 * bottom, e.g. the signed-in user + logout) — beside the primary content. It was
 * extracted from the `it.fiscozen.people` app shell (`MainLayout` + `AppSidebar`)
 * so the shape lives in the design system (RFC §4, Jira LIB-2697 / epic RT-2054).
 *
 * Responsive frame:
 * - From the `desktop` breakpoint (1200px) up the sidebar is a **persistent
 *   sticky left rail**; the content fills the rest of the row.
 * - Below it the rail becomes an **off-canvas drawer**. The template owns the
 *   collapse: it renders a sticky **mobile top bar** with a hamburger, and the
 *   drawer opens as a modal (`role="dialog"` + `aria-modal` + focus trap +
 *   Escape-to-close + a click-to-dismiss backdrop). This is the mirror of
 *   `FzAppTemplate`, where the *aside* is the drawer and the nav stays persistent;
 *   here the *nav rail itself* is what collapses.
 *
 * Distinct from `FzAppTemplate` (the frontoffice/backoffice shell whose nav is an
 * opaque injected slot that owns its own responsiveness): this template owns the
 * sidebar chrome (the colored container + the drawer machinery) and the app fills
 * the three zones. Its colors are app-themed, never baked in — set
 * `--fz-sidebar-bg` / `--fz-sidebar-text` (and optionally `--fz-sidebar-width`,
 * default 280px) on the template root; they cascade to the rail, the drawer and
 * the mobile top bar.
 *
 * Presentation-only: it owns the responsive/collapse state and safe-area/sticky
 * CSS but imports no store/router/API — only the `FzLayoutHeader`/`FzLayoutMain`
 * region molecules and `FzIconButton` (the mobile hamburger). Nav items + their
 * RBAC, routing, the brand, the user identity and logout all stay app-side,
 * injected through the slots.
 *
 * Owns a full-height root (`min-h-dvh`), so it does not depend on app-global
 * `#app { height: 100% }` / `overflow-y: auto` CSS (RFC §6.2). Set the page
 * background with a fall-through `class` on the template root.
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useMediaQuery } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import { FzIconButton } from '@fiscozen/button'
import FzLayoutHeader from './FzLayoutHeader.vue'
import FzLayoutMain from './FzLayoutMain.vue'
import type {
  FzSidebarTemplateProps,
  FzSidebarTemplateSlots,
  FzSidebarTemplateToggles
} from './types'

withDefaults(defineProps<FzSidebarTemplateProps>(), {
  menuLabel: 'Menu'
})

const slots = defineSlots<FzSidebarTemplateSlots>()

// A stable id so the mobile hamburger's `aria-controls` points at the drawer.
// A shell is a single instance per page, so a constant id is safe.
const SIDEBAR_ID = 'fz-sidebar-template-sidebar'

// -- Responsive + collapse state ----------------------------------------------
const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop})`)

// The drawer's open state. Only meaningful below the breakpoint — on desktop the
// rail is always rendered regardless. Starts closed (the app's behaviour today).
const sidebarOpen = ref(false)

/** Open/close the sidebar drawer. Pass a boolean to force a state; omit to toggle. */
function toggleSidebar(force?: boolean) {
  sidebarOpen.value = typeof force === 'boolean' ? force : !sidebarOpen.value
}

// Crossing up to desktop hands over to the persistent rail; close the drawer so
// returning to mobile starts closed (and no stale overlay state lingers).
watch(isDesktop, (desktop) => {
  if (desktop) sidebarOpen.value = false
})

// The rail is always shown on desktop; the drawer only when opened on mobile.
const showSidebar = computed(() => isDesktop.value || sidebarOpen.value)
const sidebarIsOverlay = computed(() => !isDesktop.value && sidebarOpen.value)
const showBackdrop = computed(() => sidebarIsOverlay.value)

const toggleProps = computed<FzSidebarTemplateToggles>(() => ({
  isDesktop: isDesktop.value,
  sidebarOpen: sidebarOpen.value,
  toggleSidebar
}))

const sidebarClass = computed(() =>
  isDesktop.value
    ? 'fz-sidebar-template__sidebar--rail sticky top-0 h-dvh shrink-0'
    : 'fz-sidebar-template__sidebar--drawer fixed inset-y-0 left-0 z-30 max-w-[85vw] shadow-xl'
)

// -- Mobile drawer focus trap -------------------------------------------------
const sidebarRef = ref<HTMLElement | null>(null)

const activeOverlayEl = computed<HTMLElement | null>(() =>
  sidebarIsOverlay.value ? sidebarRef.value : null
)

let restoreFocusEl: HTMLElement | null = null

function focusablesWithin(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

function onOverlayKeydown(event: KeyboardEvent) {
  const el = activeOverlayEl.value
  if (!el) return

  if (event.key === 'Escape') {
    event.preventDefault()
    toggleSidebar(false)
    return
  }

  if (event.key !== 'Tab') return

  const focusables = focusablesWithin(el)
  const first = focusables[0] ?? el
  const last = focusables[focusables.length - 1] ?? el
  const active = document.activeElement

  if (event.shiftKey && (active === first || active === el)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(activeOverlayEl, (el, prev) => {
  if (el && !prev) {
    restoreFocusEl = (document.activeElement as HTMLElement | null) ?? null
    document.addEventListener('keydown', onOverlayKeydown)
    nextTick(() => {
      const focusables = focusablesWithin(el)
      ;(focusables[0] ?? el).focus()
    })
  } else if (!el && prev) {
    document.removeEventListener('keydown', onOverlayKeydown)
    restoreFocusEl?.focus?.()
    restoreFocusEl = null
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onOverlayKeydown)
})
</script>

<template>
  <div class="fz-sidebar-template flex min-h-dvh" :class="isDesktop ? 'flex-row' : 'flex-col'">
    <!-- Mobile top bar: the always-visible affordance to open the off-canvas
         drawer. A `<header>` banner via FzLayoutHeader; only rendered below the
         breakpoint (desktop shows the persistent rail instead). -->
    <FzLayoutHeader
      v-if="!isDesktop"
      class="fz-sidebar-template__topbar sticky top-0 z-10 flex shrink-0 items-center gap-12 px-16 py-12"
    >
      <!-- The hamburger is the DS `FzIconButton` (icon-only, invisible variant);
           `inheritAttrs:false` forwards `aria-*` + the click listener to its inner
           button, and `ariaLabel` names it. -->
      <FzIconButton
        class="fz-sidebar-template__menu-btn"
        iconName="bars"
        variant="invisible"
        :ariaLabel="menuLabel"
        :aria-expanded="sidebarOpen"
        :aria-controls="SIDEBAR_ID"
        @click="toggleSidebar()"
      />
      <slot name="topbar" v-bind="toggleProps" />
    </FzLayoutHeader>

    <!-- Backdrop behind the mobile drawer -->
    <div
      v-if="showBackdrop"
      class="fz-sidebar-template__backdrop bg-core-black/40 fixed inset-0 z-20"
      @click="toggleSidebar(false)"
    />

    <!-- Sidebar: persistent sticky rail (desktop) / off-canvas modal drawer
         (mobile). The container is a plain box (not a landmark); its three zones
         carry the semantics — the `nav` slot is wrapped in the `<nav>` landmark.
         On mobile-open it is the modal dialog (focus-trapped in script). -->
    <div
      v-if="showSidebar"
      :id="SIDEBAR_ID"
      ref="sidebarRef"
      class="fz-sidebar-template__sidebar flex flex-col overflow-hidden"
      :class="sidebarClass"
      :role="sidebarIsOverlay ? 'dialog' : undefined"
      :aria-modal="sidebarIsOverlay ? 'true' : undefined"
      :aria-label="sidebarIsOverlay ? sidebarLabel : undefined"
      :tabindex="sidebarIsOverlay ? -1 : undefined"
    >
      <div v-if="slots.brand" class="fz-sidebar-template__brand shrink-0 p-16">
        <slot name="brand" v-bind="toggleProps" />
      </div>

      <nav
        v-if="slots.nav"
        class="fz-sidebar-template__nav min-h-0 flex-1 overflow-y-auto p-8"
        :aria-label="navLabel"
      >
        <slot name="nav" v-bind="toggleProps" />
      </nav>

      <div v-if="slots.footer" class="fz-sidebar-template__footer mt-auto shrink-0 p-16">
        <slot name="footer" v-bind="toggleProps" />
      </div>
    </div>

    <!-- Main content column. FzLayoutMain is the page's `<main>` landmark; the
         page fills it with its own cards on the (app-themed) page background. -->
    <FzLayoutMain
      class="fz-sidebar-template__main min-w-0 flex-1 overflow-x-clip"
      :class="isDesktop ? 'p-24' : 'p-16'"
    >
      <slot />
    </FzLayoutMain>
  </div>
</template>

<style scoped>
/* App-themed sidebar surface. Colors are never baked in: the consuming app sets
   `--fz-sidebar-bg` / `--fz-sidebar-text` on the template root and they cascade
   to the rail, the drawer and the mobile top bar. Width is likewise themeable
   (`--fz-sidebar-width`, default 280px) so the rail sizes to the app, not the
   template (RFC §4/§10). The drawer inherits the same width but caps at 85vw so a
   sliver of the backdrop stays tappable on narrow phones. */
.fz-sidebar-template__sidebar {
  width: var(--fz-sidebar-width, 280px);
  background-color: var(--fz-sidebar-bg, #fff);
  color: var(--fz-sidebar-text, inherit);
}

.fz-sidebar-template__topbar {
  background-color: var(--fz-sidebar-bg, #fff);
  color: var(--fz-sidebar-text, inherit);
  /* Sticky at the top: keep its background clear of a notch. */
  padding-top: env(safe-area-inset-top, 0px);
}

/* Directional safe-area: each sticky/overlay edge pads only the side(s) it can
   bleed under, so the surface reaches the device edge while content stays clear
   of notches / rounded corners / home indicators. Insets resolve to 0 where the
   platform does not report them. */
.fz-sidebar-template__sidebar--rail {
  padding-left: env(safe-area-inset-left, 0px);
}

.fz-sidebar-template__sidebar--drawer {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
}
</style>
