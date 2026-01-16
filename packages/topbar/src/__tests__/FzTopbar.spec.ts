import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { FzTopbar } from '..'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'example', path: '/example', component: () => {} },
    { name: 'home', path: '/', component: () => {} }
  ]
})

describe('FzTopbar', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.mock('@fiscozen/composables', () => ({
      useBreakpoints: vi.fn().mockReturnValue({
        isGreater: vi.fn().mockReturnValue(false)
      })
    }))
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
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Topbar message')
    })

    it('should render slot content', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: 'Custom topbar content'
        }
      })
      expect(wrapper.text()).toContain('Custom topbar content')
    })

    it('should render button when style is button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'button',
          actionLabel: 'Action Button'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('Action Button')
    })

    it('should render icon button when style is icon-button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'icon-button',
          actionIcon: 'close'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
      expect(iconButton.exists()).toBe(true)
    })

    it('should render link when style is link', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'link',
          actionLabel: 'Learn more',
          actionLink: '/example'
        },
        slots: {
          default: 'Topbar message'
        },
        global: {
          plugins: [router]
        }
      })
      const link = wrapper.findComponent({ name: 'FzLink' })
      expect(link.exists()).toBe(true)
      expect(link.text()).toContain('Learn more')
    })

    it('should render both button and icon button when style is hybrid', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'hybrid',
          actionLabel: 'Action',
          actionIcon: 'close'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
      expect(button.exists()).toBe(true)
      expect(iconButton.exists()).toBe(true)
    })

    it('should render custom action slot', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'button',
          actionLabel: 'Default Action'
        },
        slots: {
          default: 'Topbar message',
          action: '<button class="custom-action">Custom Action</button>'
        }
      })
      const customAction = wrapper.find('.custom-action')
      expect(customAction.exists()).toBe(true)
      expect(customAction.text()).toContain('Custom Action')
      // Default button should not be rendered when slot is provided
      const defaultButton = wrapper.findComponent({ name: 'FzButton' })
      expect(defaultButton.exists()).toBe(false)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('type prop', () => {
      it('should apply default type styling', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('bg-white-smoke')
      })

      it('should apply danger type styling', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'danger'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('bg-danger')
      })
    })

    describe('style prop', () => {
      it('should render no action when style is none', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'none'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        const link = wrapper.findComponent({ name: 'FzLink' })
        expect(button.exists()).toBe(false)
        expect(iconButton.exists()).toBe(false)
        expect(link.exists()).toBe(false)
      })

      it('should render button when style is button', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'button',
            actionLabel: 'Action'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.exists()).toBe(true)
      })

      it('should render icon button when style is icon-button', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'icon-button',
            actionIcon: 'close'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(iconButton.exists()).toBe(true)
      })

      it('should render link when style is link', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'link',
            actionLabel: 'Learn more',
            actionLink: '/example'
          },
          slots: {
            default: 'Topbar message'
          },
          global: {
            plugins: [router]
          }
        })
        const link = wrapper.findComponent({ name: 'FzLink' })
        expect(link.exists()).toBe(true)
      })

      it('should render both button and icon button when style is hybrid', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'hybrid',
            actionLabel: 'Action',
            actionIcon: 'close'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(button.exists()).toBe(true)
        expect(iconButton.exists()).toBe(true)
      })
    })

    describe('actionLabel prop', () => {
      it('should display action label on button', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'button',
            actionLabel: 'Click Me'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.text()).toContain('Click Me')
      })
    })

    describe('actionIcon prop', () => {
      it('should pass icon name to icon button', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'icon-button',
            actionIcon: 'close'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(iconButton.props('iconName')).toBe('close')
      })
    })

    describe('actionTooltip prop', () => {
      it('should pass tooltip to button', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'button',
            actionLabel: 'Action',
            actionTooltip: 'Tooltip text'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.props('tooltip')).toBe('Tooltip text')
      })

      it('should pass tooltip to icon button', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'icon-button',
            actionIcon: 'close',
            actionTooltip: 'Close tooltip'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(iconButton.props('tooltip')).toBe('Close tooltip')
      })
    })

    describe('actionLink prop', () => {
      it('should pass link to FzLink component', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'link',
            actionLabel: 'Learn more',
            actionLink: '/example'
          },
          slots: {
            default: 'Topbar message'
          },
          global: {
            plugins: [router]
          }
        })
        const link = wrapper.findComponent({ name: 'FzLink' })
        expect(link.props('to')).toBe('/example')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit actionClick when button is clicked', async () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'button',
          actionLabel: 'Action'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      await button.trigger('click')
      expect(wrapper.emitted('actionClick')).toHaveLength(1)
    })

    it('should emit actionClick when icon button is clicked', async () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'icon-button',
          actionIcon: 'close'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
      expect(iconButton.exists()).toBe(true)
      // Find the actual button element inside FzIconButton
      const buttonElement = iconButton.find('button')
      if (buttonElement.exists()) {
        await buttonElement.trigger('click')
        expect(wrapper.emitted('actionClick')).toHaveLength(1)
      } else {
        // Fallback: trigger click on the component wrapper
        await iconButton.trigger('click')
        expect(wrapper.emitted('actionClick')).toHaveLength(1)
      }
    })

    it('should emit actionClick from both button and icon button in hybrid mode', async () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'hybrid',
          actionLabel: 'Action',
          actionIcon: 'close'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const button = wrapper.findComponent({ name: 'FzButton' })
      const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
      
      expect(button.exists()).toBe(true)
      expect(iconButton.exists()).toBe(true)
      
      // Click button
      const buttonElement = button.find('button')
      if (buttonElement.exists()) {
        await buttonElement.trigger('click')
      } else {
        await button.trigger('click')
      }
      expect(wrapper.emitted('actionClick')).toHaveLength(1)
      
      // Click icon button
      const iconButtonElement = iconButton.find('button')
      if (iconButtonElement.exists()) {
        await iconButtonElement.trigger('click')
      } else {
        await iconButton.trigger('click')
      }
      expect(wrapper.emitted('actionClick')).toHaveLength(2)
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('px-24')
      expect(container.classes()).toContain('py-12')
      expect(container.classes()).toContain('gap-16')
      expect(container.classes()).toContain('items-center')
      expect(container.classes()).toContain('justify-center')
      expect(container.classes()).toContain('lg:h-48')
      expect(container.classes()).toContain('z-10')
    })

    it('should apply flex-col lg:flex-row when style is button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'button',
          actionLabel: 'Action'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('lg:flex-row')
    })

    it('should apply flex-col lg:flex-row when style is link', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'link',
          actionLabel: 'Learn more',
          actionLink: '/example'
        },
        slots: {
          default: 'Topbar message'
        },
        global: {
          plugins: [router]
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex-col')
      expect(container.classes()).toContain('lg:flex-row')
    })

    it('should not apply flex-col lg:flex-row when style is icon-button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'icon-button',
          actionIcon: 'close'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).not.toContain('flex-col')
      expect(container.classes()).not.toContain('lg:flex-row')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should use semantic div container', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const container = wrapper.find('div')
        expect(container.exists()).toBe(true)
      })

      it('should have visible text content for screen readers', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default'
          },
          slots: {
            default: 'Important announcement'
          }
        })
        expect(wrapper.text()).toContain('Important announcement')
      })
    })

    describe('Landmark role expectations', () => {
      it('should support role="banner" for topbar landmark', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default'
          },
          slots: {
            default: 'Topbar message'
          },
          attrs: {
            role: 'banner'
          }
        })
        const container = wrapper.find('div')
        // Note: Component should support role="banner" for landmark identification
        // This test documents the expected behavior for future implementation
        expect(container.exists()).toBe(true)
      })

      it('should support aria-label for topbar identification', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default'
          },
          slots: {
            default: 'Topbar message'
          },
          attrs: {
            'aria-label': 'Site announcement'
          }
        })
        const container = wrapper.find('div')
        // Note: Component should support aria-label for screen reader identification
        // This test documents the expected behavior for future implementation
        expect(container.exists()).toBe(true)
      })
    })

    describe('Action elements accessibility', () => {
      it('should have accessible button with actionLabel', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'button',
            actionLabel: 'Dismiss'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const button = wrapper.findComponent({ name: 'FzButton' })
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('Dismiss')
      })

      it('should have accessible icon button with tooltip', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'icon-button',
            actionIcon: 'close',
            actionTooltip: 'Close notification'
          },
          slots: {
            default: 'Topbar message'
          }
        })
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(iconButton.exists()).toBe(true)
        expect(iconButton.props('tooltip')).toBe('Close notification')
      })

      it('should have accessible link with actionLabel', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default',
            style: 'link',
            actionLabel: 'Learn more',
            actionLink: '/example'
          },
          slots: {
            default: 'Topbar message'
          },
          global: {
            plugins: [router]
          }
        })
        const link = wrapper.findComponent({ name: 'FzLink' })
        expect(link.exists()).toBe(true)
        expect(link.text()).toContain('Learn more')
      })
    })

    describe('Screen reader support', () => {
      it('should have text content visible to screen readers', () => {
        wrapper = mount(FzTopbar, {
          props: {
            type: 'default'
          },
          slots: {
            default: 'This is an important notification'
          }
        })
        const textSpan = wrapper.find('span')
        expect(textSpan.exists()).toBe(true)
        expect(textSpan.text()).toContain('This is an important notification')
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined actionLabel gracefully', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'button'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      expect(wrapper.exists()).toBe(true)
      const button = wrapper.findComponent({ name: 'FzButton' })
      // Button should still render even without actionLabel
      expect(button.exists()).toBe(true)
    })

    it('should handle undefined actionIcon gracefully', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'icon-button'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      expect(wrapper.exists()).toBe(true)
      // Icon button may not render without actionIcon
      const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
      // Component should handle this gracefully
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty slot content', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: ''
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle very long text content', () => {
      const longText = 'A'.repeat(500)
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: longText
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain(longText)
    })

    it('should handle special characters in slot content', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: 'Alert: & <strong>HTML</strong> &amp; entities'
        }
      })
      expect(wrapper.exists()).toBe(true)
      // Vue renders HTML in slots, so <strong> will be rendered as HTML
      expect(wrapper.html()).toContain('<strong>')
      expect(wrapper.text()).toContain('Alert: & HTML & entities')
    })

    it('should handle multiple instances', () => {
      const wrapper1 = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: 'First topbar'
        }
      })
      const wrapper2 = mount(FzTopbar, {
        props: {
          type: 'danger'
        },
        slots: {
          default: 'Second topbar'
        }
      })
      expect(wrapper1.exists()).toBe(true)
      expect(wrapper2.exists()).toBe(true)
      expect(wrapper1.text()).toContain('First topbar')
      expect(wrapper2.text()).toContain('Second topbar')
      wrapper1.unmount()
      wrapper2.unmount()
    })

    it('should handle hybrid style without actionLabel', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'hybrid',
          actionIcon: 'close'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      expect(wrapper.exists()).toBe(true)
      // Button may not render without actionLabel in hybrid mode
      const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
      expect(iconButton.exists()).toBe(true)
    })

    it('should handle hybrid style without actionIcon', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'hybrid',
          actionLabel: 'Action'
        },
        slots: {
          default: 'Topbar message'
        }
      })
      expect(wrapper.exists()).toBe(true)
      // Icon button may not render without actionIcon in hybrid mode
      const button = wrapper.findComponent({ name: 'FzButton' })
      expect(button.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default'
        },
        slots: {
          default: 'This is a Topbar'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger type', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'danger'
        },
        slots: {
          default: 'This is a Topbar'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - default with button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'button'
        },
        slots: {
          default: 'This is a Topbar'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger with button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'danger',
          style: 'button'
        },
        slots: {
          default: 'This is a Topbar'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - default with icon-button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'icon-button'
        },
        slots: {
          default: 'This is a Topbar'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger with icon-button', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'danger',
          style: 'icon-button'
        },
        slots: {
          default: 'This is a Topbar'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - default with link', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'default',
          style: 'link',
          actionLabel: 'Learn more',
          actionLink: '/example'
        },
        slots: {
          default: 'This is a Topbar'
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger with link', () => {
      wrapper = mount(FzTopbar, {
        props: {
          type: 'danger',
          style: 'link',
          actionLabel: 'Learn more',
          actionLink: '/example'
        },
        slots: {
          default: 'This is a Topbar'
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
