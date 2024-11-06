import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzProgress } from '..'

describe.concurrent('FzProgress', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzProgress, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
