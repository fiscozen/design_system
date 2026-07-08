import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzBlankTemplate } from '..'

describe('FzBlankTemplate', () => {
  // ============================================
  // RENDERING / STRUCTURE
  // ============================================
  describe('Rendering', () => {
    it('renders the default slot content', () => {
      const wrapper = mount(FzBlankTemplate, {
        slots: { default: '<div class="login">Login</div>' }
      })

      const login = wrapper.find('.login')
      expect(login.exists()).toBe(true)
      expect(login.text()).toBe('Login')
    })

    it('composes a single main region (no chrome)', () => {
      const wrapper = mount(FzBlankTemplate, {
        slots: { default: 'content' }
      })

      // Exactly one main landmark, and no nav/header/aside/footer chrome.
      expect(wrapper.findAll('main')).toHaveLength(1)
      expect(wrapper.find('.fz-layout-main').exists()).toBe(true)
      expect(wrapper.find('nav').exists()).toBe(false)
      expect(wrapper.find('header').exists()).toBe(false)
      expect(wrapper.find('aside').exists()).toBe(false)
      expect(wrapper.find('footer').exists()).toBe(false)
    })

    it('owns a full-height root so it does not depend on app-global height CSS', () => {
      const wrapper = mount(FzBlankTemplate, {
        slots: { default: 'content' }
      })
      // The template establishes its own height context via min-h-dvh (RFC §6.2).
      expect(wrapper.classes()).toContain('min-h-dvh')
      expect(wrapper.classes()).toContain('fz-blank-template')
    })

    it('always enables safe-area insets on its region', () => {
      const wrapper = mount(FzBlankTemplate, {
        slots: { default: 'content' }
      })
      expect(wrapper.find('main').classes()).toContain('fz-layout-main--safe-area')
    })
  })

  // ============================================
  // ALIGN
  // ============================================
  describe('align prop', () => {
    it('centers content by default', () => {
      const wrapper = mount(FzBlankTemplate, {
        slots: { default: 'content' }
      })
      expect(wrapper.find('main').classes()).toContain('fz-layout-main--center')
    })

    it('maps align=top onto the region', () => {
      const wrapper = mount(FzBlankTemplate, {
        props: { align: 'top' },
        slots: { default: 'content' }
      })
      expect(wrapper.find('main').classes()).toContain('fz-layout-main--top')
      expect(wrapper.find('main').classes()).not.toContain('fz-layout-main--center')
    })

    it('maps align=center onto the region', () => {
      const wrapper = mount(FzBlankTemplate, {
        props: { align: 'center' },
        slots: { default: 'content' }
      })
      expect(wrapper.find('main').classes()).toContain('fz-layout-main--center')
    })
  })

  // ============================================
  // ATTRIBUTE FORWARDING
  // ============================================
  describe('Attribute forwarding', () => {
    it('forwards fall-through attrs onto the main landmark (its single root)', () => {
      const wrapper = mount(FzBlankTemplate, {
        attrs: { 'aria-label': 'Login page', 'data-x': '1' },
        slots: { default: 'content' }
      })
      const main = wrapper.find('main')
      expect(main.attributes('aria-label')).toBe('Login page')
      expect(main.attributes('data-x')).toBe('1')
    })
  })

  // ============================================
  // EVENTS
  // ============================================
  describe('Events', () => {
    it('emits no events (presentational component)', () => {
      const wrapper = mount(FzBlankTemplate, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
