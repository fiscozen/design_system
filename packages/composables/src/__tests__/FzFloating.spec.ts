import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzFloating from '../FzFloating.vue'

describe('FzFloating', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzFloating, {
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
