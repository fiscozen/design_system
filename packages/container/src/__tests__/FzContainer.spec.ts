import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzContainer } from '..'

describe.concurrent('FzContainer', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzContainer, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
