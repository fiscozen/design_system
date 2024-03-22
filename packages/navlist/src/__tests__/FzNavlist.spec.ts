import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzNavlist from '../FzNavlist.vue'
const sections = [
  {
    label: 'Label 1',
    items: [
      {
        label: 'Item #1',
        meta: {
          path: '/foo',
          name: 'foo'
        }
      },
      {
        summary: 'Item #2',
        subitems: [
          {
            label: 'Sub-Item #1',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            label: 'Sub-Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          }
        ]
      }
    ]
  },
  {
    label: 'Label 2',
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
]
describe('FzNavlist', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzNavlist, {
      props: {
        sections
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
