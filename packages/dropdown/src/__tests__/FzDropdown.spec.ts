import { beforeEach, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzDropdown } from '..'

describe.concurrent('FzTopbar', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = mockIntersectionObserver
  })
  
  it('matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzDropdown, {
      props: {
        actionsLabel: 'This is the items label',
        actions: [
          {
            label: 'Item #1',
            disabled: true,
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            label: 'Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          }
        ]
      },
      slots: {
        default: 'This is a dropdown'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
