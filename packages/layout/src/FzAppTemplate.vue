<script setup lang="ts">
/**
 * FzAppTemplate — the persistent-nav application shell template.
 *
 * The full-chrome page shell (the frontoffice standard layout, RFC §4): a
 * persistent navigation region, an optional sticky `header`, the primary
 * content, an optional complementary `aside`, an optional sticky bottom action
 * bar and an optional `footer`. It is presentation-only — it owns responsive and
 * toggle state plus safe-area/sticky CSS, but imports no store/router/API; the
 * app injects its own organisms (nav, chat, title, actions) through the slots
 * and owns all logic.
 *
 * Responsive frame:
 * - **Nav is persistent** and the *injected* nav owns its own responsiveness.
 *   The template only places it — a sticky **left rail** from the `desktop`
 *   breakpoint (1200px) up, a full-width **top region** below it — and does not
 *   render a nav drawer or hamburger. The frontoffice nav is `FzNavbar`
 *   (`@fiscozen/layout` sibling `@fiscozen/navbar`), which already renders its
 *   own responsive rail / mobile bar (hamburger + brand + notifications) and
 *   owns its menu open state; the template must not duplicate that. Rail width
 *   is a function of the injected content, never the template (RFC §4/§10).
 * - **The `aside` is the only region the template collapses.** On desktop it is
 *   a sticky right panel; below the breakpoint it becomes a **modal drawer** —
 *   `role="dialog"` + `aria-modal` + focus trap + Escape-to-close (the frontoffice
 *   support-chat overlay, which the app shell owns today, RFC §4/§6.1).
 *
 * The bottom bar is placed inside the main content column so it aligns to that
 * column automatically and reserves its own space. The template `provide()`s the
 * region's element as the teleport target `FZ_BOTTOM_BAR_TARGET` so deep page
 * components can render bar content at the shell level (RFC §4 bottom-bar ADR).
 *
 * Owns a full-height root (`min-h-dvh`), so it does not depend on app-global
 * `#app { height: 100% }` / `overflow-y: auto` CSS (RFC §6.2). Set the page
 * background with a fall-through `class` on the template root.
 */
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'
import { useMediaQuery } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import FzLayoutHeader from './FzLayoutHeader.vue'
import FzLayoutMain from './FzLayoutMain.vue'
import FzLayoutAside from './FzLayoutAside.vue'
import FzLayoutFooter from './FzLayoutFooter.vue'
import FzLayoutBottomBar from './FzLayoutBottomBar.vue'
import { FZ_BOTTOM_BAR_TARGET } from './keys'
import type { FzAppTemplateProps, FzAppTemplateSlots, FzAppTemplateToggles } from './types'

const props = withDefaults(defineProps<FzAppTemplateProps>(), {
  hasAside: false,
  hasBottomBar: true,
  chrome: 'card',
  contentWidth: 'standard'
})

const slots = defineSlots<FzAppTemplateSlots>()

