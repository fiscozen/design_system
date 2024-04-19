import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzNavlink from '../FzNavlink.vue'

describe('FzNavlink', () => {
  it('should render correctly with label', () => {
    const wrapper = mount(FzNavlink, {
      props: {
        label: 'this is a test label',
        iconName: 'bell'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.setProps({ disabled: true })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render correctly if icon only', () => {
    const wrapper = mount(FzNavlink, {
      props: {
        iconName: 'bell'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    wrapper.setProps({ disabled: true })
    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.find('span').text()).to.be.empty
  })

  it('should emit native event', () => {
    const wrapper = mount(FzNavlink, {
      props: {
        label: 'this is a test label'
      }
    })
    wrapper.trigger('click')

    const clickEvs = wrapper.emitted('click')
    expect(clickEvs).toHaveLength(1)
  })
  it('should not emit click when disabled', () => {
    const wrapper = mount(FzNavlink, {
      props: {
        label: 'this is a test label',
        disabled: true
      }
    })
    wrapper.trigger('click')

    const clickEvs = wrapper.emitted('click')
    expect(clickEvs).toBeUndefined()
  })
})
