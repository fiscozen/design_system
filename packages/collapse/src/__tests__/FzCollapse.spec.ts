import { describe, it, expect } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import FzCollapse from '../FzCollapse.vue'

describe('FzCollapse', () => {
  it('should match snapshot', () => {
    const wrapper = mount(FzCollapse, {
      props: {
        summary: 'this is a test summary',
        content: 'this is test content',
        open: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should open when the summary is clicked', async () => {
    const wrapper = mount(FzCollapse, {
      props: {
        summary: 'this is a test summary',
        content: 'this is test content',
        open: false
      }
    })

    await wrapper.find('[data-e2e-summary]').trigger('click')
    expect(wrapper.find('[data-e2e-content]').isVisible()).toBe(true)
  })
})
