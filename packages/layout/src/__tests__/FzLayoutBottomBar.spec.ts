import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayoutBottomBar } from '..'

describe('FzLayoutBottomBar', () => {
  it('renders the default slot content inside the region root', () => {
    const wrapper = mount(FzLayoutBottomBar, {
      slots: { default: '<button class="action">Salva</button>' }
    })
    const root = wrapper.find('.fz-layout-bottom-bar')
    expect(root.exists()).toBe(true)
    expect(root.find('button.action').text()).toBe('Salva')
  })

  it('exposes its root element so the template can use it as a teleport target', () => {
    const wrapper = mount(FzLayoutBottomBar, { slots: { default: 'x' } })
    // `el` is exposed via defineExpose and populated on mount.
    expect((wrapper.vm as unknown as { el: HTMLElement | null }).el).toBe(wrapper.element)
  })

  it('collapses to an empty region when no content is provided', () => {
    const wrapper = mount(FzLayoutBottomBar)
    expect(wrapper.find('.fz-layout-bottom-bar').exists()).toBe(true)
    expect(wrapper.find('.fz-layout-bottom-bar').element.childElementCount).toBe(0)
  })

  it('emits no events (presentational component)', () => {
    const wrapper = mount(FzLayoutBottomBar, { slots: { default: 'x' } })
    expect(wrapper.emitted()).toEqual({})
  })
})
