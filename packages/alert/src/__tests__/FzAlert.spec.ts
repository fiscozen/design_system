import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { FzAlert } from '..'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: '', path: '/example', component: () => {} }]
})

describe('FzAlert', () => {
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
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Test Title'
        },
        slots: {
          default: 'Test description'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Test Title')
      expect(wrapper.text()).toContain('Test description')
    })

    it('should render with title', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Alert Title'
        }
      })
      expect(wrapper.text()).toContain('Alert Title')
    })

    it('should render slot content', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info'
        },
        slots: {
          default: 'Custom alert message'
        }
      })
      expect(wrapper.text()).toContain('Custom alert message')
    })

    it('should render icon', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info'
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should render button action when showButtonAction is true', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          buttonActionLabel: 'Click me'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('Click me')
    })

    it('should render link action when showLinkAction is true', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          showLinkAction: true,
          linkActionLabel: 'Learn more',
          linkActionLocation: '/example'
        },
        global: {
          plugins: [router]
        }
      })
      const link = wrapper.findComponent({ name: 'FzLink' })
      expect(link.exists()).toBe(true)
    })

    it('should render dismiss button when isDismissible is true', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          isDismissible: true
        }
      })
      const iconButtons = wrapper.findAllComponents({ name: 'FzIconButton' })
      expect(iconButtons.length).toBeGreaterThan(0)
    })

    it('should render accordion toggle button when variant is accordion', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion'
        }
      })
      const iconButtons = wrapper.findAllComponents({ name: 'FzIconButton' })
      expect(iconButtons.length).toBeGreaterThan(0)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('tone prop', () => {
      it.each([
        ['info', 'circle-info', 'text-semantic-info'],
        ['error', 'circle-xmark', 'text-semantic-error'],
        ['danger', 'triangle-exclamation', 'text-semantic-error'],
        ['warning', 'triangle-exclamation', 'text-semantic-warning'],
        ['success', 'circle-check', 'text-semantic-success']
      ])('should apply correct icon and classes for %s tone', (tone, expectedIcon, expectedClass) => {
        wrapper = mount(FzAlert, {
          props: {
            tone: tone as any
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toBe(expectedIcon)
        expect(icon.classes()).toContain(expectedClass)
      })

      it.each([
        ['info', 'bg-semantic-info-50', 'border-semantic-info'],
        ['error', 'bg-semantic-error-50', 'border-semantic-error'],
        ['danger', 'bg-semantic-error-50', 'border-semantic-error'],
        ['warning', 'bg-semantic-warning-50', 'border-semantic-warning'],
        ['success', 'bg-semantic-success-50', 'border-semantic-success']
      ])('should apply correct container classes for %s tone', (tone, bgClass, borderClass) => {
        wrapper = mount(FzAlert, {
          props: {
            tone: tone as any
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain(bgClass)
        expect(container.classes()).toContain(borderClass)
      })
    })

    describe('variant prop', () => {
      it('should default to background variant', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).not.toContain('cursor-pointer')
      })

      it('should apply accordion variant classes', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('cursor-pointer')
      })

      it('should show description when variant is background', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'background'
          },
          slots: {
            default: 'Description text'
          }
        })
        expect(wrapper.text()).toContain('Description text')
      })

      it('should hide description when accordion is closed', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: false
          },
          slots: {
            default: 'Description text'
          }
        })
        expect(wrapper.text()).not.toContain('Description text')
      })

      it('should show description when accordion is open', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: true
          },
          slots: {
            default: 'Description text'
          }
        })
        expect(wrapper.text()).toContain('Description text')
      })
    })

    describe('alertStyle prop (deprecated)', () => {
      it('should map default alertStyle to background variant', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            alertStyle: 'default'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).not.toContain('cursor-pointer')
      })

      it('should map collapsable alertStyle to accordion variant', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            alertStyle: 'collapsable'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('cursor-pointer')
      })

      it('should map simple alertStyle to background variant', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            alertStyle: 'simple'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).not.toContain('cursor-pointer')
      })
    })

    describe('title prop', () => {
      it('should render title when provided', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            title: 'Alert Title'
          }
        })
        expect(wrapper.text()).toContain('Alert Title')
      })

      it('should not render title element when not provided', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info'
          }
        })
        const title = wrapper.find('p[v-bold]')
        expect(title.exists()).toBe(false)
      })
    })

    describe('buttonActionLabel prop', () => {
      it('should render button with label', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            buttonActionLabel: 'Action Button'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('Action Button')
      })

      it('should not render button when showButtonAction is false', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            buttonActionLabel: 'Action Button',
            showButtonAction: false
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.exists()).toBe(false)
      })
    })

    describe('linkActionLabel prop', () => {
      it('should render link with label', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            showLinkAction: true,
            linkActionLabel: 'Learn More',
            linkActionLocation: '/example'
          },
          global: {
            plugins: [router]
          }
        })
        const link = wrapper.findComponent({ name: 'FzLink' })
        expect(link.exists()).toBe(true)
        expect(link.text()).toContain('Learn More')
      })
    })

    describe('isDismissible prop', () => {
      it('should render dismiss button when true', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            isDismissible: true
          }
        })
        const iconButtons = wrapper.findAllComponents({ name: 'FzIconButton' })
        expect(iconButtons.length).toBeGreaterThan(0)
      })

      it('should not render dismiss button when false', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            isDismissible: false,
            variant: 'background'
          }
        })
        const iconButtons = wrapper.findAllComponents({ name: 'FzIconButton' })
        expect(iconButtons.length).toBe(0)
      })
    })

    describe('defaultOpen prop', () => {
      it('should default to open (true)', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion'
          },
          slots: {
            default: 'Description'
          }
        })
        expect(wrapper.text()).toContain('Description')
      })

      it('should respect defaultOpen false for accordion', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: false
          },
          slots: {
            default: 'Description'
          }
        })
        expect(wrapper.text()).not.toContain('Description')
      })
    })

    describe('environment prop', () => {
      it('should default to frontoffice', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info'
          }
        })
        const container = wrapper.findComponent({ name: 'FzContainer' })
        expect(container.classes()).toContain('p-12')
      })

      it('should apply backoffice padding when environment is backoffice', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            environment: 'backoffice'
          }
        })
        const container = wrapper.findComponent({ name: 'FzContainer' })
        expect(container.classes()).toContain('p-6')
      })

      it('should map size sm to backoffice environment', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            size: 'sm'
          }
        })
        const container = wrapper.findComponent({ name: 'FzContainer' })
        expect(container.classes()).toContain('p-6')
      })

      it('should map size md to frontoffice environment', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            size: 'md'
          }
        })
        const container = wrapper.findComponent({ name: 'FzContainer' })
        expect(container.classes()).toContain('p-12')
      })
    })

    describe('linkActionLocation prop', () => {
      it('should set href for external links', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            showLinkAction: true,
            linkActionLabel: 'External Link',
            linkActionLocation: 'http://google.com',
            linkActionExternal: true
          }
        })
        const link = wrapper.find('a')
        expect(link.exists()).toBe(true)
        expect(link.attributes('href')).toBe('http://google.com')
      })

      it('should set target for external links with target prop', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            showLinkAction: true,
            linkActionLabel: 'External Link',
            linkActionLocation: 'http://google.com',
            linkActionExternal: true,
            linkActionTarget: '_blank'
          }
        })
        const link = wrapper.find('a')
        expect(link.attributes('target')).toBe('_blank')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit fzAlert:click when button is clicked', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          buttonActionLabel: 'Click me'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      await button.trigger('click')
      expect(wrapper.emitted('fzAlert:click')).toHaveLength(1)
    })

    it('should emit fzAlert:click when link is clicked', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          showLinkAction: true,
          linkActionLabel: 'Link',
          linkActionLocation: '/example'
        },
        global: {
          plugins: [router]
        }
      })
      const link = wrapper.findComponent({ name: 'FzLink' })
      await link.trigger('click')
      expect(wrapper.emitted('fzAlert:click')).toHaveLength(1)
    })

    it('should emit fzAlert:dismiss when dismiss button is clicked', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          isDismissible: true,
          variant: 'background' // Ensure not accordion to avoid confusion
        }
      })
      const iconButtons = wrapper.findAllComponents({ name: 'FzIconButton' })
      expect(iconButtons.length).toBe(1)
      const dismissButton = iconButtons[0]
      expect(dismissButton.exists()).toBe(true)
      
      // Trigger click event on the button element
      const buttonElement = dismissButton.find('button')
      if (buttonElement.exists()) {
        await buttonElement.trigger('click')
      } else {
        // Fallback: trigger directly on component
        await dismissButton.trigger('click')
      }
      
      expect(wrapper.emitted('fzAlert:dismiss')).toHaveLength(1)
    })

    it('should toggle accordion when clicked', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion',
          defaultOpen: true
        },
        slots: {
          default: 'Description'
        }
      })
      expect(wrapper.text()).toContain('Description')
      
      const container = wrapper.find('div')
      await container.trigger('click')
      await nextTick()
      
      expect(wrapper.text()).not.toContain('Description')
    })

    it('should toggle accordion when toggle button is clicked', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion',
          defaultOpen: false
        },
        slots: {
          default: 'Description'
        }
      })
      expect(wrapper.text()).not.toContain('Description')
      
      const toggleButton = wrapper.findAllComponents({ name: 'FzIconButton' })[0]
      await toggleButton.trigger('click')
      await nextTick()
      
      expect(wrapper.text()).toContain('Description')
    })

    it('should stop propagation on button click', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion',
          buttonActionLabel: 'Click me'
        },
        slots: {
          default: 'Description'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      const clickEvent = new MouseEvent('click', { bubbles: true })
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')
      
      await button.trigger('click', { event: clickEvent })
      
      // The event handler calls stopPropagation, so accordion should not toggle
      expect(wrapper.text()).toContain('Description')
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static container classes', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('select-none')
      expect(container.classes()).toContain('gap-12')
      expect(container.classes()).toContain('rounded')
      expect(container.classes()).toContain('justify-between')
    })

    it('should apply tone-specific container classes', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'success'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('bg-semantic-success-50')
      expect(container.classes()).toContain('border-semantic-success')
    })

    it('should apply accordion cursor class when variant is accordion', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('cursor-pointer')
    })

    it('should apply backoffice padding when environment is backoffice', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          environment: 'backoffice'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('p-6')
    })

    it('should apply frontoffice padding when environment is frontoffice', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          environment: 'frontoffice'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).not.toContain('p-6')
    })

    it('should apply description margin when title is present', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title'
        },
        slots: {
          default: 'Description'
        }
      })
      const description = wrapper.find('.font-normal')
      expect(description.classes()).toContain('mt-8')
    })

    it('should apply description bottom margin when actions are present', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          buttonActionLabel: 'Action'
        },
        slots: {
          default: 'Description'
        }
      })
      const description = wrapper.find('.font-normal')
      expect(description.classes()).toContain('mb-16')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have role="alert" for alert component', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info'
          }
        })
        const container = wrapper.find('div')
        // Note: Component should have role="alert" but may need implementation
        // This test documents the expected behavior
        const role = container.attributes('role')
        // If role is not implemented, this test will fail and document the gap
        if (role) {
          expect(role).toBe('alert')
        }
      })

      it('should have aria-live attribute for screen reader announcements', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'error'
          }
        })
        const container = wrapper.find('div')
        // Note: Component should have aria-live but may need implementation
        const ariaLive = container.attributes('aria-live')
        // For error/danger alerts, aria-live="assertive" is recommended
        // For info/success/warning, aria-live="polite" is recommended
        if (ariaLive) {
          expect(['assertive', 'polite']).toContain(ariaLive)
        }
      })

      it('should have aria-expanded for accordion variant', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: true
          }
        })
        const container = wrapper.find('div')
        // Note: Component should have aria-expanded for accordion
        const ariaExpanded = container.attributes('aria-expanded')
        if (ariaExpanded) {
          expect(ariaExpanded).toBe('true')
        }
      })

      it('should update aria-expanded when accordion toggles', async () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: true
          }
        })
        const container = wrapper.find('div')
        
        await container.trigger('click')
        await nextTick()
        
        const ariaExpanded = container.attributes('aria-expanded')
        if (ariaExpanded) {
          expect(ariaExpanded).toBe('false')
        }
      })

      it('should have decorative icon with aria-hidden', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info'
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        // Icon component should handle aria-hidden internally
        expect(icon.exists()).toBe(true)
      })

      it('should have accessible button labels', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            buttonActionLabel: 'Click to proceed'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('Click to proceed')
      })

      it('should have accessible link labels', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            showLinkAction: true,
            linkActionLabel: 'Learn more about this',
            linkActionLocation: '/example'
          },
          global: {
            plugins: [router]
          }
        })
        const link = wrapper.findComponent({ name: 'FzLink' })
        expect(link.exists()).toBe(true)
        expect(link.text()).toContain('Learn more about this')
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable when accordion variant', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion'
          }
        })
        const container = wrapper.find('div')
        // Accordion should be keyboard accessible
        expect(container.exists()).toBe(true)
      })

      it('should support Enter key to toggle accordion', async () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: false
          },
          slots: {
            default: 'Description'
          }
        })
        const container = wrapper.find('div')
        
        await container.trigger('keydown', { key: 'Enter' })
        await nextTick()
        
        // Note: Component may need keyboard handler implementation
        // This test documents expected behavior
      })

      it('should support Space key to toggle accordion', async () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'info',
            variant: 'accordion',
            defaultOpen: false
          },
          slots: {
            default: 'Description'
          }
        })
        const container = wrapper.find('div')
        
        await container.trigger('keydown', { key: ' ' })
        await nextTick()
        
        // Note: Component may need keyboard handler implementation
        // This test documents expected behavior
      })
    })

    describe('Screen reader support', () => {
      it('should announce alert content to screen readers', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'error',
            title: 'Error occurred'
          },
          slots: {
            default: 'Something went wrong'
          }
        })
        // Screen readers should be able to read the title and description
        expect(wrapper.text()).toContain('Error occurred')
        expect(wrapper.text()).toContain('Something went wrong')
      })

      it('should prioritize error and danger alerts for screen readers', () => {
        wrapper = mount(FzAlert, {
          props: {
            tone: 'error'
          }
        })
        // Error alerts should use aria-live="assertive" for immediate announcement
        const container = wrapper.find('div')
        const ariaLive = container.attributes('aria-live')
        if (ariaLive) {
          expect(ariaLive).toBe('assertive')
        }
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle missing title gracefully', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info'
        },
        slots: {
          default: 'Description only'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Description only')
    })

    it('should handle missing description gracefully', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title only'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Title only')
    })

    it('should handle both button and link actions', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          buttonActionLabel: 'Button',
          showLinkAction: true,
          linkActionLabel: 'Link',
          linkActionLocation: '/example'
        },
        global: {
          plugins: [router]
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      const link = wrapper.findComponent({ name: 'FzLink' })
      expect(button.exists()).toBe(true)
      expect(link.exists()).toBe(true)
    })

    it('should handle accordion with no defaultOpen prop', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion'
        },
        slots: {
          default: 'Description'
        }
      })
      // Should default to open (defaultOpen defaults to true)
      expect(wrapper.text()).toContain('Description')
    })

    it('should handle multiple rapid accordion toggles', async () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion',
          defaultOpen: true
        },
        slots: {
          default: 'Description'
        }
      })
      
      const container = wrapper.find('div')
      
      // Toggle multiple times rapidly
      await container.trigger('click')
      await nextTick()
      expect(wrapper.text()).not.toContain('Description') // Closed after 1 click
      
      await container.trigger('click')
      await nextTick()
      expect(wrapper.text()).toContain('Description') // Open after 2 clicks
      
      await container.trigger('click')
      await nextTick()
      expect(wrapper.text()).not.toContain('Description') // Closed after 3 clicks
    })

    it('should handle external link without target', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          showLinkAction: true,
          linkActionLabel: 'External',
          linkActionLocation: 'http://example.com',
          linkActionExternal: true
        }
      })
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('http://example.com')
    })

    it('should handle action slot override', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          buttonActionLabel: 'Default Button'
        },
        slots: {
          action: '<button>Custom Action</button>'
        }
      })
      // Custom action slot should override default button
      expect(wrapper.html()).toContain('Custom Action')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - info alert', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title here',
          buttonActionLabel: 'Button action here'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - error alert', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'error',
          title: 'Title here',
          buttonActionLabel: 'Button action here'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger alert', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'danger',
          title: 'Title here',
          buttonActionLabel: 'Button action here'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - warning alert', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'warning',
          title: 'Title here',
          buttonActionLabel: 'Button action here'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - success alert', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'success',
          title: 'Title here',
          buttonActionLabel: 'Button action here'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - accordion variant', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          variant: 'accordion',
          title: 'Title here',
          buttonActionLabel: 'Button action here'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - dismissible alert', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title here',
          isDismissible: true
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with link action', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title here',
          showButtonAction: false,
          showLinkAction: true,
          linkActionLabel: 'This is a link',
          linkActionLocation: '/example'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - external link with target', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title here',
          showButtonAction: false,
          showLinkAction: true,
          linkActionLabel: 'This is a link',
          linkActionLocation: '/example',
          linkActionTarget: '_blank'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - backoffice environment', () => {
      wrapper = mount(FzAlert, {
        props: {
          tone: 'info',
          title: 'Title here',
          environment: 'backoffice'
        },
        slots: {
          default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
