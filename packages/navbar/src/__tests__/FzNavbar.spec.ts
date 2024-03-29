import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzNavbar from '../FzNavbar.vue'

const navigation = `
  <div class="link">one</div>
  <div class="link">two</div>
  <div class="link">three</div>
`

const logo = `
<template #brand-logo="scope">
  <div id="brandlogo" :class="{'mobile': scope.isMobile, 'desktop': !scope.isMobile}"></div>
</template>
`
const avatar = '<div id="avatar"></div>'
const notifications = '<div id="notification"></div>'

describe('FzNavbar', () => {
  it('should match snapshot in horizontal layout large screen', () => {
    window.innerWidth = 1280
    const wrapper = mount(FzNavbar, {
      props: {
        variant: 'horizontal'
      },
      slots: {
        navigation,
        notifications,
        'user-menu': avatar,
        'brand-logo': logo
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should match snapshot in horizontal layout small screen', () => {
    window.innerWidth = 1024
    const wrapper = mount(FzNavbar, {
      props: {
        variant: 'horizontal'
      },
      slots: {
        navigation,
        notifications,
        'user-menu': avatar,
        'brand-logo': logo
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should match snapshot in vertical layout large screen', () => {
    window.innerWidth = 1280
    const wrapper = mount(FzNavbar, {
      props: {
        variant: 'vertical'
      },
      slots: {
        navigation,
        notifications,
        'user-menu': avatar,
        'brand-logo': logo
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should match snapshot in vertical layout small screen', () => {
    window.innerWidth = 1024
    const wrapper = mount(FzNavbar, {
      props: {
        variant: 'vertical'
      },
      slots: {
        navigation,
        notifications,
        'user-menu': avatar,
        'brand-logo': logo
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
