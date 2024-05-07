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
})
