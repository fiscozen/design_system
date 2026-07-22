import { describe, it, expect } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { FzThreeColumnsTemplate } from '..'

describe('FzThreeColumnsTemplate', () => {
  // ============================================
  // RENDERING / STRUCTURE
  // ============================================
  describe('Rendering', () => {
    it('renders the root container hook', () => {
      const wrapper = mount(FzThreeColumnsTemplate)
      expect(wrapper.classes()).toContain('fz-three-columns-template')
    })

    it('renders all region slots into their regions', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        slots: {
          'header-left': '<div class="hl">Registrazione</div>',
          'header-right': '<div class="hr">actions</div>',
          'sidebar-filter': '<div class="sf">filters</div>',
          'sidebar-content': '<div class="sc">list</div>',
          'column-left': '<div class="cl">preview</div>',
          'column-right-header': '<div class="crh">badge/tabs</div>',
          'column-right-content': '<div class="crc">form</div>'
        }
      })
      expect(wrapper.find('.fz-three-columns-template__header-left .hl').text()).toBe(
        'Registrazione'
      )
      expect(wrapper.find('.fz-three-columns-template__header-right .hr').text()).toBe('actions')
      expect(wrapper.find('.fz-three-columns-template__sidebar-filter .sf').exists()).toBe(true)
      expect(wrapper.find('.fz-three-columns-template__sidebar-content .sc').text()).toBe('list')
      expect(wrapper.find('.fz-three-columns-template__column-left .cl').text()).toBe('preview')
      expect(wrapper.find('.fz-three-columns-template__column-right-header .crh').exists()).toBe(
        true
      )
      expect(wrapper.find('.fz-three-columns-template__column-right-content .crc').text()).toBe(
        'form'
      )
    })

    it('omits the sidebar-filter region when its slot is not provided', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        slots: { 'sidebar-content': 'x' }
      })
      expect(wrapper.find('.fz-three-columns-template__sidebar-filter').exists()).toBe(false)
      // The scrollable body region is a core region and is always present.
      expect(wrapper.find('.fz-three-columns-template__sidebar-content').exists()).toBe(true)
    })
  })

  // ============================================
  // HEIGHT CONTRACT
  // ============================================
  describe('Height contract', () => {
    it('fills its parent (h-full) and does NOT own the viewport (no min-h-dvh)', () => {
      const wrapper = mount(FzThreeColumnsTemplate)
      // Fills the bounded-height ancestor rather than growing with content...
      expect(wrapper.classes()).toContain('h-full')
      // ...and unlike the top-level shells it must not pin itself to the viewport.
      expect(wrapper.classes()).not.toContain('min-h-dvh')
    })
  })

  // ============================================
  // INDEPENDENT-SCROLL REGIONS (contract the consumer's observer relies on)
  // ============================================
  describe('Scroll regions', () => {
    it('renders the sidebar body inside an overflow-y-auto / min-h-0 scroll container', () => {
      // The sole consumer wires an IntersectionObserver whose root is the nearest
      // scrollable ancestor of a sentinel in this region (findScrollParent walks up
      // to overflow-y:auto). Lock the class combination so a future markup refactor
      // cannot silently remove the scroll parent.
      const wrapper = mount(FzThreeColumnsTemplate, { slots: { 'sidebar-content': 'x' } })
      const body = wrapper.find('.fz-three-columns-template__sidebar-content')
      expect(body.classes()).toContain('overflow-y-auto')
      expect(body.classes()).toContain('min-h-0')
    })

    it('renders the right-column body inside an overflow-y-auto / min-h-0 scroll container', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        slots: { 'column-right-content': 'x' }
      })
      const body = wrapper.find('.fz-three-columns-template__column-right-content')
      expect(body.classes()).toContain('overflow-y-auto')
      expect(body.classes()).toContain('min-h-0')
    })
  })

  // ============================================
  // SIDEBAR COLLAPSE (v-model:sidebarCollapsed)
  // ============================================
  describe('Sidebar collapse', () => {
    it('is expanded by default (300px rail, body visible)', () => {
      const wrapper = mount(FzThreeColumnsTemplate, { slots: { 'sidebar-content': 'x' } })
      const sidebar = wrapper.find('.fz-three-columns-template__sidebar')
      expect(sidebar.classes()).toContain('w-[300px]')
      expect(wrapper.find('.fz-three-columns-template__sidebar-content').isVisible()).toBe(true)
    })

    it('narrows to the rail and hides the body when collapsed', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        props: { sidebarCollapsed: true },
        slots: { 'sidebar-filter': 'f', 'sidebar-content': 'x' }
      })
      const sidebar = wrapper.find('.fz-three-columns-template__sidebar')
      expect(sidebar.classes()).toContain('w-64')
      // Header row stays visible; filter + body are hidden.
      expect(wrapper.find('.fz-three-columns-template__sidebar-header').isVisible()).toBe(true)
      expect(wrapper.find('.fz-three-columns-template__sidebar-filter').isVisible()).toBe(false)
      expect(wrapper.find('.fz-three-columns-template__sidebar-content').isVisible()).toBe(false)
    })

    it('keeps the sidebar body MOUNTED when collapsed (v-show, not v-if)', () => {
      // Guards the fix for the source bug: v-if would destroy the scroll container
      // and detach the consumer's IntersectionObserver on every collapse/expand.
      const wrapper = mount(FzThreeColumnsTemplate, {
        props: { sidebarCollapsed: true },
        slots: { 'sidebar-content': '<div class="sentinel">…</div>' }
      })
      const body = wrapper.find('.fz-three-columns-template__sidebar-content')
      expect(body.exists()).toBe(true) // still in the DOM…
      expect(body.isVisible()).toBe(false) // …just hidden
      expect(wrapper.find('.sentinel').exists()).toBe(true)
    })

    it('exposes { collapsed, toggle } to the sidebar-header slot and emits update:sidebarCollapsed on toggle', async () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        props: { sidebarCollapsed: false },
        slots: {
          'sidebar-header': (props: { collapsed: boolean; toggle: (force?: boolean) => void }) =>
            h(
              'button',
              { class: 'toggle', onClick: () => props.toggle() },
              props.collapsed ? 'collapsed' : 'expanded'
            )
        }
      })
      const button = wrapper.find('button.toggle')
      expect(button.text()).toBe('expanded')
      await button.trigger('click')
      expect(wrapper.emitted('update:sidebarCollapsed')?.[0]).toEqual([true])
    })

    it('toggle(force) forces the state passed', async () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        props: { sidebarCollapsed: true },
        slots: {
          'sidebar-header': (props: { collapsed: boolean; toggle: (force?: boolean) => void }) =>
            h('button', { class: 'expand', onClick: () => props.toggle(false) })
        }
      })
      await wrapper.find('button.expand').trigger('click')
      expect(wrapper.emitted('update:sidebarCollapsed')?.[0]).toEqual([false])
    })
  })

  // ============================================
  // LANDMARKS
  // ============================================
  describe('Landmarks', () => {
    it('renders the sidebar as a complementary <aside> landmark', () => {
      const wrapper = mount(FzThreeColumnsTemplate, { slots: { 'sidebar-content': 'x' } })
      const aside = wrapper.find('aside.fz-layout-aside')
      expect(aside.exists()).toBe(true)
      expect(aside.classes()).toContain('fz-three-columns-template__sidebar')
    })

    it('names the sidebar landmark via sidebarLabel', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        props: { sidebarLabel: 'Lista documenti' },
        slots: { 'sidebar-content': 'x' }
      })
      expect(wrapper.find('aside.fz-three-columns-template__sidebar').attributes('aria-label')).toBe(
        'Lista documenti'
      )
    })

    it('leaves the sidebar landmark unnamed when sidebarLabel is omitted', () => {
      const wrapper = mount(FzThreeColumnsTemplate, { slots: { 'sidebar-content': 'x' } })
      expect(
        wrapper.find('aside.fz-three-columns-template__sidebar').attributes('aria-label')
      ).toBeUndefined()
    })

    it('wraps the two content columns in a <main> landmark by default', () => {
      const wrapper = mount(FzThreeColumnsTemplate, { slots: { 'column-left': 'x' } })
      const main = wrapper.find('main.fz-three-columns-template__columns')
      expect(main.exists()).toBe(true)
      expect(main.find('.fz-three-columns-template__column-left').exists()).toBe(true)
    })

    it('renders the columns region as a <div> when mainAs=div (for shell nesting)', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        props: { mainAs: 'div' },
        slots: { 'column-left': 'x' }
      })
      expect(wrapper.find('main').exists()).toBe(false)
      expect(wrapper.find('div.fz-three-columns-template__columns').exists()).toBe(true)
    })
  })

  // ============================================
  // ATTRIBUTE FORWARDING
  // ============================================
  describe('Attribute forwarding', () => {
    it('forwards fall-through attrs onto the root container, not the main region', () => {
      const wrapper = mount(FzThreeColumnsTemplate, {
        attrs: { 'aria-label': 'Registrazione contabile', 'data-x': '1' },
        slots: { 'column-left': 'x' }
      })
      expect(wrapper.classes()).toContain('fz-three-columns-template')
      expect(wrapper.attributes('aria-label')).toBe('Registrazione contabile')
      expect(wrapper.attributes('data-x')).toBe('1')
      // The inner <main> must not receive the container-level label.
      expect(wrapper.find('main').attributes('aria-label')).toBeUndefined()
    })
  })
})
