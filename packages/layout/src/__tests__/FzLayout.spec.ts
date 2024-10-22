import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayout } from '..'

describe.concurrent('FzLayout', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
