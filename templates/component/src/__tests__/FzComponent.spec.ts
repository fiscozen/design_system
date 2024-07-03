import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Fz{{pascalCase component}} } from '..'

describe.concurrent('Fz{{pascalCase component}}', () => {
  it('matches snaphost', async ({ expect }) => {
    const wrapper = mount(Fz{{pascalCase component}}, {
      props: {},
      slots: {}
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
