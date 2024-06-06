import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzTopbar } from '..'

describe.concurrent('FzTopbar', () => {
  vi.mock('@fiscozen/composables', () => ({
    useBreakpoints: vi.fn().mockReturnValue({
      isGreater: vi.fn().mockReturnValue(false)
    })
  }))

  it('matches default topbar snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches default topbar with button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default',
        style: 'button'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar with button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger',
        style: 'button'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches default topbar with icon-button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default',
        style: 'icon-button'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar with icon-button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger',
        style: 'icon-button'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches default topbar with link snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default',
        style: 'link'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar with link snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger',
        style: 'link'
      },
      slots: {
        default: 'This is a Topbar'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
