import { describe, it } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import FzCollapse from '../FzCollapse.vue'

describe.concurrent('FzCollapse', () => {
  it('should match snapshot', ({ expect }) => {
    const wrapper = mount(FzCollapse, {
      props: {
        summary: 'this is a test summary',
        content: 'this is test content',
        open: true
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
  it('should open when the summary is clicked', async ({ expect }) => {
    const wrapper = mount(FzCollapse, {
      props: {
        summary: 'this is a test summary',
        content: 'this is test content',
        isOpen: false
      },
      attachTo: document.body
    })

    expect(wrapper.find('[data-e2e=content]').isVisible()).toBe(false)
    await wrapper.find('[data-e2e=details]').trigger('toggle')
    expect(wrapper.find('[data-e2e=content]').isVisible()).toBe(true)
  })
})
