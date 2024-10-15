import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzNavlist from '../FzNavlist.vue'
import { FzNavlistSection } from '../types'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: 'foo', path: '/foo', component: () => {} }]
})

const sections: FzNavlistSection[] = [
  {
    label: 'Label 1',
    items: [
      {
        label: 'Item #1',
        meta: {
          path: '/foo',
          name: 'foo'
        },
        type: 'link'
      },
      {
        summary: 'Item #2',
        subitems: [
          {
            label: 'Sub-Item #1',
            meta: {
              path: '/foo',
              name: 'foo'
            },
            type: 'link'
          },
          {
            label: 'Sub-Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            },
            type: 'link'
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
        },
        type: 'link'
      },
      {
        label: 'Item #2',
        meta: {
          path: '/foo',
          name: 'foo'
        },
        type: 'link'
      }
    ]
  },
  {
    label: 'Label 3',
    items: [
      {
        label: 'Item #1',
        disabled: true,
        type: 'button'
      },
      {
        label: 'Item #2',
        type: 'button'
      }
    ]
  }
]

describe('FzNavlist', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzNavlist, {
      props: {
        sections
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})