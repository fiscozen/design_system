import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
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
})
