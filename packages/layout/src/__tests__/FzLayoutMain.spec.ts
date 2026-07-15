import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayoutMain } from '..'

describe('FzLayoutMain', () => {
  // ============================================
  // RENDERING / SEMANTICS
  // ============================================
  describe('Rendering', () => {
    it('renders a <main> landmark by default', () => {
      const wrapper = mount(FzLayoutMain, {
        slots: { default: '<p>content</p>' }
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('main')
      expect(wrapper.find('.fz-layout-main').exists()).toBe(true)
    })

    it('renders the default slot content', () => {
      const wrapper = mount(FzLayoutMain, {
        slots: { default: '<div class="child">hello</div>' }
      })

      const child = wrapper.find('.child')
      expect(child.exists()).toBe(true)
      expect(child.text()).toBe('hello')
    })

    it('renders as the tag given by `as` (single-landmark override)', () => {
      const wrapper = mount(FzLayoutMain, {
        props: { as: 'div' },
        slots: { default: 'content' }
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('div')
      // Still carries the region marker class regardless of tag.
      expect(wrapper.classes()).toContain('fz-layout-main')
    })
  })

  // ============================================
  // ALIGN
  // ============================================
  describe('align prop', () => {
    it('defaults to stretch alignment', () => {
      const wrapper = mount(FzLayoutMain, { slots: { default: 'x' } })
      expect(wrapper.classes()).toContain('fz-layout-main--stretch')
    })

    it.each([['stretch'], ['top'], ['center']] as const)(
      'reflects align=%s as its modifier class',
      (align) => {
        const wrapper = mount(FzLayoutMain, {
          props: { align },
          slots: { default: 'x' }
        })
        expect(wrapper.classes()).toContain(`fz-layout-main--${align}`)
      }
    )
  })

  // ============================================
  // SAFE AREA
  // ============================================
  describe('safeArea prop', () => {
    it('does not apply the safe-area class by default', () => {
      const wrapper = mount(FzLayoutMain, { slots: { default: 'x' } })
      expect(wrapper.classes()).not.toContain('fz-layout-main--safe-area')
    })

    it('applies the safe-area class when safeArea is true', () => {
      const wrapper = mount(FzLayoutMain, {
        props: { safeArea: true },
        slots: { default: 'x' }
      })
      expect(wrapper.classes()).toContain('fz-layout-main--safe-area')
    })
  })

  // ============================================
  // ACCESSIBILITY
  // ============================================
  describe('Accessibility', () => {
    it('exposes a main landmark that assistive tech can target', () => {
      const wrapper = mount(FzLayoutMain, { slots: { default: 'content' } })
      // A bare <main> is an implicit `main` landmark; assert the element rather
      // than a styling class so the a11y guarantee is what is under test.
      expect(wrapper.find('main').exists()).toBe(true)
    })

    it('forwards aria-* attributes onto the region element', () => {
      const wrapper = mount(FzLayoutMain, {
        attrs: { 'aria-label': 'Login' },
        slots: { default: 'content' }
      })
      expect(wrapper.attributes('aria-label')).toBe('Login')
    })
  })

  // ============================================
  // EVENTS
  // ============================================
  describe('Events', () => {
    it('emits no events (presentational component)', () => {
      const wrapper = mount(FzLayoutMain, { slots: { default: 'x' } })
      expect(wrapper.emitted()).toEqual({})
    })
  })
})
