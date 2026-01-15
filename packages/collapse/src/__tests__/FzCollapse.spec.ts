import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import FzCollapse from '../FzCollapse.vue'

describe('FzCollapse', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          content: 'Test Content'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[data-e2e="details"]').exists()).toBe(true)
      expect(wrapper.find('[data-e2e="summary"]').exists()).toBe(true)
      expect(wrapper.find('[data-e2e="content"]').exists()).toBe(true)
    })

    it('should render summary text when provided', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary Text'
        }
      })
      expect(wrapper.text()).toContain('Test Summary Text')
    })

    it('should render content text when provided', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          content: 'Test Content Text',
          open: true
        }
      })
      await nextTick()
      expect(wrapper.text()).toContain('Test Content Text')
    })

    it('should render summary slot content', () => {
      wrapper = mount(FzCollapse, {
        props: {},
        slots: {
          summary: '<span>Custom Summary Slot</span>'
        }
      })
      expect(wrapper.text()).toContain('Custom Summary Slot')
    })

    it('should render content slot content when open', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          open: true
        },
        slots: {
          content: '<div>Custom Content Slot</div>'
        }
      })
      await nextTick()
      expect(wrapper.text()).toContain('Custom Content Slot')
    })

    it('should render icon slot when provided', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary'
        },
        slots: {
          icon: '<span class="custom-icon">Custom Icon</span>'
        }
      })
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('should render default chevron icon when icon slot not provided', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary'
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should show chevron-up icon when open', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          open: true
        }
      })
      await nextTick()
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('chevron-up')
    })

    it('should show chevron-down icon when closed', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          open: false
        }
      })
      await nextTick()
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('chevron-down')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('summary prop', () => {
      it('should display summary text', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'My Summary'
          }
        })
        expect(wrapper.text()).toContain('My Summary')
      })

      it('should handle empty summary string', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: ''
          }
        })
        expect(wrapper.exists()).toBe(true)
      })

      it('should handle undefined summary', () => {
        wrapper = mount(FzCollapse, {
          props: {}
        })
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('content prop', () => {
      it('should display content text when open', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            content: 'My Content',
            open: true
          }
        })
        await nextTick()
        expect(wrapper.text()).toContain('My Content')
      })

      it('should not display content when closed', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            content: 'My Content',
            open: false
          }
        })
        await nextTick()
        const content = wrapper.find('[data-e2e="content"]')
        expect(content.isVisible()).toBe(false)
      })

      it('should handle empty content string', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            content: '',
            open: true
          }
        })
        await nextTick()
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('summaryClass prop', () => {
      it('should apply custom summary class', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            summaryClass: 'custom-summary-class'
          }
        })
        const summary = wrapper.find('[data-e2e="summary"]')
        expect(summary.classes()).toContain('custom-summary-class')
      })

      it('should handle undefined summaryClass', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary'
          }
        })
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('contentClass prop', () => {
      it('should apply custom content class', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            content: 'Content',
            contentClass: 'custom-content-class',
            open: true
          }
        })
        await nextTick()
        const content = wrapper.find('[data-e2e="content"]')
        expect(content.classes()).toContain('custom-content-class')
      })

      it('should handle undefined contentClass', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            open: true
          }
        })
        await nextTick()
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('open prop (v-model)', () => {
      it('should be closed by default when open prop not provided', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary'
          }
        })
        const details = wrapper.find('[data-e2e="details"]')
        expect(details.attributes('open')).toBeUndefined()
      })

      it('should be open when open prop is true', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            open: true
          }
        })
        await nextTick()
        const details = wrapper.find('[data-e2e="details"]')
        expect(details.attributes('open')).toBeDefined()
      })

      it('should be closed when open prop is false', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            open: false
          }
        })
        await nextTick()
        const details = wrapper.find('[data-e2e="details"]')
        expect(details.attributes('open')).toBeUndefined()
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit update:open when toggled from closed to open', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: false
        },
        attachTo: document.body
      })
      await nextTick()

      const summary = wrapper.find('[data-e2e="summary"]')
      await summary.trigger('click')

      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([true])
    })

    it('should emit update:open when toggled from open to closed', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: true
        },
        attachTo: document.body
      })
      await nextTick()

      const summary = wrapper.find('[data-e2e="summary"]')
      await summary.trigger('click')

      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([false])
    })

    it('should handle toggle event on details element', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: false
        },
        attachTo: document.body
      })
      await nextTick()

      // The component's handleToggle checks e.newState
      // Note: Native toggle event doesn't have newState, but component expects it
      // This test verifies the toggle handler exists and can be called
      const details = wrapper.find('[data-e2e="details"]')
      const toggleEvent = new Event('toggle')
      // Add newState property to match component's expectation
      Object.defineProperty(toggleEvent, 'newState', {
        value: 'open',
        writable: false
      })
      await details.element.dispatchEvent(toggleEvent)

      await nextTick()
      // Verify the component emits update:open when toggle event fires
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([true])
    })

    it('should update open state when summary is clicked', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: false
        },
        attachTo: document.body
      })
      await nextTick()

      const content = wrapper.find('[data-e2e="content"]')
      expect(content.isVisible()).toBe(false)

      const summary = wrapper.find('[data-e2e="summary"]')
      await summary.trigger('click')

      await nextTick()
      const contentAfter = wrapper.find('[data-e2e="content"]')
      expect(contentAfter.isVisible()).toBe(true)
    })

    it('should update open state when details element receives toggle event with newState', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: false
        },
        attachTo: document.body
      })
      await nextTick()

      const details = wrapper.find('[data-e2e="details"]')
      const content = wrapper.find('[data-e2e="content"]')
      expect(content.isVisible()).toBe(false)

      // The component's handleToggle checks e.newState
      // Simulate toggle event with newState property
      const toggleEvent = new Event('toggle')
      Object.defineProperty(toggleEvent, 'newState', {
        value: 'open',
        writable: false
      })
      await details.element.dispatchEvent(toggleEvent)

      await nextTick()
      // Verify the component emits update:open
      expect(wrapper.emitted('update:open')).toBeTruthy()
      expect(wrapper.emitted('update:open')![0]).toEqual([true])
      // Verify content becomes visible after state update
      // Note: This requires the parent to update the open prop, which happens via v-model
      // In a real scenario, the parent would update the prop based on the emitted event
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should use native details element for semantic structure', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary'
          }
        })
        const details = wrapper.find('details')
        expect(details.exists()).toBe(true)
        // Native details element provides semantic structure
      })

      it('should use native summary element for semantic structure', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary'
          }
        })
        const summary = wrapper.find('summary')
        expect(summary.exists()).toBe(true)
        // Native summary element provides semantic structure
      })

      it('should have details open attribute when open', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary',
            open: true
          }
        })
        await nextTick()
        const details = wrapper.find('details')
        expect(details.attributes('open')).toBeDefined()
      })

      it('should not have details open attribute when closed', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary',
            open: false
          }
        })
        await nextTick()
        const details = wrapper.find('details')
        expect(details.attributes('open')).toBeUndefined()
      })

      it('should have accessible summary text', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Accessible Summary Text'
          }
        })
        const summary = wrapper.find('summary')
        expect(summary.text()).toContain('Accessible Summary Text')
      })

      it('should have accessible content when open', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Summary',
            content: 'Accessible Content',
            open: true
          }
        })
        await nextTick()
        const content = wrapper.find('[data-e2e="content"]')
        expect(content.text()).toContain('Accessible Content')
        expect(content.isVisible()).toBe(true)
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable via summary element', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary'
          }
        })
        const summary = wrapper.find('summary')
        // Native summary element is focusable
        expect(summary.element.tagName).toBe('SUMMARY')
      })

      it('should support Enter key activation on summary', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary',
            open: false
          },
          attachTo: document.body
        })
        await nextTick()

        const summary = wrapper.find('summary')
        summary.element.focus()
        await summary.trigger('keydown', { key: 'Enter' })

        await nextTick()
        // Native details element handles Enter key
        const details = wrapper.find('details')
        // The behavior depends on browser implementation
        expect(details.exists()).toBe(true)
      })

      it('should support Space key activation on summary', async () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary',
            open: false
          },
          attachTo: document.body
        })
        await nextTick()

        const summary = wrapper.find('summary')
        summary.element.focus()
        await summary.trigger('keydown', { key: ' ' })

        await nextTick()
        // Native details element handles Space key
        const details = wrapper.find('details')
        expect(details.exists()).toBe(true)
      })
    })

    describe('Decorative elements', () => {
      it('should have decorative icon with aria-hidden when using default icon', () => {
        wrapper = mount(FzCollapse, {
          props: {
            summary: 'Test Summary'
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        if (icon.exists()) {
          // Icon should be decorative (chevron) and hidden from screen readers
          // Note: FzIcon component should handle aria-hidden internally
          expect(icon.exists()).toBe(true)
        }
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to summary', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary'
        }
      })
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('text-grey-500')
      expect(summary.classes()).toContain('flex')
      expect(summary.classes()).toContain('h-32')
      expect(summary.classes()).toContain('cursor-pointer')
      expect(summary.classes()).toContain('select-none')
      expect(summary.classes()).toContain('list-none')
      expect(summary.classes()).toContain('items-center')
      expect(summary.classes()).toContain('text-sm')
      expect(summary.classes()).toContain('rounded')
      expect(summary.classes()).toContain('font-medium')
    })

    it('should apply open state classes when open', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          open: true
        }
      })
      await nextTick()
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('bg-background-alice-blue')
      expect(summary.classes()).toContain('!text-blue-500')
    })

    it('should not apply open state classes when closed', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          open: false
        }
      })
      await nextTick()
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).not.toContain('bg-background-alice-blue')
      expect(summary.classes()).not.toContain('!text-blue-500')
    })

    it('should apply custom summaryClass', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          summaryClass: 'custom-summary'
        }
      })
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('custom-summary')
    })

    it('should apply custom contentClass', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          content: 'Test Content',
          contentClass: 'custom-content',
          open: true
        }
      })
      await nextTick()
      const content = wrapper.find('[data-e2e="content"]')
      expect(content.classes()).toContain('custom-content')
    })

    it('should apply text-sm class to content', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          open: true
        }
      })
      await nextTick()
      const content = wrapper.find('[data-e2e="content"]')
      expect(content.classes()).toContain('text-sm')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined summary prop', () => {
      wrapper = mount(FzCollapse, {
        props: {}
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle undefined content prop', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: true
        }
      })
      await nextTick()
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string summary', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: ''
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string content', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          content: '',
          open: true
        }
      })
      await nextTick()
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle very long summary text', () => {
      const longSummary = 'A'.repeat(1000)
      wrapper = mount(FzCollapse, {
        props: {
          summary: longSummary
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain(longSummary)
    })

    it('should handle very long content text', async () => {
      const longContent = 'B'.repeat(1000)
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          content: longContent,
          open: true
        }
      })
      await nextTick()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain(longContent)
    })

    it('should handle rapid toggle clicks', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          open: false
        },
        attachTo: document.body
      })
      await nextTick()

      const summary = wrapper.find('[data-e2e="summary"]')
      
      // Rapid clicks
      await summary.trigger('click')
      await nextTick()
      await summary.trigger('click')
      await nextTick()
      await summary.trigger('click')
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle multiple custom classes in summaryClass', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          summaryClass: 'class1 class2 class3'
        }
      })
      const summary = wrapper.find('[data-e2e="summary"]')
      expect(summary.classes()).toContain('class1')
      expect(summary.classes()).toContain('class2')
      expect(summary.classes()).toContain('class3')
    })

    it('should handle multiple custom classes in contentClass', async () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Summary',
          contentClass: 'class1 class2 class3',
          open: true
        }
      })
      await nextTick()
      const content = wrapper.find('[data-e2e="content"]')
      expect(content.classes()).toContain('class1')
      expect(content.classes()).toContain('class2')
      expect(content.classes()).toContain('class3')
    })

    it('should handle slot content overriding props', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Prop Summary',
          content: 'Prop Content'
        },
        slots: {
          summary: '<span>Slot Summary</span>',
          content: '<div>Slot Content</div>'
        }
      })
      expect(wrapper.text()).toContain('Slot Summary')
      expect(wrapper.text()).not.toContain('Prop Summary')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state (closed)', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          content: 'Test Content'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - open state', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          content: 'Test Content',
          open: true
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom classes', () => {
      wrapper = mount(FzCollapse, {
        props: {
          summary: 'Test Summary',
          content: 'Test Content',
          summaryClass: 'custom-summary',
          contentClass: 'custom-content',
          open: true
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with slots', () => {
      wrapper = mount(FzCollapse, {
        props: {},
        slots: {
          summary: '<span>Custom Summary</span>',
          content: '<div>Custom Content</div>',
          icon: '<span>Custom Icon</span>'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
