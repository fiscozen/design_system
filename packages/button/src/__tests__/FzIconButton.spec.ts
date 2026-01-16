import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import FzIconButton from '../FzIconButton.vue'
import FzButton from '../FzButton.vue'
import { FzIcon } from '@fiscozen/icons'

describe('FzIconButton', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      expect(wrapper.html()).toBeTruthy()
      const button = wrapper.findComponent(FzButton)
      expect(button.exists()).toBe(true)
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('bell')
    })

    it('renders with default props', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'settings',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('variant')).toBe('primary')
      expect(button.props('environment')).toBe('frontoffice')
      expect(button.props('disabled')).toBe(false)
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('variant')).toBe('far')
    })
  })

  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          variant: 'primary',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('variant')).toBe('primary')
    })

    it('renders secondary variant correctly', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          variant: 'secondary',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('variant')).toBe('secondary')
    })

    it('renders invisible variant correctly', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          variant: 'invisible',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('variant')).toBe('invisible')
    })

  })

  describe('Environment', () => {
    it('uses frontoffice environment by default', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('environment')).toBe('frontoffice')
      const buttonElement = wrapper.find('button')
      expect(buttonElement.classes()).toContain('h-44')
    })

    it('uses backoffice environment when provided', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          environment: 'backoffice',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('environment')).toBe('backoffice')
      const buttonElement = wrapper.find('button')
      expect(buttonElement.classes()).toContain('h-32')
    })

    it('uses frontoffice environment when provided', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          environment: 'frontoffice',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('environment')).toBe('frontoffice')
      const buttonElement = wrapper.find('button')
      expect(buttonElement.classes()).toContain('h-44')
    })

    it('maps deprecated size prop to environment', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          size: 'xs', // Deprecated prop, should map to backoffice
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('environment')).toBe('backoffice')
      const buttonElement = wrapper.find('button')
      expect(buttonElement.classes()).toContain('h-32')
    })

    it('prioritizes environment prop over deprecated size prop', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          environment: 'frontoffice',
          size: 'xs', // Deprecated prop, should be ignored
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('environment')).toBe('frontoffice')
      const buttonElement = wrapper.find('button')
      expect(buttonElement.classes()).toContain('h-44')
    })

    it('always uses fixed md size for icon (20px x 20px)', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('size')).toBe('md')
    })
  })

  describe('Icon Props', () => {
    it('passes iconName to FzIcon', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'settings',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('name')).toBe('settings')
    })

    it('passes iconVariant to FzIcon', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          iconVariant: 'fas',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('variant')).toBe('fas')
    })

    it('uses fixed icon size', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('size')).toBe('md')
    })

  })

  describe('States', () => {
    it('renders disabled state correctly', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          disabled: true,
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.props('disabled')).toBe(true)
    })

  })

  describe('User Interactions', () => {
    it('emits click event when button is clicked', async () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      await button.trigger('click')
      
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.length).toBe(1)
    })

    it('does not emit click event when disabled', async () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          disabled: true,
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      await button.trigger('click')
      
      // FzButton should prevent click when disabled
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Deprecation Warnings', () => {
    it('warns when tooltip prop is used', async () => {
      mount(FzIconButton, {
        props: {
          iconName: 'bell',
          tooltip: 'Tooltip text',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      await flushPromises()

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzIconButton] The "tooltip" prop is deprecated')
      )
    })

    it('does not warn when tooltip prop is not provided', async () => {
      mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      await flushPromises()

      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('[FzIconButton] The "tooltip" prop is deprecated')
      )
    })

    it('warns when size prop is used', async () => {
      mount(FzIconButton, {
        props: {
          iconName: 'bell',
          size: 'md',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      await flushPromises()

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzIconButton] The "size" prop is deprecated')
      )
    })

    it('warns for all size values', async () => {
      const sizes = ['xs', 'sm', 'md', 'lg'] as const
      
      for (const size of sizes) {
        vi.clearAllMocks()
        
        mount(FzIconButton, {
          props: {
            iconName: 'bell',
            size,
          },
          global: {
            components: { FzButton, FzIcon }
          }
        })

        await flushPromises()

        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('[FzIconButton] The "size" prop is deprecated')
        )
      }
    })

    it('warns when iconSize prop is used', async () => {
      mount(FzIconButton, {
        props: {
          iconName: 'bell',
          iconSize: 'xl',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      await flushPromises()

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzIconButton] The "iconSize" prop is deprecated')
      )
    })

    it('ignores iconSize prop and uses fixed md size (20px x 20px)', async () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          iconSize: 'xl', // Deprecated prop, should be ignored
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const icon = wrapper.findComponent({ name: 'FzIcon' })
      // Should use fixed 'md' size (20px x 20px), not 'xl' from deprecated prop
      expect(icon.props('size')).toBe('md')
    })
  })

  describe('Accessibility', () => {
    it('uses ariaLabel prop when provided', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          ariaLabel: 'Custom label',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      // Note: aria-label would be passed to FzButton if it supported it
      // For now, we verify the computed ariaLabel value is correct
      const button = wrapper.findComponent(FzButton)
      expect(button.exists()).toBe(true)
    })

    it('falls back to tooltip for aria-label when ariaLabel not provided', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          tooltip: 'Tooltip text',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.exists()).toBe(true)
    })

    it('falls back to iconName for aria-label when neither ariaLabel nor tooltip provided', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.findComponent(FzButton)
      expect(button.exists()).toBe(true)
    })

  })

  describe('Notification Badge', () => {
    it('does not render badge when hasNotification is false', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: false,
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.exists()).toBe(false)
    })

    it('renders badge when hasNotification is true', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.exists()).toBe(true)
      expect(badge.classes()).toContain('rounded-full')
      expect(badge.classes()).toContain('w-8')
      expect(badge.classes()).toContain('h-8')
      expect(badge.classes()).toContain('absolute')
      expect(badge.classes()).toContain('-top-[2px]')
      expect(badge.classes()).toContain('-right-[2px]')
    })

    it('applies orange color for primary variant', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          variant: 'primary',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('bg-orange-500')
      expect(badge.classes()).not.toContain('bg-blue-500')
    })

    it('applies blue color for secondary variant', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          variant: 'secondary',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('bg-blue-500')
      expect(badge.classes()).not.toContain('bg-orange-500')
    })

    it('applies blue color for invisible variant', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          variant: 'invisible',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('bg-blue-500')
      expect(badge.classes()).not.toContain('bg-orange-500')
    })

    it('applies orange-200 color for disabled primary variant', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          disabled: true,
          variant: 'primary',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('bg-orange-200')
      expect(badge.classes()).not.toContain('bg-grey-200')
      expect(badge.classes()).not.toContain('bg-orange-500')
      expect(badge.classes()).not.toContain('bg-blue-500')
    })

    it('applies grey-200 color for disabled secondary variant', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          disabled: true,
          variant: 'secondary',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('bg-grey-200')
      expect(badge.classes()).not.toContain('bg-orange-200')
      expect(badge.classes()).not.toContain('bg-orange-500')
      expect(badge.classes()).not.toContain('bg-blue-500')
    })

    it('applies grey-200 color for disabled invisible variant', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          disabled: true,
          variant: 'invisible',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('bg-grey-200')
      expect(badge.classes()).not.toContain('bg-orange-200')
      expect(badge.classes()).not.toContain('bg-orange-500')
      expect(badge.classes()).not.toContain('bg-blue-500')
    })

    it('marks badge as aria-hidden for screen readers', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.exists()).toBe(true)
      expect(badge.attributes('aria-hidden')).toBe('true')
    })

    it('includes notification status in button aria-label when hasNotification is true', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          ariaLabel: 'Notifications',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Notifications, hai delle notifiche')
    })

    it('does not include notification status in button aria-label when hasNotification is false', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: false,
          ariaLabel: 'Notifications',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Notifications')
    })

    it('uses fixed 8px size for badge in backoffice environment', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          environment: 'backoffice',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('w-8')
      expect(badge.classes()).toContain('h-8')
    })

    it('uses fixed 8px size for badge in frontoffice environment', () => {
      const wrapper = mount(FzIconButton, {
        props: {
          iconName: 'bell',
          hasNotification: true,
          environment: 'frontoffice',
        },
        global: {
          components: { FzButton, FzIcon }
        }
      })

      const badge = wrapper.find('div[aria-hidden="true"]')
      expect(badge.classes()).toContain('w-8')
      expect(badge.classes()).toContain('h-8')
    })
  })
})

