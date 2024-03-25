import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzAvatar } from '..'

describe.concurrent('FzAvatar', () => {
  it('image matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi',
        src: 'https://example.com',
        size: 'xl'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('placeholder matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render image source prop', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi',
        src: 'https://example.com'
      }
    })

    expect(wrapper.html()).toContain('https://example.com')
  })

  it('should render placeholder initials', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi'
      }
    })

    expect(wrapper.html()).toContain('MR')
  })

  it('should render size', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi',
        src: 'https://example.com',
        size: 'xl'
      },
      attachTo: document.body
    })

    expect(wrapper.find('img').classes()).toContain('size-40')
  })
})
