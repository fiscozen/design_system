import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzNavbar from '../FzNavbar.vue'

describe('FzNavbar', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzNavbar, {})

    expect(wrapper.html()).toMatchSnapshot()
  })
})
