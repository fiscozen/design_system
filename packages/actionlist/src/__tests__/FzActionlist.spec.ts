import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FzActionlist from '../FzActionlist.vue'

describe('FzActionlist', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzActionlist, {
      props: {
        label: 'This is a label',
        items: [
          {
            label: 'Item #1',
            disabled: true,
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            label: 'Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          }
        ]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
