import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { FzSidebarTemplate } from '..'

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

// A set of slots exercising every zone + the toggle slot props. The nav slot's
// link closes the drawer via `toggleSidebar(false)` — the app's real behaviour.
function fullSlots() {
  return {
    brand: () => h('div', { class: 'brand' }, 'People'),
    nav: (p: any) =>
      h('div', [
        h('span', { class: 'is-desktop' }, String(p.isDesktop)),
        h('a', { href: '#', class: 'nav-link', onClick: () => p.toggleSidebar(false) }, 'Home')
      ]),
    footer: () => h('div', { class: 'user' }, [h('button', { class: 'logout' }, 'logout')]),
    topbar: () => h('span', { class: 'topbar-title' }, 'People'),
    default: () => h('div', { class: 'page' }, 'Contenuto')
  }
}

describe('FzSidebarTemplate', () => {
  // ============================================
  // STRUCTURE
  // ============================================
  describe('Structure', () => {
    it('owns a full-height flex root so it does not depend on app-global height CSS', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: { default: 'x' } })
      expect(wrapper.classes()).toContain('fz-sidebar-template')
      expect(wrapper.classes()).toContain('min-h-dvh')
    })

    it('renders the primary content as the <main> landmark', () => {
      const wrapper = mount(FzSidebarTemplate, {
        slots: { default: '<div class="page">P</div>' }
      })
      expect(wrapper.find('main.fz-layout-main .page').text()).toBe('P')
    })

    it('renders the three sidebar zones and the nav landmark on desktop', () => {
      const wrapper = mount(FzSidebarTemplate, {
        props: { navLabel: 'Principale' },
        slots: fullSlots()
      })
      expect(wrapper.find('.fz-sidebar-template__brand .brand').exists()).toBe(true)
      const nav = wrapper.find('nav.fz-sidebar-template__nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('aria-label')).toBe('Principale')
      expect(wrapper.find('.fz-sidebar-template__footer .user').exists()).toBe(true)
    })

    it('gates each zone on its slot', () => {
      const wrapper = mount(FzSidebarTemplate, {
        slots: { nav: () => h('a', { href: '#' }, 'Home'), default: 'x' }
      })
      expect(wrapper.find('.fz-sidebar-template__brand').exists()).toBe(false)
      expect(wrapper.find('nav.fz-sidebar-template__nav').exists()).toBe(true)
      expect(wrapper.find('.fz-sidebar-template__footer').exists()).toBe(false)
    })
  })

  // ============================================
  // DESKTOP RAIL
  // ============================================
  describe('Desktop rail', () => {
    it('renders the sidebar as a persistent sticky rail, never a dialog', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      const sidebar = wrapper.find('.fz-sidebar-template__sidebar')
      expect(sidebar.exists()).toBe(true)
      expect(sidebar.classes()).toContain('fz-sidebar-template__sidebar--rail')
      expect(sidebar.classes()).toContain('sticky')
      expect(sidebar.attributes('role')).toBeUndefined()
    })

    it('renders no mobile top bar and no backdrop on desktop', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      expect(wrapper.find('.fz-sidebar-template__topbar').exists()).toBe(false)
      expect(wrapper.find('.fz-sidebar-template__menu-btn').exists()).toBe(false)
      expect(wrapper.find('.fz-sidebar-template__backdrop').exists()).toBe(false)
    })
  })

  // ============================================
  // MOBILE DRAWER + A11Y
  // ============================================
  describe('Mobile drawer', () => {
    beforeEach(() => setViewport(false))

    it('renders the top bar with the hamburger and keeps the drawer closed initially', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      const topbar = wrapper.find('header.fz-sidebar-template__topbar')
      expect(topbar.exists()).toBe(true)
      expect(topbar.classes()).toContain('sticky')
      const btn = wrapper.find('.fz-sidebar-template__menu-btn')
      expect(btn.attributes('aria-expanded')).toBe('false')
      // The drawer (and its content) is not mounted until opened.
      expect(wrapper.find('.fz-sidebar-template__sidebar').exists()).toBe(false)
      expect(wrapper.find('.brand').exists()).toBe(false)
    })

    it('opens the drawer as a modal with dialog semantics + backdrop on hamburger click', async () => {
      const wrapper = mount(FzSidebarTemplate, {
        props: { sidebarLabel: 'Menu di navigazione' },
        slots: fullSlots()
      })
      await wrapper.find('.fz-sidebar-template__menu-btn').trigger('click')

      const drawer = wrapper.find('.fz-sidebar-template__sidebar--drawer')
      expect(drawer.exists()).toBe(true)
      expect(drawer.attributes('role')).toBe('dialog')
      expect(drawer.attributes('aria-modal')).toBe('true')
      expect(drawer.attributes('aria-label')).toBe('Menu di navigazione')
      expect(wrapper.find('.fz-sidebar-template__backdrop').exists()).toBe(true)
      expect(wrapper.find('.fz-sidebar-template__menu-btn').attributes('aria-expanded')).toBe(
        'true'
      )
    })

    it('closes the drawer on Escape', async () => {
      const wrapper = mount(FzSidebarTemplate, { attachTo: document.body, slots: fullSlots() })
      await wrapper.find('.fz-sidebar-template__menu-btn').trigger('click')
      expect(wrapper.find('.fz-sidebar-template__sidebar--drawer').exists()).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      expect(wrapper.find('.fz-sidebar-template__sidebar--drawer').exists()).toBe(false)
      wrapper.unmount()
    })

    it('closes the drawer when the backdrop is clicked', async () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      await wrapper.find('.fz-sidebar-template__menu-btn').trigger('click')
      await wrapper.find('.fz-sidebar-template__backdrop').trigger('click')
      expect(wrapper.find('.fz-sidebar-template__sidebar').exists()).toBe(false)
    })

    it('closes the drawer when a nav item drives toggleSidebar(false)', async () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      await wrapper.find('.fz-sidebar-template__menu-btn').trigger('click')
      expect(wrapper.find('.fz-sidebar-template__sidebar--drawer').exists()).toBe(true)
      await wrapper.find('.nav-link').trigger('click')
      expect(wrapper.find('.fz-sidebar-template__sidebar').exists()).toBe(false)
    })
  })

  // ============================================
  // TOGGLE SLOT PROPS
  // ============================================
  describe('Toggle slot props', () => {
    it('exposes isDesktop to the sidebar slots (true on desktop)', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      expect(wrapper.find('.is-desktop').text()).toBe('true')
    })

    it('exposes isDesktop as false below the breakpoint', async () => {
      setViewport(false)
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      await wrapper.find('.fz-sidebar-template__menu-btn').trigger('click')
      expect(wrapper.find('.is-desktop').text()).toBe('false')
    })
  })

  // ============================================
  // HAMBURGER LABEL
  // ============================================
  describe('Hamburger label', () => {
    beforeEach(() => setViewport(false))

    it('defaults the hamburger accessible name to "Menu"', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      expect(wrapper.find('.fz-sidebar-template__menu-btn').attributes('aria-label')).toBe('Menu')
    })

    it('honours a custom menuLabel', () => {
      const wrapper = mount(FzSidebarTemplate, {
        props: { menuLabel: 'Apri menu' },
        slots: fullSlots()
      })
      expect(wrapper.find('.fz-sidebar-template__menu-btn').attributes('aria-label')).toBe(
        'Apri menu'
      )
    })
  })

  // ============================================
  // RESPONSIVE RESET
  // ============================================
  describe('Responsive reset', () => {
    it('hands over to the persistent rail when the viewport crosses up to desktop', async () => {
      setViewport(false)
      const wrapper = mount(FzSidebarTemplate, { slots: fullSlots() })
      await wrapper.find('.fz-sidebar-template__menu-btn').trigger('click')
      expect(wrapper.find('.fz-sidebar-template__sidebar--drawer').exists()).toBe(true)

      fireViewportChange(true)
      await nextTick()
      const sidebar = wrapper.find('.fz-sidebar-template__sidebar')
      expect(sidebar.classes()).toContain('fz-sidebar-template__sidebar--rail')
      expect(sidebar.attributes('role')).toBeUndefined()
      expect(wrapper.find('.fz-sidebar-template__topbar').exists()).toBe(false)
    })
  })

  // ============================================
  // EVENTS
  // ============================================
  describe('Events', () => {
    it('emits no events (presentational component)', () => {
      const wrapper = mount(FzSidebarTemplate, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
