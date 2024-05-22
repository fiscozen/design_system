import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzTopbar } from '..'

describe.concurrent('FzTopbar', () => {
  it('matches default topbar snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches default topbar with button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default',
        style: 'button'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar with button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger',
        style: 'button'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches default topbar with icon-button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default',
        style: 'icon-button'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar with icon-button snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger',
        style: 'icon-button'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches default topbar with link snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'default',
        style: 'link'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger topbar with link snapshot', async ({ expect }) => {
    const wrapper = mount(FzTopbar, {
      props: {
        type: 'danger',
        style: 'link'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
