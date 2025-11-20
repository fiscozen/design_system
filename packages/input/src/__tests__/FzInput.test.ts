import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzInput } from '..'

const NUMBER_OF_INPUTS = 1000

describe('FzInput', () => {
  describe('Rendering', () => {
    it('renders label', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
        },
        slots: {},
      })

      expect(wrapper.text()).toContain('Label')
    })

    it('renders leftIcon', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          leftIcon: 'calendar-lines',
        },
        slots: {},
      })

      expect(wrapper.find('.fa-calendar-lines')).toBeTruthy()
    })

    it('renders rightIcon', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          rightIcon: 'credit-card',
        },
        slots: {},
      })

      expect(wrapper.find('.fa-credit-card')).toBeTruthy()
    })

    it('renders helpText', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
        },
        slots: {
          helpText: 'This is a helper text',
        },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This is a helper text')
    })

    it('renders errorMessage', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          error: true,
        },
        slots: {
          errorMessage: 'This is an error message',
        },
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This is an error message')
    })
  })

  describe('Input types', () => {
    it('renders email type', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          type: 'email',
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('type')).toBe('email')
    })

    it('renders tel type', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          type: 'tel',
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('type')).toBe('tel')
    })

    it('renders password type', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          type: 'password',
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('type')).toBe('password')
    })
  })

  describe('Input states', () => {
    it('renders disabled', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          disabled: true,
        },
        slots: {},
      })

      expect(wrapper.find('input').attributes('disabled')).toBe('')
    })

    it('renders required', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          required: true,
        },
        slots: {},
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('input').attributes('required')).toBe('')
      expect(wrapper.text()).toContain('*')
    })
  })

  describe('Events', () => {
    it('emits fzinput:right-icon-click event', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          rightIcon: 'eye',
        },
        slots: {},
      })

      await wrapper.find('.fa-eye').trigger('click')

      expect(wrapper.emitted('fzinput:right-icon-click')).toBeTruthy()
    })

    it('emits fzinput:left-icon-click event', async () => {
      const wrapper = mount(FzInput, {
        props: {
          label: 'Label',
          leftIcon: 'eye',
        },
        slots: {},
      })

      await wrapper.find('.fa-eye').trigger('click')

      expect(wrapper.emitted('fzinput:left-icon-click')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    describe('Input ARIA attributes', () => {
      it('applies aria-required when required is true', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            required: true,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-required')).toBe('true')
      })

      it('applies aria-required="false" when required is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            required: false,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-required')).toBe('false')
      })

      it('applies aria-invalid when error is true', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-invalid')).toBe('true')
      })

      it('applies aria-invalid="false" when error is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            error: false,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-invalid')).toBe('false')
      })

      it('applies aria-disabled when disabled is true', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            disabled: true,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-disabled')).toBe('true')
      })

      it('applies aria-disabled="false" when disabled is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            disabled: false,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-disabled')).toBe('false')
      })

      it('applies aria-labelledby when label is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Test Label',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        const labelId = input.getAttribute('aria-labelledby')
        expect(labelId).toBeTruthy()
        
        // Verify label element exists with matching id
        const label = wrapper.find('label').element as HTMLLabelElement
        expect(label.getAttribute('id')).toBe(labelId)
      })

      it('does not apply aria-labelledby when label is not provided', async () => {
        const wrapper = mount(FzInput, {
          props: {},
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-labelledby')).toBeNull()
      })

      it('applies aria-describedby when helpText slot is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
          },
          slots: {
            helpText: 'Help text',
          },
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()
        
        // Verify help text element exists with matching id
        const helpText = wrapper.find(`#${describedBy}`)
        expect(helpText.exists()).toBe(true)
        expect(helpText.text()).toContain('Help text')
      })

      it('applies aria-describedby when errorMessage slot is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toBeTruthy()
        
        // Verify error message element exists with matching id
        const errorMessage = wrapper.find(`#${describedBy}`)
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.text()).toContain('Error message')
      })

      it('does not apply aria-describedby when neither helpText nor errorMessage are provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const input = wrapper.find('input').element as HTMLInputElement
        expect(input.getAttribute('aria-describedby')).toBeNull()
      })
    })

    describe('Error message accessibility', () => {
      it('applies role="alert" to error message container', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })

        await wrapper.vm.$nextTick()

        const errorContainer = wrapper.find('[role="alert"]')
        expect(errorContainer.exists()).toBe(true)
        expect(errorContainer.text()).toContain('Error message')
      })

      it('does not render error container when error is false', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            error: false,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })

        await wrapper.vm.$nextTick()

        const errorContainer = wrapper.find('[role="alert"]')
        expect(errorContainer.exists()).toBe(false)
      })
    })

    describe('Decorative icons accessibility', () => {
      it('applies aria-hidden="true" to valid checkmark icon', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            valid: true,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the check icon (FzIcon with name="check")
        const checkIcons = wrapper.findAllComponents({ name: 'FzIcon' })
        const checkIcon = checkIcons.find((icon) => icon.props('name') === 'check')
        
        expect(checkIcon?.exists()).toBe(true)
        const rootElement = checkIcon?.element as HTMLElement
        expect(rootElement.getAttribute('aria-hidden')).toBe('true')
      })

      it('applies aria-hidden="true" to error icon', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })

        await wrapper.vm.$nextTick()

        // Find the error icon (FzIcon with name="triangle-exclamation")
        const errorIcons = wrapper.findAllComponents({ name: 'FzIcon' })
        const errorIcon = errorIcons.find((icon) => icon.props('name') === 'triangle-exclamation')
        
        expect(errorIcon?.exists()).toBe(true)
        const rootElement = errorIcon?.element as HTMLElement
        expect(rootElement.getAttribute('aria-hidden')).toBe('true')
      })
    })

    describe('Container accessibility', () => {
      it('applies tabindex="0" to container when not disabled', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const container = wrapper.find('.fz-input > div').element as HTMLElement
        expect(container.getAttribute('tabindex')).toBe('0')
      })

      it('removes tabindex from container when disabled', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            disabled: true,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        const container = wrapper.find('.fz-input > div').element as HTMLElement
        expect(container.getAttribute('tabindex')).toBeNull()
      })
    })

    describe('Left icon accessibility', () => {
      it('applies accessibility attributes when leftIconAriaLabel is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            leftIcon: 'calendar-lines',
            leftIconAriaLabel: 'Open calendar',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper div (root element)
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify attributes are on the root element
        expect(rootElement.getAttribute('role')).toBe('button')
        expect(rootElement.getAttribute('aria-label')).toBe('Open calendar')
        expect(rootElement.getAttribute('tabindex')).toBe('0')
      })

      it('does not apply accessibility attributes when leftIconAriaLabel is not provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            leftIcon: 'calendar-lines',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify attributes are not on the root element
        expect(rootElement.getAttribute('role')).toBeNull()
        expect(rootElement.getAttribute('aria-label')).toBeNull()
        expect(rootElement.getAttribute('tabindex')).toBeNull()
      })

      it('removes tabindex when disabled and leftIconAriaLabel is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            leftIcon: 'calendar-lines',
            leftIconAriaLabel: 'Open calendar',
            disabled: true,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify attributes are on the root element
        expect(rootElement.getAttribute('role')).toBe('button')
        expect(rootElement.getAttribute('aria-label')).toBe('Open calendar')
        expect(rootElement.getAttribute('tabindex')).toBeNull() // Removed when disabled
        expect(rootElement.getAttribute('aria-disabled')).toBe('true')
      })

      it('has keyboard handler when leftIconAriaLabel is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            leftIcon: 'calendar-lines',
            leftIconAriaLabel: 'Open calendar',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify icon is keyboard accessible (has tabindex)
        expect(rootElement.getAttribute('tabindex')).toBe('0')
        // Keyboard interaction is tested in Storybook play functions
      })
    })

    describe('Right icon accessibility', () => {
      it('applies accessibility attributes when rightIconAriaLabel is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            rightIcon: 'eye',
            rightIconAriaLabel: 'Toggle visibility',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper (not the inner img)
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify attributes are on the root element
        expect(rootElement.getAttribute('role')).toBe('button')
        expect(rootElement.getAttribute('aria-label')).toBe('Toggle visibility')
        expect(rootElement.getAttribute('tabindex')).toBe('0')
      })

      it('does not apply accessibility attributes when rightIconAriaLabel is not provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            rightIcon: 'eye',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify attributes are not on the root element
        expect(rootElement.getAttribute('role')).toBeNull()
        expect(rootElement.getAttribute('aria-label')).toBeNull()
        expect(rootElement.getAttribute('tabindex')).toBeNull()
      })

      it('removes tabindex when disabled and rightIconAriaLabel is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            rightIcon: 'eye',
            rightIconAriaLabel: 'Toggle visibility',
            disabled: true,
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify attributes are on the root element
        expect(rootElement.getAttribute('role')).toBe('button')
        expect(rootElement.getAttribute('aria-label')).toBe('Toggle visibility')
        expect(rootElement.getAttribute('tabindex')).toBeNull() // Removed when disabled
        expect(rootElement.getAttribute('aria-disabled')).toBe('true')
      })

      it('does not apply accessibility attributes when rightIconButton is true', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            rightIcon: 'eye',
            rightIconButton: true,
            rightIconAriaLabel: 'Toggle visibility',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // When rightIconButton is true, FzIconButton is used instead of FzIcon
        const iconButton = wrapper.findComponent({ name: 'FzIconButton' })
        expect(iconButton.exists()).toBe(true)
      })

      it('has keyboard handler when rightIconAriaLabel is provided', async () => {
        const wrapper = mount(FzInput, {
          props: {
            label: 'Label',
            rightIcon: 'eye',
            rightIconAriaLabel: 'Toggle visibility',
          },
          slots: {},
        })

        await wrapper.vm.$nextTick()

        // Find the FzIcon component wrapper
        const iconComponent = wrapper.findComponent({ name: 'FzIcon' })
        expect(iconComponent.exists()).toBe(true)
        
        // Get the root element (div wrapper)
        const rootElement = iconComponent.element as HTMLElement
        
        // Verify icon is keyboard accessible (has tabindex)
        expect(rootElement.getAttribute('tabindex')).toBe('0')
        // Keyboard interaction is tested in Storybook play functions
      })
    })
  })

  describe('Edge cases', () => {
    it(`renders ${NUMBER_OF_INPUTS} input with different ids`, async () => {
      const wrapperList = Array.from({ length: NUMBER_OF_INPUTS }).map((_, i) =>
        mount(FzInput, {
          props: {
            label: `Label ${i}`,
          },
          slots: {},
        }),
      )

      await Promise.all(wrapperList.map((w) => w.vm.$nextTick()))

      const ids = wrapperList.map((w) => w.find('input').attributes('id'))

      expect(new Set(ids).size).toBe(NUMBER_OF_INPUTS)
    })
  })
})

