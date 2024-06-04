// FzButtonGroup.spec.ts

import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import FzButtonGroup from '../FzButtonGroup.vue'

describe('FzButtonGroup', () => {
  it('renders correctly', () => {
    const wrapper = mount(FzButtonGroup, {
      props: {
        gap: true,
        size: 'md'
      },
      slots: {
        default: '<button>Button 1</button><button>Button 2</button>'
      }
    })
    expect(wrapper.html()).to.include('Button 1')
    expect(wrapper.html()).to.include('Button 2')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('applies correct gap class based on size prop', () => {
    const wrapper = mount(FzButtonGroup, {
      props: {
        gap: true,
        size: 'md'
      }
    })
    expect(wrapper.classes()).to.include('gap-12')
  })

  it('does not apply gap class when gap prop is false', () => {
    const wrapper = mount(FzButtonGroup, {
      props: {
        gap: false,
        size: 'md'
      }
    })
    expect(wrapper.classes()).to.include('gap-disabled')
  })

  it("applies 'vertical' class when horizontal prop is false", () => {
    const wrapper = mount(FzButtonGroup, {
      props: {
        gap: false,
        size: 'md',
        horizontal: false
      }
    })
    expect(wrapper.classes()).to.include('flex-col')
  })
})
