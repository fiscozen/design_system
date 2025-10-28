import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FzButton from '../FzButton.vue'

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
      expect(button.classes()).toContain('bg-semantic-error')
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
      expect(button.classes()).toContain('bg-semantic-success')
      expect(button.classes()).toContain('text-core-white')
    })
  })

  describe('Sizes', () => {
    it('should render xs size with correct height', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'xs',
          label: 'XS Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-24')
      expect(button.classes()).toContain('text-xs')
    })

    it('should render sm size with correct height', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'sm',
          label: 'SM Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-28')
      expect(button.classes()).toContain('text-sm')
    })

    it('should render md size with correct height (default)', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'md',
          label: 'MD Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-32')
    })

    it('should render lg size with correct height', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'lg',
          label: 'LG Button'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('h-40')
      expect(button.classes()).toContain('text-lg')
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

      const iconContainer = wrapper.find('div.mr-6')
      expect(iconContainer.exists()).toBe(true)
    })

    it('should render icon after label', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'With Icon',
          iconName: 'bell',
          iconPosition: 'after'
        }
      })

      const iconContainer = wrapper.find('div.ml-6')
      expect(iconContainer.exists()).toBe(true)
    })

    it('should not render icon without iconName', () => {
      const wrapper = mount(FzButton, {
        props: {
          label: 'No Icon'
        }
      })

      expect(wrapper.findAll('.mr-6, .ml-6').length).toBe(0)
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
      expect(button.classes()).toContain('font-medium')
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
      expect(button.classes()).toContain('focus:border-blue-600')
      expect(button.classes()).toContain('focus:border-solid')
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
    it('should handle danger variant with lg size', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'danger',
          size: 'lg',
          label: 'Large Danger'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-semantic-error')
      expect(button.classes()).toContain('h-40')
      expect(button.classes()).toContain('text-lg')
    })

    it('should handle success variant with icon and xs size', () => {
      const wrapper = mount(FzButton, {
        props: {
          variant: 'success',
          size: 'xs',
          label: 'Success',
          iconName: 'check',
          iconPosition: 'before'
        }
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-semantic-success')
      expect(button.classes()).toContain('h-24')
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
      expect(button.classes()).toContain('disabled:text-grey-100')
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

    it('should match snapshot - xs size', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'xs',
          label: 'XS Button'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - lg size with icon', () => {
      const wrapper = mount(FzButton, {
        props: {
          size: 'lg',
          label: 'Large Button',
          iconName: 'star',
          iconPosition: 'after'
        }
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
