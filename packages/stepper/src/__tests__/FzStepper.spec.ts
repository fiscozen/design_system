import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzStepper } from '..'

describe.concurrent('FzStepper', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzStepper, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
