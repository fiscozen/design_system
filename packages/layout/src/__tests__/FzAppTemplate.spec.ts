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
        h('button', { class: 'nav-toggle-aside', onClick: () => p.toggleAside() }, 'chat')
      ]),
    header: (p: any) =>
      h('div', [
        h('button', { class: 'open-nav', onClick: () => p.toggleNav(true) }, 'menu'),
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
      await wrapper.find('.nav-toggle-aside').trigger('click')
      expect(wrapper.find('aside.fz-layout-aside').exists()).toBe(true)
    })
  })

  // ============================================
  // MOBILE OVERLAYS + A11Y
  // ============================================
  describe('Mobile overlays', () => {
    beforeEach(() => setViewport(false))

    it('starts with nav and aside closed on mobile', () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('.fz-app-template__nav').exists()).toBe(false)
      expect(wrapper.find('.fz-app-template__aside').exists()).toBe(false)
    })

    it('opens the nav as a modal drawer with dialog semantics + backdrop', async () => {
      const wrapper = mount(FzAppTemplate, {
        props: { navLabel: 'Menu' },
        slots: fullSlots()
      })
      await wrapper.find('.open-nav').trigger('click')
      const nav = wrapper.find('.fz-app-template__nav')
      expect(nav.exists()).toBe(true)
      expect(nav.classes()).toContain('fz-app-template__nav--drawer')
      expect(nav.attributes('role')).toBe('dialog')
      expect(nav.attributes('aria-modal')).toBe('true')
      expect(nav.attributes('aria-label')).toBe('Menu')
      expect(wrapper.find('.fz-app-template__backdrop').exists()).toBe(true)
    })

    it('opening the aside closes the nav (mutually exclusive drawers)', async () => {
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      await wrapper.find('.open-nav').trigger('click')
      expect(wrapper.find('.fz-app-template__nav').exists()).toBe(true)
      await wrapper.find('.open-aside').trigger('click')
      expect(wrapper.find('.fz-app-template__nav').exists()).toBe(false)
      expect(wrapper.find('aside.fz-app-template__aside--drawer').exists()).toBe(true)
    })

    it('closes an open drawer on Escape', async () => {
      const wrapper = mount(FzAppTemplate, {
        attachTo: document.body,
        props: { hasAside: true, asideLabel: 'Chat' },
        slots: fullSlots()
      })
      await wrapper.find('.open-aside').trigger('click')
      expect(wrapper.find('aside.fz-app-template__aside--drawer').exists()).toBe(true)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      expect(wrapper.find('aside.fz-app-template__aside--drawer').exists()).toBe(false)
      wrapper.unmount()
    })

    it('clicking the backdrop closes the drawers', async () => {
      const wrapper = mount(FzAppTemplate, { slots: fullSlots() })
      await wrapper.find('.open-nav').trigger('click')
      await wrapper.find('.fz-app-template__backdrop').trigger('click')
      expect(wrapper.find('.fz-app-template__nav').exists()).toBe(false)
    })
  })

  // ============================================
  // RESPONSIVE RESET
  // ============================================
  describe('Responsive reset', () => {
    it('reopens nav/aside when the viewport crosses up to desktop', async () => {
      setViewport(false)
      const wrapper = mount(FzAppTemplate, { props: { hasAside: true }, slots: fullSlots() })
      expect(wrapper.find('aside.fz-layout-aside').exists()).toBe(false)
      fireViewportChange(true)
      await nextTick()
      // Back on desktop the aside panel is shown again.
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
