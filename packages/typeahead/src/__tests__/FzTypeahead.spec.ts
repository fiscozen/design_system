import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzTypeahead } from '..'

describe.concurrent('FzTypeahead', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(FzTypeahead, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
