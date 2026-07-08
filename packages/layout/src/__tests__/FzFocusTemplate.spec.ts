import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzFocusTemplate } from '..'

describe('FzFocusTemplate', () => {
  // ============================================
  // RENDERING / STRUCTURE
  // ============================================
  describe('Rendering', () => {
    it('renders the default (flow) slot content in a centered main region', () => {
      const wrapper = mount(FzFocusTemplate, {
        slots: { default: '<div class="flow">Step 1</div>' }
      })

      const flow = wrapper.find('.flow')
      expect(flow.exists()).toBe(true)
      expect(flow.text()).toBe('Step 1')

      const main = wrapper.find('main')
      expect(main.exists()).toBe(true)
      expect(main.classes()).toContain('fz-layout-main--center')
    })

    it('owns a full-height root so it does not depend on app-global height CSS', () => {
      const wrapper = mount(FzFocusTemplate, { slots: { default: 'x' } })
      expect(wrapper.classes()).toContain('fz-focus-template')
      expect(wrapper.classes()).toContain('min-h-dvh')
    })

    it('renders only the main region when no optional slots are provided', () => {
      const wrapper = mount(FzFocusTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('main').exists()).toBe(true)
      expect(wrapper.find('header').exists()).toBe(false)
      expect(wrapper.find('aside').exists()).toBe(false)
      expect(wrapper.find('footer').exists()).toBe(false)
    })
  })

  // ============================================
  // OPTIONAL REGIONS
  // ============================================
  describe('Optional regions', () => {
    it('renders the topbar in a header landmark when the slot is provided', () => {
      const wrapper = mount(FzFocusTemplate, {
        slots: {
          topbar: '<div class="bar">Bar</div>',
          default: 'content'
        }
      })
      const header = wrapper.find('header.fz-layout-header')
      expect(header.exists()).toBe(true)
      expect(header.find('.bar').text()).toBe('Bar')
    })

    it('renders the aside in a complementary landmark when the slot is provided', () => {
      const wrapper = mount(FzFocusTemplate, {
        slots: {
          aside: '<div class="chat">Chat</div>',
          default: 'content'
        }
      })
      const aside = wrapper.find('aside.fz-layout-aside')
      expect(aside.exists()).toBe(true)
      expect(aside.find('.chat').text()).toBe('Chat')
    })

    it('renders the footer in a contentinfo landmark when the slot is provided', () => {
      const wrapper = mount(FzFocusTemplate, {
        slots: {
          footer: '<div class="legal">Legal</div>',
          default: 'content'
        }
      })
      const footer = wrapper.find('footer.fz-layout-footer')
      expect(footer.exists()).toBe(true)
      expect(footer.find('.legal').text()).toBe('Legal')
    })
  })

  // ============================================
  // CHROME
  // ============================================
  describe('chrome prop', () => {
    it('frames content in a card by default', () => {
      const wrapper = mount(FzFocusTemplate, { slots: { default: 'x' } })
      expect(wrapper.find('.fz-focus-template__content--card').exists()).toBe(true)
      expect(wrapper.find('.fz-focus-template__content--flat').exists()).toBe(false)
    })

    it('uses the flat (full-bleed) frame when chrome=flat', () => {
      const wrapper = mount(FzFocusTemplate, {
        props: { chrome: 'flat' },
        slots: { default: 'x' }
      })
      expect(wrapper.find('.fz-focus-template__content--flat').exists()).toBe(true)
      expect(wrapper.find('.fz-focus-template__content--card').exists()).toBe(false)
    })

    it('uses the card frame when chrome=card', () => {
      const wrapper = mount(FzFocusTemplate, {
        props: { chrome: 'card' },
        slots: { default: 'x' }
      })
      expect(wrapper.find('.fz-focus-template__content--card').exists()).toBe(true)
    })
  })

  // ============================================
  // ATTRIBUTE FORWARDING
  // ============================================
  describe('Attribute forwarding', () => {
    it('forwards fall-through attrs onto the root container, not the main region', () => {
      const wrapper = mount(FzFocusTemplate, {
        attrs: { 'aria-label': 'Onboarding', 'data-x': '1' },
        slots: { default: 'content' }
      })
      // Root is the non-landmark container div (documented behaviour).
      expect(wrapper.classes()).toContain('fz-focus-template')
      expect(wrapper.attributes('aria-label')).toBe('Onboarding')
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
      const wrapper = mount(FzFocusTemplate, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
