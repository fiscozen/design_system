import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FzLink from '../FzLink.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: '', path: '/example', component: () => {} }]
})

describe.concurrent('FzLink', () => {
  it('image matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzLink, {
      props: {
        to: '/example'
      },
      slots: {
        default: 'This is a link'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render link when not disabled', async ({ expect }) => {
    const wrapper = mount(FzLink, {
      props: {
        to: '/example'
      },
      slots: {
        default: 'This is a link'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('should render span when disabled', async ({ expect }) => {
    const wrapper = mount(FzLink, {
      props: {
        to: '/example',
        disabled: true
      },
      slots: {
        default: 'This is a link'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('should render link href', async ({ expect }) => {
    const wrapper = mount(FzLink, {
      props: {
        to: '/example'
      },
      slots: {
        default: 'This is a link'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('a').attributes('href')).toBe('/example')
  })

  it('should render text content', async ({ expect }) => {
    const wrapper = mount(FzLink, {
      props: {
        to: '/example'
      },
      slots: {
        default: 'This is a link'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toContain('This is a link')
  })

  it('should render size', async ({ expect }) => {
    const wrapper = mount(FzLink, {
      props: {
        size: 'md',
        to: '/example'
      },
      slots: {
        default: 'This is a link'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('a').classes()).toContain('text-md')
  })
})
