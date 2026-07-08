import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayoutHeader, FzLayoutAside, FzLayoutFooter } from '..'

// The three thin semantic region wrappers share one shape: render a landmark
// element + a stable class hook, forward attrs, hold no state.
const regions = [
  {
    name: 'FzLayoutHeader',
    Cmp: FzLayoutHeader,
    tag: 'header',
    cls: 'fz-layout-header'
  },
  {
    name: 'FzLayoutAside',
    Cmp: FzLayoutAside,
    tag: 'aside',
    cls: 'fz-layout-aside'
  },
  {
    name: 'FzLayoutFooter',
    Cmp: FzLayoutFooter,
    tag: 'footer',
    cls: 'fz-layout-footer'
  }
] as const

describe.each(regions)('$name', ({ Cmp, tag, cls }) => {
  it(`renders a <${tag}> landmark by default`, () => {
    const wrapper = mount(Cmp, { slots: { default: 'content' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe(tag)
    expect(wrapper.classes()).toContain(cls)
  })

  it('renders the default slot content', () => {
    const wrapper = mount(Cmp, {
      slots: { default: '<span class="child">hi</span>' }
    })
    const child = wrapper.find('.child')
    expect(child.exists()).toBe(true)
    expect(child.text()).toBe('hi')
  })

  it('renders as the tag given by `as`', () => {
    const wrapper = mount(Cmp, {
      props: { as: 'div' },
      slots: { default: 'content' }
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain(cls)
  })

  it('forwards attributes onto the region element', () => {
    const wrapper = mount(Cmp, {
      attrs: { 'aria-label': 'region', 'data-x': '1' },
      slots: { default: 'content' }
    })
    expect(wrapper.attributes('aria-label')).toBe('region')
    expect(wrapper.attributes('data-x')).toBe('1')
  })

  it('emits no events (presentational component)', () => {
    const wrapper = mount(Cmp, { slots: { default: 'x' } })
    expect(wrapper.emitted()).toEqual({})
  })
})
