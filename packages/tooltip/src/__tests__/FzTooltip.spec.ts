import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import FzTooltip from '../FzTooltip.vue'
import { FzTooltipStatus } from '../types'

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

  describe('isInteractive prop', () => {
    it('should add tabindex="0" when isInteractive is false (default)', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text' },
        slots: { default: 'Non-interactive text' },
        attachTo: document.body
      })
      
      // Find the span wrapper that contains the slot content
      const triggerElement = wrapper.find('span[tabindex]')
      expect(triggerElement.attributes('tabindex')).toBe('0')
      
      wrapper.unmount()
    })

    it('should NOT add tabindex when isInteractive is true', () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', isInteractive: true },
        slots: { default: '<button>Interactive</button>' }
      })
      
      // Find the span wrapper - it should exist but without tabindex
      const triggerElement = wrapper.find('.fz__tooltip span')
      expect(triggerElement.exists()).toBe(true)
      expect(triggerElement.attributes('tabindex')).toBeUndefined()
    })

    it('should hide tooltip on focusout when isInteractive is false', async () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text' },
        slots: { default: 'Non-interactive text' },
        attachTo: document.body
      })
      
      const triggerElement = wrapper.find('.fz__tooltip span')
      await triggerElement.trigger('focusin')
      await triggerElement.trigger('focusout')
      
      // Tooltip is teleported to body
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip?.getAttribute('aria-hidden')).toBe('true')
      
      wrapper.unmount()
    })

    it('should hide tooltip on focusout when isInteractive is true', async () => {
      const wrapper = mount(FzTooltip, {
        props: { text: 'Tooltip text', isInteractive: true },
        slots: { default: '<button>Click me</button>' },
        attachTo: document.body
      })
      
      const triggerElement = wrapper.find('.fz__tooltip span')
      await triggerElement.trigger('focusin')
      await triggerElement.trigger('focusout')
      
      // Tooltip is teleported to body
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip?.getAttribute('aria-hidden')).toBe('true')
      
      wrapper.unmount()
    })
  })
})
