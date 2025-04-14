import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzButton from '../FzButton.vue'

describe('FzButton', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzButton, {
      props: {
        label: 'some text',
        disabled: false,
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with icon', () => {
    const wrapper = mount(FzButton, {
      props: {
        tooltip: 'some text',
        disabled: false,
        iconName: 'bell',
        label: 'some label',
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should emit native event', () => {
    const wrapper = mount(FzButton, {
      props: {
        tooltip: 'some text',
        disabled: false
      }
    })
    wrapper.trigger('click')

    const clickEvs = wrapper.emitted('click')
    expect(clickEvs).toHaveLength(1)
  })
  it('should not emit click when disabled', () => {
    const wrapper = mount(FzButton, {
      props: {
        tooltip: 'some text',
        disabled: true
      }
    })
    wrapper.trigger('click')

    const clickEvs = wrapper.emitted('click')
    // in questo caso emitted ritorna undefined e non un array vuoto
    expect(clickEvs).toBeUndefined()
  })
})
