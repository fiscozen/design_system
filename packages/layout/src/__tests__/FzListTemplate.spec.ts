import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzListTemplate } from '..'

describe('FzListTemplate', () => {
  // ============================================
  // RENDERING / STRUCTURE
  // ============================================
  describe('Rendering', () => {
    it('renders the default (list) slot content inside the main region', () => {
      const wrapper = mount(FzListTemplate, {
        slots: { default: '<table class="list">rows</table>' }
      })

      const main = wrapper.find('main.fz-layout-main')
      expect(main.exists()).toBe(true)
      expect(main.find('table.list').text()).toBe('rows')
    })

    it('renders a main landmark by default', () => {
      const wrapper = mount(FzListTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main').exists()).toBe(true)
    })

    it('does not force a viewport height (page-content template, relies on shell/document scroll)', () => {
      const wrapper = mount(FzListTemplate, { slots: { default: 'x' } })
      expect(wrapper.classes()).toContain('fz-list-template')
      // Unlike the top-level templates, it must NOT pin itself to the viewport.
      expect(wrapper.classes()).not.toContain('min-h-dvh')
    })

    it('renders only the main region when no optional slots are provided', () => {
      const wrapper = mount(FzListTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main').exists()).toBe(true)
      expect(wrapper.find('.fz-list-template__banner').exists()).toBe(false)
      expect(wrapper.find('aside').exists()).toBe(false)
      expect(wrapper.find('.fz-list-template__header').exists()).toBe(false)
    })
  })

  // ============================================
  // OPTIONAL REGIONS
  // ============================================
  describe('Optional regions', () => {
    it('renders the banner above the body when the slot is provided', () => {
      const wrapper = mount(FzListTemplate, {
        slots: {
          banner: '<div class="notice">Fuori periodo</div>',
          default: 'content'
        }
      })
      const banner = wrapper.find('.fz-list-template__banner')
      expect(banner.exists()).toBe(true)
      expect(banner.find('.notice').text()).toBe('Fuori periodo')
    })

    it('renders the filters rail in a complementary landmark when the slot is provided', () => {
      const wrapper = mount(FzListTemplate, {
        slots: {
          filters: '<div class="filters">Anno</div>',
          default: 'content'
        }
      })
      const aside = wrapper.find('aside.fz-layout-aside')
      expect(aside.exists()).toBe(true)
      expect(aside.classes()).toContain('fz-list-template__filters')
      expect(aside.find('.filters').text()).toBe('Anno')
    })

    it('renders the header toolbar as a plain (non-banner) region when the slot is provided', () => {
      const wrapper = mount(FzListTemplate, {
        slots: {
          header: '<div class="toolbar">Dichiarazioni IVA</div>',
          default: 'content'
        }
      })
      const header = wrapper.find('.fz-list-template__header')
      expect(header.exists()).toBe(true)
      expect(header.find('.toolbar').text()).toBe('Dichiarazioni IVA')
      // Must not introduce a second banner landmark — the shell owns the page banner.
      expect(wrapper.find('header').exists()).toBe(false)
    })
  })

  // ============================================
  // FILTERS POSITION
  // ============================================
  describe('filtersPosition prop', () => {
    // Assert the stable per-position modifier hooks rather than the raw
    // responsive utilities: jsdom cannot evaluate `md:` breakpoints, and the
    // hooks keep the tests decoupled from a purely visual rail-width tweak.
    it('places the filter rail beside the content on md+ by default (left)', () => {
      const wrapper = mount(FzListTemplate, {
        slots: { filters: 'f', default: 'x' }
      })
      expect(wrapper.find('.fz-list-template__body').classes()).toContain(
        'fz-list-template__body--left'
      )
      const aside = wrapper.find('aside.fz-list-template__filters')
      expect(aside.classes()).toContain('fz-list-template__filters--left')
      expect(aside.classes()).not.toContain('fz-list-template__filters--top')
    })

    it('stacks the filters full-width above the content when top', () => {
      const wrapper = mount(FzListTemplate, {
        props: { filtersPosition: 'top' },
        slots: { filters: 'f', default: 'x' }
      })
      expect(wrapper.find('.fz-list-template__body').classes()).toContain(
        'fz-list-template__body--top'
      )
      const aside = wrapper.find('aside.fz-list-template__filters')
      expect(aside.classes()).toContain('fz-list-template__filters--top')
      expect(aside.classes()).not.toContain('fz-list-template__filters--left')
    })
  })

  // ============================================
  // FILTERS LANDMARK LABEL
  // ============================================
  describe('filtersLabel prop', () => {
    it('names the filters complementary landmark when provided', () => {
      const wrapper = mount(FzListTemplate, {
        props: { filtersLabel: 'Filtri dichiarazioni' },
        slots: { filters: 'f', default: 'x' }
      })
      expect(wrapper.find('aside.fz-list-template__filters').attributes('aria-label')).toBe(
        'Filtri dichiarazioni'
      )
    })

    it('leaves the filters landmark unnamed when omitted', () => {
      const wrapper = mount(FzListTemplate, {
        slots: { filters: 'f', default: 'x' }
      })
      expect(
        wrapper.find('aside.fz-list-template__filters').attributes('aria-label')
      ).toBeUndefined()
    })
  })

  // ============================================
  // MAIN LANDMARK OWNERSHIP
  // ============================================
  describe('mainAs prop', () => {
    it('renders the content as a <main> landmark by default', () => {
      const wrapper = mount(FzListTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main.fz-layout-main').exists()).toBe(true)
    })

    it('renders the content as a <div> when mainAs=div (for shell nesting)', () => {
      const wrapper = mount(FzListTemplate, {
        props: { mainAs: 'div' },
        slots: { default: '<span class="rows">rows</span>' }
      })
      expect(wrapper.find('main').exists()).toBe(false)
      const region = wrapper.find('div.fz-layout-main')
      expect(region.exists()).toBe(true)
      expect(region.find('.rows').text()).toBe('rows')
    })
  })

  // ============================================
  // ATTRIBUTE FORWARDING
  // ============================================
  describe('Attribute forwarding', () => {
    it('forwards fall-through attrs onto the root container, not the main region', () => {
      const wrapper = mount(FzListTemplate, {
        attrs: { 'aria-label': 'Dichiarazioni IVA', 'data-x': '1' },
        slots: { default: 'content' }
      })
      // Root is the non-landmark container div (documented behaviour).
      expect(wrapper.classes()).toContain('fz-list-template')
      expect(wrapper.attributes('aria-label')).toBe('Dichiarazioni IVA')
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
      const wrapper = mount(FzListTemplate, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
