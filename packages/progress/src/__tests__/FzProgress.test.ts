import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FzProgress from '../FzProgress.vue'

describe('FzProgress', () => {
  it('renders correctly', () => {
    const wrapper = mount(FzProgress, {
      props: {},
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders with default spinner icon', () => {
    const wrapper = mount(FzProgress, {
      props: {},
    })

    const icon = wrapper.findComponent({ name: 'FzIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe('spinner-third')
    expect(icon.props('variant')).toBe('fas')
    expect(icon.props('spin')).toBe(true)
  })

  it('passes props to FzIcon', () => {
    const wrapper = mount(FzProgress, {
      props: {
        size: 'lg',
        name: 'spinner',
      },
    })

    const icon = wrapper.findComponent({ name: 'FzIcon' })
    expect(icon.props('size')).toBe('lg')
    expect(icon.props('name')).toBe('spinner')
  })

  it('applies custom animation styles', () => {
    const wrapper = mount(FzProgress, {
      props: {},
    })

    const html = wrapper.html()
    expect(html).toContain('--fa-animation-duration: 0.86s')
    expect(html).toContain('--fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85)')
  })
})

