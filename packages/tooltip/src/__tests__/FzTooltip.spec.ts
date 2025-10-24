import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h } from 'vue'

import { mount } from '@vue/test-utils'
import FzTooltip from '../FzTooltip.vue'
import { FzTooltipStatus } from '../types'
import { FzButton } from '@fiscozen/button'
import { FzLink } from '@fiscozen/link'

const statuses: FzTooltipStatus[] = ['neutral', 'informative', 'positive', 'alert', 'error']

const wrapperGen = (status: FzTooltipStatus, withIcon = false) =>
  mount(FzTooltip, {
    props: {
      text: 'sample text',
      status,
      withIcon,
      position: 'auto'
    },
    slots: {
      default: 'sample text'
    }
  })

beforeEach(() => {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  })
  window.IntersectionObserver = mockIntersectionObserver
  
  // Mock matchMedia for useMediaQuery composable
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe('FzTooltip', () => {
  statuses.forEach((status) => {
    it(`should match ${status} snapshot`, () => {
      const wrapper = wrapperGen(status)
      expect(wrapper.html()).toMatchSnapshot()
    })

    it(`should match ${status} snapshot with icon`, () => {
      const wrapper = wrapperGen(status, true)
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('Auto-detection of interactive elements', () => {
    it('should auto-detect FzButton as interactive (no tabindex on wrapper)', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text' },
        slots: { 
          default: () => h(FzButton, { label: 'Click me' })
        }
      })
      
      // Check that wrapper has no tabindex attribute (auto-detected as interactive)
      const html = wrapper.html()
      expect(html).toContain('<button')
      expect(html).not.toMatch(/<span[^>]*tabindex="0"/)
    })

    it('should auto-detect FzLink as interactive (no tabindex on wrapper)', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text' },
        slots: { 
          default: () => h(FzLink, { to: '/test', external: true }, { default: () => 'Link' })
        }
      })
      
      const html = wrapper.html()
      expect(html).toContain('<a')
      expect(html).not.toMatch(/<span[^>]*tabindex="0"/)
    })

    it('should NOT auto-detect span as interactive (adds tabindex="0")', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text' },
        slots: { default: 'Non-interactive text' }
      })
      
      const html = wrapper.html()
      expect(html).toMatch(/<span[^>]*tabindex="0"/)
    })

    it('should NOT auto-detect plain HTML elements as interactive', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text' },
        slots: { default: '<div>Content</div>' }
      })
      
      const html = wrapper.html()
      expect(html).toMatch(/<span[^>]*tabindex="0"/)
    })
  })

  describe('interactive prop - explicit values', () => {
    it('should respect interactive="auto" (same as default)', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', interactive: 'auto' },
        slots: { default: 'Non-interactive text' }
      })
      
      const html = wrapper.html()
      expect(html).toMatch(/<span[^>]*tabindex="0"/)
    })

    it('should force interactive with :interactive="true" on non-interactive element', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', interactive: true },
        slots: { default: '<span>Non-interactive</span>' }
      })
      
      const html = wrapper.html()
      expect(html).not.toMatch(/<span[^>]*tabindex="0"/)
    })

    it('should force non-interactive with :interactive="false" on interactive element', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', interactive: false },
        slots: { 
          default: () => h(FzButton, { label: 'Click me' })
        }
      })
      
      const html = wrapper.html()
      expect(html).toMatch(/<span[^>]*tabindex="0"/)
    })
  })

  describe('interactive prop - override auto-detection', () => {
    it('should override auto-detection: FzButton with :interactive="false"', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', interactive: false },
        slots: { 
          default: () => h(FzButton, { label: 'Button' })
        }
      })
      
      // Despite FzButton being auto-detected, interactive=false forces tabindex
      const html = wrapper.html()
      expect(html).toContain('<button')
      expect(html).toMatch(/<span[^>]*tabindex="0"/)
    })

    it('should override auto-detection: span with :interactive="true"', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', interactive: true },
        slots: { default: '<span>Text</span>' }
      })
      
      // Despite span not being auto-detected, interactive=true removes tabindex
      const html = wrapper.html()
      expect(html).not.toMatch(/<span[^>]*tabindex="0"/)
    })
  })
})
