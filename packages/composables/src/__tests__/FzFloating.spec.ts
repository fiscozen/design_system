import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FzFloating from '../FzFloating.vue'
import { FzFloatingPosition } from '../types'

const positions: FzFloatingPosition[] = [
  'top',
  'top-start',
  'top-end',
  'left',
  'left-start',
  'left-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'right',
  'right-start',
  'right-end'
]
beforeEach(() => {
  const mockIntersectionObserver = vi.fn().mockImplementation(function (this: any) {
    this.observe = () => null
    this.unobserve = () => null
    this.disconnect = () => null
  })
  window.IntersectionObserver = mockIntersectionObserver

  // Mock matchMedia for useMediaQuery composable
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})
describe('FzFloating', () => {
  positions.forEach((pos) => {
    it('should match snapshot', async () => {
      const wrapper = mount(FzFloating, {
        props: {
          position: pos,
          isOpen: true
        },
        slots: {
          opener: '<button @click="params.floating.setPosition()">opener</button>',
          default: '<div>content</div>'
        }
      })

      wrapper.find('button').trigger('click')
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('content width on the smallest screens', () => {
    const setViewportMatchesXs = (matches: boolean) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn()
        }))
      })
    }

    // Mounts closed, stubs the opener width, then opens so the width assignment runs.
    const openWithOpenerWidth = async (openerWidth: number) => {
      const wrapper = mount(FzFloating, {
        props: { position: 'bottom', isOpen: false },
        slots: {
          opener: '<button>opener</button>',
          default: '<div>content</div>'
        },
        attachTo: document.body
      })

      const openerEl = wrapper.find('button').element.parentElement!
      openerEl.getBoundingClientRect = () =>
        ({ width: openerWidth, height: 44, top: 0, left: 0, right: openerWidth, bottom: 44 }) as DOMRect

      await wrapper.setProps({ isOpen: true })
      await nextTick()

      return wrapper.find('.fz__floating__content').element as HTMLElement
    }

    it('does not pin the panel to a narrow (icon-button) opener', async () => {
      setViewportMatchesXs(true)

      const content = await openWithOpenerWidth(44)

      // Pinning the width to a 44px icon button collapses the panel: its content keeps
      // painting at its intrinsic width, outside the box and off screen, where the
      // viewport clamp in useFloating cannot see it (HD-25388 / LIB-2809).
      expect(content.style.width).toBe('auto')
      expect(content.style.minWidth).toBe('44px')
    })

    it('still covers a full-width opener', async () => {
      setViewportMatchesXs(true)

      const content = await openWithOpenerWidth(360)

      expect(content.style.minWidth).toBe('360px')
    })

    it('does not constrain the panel above the xs breakpoint', async () => {
      setViewportMatchesXs(false)

      const content = await openWithOpenerWidth(44)

      expect(content.style.width).toBe('auto')
      expect(content.style.minWidth).toBe('')
    })
  })
})
