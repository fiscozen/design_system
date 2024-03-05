import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzButton from '../FzIconButton.vue'

describe('FzButton', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzButton, { 
      props: { 
        tooltip: 'some text',
        disabled: false,
        iconName: 'bell',
      } 
    })

    expect(wrapper).toMatchSnapshot();
  })
  it('should emit native event', () => {
    const wrapper = mount(FzButton, { 
      props: { 
        tooltip: 'some text',
        disabled: false,
        iconName: 'bell',
      } 
    })
    wrapper.trigger('click')

    const clickEvs = wrapper.emitted('click')
    expect(clickEvs).toHaveLength(1)
  })
})
