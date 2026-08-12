import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick } from 'vue'
import { FzAppTemplate, FZ_BOTTOM_BAR_TARGET } from '..'

// ---------------------------------------------------------------------------
// window.matchMedia mock (not provided by jsdom, not mocked globally). The one
// query the template uses is `(min-width: 1200px)`; `matches` reflects it.
// ---------------------------------------------------------------------------
const originalMatchMedia = window.matchMedia
let isDesktop = true
const changeListeners = new Set<(e: MediaQueryListEvent) => void>()

function setViewport(desktop: boolean) {
  isDesktop = desktop
}

function fireViewportChange(desktop: boolean) {
  isDesktop = desktop
  changeListeners.forEach((cb) => cb({ matches: desktop } as MediaQueryListEvent))
}

beforeEach(() => {
  isDesktop = true
  changeListeners.clear()
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: isDesktop,
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        changeListeners.add(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) =>
        changeListeners.delete(cb),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: originalMatchMedia
  })
})

// A set of slots exercising every region + the toggle slot props.
function fullSlots() {
  return {
    nav: (p: any) =>
      h('nav', { 'aria-label': 'Principale' }, [
        // The injected nav's chat control opens the aside via the toggle prop.
        h('button', { class: 'nav-open-aside', onClick: () => p.toggleAside(true) }, 'chat')
      ]),
    header: (p: any) =>
      h('div', [
        h('button', { class: 'open-aside', onClick: () => p.toggleAside(true) }, 'chat'),
        h('span', { class: 'is-desktop' }, String(p.isDesktop))
      ]),
    default: () => h('div', { class: 'page' }, 'Contenuto'),
    aside: () => h('div', { class: 'chat-panel' }, [h('button', { class: 'in-aside' }, 'x')]),
    footer: () => h('div', { class: 'foot' }, '© Fiscozen'),
    bottomBar: () => h('button', { class: 'bar-action' }, 'Salva')
  }
}