// -- Responsive + toggle state -------------------------------------------------
const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop})`)

// Only the aside is collapsible by the template; the nav owns its own responsive
// state (see the component doc). Open on desktop, closed on mobile — the app's
// behaviour today.
const asideOpen = ref(isDesktop.value)

function toggleAside(force?: boolean) {
  asideOpen.value = typeof force === 'boolean' ? force : !asideOpen.value
}

// Crossing the breakpoint resets the aside to its default for that viewport.
watch(isDesktop, (desktop) => {
  asideOpen.value = desktop
})

const toggleProps = computed<FzAppTemplateToggles>(() => ({
  isDesktop: isDesktop.value,
  asideOpen: asideOpen.value,
  toggleAside
}))

const asideIsOverlay = computed(() => !isDesktop.value && asideOpen.value)
const showBackdrop = computed(() => asideIsOverlay.value)

// -- Region visibility + classes ----------------------------------------------
const showAside = computed(
  () => props.hasAside && !!slots.aside && (isDesktop.value || asideOpen.value)
)

const navClass = computed(() =>
  isDesktop.value
    ? 'fz-app-template__nav--rail sticky top-0 h-dvh shrink-0 overflow-y-auto'
    : 'fz-app-template__nav--bar w-full shrink-0'
)

const asideClass = computed(() =>
  isDesktop.value
    ? 'fz-app-template__aside--panel sticky top-0 h-dvh shrink-0 overflow-y-auto'
    : 'fz-app-template__aside--drawer fixed inset-y-0 right-0 z-30 w-[360px] max-w-[85vw] overflow-y-auto bg-core-white shadow-xl'
)

const contentWidthClass = computed(() => {
  switch (props.contentWidth) {
    case 'wide':
      return 'max-w-[1024px] 3xl:max-w-none'
    case 'full':
      return 'max-w-none'
    case 'standard':
    default:
      return 'max-w-[1024px]'
  }
})

const contentClass = computed(() => [
  'fz-app-template__content mx-auto flex w-full flex-1 flex-col',
  contentWidthClass.value,
  props.chrome === 'card'
    ? 'fz-app-template__content--card rounded-lg bg-core-white p-24'
    : 'fz-app-template__content--flat'
])

// -- Bottom-bar teleport target (provide) -------------------------------------
const bottomBarRegion = ref<{ el: HTMLElement | null } | null>(null)
const bottomBarTarget = ref<HTMLElement | null>(null)
// Provided as a plain ref; the injection key's type signals read-only intent to
// consumers (they only read `.value` to teleport into it).
provide(FZ_BOTTOM_BAR_TARGET, bottomBarTarget)
// Keep the provided target in sync with the region's mounted element (and clear
// it when `hasBottomBar` removes the region). Runs after DOM updates.
watch(
  () => bottomBarRegion.value?.el ?? null,
  (el) => {
    bottomBarTarget.value = el
  },
  { flush: 'post' }
)

// -- Mobile aside overlay focus trap ------------------------------------------
const asideRef = ref<{ $el?: HTMLElement } | null>(null)

const activeOverlayEl = computed<HTMLElement | null>(() =>
  asideIsOverlay.value ? (asideRef.value?.$el ?? null) : null
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
    toggleAside(false)
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
  <div class="fz-app-template flex min-h-dvh" :class="isDesktop ? 'flex-row' : 'flex-col'">
    <!-- Backdrop behind the mobile aside drawer -->
    <div
      v-if="showBackdrop"
      class="fz-app-template__backdrop fixed inset-0 z-20 bg-core-black/40"
      @click="toggleAside(false)" />

    <!-- Navigation: persistent left rail (desktop) / top region (mobile). The
         injected nav (e.g. FzNavbar) owns its own responsive collapse + menu. -->
    <div v-if="slots.nav" class="fz-app-template__nav" :class="navClass">
      <slot name="nav" v-bind="toggleProps" />
    </div>

    <!-- Main content column: header (sticky) / main / bottom bar (sticky) -->
    <div class="fz-app-template__col flex min-w-0 flex-1 flex-col">
      <FzLayoutHeader
        v-if="slots.header"
        class="fz-app-template__header sticky top-0 z-10 shrink-0">
        <slot name="header" v-bind="toggleProps" />
      </FzLayoutHeader>

      <FzLayoutMain class="fz-app-template__main flex-1 overflow-x-clip">
        <div :class="contentClass">
          <slot />
          <FzLayoutFooter v-if="slots.footer" class="fz-app-template__footer mt-auto">
            <slot name="footer" />
          </FzLayoutFooter>
        </div>
      </FzLayoutMain>

      <FzLayoutBottomBar
        v-if="hasBottomBar"
        ref="bottomBarRegion"
        class="fz-app-template__bottom-bar">
        <slot name="bottomBar" />
      </FzLayoutBottomBar>
    </div>

    <!-- Complementary aside: right panel (desktop) / modal drawer (mobile) -->
    <FzLayoutAside
      v-if="showAside"
      ref="asideRef"
      class="fz-app-template__aside"
      :class="asideClass"
      :role="asideIsOverlay ? 'dialog' : undefined"
      :aria-modal="asideIsOverlay ? 'true' : undefined"
      :aria-label="asideIsOverlay ? asideLabel : undefined"
      :tabindex="asideIsOverlay ? -1 : undefined">
      <slot name="aside" v-bind="toggleProps" />
    </FzLayoutAside>
  </div>
</template>

<style scoped>
/* Directional safe-area: each sticky/overlay region pads only the edge(s) it
   can bleed under, so a region's background reaches the device edge while its
   content stays clear of notches / rounded corners / home indicators. Insets
   resolve to 0 where the platform does not report them. The bottom bar owns its
   own bottom inset (see FzLayoutBottomBar); the nav owns its own insets on
   mobile (the injected nav, e.g. FzNavbar `respectSafeArea`). */
.fz-app-template__header {
  padding-top: env(safe-area-inset-top, 0px);
}

.fz-app-template__nav--rail {
  padding-left: env(safe-area-inset-left, 0px);
}

.fz-app-template__aside--panel {
  padding-right: env(safe-area-inset-right, 0px);
}

.fz-app-template__aside--drawer {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
</style>
