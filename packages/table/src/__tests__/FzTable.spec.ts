import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzTable } from '..'

describe.concurrent('FzTable', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzTable, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
