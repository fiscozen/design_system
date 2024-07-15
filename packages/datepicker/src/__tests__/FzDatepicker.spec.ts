import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzDatepicker } from '..'

describe.concurrent('FzDatepicker', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzDatepicker, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
