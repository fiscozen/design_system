import { beforeEach, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzDropdown, FzIconDropdown } from '..'
import { FzIconButton } from '@fiscozen/button'

describe.concurrent('FzDropdown', () => {
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

  it('matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzIconDropdown, {
      props: {
        actionsLabel: 'This is the items label',
        actions: [
          {
            label: 'Item #1',
            disabled: true,
            type: 'button'
          },
          {
            label: 'Item #2',
            type: 'button'
          }
        ]
      },
      slots: {
        default: 'This is a dropdown'
      }
    })

    await wrapper.vm.$nextTick()

    const iconButton = wrapper.findComponent(FzIconButton)
    expect(iconButton.exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()

    iconButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
