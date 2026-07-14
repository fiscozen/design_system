import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzDetailTemplate } from '..'

describe('FzDetailTemplate', () => {
  // ============================================
  // RENDERING / STRUCTURE
  // ============================================
  describe('Rendering', () => {
    it('renders the default (body) slot content inside the main region', () => {
      const wrapper = mount(FzDetailTemplate, {
        slots: { default: '<section class="body">tabs</section>' }
      })

      const main = wrapper.find('main.fz-layout-main')
      expect(main.exists()).toBe(true)
      expect(main.find('section.body').text()).toBe('tabs')
    })

    it('renders a main landmark by default', () => {
      const wrapper = mount(FzDetailTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main').exists()).toBe(true)
    })

    it('does not force a viewport height (page-content template, relies on shell/document scroll)', () => {
      const wrapper = mount(FzDetailTemplate, { slots: { default: 'x' } })
      expect(wrapper.classes()).toContain('fz-detail-template')
      // Unlike the top-level templates, it must NOT pin itself to the viewport.
      expect(wrapper.classes()).not.toContain('min-h-dvh')
    })

    it('renders only the main region when no optional slots are provided', () => {
      const wrapper = mount(FzDetailTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main').exists()).toBe(true)
      expect(wrapper.find('.fz-detail-template__banner').exists()).toBe(false)
      expect(wrapper.find('aside').exists()).toBe(false)
      expect(wrapper.find('.fz-detail-template__header').exists()).toBe(false)
    })
  })

  // ============================================
  // OPTIONAL REGIONS
  // ============================================
  describe('Optional regions', () => {
    it('renders the banner above the body when the slot is provided', () => {
      const wrapper = mount(FzDetailTemplate, {
        slots: {
          banner: '<div class="notice">Avvisi</div>',
          default: 'content'
        }
      })
      const banner = wrapper.find('.fz-detail-template__banner')
      expect(banner.exists()).toBe(true)
      expect(banner.find('.notice').text()).toBe('Avvisi')
    })

    it('renders the sidebar in a complementary landmark when the slot is provided', () => {
      const wrapper = mount(FzDetailTemplate, {
        slots: {
          sidebar: '<div class="summary">Mario Rossi</div>',
          default: 'content'
        }
      })
      const aside = wrapper.find('aside.fz-layout-aside')
      expect(aside.exists()).toBe(true)
      expect(aside.classes()).toContain('fz-detail-template__sidebar')
      expect(aside.find('.summary').text()).toBe('Mario Rossi')
    })

    it('renders the header toolbar as a plain (non-banner) region when the slot is provided', () => {
      const wrapper = mount(FzDetailTemplate, {
        slots: {
          header: '<div class="toolbar">Dichiarazione IVA 2026</div>',
          default: 'content'
        }
      })
      const header = wrapper.find('.fz-detail-template__header')
      expect(header.exists()).toBe(true)
      expect(header.find('.toolbar').text()).toBe('Dichiarazione IVA 2026')
      // Must not introduce a second banner landmark — the shell owns the page banner.
      expect(wrapper.find('header').exists()).toBe(false)
    })

    it('places the summary rail beside the content (side-by-side body row)', () => {
      const wrapper = mount(FzDetailTemplate, {
        slots: { sidebar: 's', default: 'x' }
      })
      // The body is the flex row that pairs the rail with the content.
      expect(wrapper.find('.fz-detail-template__body').exists()).toBe(true)
      expect(wrapper.find('aside.fz-detail-template__sidebar').exists()).toBe(true)
    })
  })

  // ============================================
  // SIDEBAR LANDMARK LABEL
  // ============================================
  describe('sidebarLabel prop', () => {
    it('names the sidebar complementary landmark when provided', () => {
      const wrapper = mount(FzDetailTemplate, {
        props: { sidebarLabel: 'Riepilogo dichiarazione' },
        slots: { sidebar: 's', default: 'x' }
      })
      expect(wrapper.find('aside.fz-detail-template__sidebar').attributes('aria-label')).toBe(
        'Riepilogo dichiarazione'
      )
    })

    it('leaves the sidebar landmark unnamed when omitted', () => {
      const wrapper = mount(FzDetailTemplate, {
        slots: { sidebar: 's', default: 'x' }
      })
      expect(
        wrapper.find('aside.fz-detail-template__sidebar').attributes('aria-label')
      ).toBeUndefined()
    })
  })

  // ============================================
  // MAIN LANDMARK OWNERSHIP
  // ============================================
  describe('mainAs prop', () => {
    it('renders the content as a <main> landmark by default', () => {
      const wrapper = mount(FzDetailTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main.fz-layout-main').exists()).toBe(true)
    })

    it('renders the content as a <div> when mainAs=div (for shell nesting)', () => {
      const wrapper = mount(FzDetailTemplate, {
        props: { mainAs: 'div' },
        slots: { default: '<span class="body">tabs</span>' }
      })
      expect(wrapper.find('main').exists()).toBe(false)
      const region = wrapper.find('div.fz-layout-main')
      expect(region.exists()).toBe(true)
      expect(region.find('.body').text()).toBe('tabs')
    })
  })

  // ============================================
  // ATTRIBUTE FORWARDING
  // ============================================
  describe('Attribute forwarding', () => {
    it('forwards fall-through attrs onto the root container, not the main region', () => {
      const wrapper = mount(FzDetailTemplate, {
        attrs: { 'aria-label': 'Dettaglio dichiarazione', 'data-x': '1' },
        slots: { default: 'content' }
      })
      // Root is the non-landmark container div (documented behaviour).
      expect(wrapper.classes()).toContain('fz-detail-template')
      expect(wrapper.attributes('aria-label')).toBe('Dettaglio dichiarazione')
      expect(wrapper.attributes('data-x')).toBe('1')
      // The inner <main> must NOT receive the container-level label.
      expect(wrapper.find('main').attributes('aria-label')).toBeUndefined()
    })
  })

  // ============================================
  // EVENTS
  // ============================================
  describe('Events', () => {
    it('emits no events (presentational component)', () => {
      const wrapper = mount(FzDetailTemplate, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
