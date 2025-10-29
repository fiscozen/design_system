import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import FzButton from '../FzButton.vue'
import { FzIcon } from '@fiscozen/icons'

describe.concurrent('FzButton', () => {
  describe('Basic Rendering', () => {
    it('should render with label', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Test Button',
        }
      })

      expect(wrapper.text()).toContain('Test Button')
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render with default slot', () => {
      const wrapper = mount(FzButton, {
        slots: {
          default: 'Slot Content'
        }
      })

      expect(wrapper.text()).toContain('Slot Content')
    })

    it('should prioritize slot over label', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Label Text'
        },
        slots: {
          default: 'Slot Text'
        }
      })

      expect(wrapper.text()).toContain('Slot Text')
      expect(wrapper.text()).not.toContain('Label Text')
    })
  })

  describe('Variants', () => {
    it('should render primary variant with correct classes', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'primary',
          label: 'Primary'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-blue-500')
      expect(button.classes()).toContain('text-core-white')
    })

    it('should render secondary variant with correct classes', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'secondary',
          label: 'Secondary'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-core-white')
      expect(button.classes()).toContain('text-grey-500')
    })

    it('should render invisible variant with correct classes', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'invisible',
          label: 'Invisible'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-transparent')
      expect(button.classes()).toContain('border-transparent')
    })

    it('should render danger variant with correct classes', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'danger',
          label: 'Danger'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-semantic-error-200')
      expect(button.classes()).toContain('text-core-white')
    })

    it('should render success variant with correct classes', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'success',
          label: 'Success'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-semantic-success-200')
      expect(button.classes()).toContain('text-core-white')
    })
  })

  describe('Environment', () => {
    it('should render backoffice environment with correct height', () => {
      const wrapper = mount(FzButton, {
        props: {
          environment: 'backoffice',
          label: 'Backoffice Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-32')
      expect(button.classes()).not.toContain('text-lg')
    })

    it('should render frontoffice environment with correct height', () => {
      const wrapper = mount(FzButton, {
        props: {
          environment: 'frontoffice',
          label: 'Frontoffice Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-44')
      expect(button.classes()).not.toContain('text-lg')
    })

    it('should use frontoffice as default environment', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Default Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-44')
    })
  })

  describe('Size Deprecation', () => {
    it('should log deprecation warning for any size prop', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const wrapper = mount(FzButton, {
        props: {
          size: 'lg',
          label: 'Legacy Button'
        }
      })

      await wrapper.vm.$nextTick()

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FzButton] The "size" prop is deprecated')
      )
      
      warnSpy.mockRestore()
    })

    it('should log deprecation warning for md size', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const wrapper = mount(FzButton, {
        props: {
          size: 'md',
          label: 'MD Button'
        }
      })

      await wrapper.vm.$nextTick()

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FzButton] The "size" prop is deprecated')
      )
      
      warnSpy.mockRestore()
    })

    it('should map lg size to frontoffice environment', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'lg',
          label: 'LG Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-44')
      expect(button.classes()).not.toContain('text-lg')
    })

    it('should map md size to backoffice environment', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'md',
          label: 'MD Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-32')
      expect(button.classes()).not.toContain('text-lg')
    })
  })

  describe('Icons', () => {
    it('should render icon before label', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'With Icon',
          iconName: 'bell',
          iconPosition: 'before'
        }
      })

      const icon = wrapper.findComponent(FzIcon)
      expect(icon.exists()).toBe(true)
      const button = wrapper.find('button')
      expect(button.classes()).toContain('gap-8')
      expect(button.classes()).toContain('px-12')
    })

    it('should render icon after label', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'With Icon',
          iconName: 'bell',
          iconPosition: 'after'
        }
      })

      const icon = wrapper.findComponent(FzIcon)
      expect(icon.exists()).toBe(true)
      const button = wrapper.find('button')
      expect(button.classes()).toContain('gap-8')
      expect(button.classes()).toContain('px-12')
    })

    it('should not render icon without iconName', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'No Icon'
        }
      })

      const icon = wrapper.findComponent(FzIcon)
      expect(icon.exists()).toBe(false)
      const button = wrapper.find('button')
      expect(button.classes()).toContain('gap-8')
      expect(button.classes()).toContain('px-12')
    })

    it('should use before slots when provided', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Button',
          iconName: 'bell'
        },
        slots: {
          before: '<span class="custom-before">Custom Before</span>'
        }
      })

      expect(wrapper.find('.custom-before').exists()).toBe(true)
    })

    it('should use after slots when provided', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Button',
          iconName: 'bell'
        },
        slots: {
          after: '<span class="custom-after">Custom After</span>'
        }
      })

      expect(wrapper.find('.custom-after').exists()).toBe(true)
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled attribute when disabled', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Disabled',
          disabled: true
        }
      })

      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('should apply disabled classes for primary variant', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'primary',
          label: 'Disabled Primary',
          disabled: true
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('disabled:bg-blue-200')
    })

    it('should not apply hover classes when disabled', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'primary',
          label: 'Disabled',
          disabled: true
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).not.toContain('focus:bg-blue-500')
    })

    it('should not emit click when disabled', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Disabled',
          disabled: true
        }
      })
      wrapper.trigger('click')

      const clickEvs = wrapper.emitted('click')
      expect(clickEvs).toBeUndefined()
    })
  })

  describe('Events', () => {
    it('should emit native click event', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Clickable'
        }
      })
      wrapper.trigger('click')

      const clickEvs = wrapper.emitted('click')
      expect(clickEvs).toHaveLength(1)
    })
  })

  describe('CSS Classes', () => {
    it('should apply static classes', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('relative')
      expect(button.classes()).toContain('rounded')
      expect(button.classes()).toContain('flex')
      expect(button.classes()).toContain('items-center')
      expect(button.classes()).toContain('justify-center')
      expect(button.classes()).toContain('font-normal')
      expect(button.classes()).toContain('!text-[16px]')
      expect(button.classes()).toContain('!leading-[20px]')
      expect(button.classes()).toContain('border-1')
    })

    it('should apply focus classes when not disabled', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Button',
          disabled: false
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('focus:!border-blue-600')
    })

    it('should apply containerClass when provided', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Button',
          containerClass: 'custom-class'
        }
      })

      const container = wrapper.find('div.truncate')
      expect(container.classes()).toContain('custom-class')
    })

    it('should override container classes when overrideContainerClass is true', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'Button',
          containerClass: 'only-custom',
          overrideContainerClass: true
        }
      })

      // When overrideContainerClass is true, only containerClass is applied
      const html = wrapper.html()
      expect(html).toContain('only-custom')
      expect(html).not.toContain('truncate')
    })
  })

  describe('Combinations', () => {
    it('should handle danger variant with frontoffice environment', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'danger',
          environment: 'frontoffice',
          label: 'Large Danger'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-semantic-error-200')
      expect(button.classes()).toContain('h-44')
      expect(button.classes()).not.toContain('text-lg')
    })

    it('should handle success variant with icon and backoffice environment', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'success',
          environment: 'backoffice',
          label: 'Success',
          iconName: 'check',
          iconPosition: 'before'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-semantic-success-200')
      expect(button.classes()).toContain('h-32')
    })

    it('should handle secondary variant disabled with icon', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'secondary',
          disabled: true,
          label: 'Disabled Secondary',
          iconName: 'bell'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-core-white')
      expect(button.classes()).toContain('disabled:text-grey-200')
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('Snapshots', () => {
    it('should match snapshot - basic button', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'some text',
          disabled: false,
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with icon', () => {
      const wrapper = mount(FzButton, {
        props: {
          tooltip: 'some text',
          disabled: false,
          iconName: 'bell',
          label: 'some label',
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger variant', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'danger',
          label: 'Danger Button'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - success variant', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'success',
          label: 'Success Button'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - backoffice environment', () => {
      const wrapper = mount(FzButton, {
        props: {
          environment: 'backoffice',
          label: 'Backoffice Button'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - frontoffice environment with icon', () => {
      const wrapper = mount(FzButton, {
        props: {
          environment: 'frontoffice',
          label: 'Frontoffice Button',
          iconName: 'star',
          iconPosition: 'after'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
