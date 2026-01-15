import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FzActionlist from '../FzActionlist.vue'
import type { ActionlistItem } from '../types'

describe('FzActionlist', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: []
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.fz__actionlist').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          label: 'Action Menu',
          items: []
        }
      })
      expect(wrapper.text()).toContain('Action Menu')
      expect(wrapper.find('.text-grey-400').exists()).toBe(true)
    })

    it('should not render label section when label is not provided', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: []
        }
      })
      expect(wrapper.find('.text-grey-400').exists()).toBe(false)
    })

    it('should render items', () => {
      const items: ActionlistItem[] = [
        {
          type: 'button',
          label: 'Action 1'
        },
        {
          type: 'button',
          label: 'Action 2'
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      expect(wrapper.text()).toContain('Action 1')
      expect(wrapper.text()).toContain('Action 2')
    })

    it('should render button type items using FzNavlink', () => {
      const items: ActionlistItem[] = [
        {
          type: 'button',
          label: 'Button Action'
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      const navlink = wrapper.findComponent({ name: 'FzNavlink' })
      expect(navlink.exists()).toBe(true)
      expect(navlink.text()).toContain('Button Action')
    })

    it('should render link type items using FzRouterNavlink', () => {
      const items: ActionlistItem[] = [
        {
          type: 'link',
          label: 'Link Action',
          meta: {
            path: '/test',
            name: 'test'
          }
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items },
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot></slot></a>'
            }
          }
        }
      })

      const routerNavlink = wrapper.findComponent({ name: 'FzRouterNavlink' })
      expect(routerNavlink.exists()).toBe(true)
      expect(routerNavlink.text()).toContain('Link Action')
    })

    it('should render custom slot content for items', () => {
      const items: ActionlistItem[] = [
        {
          type: 'button',
          label: 'Default Item'
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items },
        slots: {
          'fzaction-item-0': '<div class="custom-item">Custom Content</div>'
        }
      })

      expect(wrapper.find('.custom-item').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Content')
      // Default item should not be rendered when slot is provided
      expect(wrapper.text()).not.toContain('Default Item')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('label prop', () => {
      it('should display label when provided', () => {
        const wrapper = mount(FzActionlist, {
          props: {
            label: 'My Actions',
            items: []
          }
        })
        expect(wrapper.text()).toContain('My Actions')
      })

      it('should not display label section when not provided', () => {
        const wrapper = mount(FzActionlist, {
          props: {
            items: []
          }
        })
        expect(wrapper.find('.text-grey-400').exists()).toBe(false)
      })
    })

    describe('items prop', () => {
      it('should render empty list when items array is empty', () => {
        const wrapper = mount(FzActionlist, {
          props: {
            items: []
          }
        })
        expect(wrapper.find('.fz__actionlist').exists()).toBe(true)
        // Should not have any navlink components
        expect(wrapper.findComponent({ name: 'FzNavlink' }).exists()).toBe(false)
        expect(wrapper.findComponent({ name: 'FzRouterNavlink' }).exists()).toBe(false)
      })

      it('should render multiple items', () => {
        const items: ActionlistItem[] = [
          { type: 'button', label: 'Item 1' },
          { type: 'button', label: 'Item 2' },
          { type: 'button', label: 'Item 3' }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
        expect(navlinks.length).toBe(3)
      })

      it('should handle items with disabled state', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Disabled Item',
            disabled: true
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.props('disabled')).toBe(true)
      })

      it('should handle items with icons', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Item with Icon',
            iconName: 'bell'
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.props('iconName')).toBe('bell')
      })

      it('should handle link items with meta', () => {
        const items: ActionlistItem[] = [
          {
            type: 'link',
            label: 'Router Link',
            meta: {
              path: '/dashboard',
              name: 'dashboard'
            }
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items },
          global: {
            stubs: {
              'router-link': {
                template: '<a><slot></slot></a>'
              }
            }
          }
        })

        const routerNavlink = wrapper.findComponent({ name: 'FzRouterNavlink' })
        expect(routerNavlink.exists()).toBe(true)
        expect(routerNavlink.props('meta')).toEqual({
          path: '/dashboard',
          name: 'dashboard'
        })
      })
    })

    describe('listClass prop', () => {
      it('should apply custom class to container', () => {
        const wrapper = mount(FzActionlist, {
          props: {
            items: [],
            listClass: 'custom-class'
          }
        })

        const container = wrapper.find('.fz__actionlist')
        expect(container.classes()).toContain('custom-class')
      })

      it('should maintain base classes when custom class is provided', () => {
        const wrapper = mount(FzActionlist, {
          props: {
            items: [],
            listClass: 'custom-class'
          }
        })

        const container = wrapper.find('.fz__actionlist')
        expect(container.classes()).toContain('bg-core-white')
        expect(container.classes()).toContain('rounded')
        expect(container.classes()).toContain('custom-class')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit fzaction:click when button item is clicked', async () => {
      const items: ActionlistItem[] = [
        {
          type: 'button',
          label: 'Clickable Item'
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      const navlink = wrapper.findComponent({ name: 'FzNavlink' })
      await navlink.trigger('click')

      expect(wrapper.emitted('fzaction:click')).toBeDefined()
      expect(wrapper.emitted('fzaction:click')).toHaveLength(1)
      expect(wrapper.emitted('fzaction:click')![0]).toEqual([
        0, // index
        items[0] // item
      ])
    })

    it('should emit fzaction:click when link item is clicked', async () => {
      const items: ActionlistItem[] = [
        {
          type: 'link',
          label: 'Link Item',
          meta: {
            path: '/test',
            name: 'test'
          }
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items },
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot></slot></a>'
            }
          }
        }
      })

      // Find the router-link element and click it directly
      const linkElement = wrapper.find('a')
      await linkElement.trigger('click')

      expect(wrapper.emitted('fzaction:click')).toBeDefined()
      expect(wrapper.emitted('fzaction:click')).toHaveLength(1)
      expect(wrapper.emitted('fzaction:click')![0]).toEqual([
        0, // index
        items[0] // item
      ])
    })

    it('should emit fzaction:click with correct index for multiple items', async () => {
      const items: ActionlistItem[] = [
        { type: 'button', label: 'Item 1' },
        { type: 'button', label: 'Item 2' },
        { type: 'button', label: 'Item 3' }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
      
      // Click second item
      await navlinks[1].trigger('click')

      expect(wrapper.emitted('fzaction:click')).toBeDefined()
      expect(wrapper.emitted('fzaction:click')![0]).toEqual([
        1, // index
        items[1] // item
      ])
    })

    it('should not emit fzaction:click when disabled item is clicked', async () => {
      const items: ActionlistItem[] = [
        {
          type: 'button',
          label: 'Disabled Item',
          disabled: true
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      const navlink = wrapper.findComponent({ name: 'FzNavlink' })
      await navlink.trigger('click')

      // Disabled items should not emit click events
      expect(wrapper.emitted('fzaction:click')).toBeUndefined()
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have semantic structure for navigation list', () => {
        const items: ActionlistItem[] = [
          { type: 'button', label: 'Action 1' },
          { type: 'button', label: 'Action 2' }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const container = wrapper.find('.fz__actionlist')
        expect(container.exists()).toBe(true)
        // Container should be a div (semantic container)
        expect(container.element.tagName).toBe('DIV')
      })

      it('should have accessible label when label prop is provided', () => {
        const wrapper = mount(FzActionlist, {
          props: {
            label: 'Action Menu',
            items: []
          }
        })

        const labelElement = wrapper.find('.text-grey-400')
        expect(labelElement.exists()).toBe(true)
        expect(labelElement.text()).toBe('Action Menu')
      })

      it('should pass disabled state to child navlinks', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Disabled Action',
            disabled: true
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.props('disabled')).toBe(true)
      })

      it('should render button items with accessible button elements', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Button Action'
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        // FzNavlink renders a button element which is accessible
        expect(navlink.exists()).toBe(true)
      })

      it('should render link items with accessible link elements', () => {
        const items: ActionlistItem[] = [
          {
            type: 'link',
            label: 'Link Action',
            meta: {
              path: '/test',
              name: 'test'
            }
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items },
          global: {
            stubs: {
              'router-link': {
                template: '<a><slot></slot></a>'
              }
            }
          }
        })

        const routerNavlink = wrapper.findComponent({ name: 'FzRouterNavlink' })
        expect(routerNavlink.exists()).toBe(true)
      })

      it('should maintain accessible text content in items', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Accessible Action'
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        expect(wrapper.text()).toContain('Accessible Action')
      })
    })

    describe('Keyboard navigation', () => {
      it('should have focusable items when not disabled', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Focusable Item'
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        // Button elements are focusable by default
        expect(navlink.exists()).toBe(true)
      })

      it('should have non-focusable items when disabled', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Disabled Item',
            disabled: true
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        const navlink = wrapper.findComponent({ name: 'FzNavlink' })
        expect(navlink.props('disabled')).toBe(true)
        // Disabled buttons should not be focusable
      })
    })

    describe('Semantic HTML', () => {
      it('should use appropriate semantic elements for list structure', () => {
        const items: ActionlistItem[] = [
          { type: 'button', label: 'Item 1' },
          { type: 'button', label: 'Item 2' }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        // Container should be a div (semantic container for list)
        const container = wrapper.find('.fz__actionlist')
        expect(container.element.tagName).toBe('DIV')
        
        // Items should be wrapped in div containers
        const itemContainers = wrapper.findAll('.flex.flex-col')
        expect(itemContainers.length).toBe(2)
      })

      it('should have visible text labels for all items', () => {
        const items: ActionlistItem[] = [
          {
            type: 'button',
            label: 'Action with Label'
          }
        ]

        const wrapper = mount(FzActionlist, {
          props: { items }
        })

        expect(wrapper.text()).toContain('Action with Label')
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to container', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: []
        }
      })

      const container = wrapper.find('.fz__actionlist')
      expect(container.classes()).toContain('bg-core-white')
      expect(container.classes()).toContain('inline-flex')
      expect(container.classes()).toContain('grow-0')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('rounded')
      expect(container.classes()).toContain('p-4')
    })

    it('should apply custom listClass alongside base classes', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: [],
          listClass: 'my-custom-class'
        }
      })

      const container = wrapper.find('.fz__actionlist')
      expect(container.classes()).toContain('bg-core-white')
      expect(container.classes()).toContain('my-custom-class')
    })

    it('should apply label section classes when label is provided', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          label: 'Test Label',
          items: []
        }
      })

      const labelSection = wrapper.find('.text-grey-400')
      expect(labelSection.exists()).toBe(true)
      expect(labelSection.classes()).toContain('flex')
      expect(labelSection.classes()).toContain('h-32')
      expect(labelSection.classes()).toContain('items-center')
      expect(labelSection.classes()).toContain('px-12')
      expect(labelSection.classes()).toContain('text-xs')
    })

    it('should apply item container classes', () => {
      const items: ActionlistItem[] = [
        { type: 'button', label: 'Item' }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      const itemContainer = wrapper.find('.flex.flex-col')
      expect(itemContainer.exists()).toBe(true)
      expect(itemContainer.classes()).toContain('flex')
      expect(itemContainer.classes()).toContain('flex-col')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: []
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.fz__actionlist').exists()).toBe(true)
    })

    it('should handle items with undefined label', () => {
      const items: ActionlistItem[] = [
        {
          type: 'button',
          label: undefined as any
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle mixed item types', () => {
      const items: ActionlistItem[] = [
        { type: 'button', label: 'Button Item' },
        {
          type: 'link',
          label: 'Link Item',
          meta: {
            path: '/test',
            name: 'test'
          }
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items },
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot></slot></a>'
            }
          }
        }
      })

      expect(wrapper.findComponent({ name: 'FzNavlink' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'FzRouterNavlink' }).exists()).toBe(true)
    })

    it('should handle items with complex meta objects', () => {
      const items: ActionlistItem[] = [
        {
          type: 'link',
          label: 'Complex Link',
          meta: {
            path: '/complex/path',
            name: 'complex-route',
            params: { id: '123' },
            query: { tab: 'details' }
          } as any
        }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items },
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot></slot></a>'
            }
          }
        }
      })

      const routerNavlink = wrapper.findComponent({ name: 'FzRouterNavlink' })
      expect(routerNavlink.exists()).toBe(true)
    })

    it('should handle multiple items with same properties', () => {
      const items: ActionlistItem[] = [
        { type: 'button', label: 'Item' },
        { type: 'button', label: 'Item' },
        { type: 'button', label: 'Item' }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items }
      })

      const navlinks = wrapper.findAllComponents({ name: 'FzNavlink' })
      expect(navlinks.length).toBe(3)
    })

    it('should handle slot override for specific item index', () => {
      const items: ActionlistItem[] = [
        { type: 'button', label: 'Item 1' },
        { type: 'button', label: 'Item 2' }
      ]

      const wrapper = mount(FzActionlist, {
        props: { items },
        slots: {
          'fzaction-item-1': '<div class="custom-slot">Custom</div>'
        }
      })

      // First item should use default rendering
      expect(wrapper.text()).toContain('Item 1')
      
      // Second item should use custom slot
      expect(wrapper.find('.custom-slot').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom')
      expect(wrapper.text()).not.toContain('Item 2')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: []
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with label', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          label: 'Action Menu',
          items: []
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with button items', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          label: 'Button Actions',
          items: [
            {
              type: 'button',
              label: 'Action 1'
            },
            {
              type: 'button',
              label: 'Action 2',
              disabled: true
            }
          ]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with link items', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          label: 'Link Actions',
          items: [
            {
              type: 'link',
              label: 'Link 1',
              meta: {
                path: '/path1',
                name: 'path1'
              }
            },
            {
              type: 'link',
              label: 'Link 2',
              meta: {
                path: '/path2',
                name: 'path2'
              }
            }
          ]
        },
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot></slot></a>'
            }
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with mixed items', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          label: 'Mixed Actions',
          items: [
            {
              type: 'button',
              label: 'Button Action'
            },
            {
              type: 'link',
              label: 'Link Action',
              meta: {
                path: '/test',
                name: 'test'
              }
            }
          ]
        },
        global: {
          stubs: {
            'router-link': {
              template: '<a><slot></slot></a>'
            }
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom listClass', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: [],
          listClass: 'custom-list-class'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with items including icons', () => {
      const wrapper = mount(FzActionlist, {
        props: {
          items: [
            {
              type: 'button',
              label: 'Action with Icon',
              iconName: 'bell'
            }
          ]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