describe('FzAppTemplate', () => {
  // ============================================
  // STRUCTURE
  // ============================================
  describe('Structure', () => {
    it('owns a full-height flex root so it does not depend on app-global height CSS', () => {
      const wrapper = mount(FzAppTemplate, { slots: { default: 'x' } })
      expect(wrapper.classes()).toContain('fz-app-template')
      expect(wrapper.classes()).toContain('min-h-dvh')
    })

    it('renders the main content and, by default, the bottom-bar region', () => {
      const wrapper = mount(FzAppTemplate, { slots: { default: '<div class="page">P</div>' } })
      expect(wrapper.find('main.fz-layout-main .page').text()).toBe('P')
      expect(wrapper.find('.fz-layout-bottom-bar').exists()).toBe(true)
    })

    it('renders every region as its landmark on desktop when its slot is provided', () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('main.fz-layout-main').exists()).toBe(true)
      expect(wrapper.find('header.fz-layout-header').exists()).toBe(true)
      expect(wrapper.find('aside.fz-layout-aside').exists()).toBe(true)
      expect(wrapper.find('footer.fz-layout-footer').exists()).toBe(true)
      expect(wrapper.find('.fz-app-template__nav nav[aria-label="Principale"]').exists()).toBe(true)
    })
  })

  // ============================================
  // NAV (persistent — defers to the injected nav)
  // ============================================
  describe('Persistent nav', () => {
    it('renders the nav as a sticky rail on desktop (never a dialog)', () => {
      const wrapper = mount(FzAppTemplate, { slots: fullSlots() })
      const nav = wrapper.find('.fz-app-template__nav')
      expect(nav.exists()).toBe(true)
      expect(nav.classes()).toContain('fz-app-template__nav--rail')
      expect(nav.attributes('role')).toBeUndefined()
    })

    it('keeps the nav persistent (a top region, not a hidden drawer) on mobile', () => {
      setViewport(false)
      const wrapper = mount(FzAppTemplate, { slots: fullSlots() })
      const nav = wrapper.find('.fz-app-template__nav')
      expect(nav.exists()).toBe(true)
      expect(nav.classes()).toContain('fz-app-template__nav--bar')
      expect(nav.classes()).toContain('w-full')
      // The template never turns the nav into a modal — the injected nav owns that.
      expect(nav.attributes('role')).toBeUndefined()
      expect(wrapper.find('nav[aria-label="Principale"]').exists()).toBe(true)
    })

    it('pins the mobile bar on the region itself, where sticky can actually travel', () => {
      setViewport(false)
      const wrapper = mount(FzAppTemplate, { slots: fullSlots() })
      const nav = wrapper.find('.fz-app-template__nav')
      // The region is a shrink-0 flex item sized to the nav inside it, so a sticky
      // *child* would have zero travel and scroll away with it. It has to be here.
      expect(nav.classes()).toContain('sticky')
      expect(nav.classes()).toContain('top-0')
    })

    it('does not render a nav region when no nav slot is provided', () => {
      const wrapper = mount(FzAppTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('.fz-app-template__nav').exists()).toBe(false)
    })

    it('wraps the nav slot in a <nav> landmark named via navLabel', () => {
      const wrapper = mount(FzAppTemplate, {
        props: { navLabel: 'Navigazione' },
        slots: fullSlots()
      })
      const nav = wrapper.find('nav.fz-app-template__nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('aria-label')).toBe('Navigazione')
    })
  })

  // ============================================
  // ASIDE / BOTTOM BAR GATING
  // ============================================
  describe('Optional regions', () => {
    it('does not render the aside unless hasAside is set, even with an aside slot', () => {
      const wrapper = mount(FzAppTemplate, {
        props: { hasAside: false },
        slots: { default: 'x', aside: () => h('div', { class: 'chat-panel' }, 'c') }
      })
      expect(wrapper.find('.fz-app-template__aside').exists()).toBe(false)
      expect(wrapper.find('.chat-panel').exists()).toBe(false)
    })

    it('renders the aside as a desktop panel when hasAside is set', () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      const aside = wrapper.find('aside.fz-layout-aside')
      expect(aside.exists()).toBe(true)
      expect(aside.classes()).toContain('fz-app-template__aside--panel')
      // Desktop panel is not a modal dialog.
      expect(aside.attributes('role')).toBeUndefined()
    })

    it('omits the bottom-bar region when hasBottomBar is false', () => {
      const wrapper = mount(FzAppTemplate, {
        props: { hasBottomBar: false },
        slots: { default: 'x' }
      })
      expect(wrapper.find('.fz-layout-bottom-bar').exists()).toBe(false)
    })
  })

  // ============================================
  // CHROME + CONTENT WIDTH
  // ============================================
  describe('chrome prop', () => {
    it('frames content in a card by default', () => {
      const wrapper = mount(FzAppTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('.fz-app-template__content--card').exists()).toBe(true)
      expect(wrapper.find('.fz-app-template__content--flat').exists()).toBe(false)
    })

    it('uses the flat frame when chrome=flat', () => {
      const wrapper = mount(FzAppTemplate, {
        props: { chrome: 'flat' },
        slots: { default: 'x' }
      })
      expect(wrapper.find('.fz-app-template__content--flat').exists()).toBe(true)
      expect(wrapper.find('.fz-app-template__content--card').exists()).toBe(false)
    })

    it('gutters the main region and matches it on the bottom bar in card chrome', () => {
      const wrapper = mount(FzAppTemplate, { slots: { default: 'x' } })
      const main = wrapper.find('.fz-app-template__main')
      expect(main.classes()).toContain('fz-app-template__main--card')
      expect(main.classes()).toContain('p-16')
      // The bottom bar mirrors main's horizontal inset so the content card and the
      // bar card share left/right edges at every width (bottom-bar ADR D2).
      expect(wrapper.find('.fz-layout-bottom-bar').classes()).toContain('px-16')
    })

    it('drops the gutter from main and the bottom bar in flat chrome', () => {
      const wrapper = mount(FzAppTemplate, {
        props: { chrome: 'flat' },
        slots: { default: 'x' }
      })
      const main = wrapper.find('.fz-app-template__main')
      expect(main.classes()).toContain('fz-app-template__main--flat')
      expect(main.classes()).not.toContain('p-16')
      expect(wrapper.find('.fz-layout-bottom-bar').classes()).not.toContain('px-16')
    })

    it('collapses the card to full-bleed below the desktop breakpoint', () => {
      setViewport(false)
      const wrapper = mount(FzAppTemplate, { slots: { default: 'x' } })
      const content = wrapper.find('.fz-app-template__content')
      // Still the card surface, but framed as the page rather than as a floating
      // box: white kept, gutter and rounding dropped. Only the horizontal inset
      // narrows, 24 → 16; the vertical padding stays 24 at every size.
      expect(content.classes()).toContain('fz-app-template__content--card')
      expect(content.classes()).toContain('bg-core-white')
      expect(content.classes()).toContain('px-16')
      expect(content.classes()).toContain('py-24')
      expect(content.classes()).not.toContain('rounded-lg')
      expect(content.classes()).not.toContain('px-24')
      expect(wrapper.find('.fz-app-template__main').classes()).not.toContain('p-16')
      // The bar mirrors the gutter, so it drops its inset too — otherwise it would
      // sit 16px inside the content it is supposed to stay edge-aligned with.
      expect(wrapper.find('.fz-layout-bottom-bar').classes()).not.toContain('px-16')
    })
  })

  describe('contentWidth prop', () => {
    it.each([
      ['standard', 'max-w-[1024px]'],
      ['wide', '3xl:max-w-none'],
      ['full', 'max-w-none']
    ] as const)('maps %s to the right max-width class', (contentWidth, cls) => {
      const wrapper = mount(FzAppTemplate, { props: { contentWidth }, slots: { default: 'x' } })
      expect(wrapper.find('.fz-app-template__content').classes()).toContain(cls)
    })
  })

  // ============================================
  // TOGGLE SLOT PROPS
  // ============================================
  describe('Toggle slot props', () => {
    it('exposes isDesktop to the chrome slots', () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('.is-desktop').text()).toBe('true')
    })

    it('passes a callable toggleAside to the nav slot; the desktop panel stays persistent', async () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('aside.fz-layout-aside').exists()).toBe(true)
      // The nav slot's control invokes toggleAside without error; on desktop the
      // aside is a persistent panel (the toggle drives only the mobile drawer).
      await wrapper.find('.nav-open-aside').trigger('click')
      expect(wrapper.find('aside.fz-layout-aside').exists()).toBe(true)
    })
  })

  // ============================================
  // MOBILE ASIDE OVERLAY + A11Y
  // ============================================
  describe('Mobile aside overlay', () => {
    beforeEach(() => setViewport(false))

    it('starts with the aside closed on mobile (nav stays persistent)', () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('.fz-app-template__aside').exists()).toBe(false)
      // Nav remains rendered as the top bar even while the aside is closed.
      expect(wrapper.find('.fz-app-template__nav--bar').exists()).toBe(true)
    })

    it('opens the aside as a modal drawer with dialog semantics + backdrop', async () => {
      const wrapper = mount(FzAppTemplate, {
        props: { hasAside: true, asideLabel: 'Assistenza' },
        slots: fullSlots()
      })
      await wrapper.find('.open-aside').trigger('click')
      const aside = wrapper.find('aside.fz-app-template__aside--drawer')
      expect(aside.exists()).toBe(true)
      expect(aside.attributes('role')).toBe('dialog')
      expect(aside.attributes('aria-modal')).toBe('true')
      expect(aside.attributes('aria-label')).toBe('Assistenza')
      expect(wrapper.find('.fz-app-template__backdrop').exists()).toBe(true)
    })

    it('renders the drawer full-screen, not as a partial side sheet', async () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      await wrapper.find('.open-aside').trigger('click')
      const aside = wrapper.find('aside.fz-app-template__aside--drawer')
      expect(aside.classes()).toContain('inset-0')
      expect(aside.classes()).toContain('w-full')
      // A surface that covers the viewport has no visible edge, so it needs
      // neither a width cap nor a shadow to separate it from the page.
      expect(aside.classes()).not.toContain('max-w-[85vw]')
      expect(aside.classes()).not.toContain('shadow-xl')
    })

    it('closes the drawer on Escape', async () => {
      const wrapper = mount(FzAppTemplate, {
        attachTo: document.body,
        props: { hasAside: true, asideLabel: 'Assistenza' },
        slots: fullSlots()
      })
      await wrapper.find('.open-aside').trigger('click')
      expect(wrapper.find('aside.fz-app-template__aside--drawer').exists()).toBe(true)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      expect(wrapper.find('aside.fz-app-template__aside--drawer').exists()).toBe(false)
      wrapper.unmount()
    })

    it('clicking the backdrop closes the drawer', async () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      await wrapper.find('.open-aside').trigger('click')
      await wrapper.find('.fz-app-template__backdrop').trigger('click')
      expect(wrapper.find('.fz-app-template__aside').exists()).toBe(false)
    })
  })

  // ============================================
  // RESPONSIVE RESET
  // ============================================
  describe('Responsive reset', () => {
    it('reopens the aside panel when the viewport crosses up to desktop', async () => {
      setViewport(false)
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('aside.fz-layout-aside').exists()).toBe(false)
      fireViewportChange(true)
      await nextTick()
      expect(wrapper.find('aside.fz-app-template__aside--panel').exists()).toBe(true)
    })
  })

  // ============================================
  // BOTTOM-BAR TELEPORT TARGET (provide, ADR D1)
  // ============================================
  describe('Bottom-bar teleport target', () => {
    it('provides the region element so descendants can teleport a bar into it', async () => {
      const Injector = defineComponent({
        setup() {
          const target = inject(FZ_BOTTOM_BAR_TARGET, null)
          return { target }
        },
        template: `<Teleport v-if="target" :to="target" defer><button class="teleported">Salva</button></Teleport>`
      })

      const wrapper = mount(FzAppTemplate, {
        attachTo: document.body,
        slots: { default: () => h(Injector) }
      })
      await flushPromises()

      const teleported = wrapper.find('.fz-layout-bottom-bar .teleported')
      expect(teleported.exists()).toBe(true)
      wrapper.unmount()
    })

    it('provides a null target when hasBottomBar is false', () => {
      let received: unknown = 'unset'
      const Injector = defineComponent({
        setup() {
          received = inject(FZ_BOTTOM_BAR_TARGET, null)
          return () => null
        }
      })
      mount(FzAppTemplate, {
        props: { hasBottomBar: false },
        slots: { default: () => h(Injector) }
      })
      // The provided ref exists but resolves to null (no region rendered).
      expect((received as { value: unknown } | null)?.value ?? null).toBeNull()
    })
  })

  // ============================================
  // INJECTION KEY LOCK-IN
  // ============================================
  describe('Injection key', () => {
    it('is the documented namespaced string', () => {
      expect(FZ_BOTTOM_BAR_TARGET).toBe('@fiscozen/layout/bottomBarTarget')
    })
  })

  // ============================================
  // EVENTS
  // ============================================
  describe('Events', () => {
    it('emits no events (presentational component)', () => {
      const wrapper = mount(FzAppTemplate, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
