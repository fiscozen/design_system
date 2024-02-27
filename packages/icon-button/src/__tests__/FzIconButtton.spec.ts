import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzButton from '../FzIconButton.vue'

describe('FzButton', () => {
  it('renders properly', () => {
    const wrapper = mount(FzButton, { props: { label: 'some text' } })
    expect(wrapper.text()).toContain('some text')
  })

  it('emits 1 when clicked', () => {
    const wrapper = mount(FzButton, { props: { label: 'some text' } })
    wrapper.trigger('click')

    const clickEvs = wrapper.emitted('click')
    expect(clickEvs).toHaveLength(1)
    expect((clickEvs as any[])[0]).toEqual([1])
  })
})
