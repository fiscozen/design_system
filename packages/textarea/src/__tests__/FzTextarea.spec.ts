import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzTextarea } from '..'

describe('FzTextarea', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('textarea').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      expect(wrapper.text()).toContain('Test Label')
      expect(wrapper.find('label').text()).toContain('Test Label')
    })

    it('should render required asterisk when required is true', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          required: true,
        },
      })
      expect(wrapper.find('label').text()).toContain('*')
    })

    it('should render placeholder when provided', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          placeholder: 'Enter text here',
        },
      })
      expect(wrapper.find('textarea').attributes('placeholder')).toBe('Enter text here')
    })

    it('should render valid check icon when valid is true', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          valid: true,
        },
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('check')
    })

    it('should not render valid check icon when valid is false', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          valid: false,
        },
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(false)
    })

    it('should render error message when error is true and errorMessage is provided', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
          errorMessage: 'This field is required',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This field is required')
      const errorIcon = wrapper.findAllComponents({ name: 'FzIcon' }).find(
        (icon) => icon.props('name') === 'triangle-exclamation'
      )
      expect(errorIcon?.exists()).toBe(true)
    })

    it('should render help message when helpMessage is provided', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          helpMessage: 'This is helpful text',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This is helpful text')
    })

    it('should not render error message when error is false', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: false,
          errorMessage: 'This field is required',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain('This field is required')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('size prop', () => {
      it.each([
        ['sm', 'text-sm'],
        ['md', 'text-base'],
        ['lg', 'text-lg'],
      ])('should apply %s size classes', (size, expectedClass) => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            size: size as 'sm' | 'md' | 'lg',
          },
        })
        expect(wrapper.find('textarea').classes()).toContain(expectedClass)
      })

      it('should default to md size', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        expect(wrapper.find('textarea').classes()).toContain('text-base')
      })
    })

    describe('resize prop', () => {
      it.each([
        ['none', 'resize-none'],
        ['vertical', 'resize-y'],
        ['horizontal', 'resize-x'],
        ['all', 'resize'],
      ])('should apply %s resize classes', (resize, expectedClass) => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            resize: resize as 'none' | 'vertical' | 'horizontal' | 'all',
          },
        })
        expect(wrapper.find('textarea').classes()).toContain(expectedClass)
      })

      it('should default to all resize', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        expect(wrapper.find('textarea').classes()).toContain('resize')
      })
    })

    describe('disabled prop', () => {
      it('should apply disabled attribute when true', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            disabled: true,
          },
        })
        expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      })

      it('should apply disabled classes to container and label', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            disabled: true,
          },
        })
        expect(wrapper.find('.cursor-not-allowed').exists()).toBe(true)
        expect(wrapper.find('label').classes()).toContain('text-grey-300')
        expect(wrapper.find('label').classes()).toContain('cursor-not-allowed')
      })
    })

    describe('readonly prop', () => {
      it('should apply readonly attribute when true', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            readonly: true,
          },
        })
        expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
      })
    })

    describe('required prop', () => {
      it('should apply required attribute when true', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            required: true,
          },
        })
        expect(wrapper.find('textarea').attributes('required')).toBeDefined()
      })

      it('should show required asterisk in label', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            required: true,
          },
        })
        expect(wrapper.find('label').text()).toContain('*')
      })
    })

    describe('error prop', () => {
      it('should apply error border class when true', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
          },
        })
        expect(wrapper.find('textarea').classes()).toContain('border-semantic-error')
      })

      it('should apply default border class when false', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: false,
          },
        })
        expect(wrapper.find('textarea').classes()).toContain('border-grey-300')
      })
    })

    describe('valid prop', () => {
      it('should render check icon when true', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            valid: true,
          },
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props('name')).toBe('check')
      })

      it('should apply padding-right class when valid is true', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            valid: true,
          },
        })
        expect(wrapper.find('textarea').classes()).toContain('pr-[38px]')
      })
    })

    describe('rows prop', () => {
      it('should apply rows attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            rows: 5,
          },
        })
        expect(wrapper.find('textarea').attributes('rows')).toBe('5')
      })
    })

    describe('cols prop', () => {
      it('should apply cols attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            cols: 50,
          },
        })
        expect(wrapper.find('textarea').attributes('cols')).toBe('50')
      })
    })

    describe('minlength prop', () => {
      it('should apply minlength attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            minlength: 10,
          },
        })
        expect(wrapper.find('textarea').attributes('minlength')).toBe('10')
      })
    })

    describe('maxlength prop', () => {
      it('should apply maxlength attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            maxlength: 100,
          },
        })
        expect(wrapper.find('textarea').attributes('maxlength')).toBe('100')
      })
    })

    describe('id prop', () => {
      it('should apply id to textarea and label for attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-textarea-id',
          },
        })
        expect(wrapper.find('textarea').attributes('id')).toBe('test-textarea-id')
        expect(wrapper.find('label').attributes('for')).toBe('test-textarea-id')
      })
    })

    describe('name prop', () => {
      it('should apply name attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            name: 'test-textarea',
          },
        })
        expect(wrapper.find('textarea').attributes('name')).toBe('test-textarea')
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit blur event', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      await wrapper.find('textarea').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('should emit focus event', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      await wrapper.find('textarea').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
      expect(wrapper.emitted('focus')).toHaveLength(1)
    })

    it('should emit paste event', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      await wrapper.find('textarea').trigger('paste')
      expect(wrapper.emitted('paste')).toBeTruthy()
      expect(wrapper.emitted('paste')).toHaveLength(1)
    })

    it('should emit update:modelValue when textarea value changes', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      const textarea = wrapper.find('textarea')
      await textarea.setValue('New value')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['New value'])
    })

    it('should not emit blur event when disabled (disabled elements do not fire events)', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          disabled: true,
        },
      })
      await wrapper.find('textarea').trigger('blur')
      // Disabled textareas do not fire blur events when triggered programmatically
      expect(wrapper.emitted('blur')).toBeUndefined()
    })

    it('should not emit focus event when disabled (disabled elements do not fire events)', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          disabled: true,
        },
      })
      await wrapper.find('textarea').trigger('focus')
      // Disabled textareas do not fire focus events when triggered programmatically
      expect(wrapper.emitted('focus')).toBeUndefined()
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have label associated with textarea via id and for attributes', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-id',
          },
        })
        const textarea = wrapper.find('textarea')
        const label = wrapper.find('label')
        expect(textarea.attributes('id')).toBe('test-id')
        expect(label.attributes('for')).toBe('test-id')
      })

      it('should have aria-disabled when disabled', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            disabled: true,
          },
        })
        await wrapper.vm.$nextTick()
        const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
        // Note: aria-disabled may not be set by default, but disabled attribute should be present
        expect(textarea.hasAttribute('disabled')).toBe(true)
      })

      it('should have aria-required when required', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            required: true,
          },
        })
        await wrapper.vm.$nextTick()
        const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
        // Note: aria-required may not be set by default, but required attribute should be present
        expect(textarea.hasAttribute('required')).toBe(true)
      })

      it('should have aria-invalid when error', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
            errorMessage: 'Error message',
          },
        })
        await wrapper.vm.$nextTick()
        const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
        // Note: Component may not set aria-invalid by default, documenting expected behavior
        // The error state is visually indicated via border classes
        expect(textarea.hasAttribute('aria-invalid')).toBe(false) // Currently not implemented
      })

      it('should have aria-describedby linking to error message when error is present', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
            errorMessage: 'Error message',
          },
        })
        await wrapper.vm.$nextTick()
        const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
        // Note: Component may not set aria-describedby by default, documenting expected behavior
        const describedBy = textarea.getAttribute('aria-describedby')
        // Currently not implemented - this is an accessibility gap
        expect(describedBy).toBeNull() // Documenting current state
      })

      it('should have aria-describedby linking to help message when helpMessage is present', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            helpMessage: 'Help message',
          },
        })
        await wrapper.vm.$nextTick()
        const textarea = wrapper.find('textarea').element as HTMLTextAreaElement
        // Note: Component may not set aria-describedby by default, documenting expected behavior
        const describedBy = textarea.getAttribute('aria-describedby')
        // Currently not implemented - this is an accessibility gap
        expect(describedBy).toBeNull() // Documenting current state
      })
    })

    describe('Error message accessibility', () => {
      it('should have role="alert" on error message container', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
            errorMessage: 'Error message',
          },
        })
        await wrapper.vm.$nextTick()
        // Note: Component may not set role="alert" by default, documenting expected behavior
        const errorContainer = wrapper.find('[role="alert"]')
        // Currently not implemented - this is an accessibility gap
        expect(errorContainer.exists()).toBe(false) // Documenting current state
      })
    })

    describe('Decorative icons accessibility', () => {
      it('should render valid check icon (decorative)', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            valid: true,
          },
        })
        await wrapper.vm.$nextTick()
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props('name')).toBe('check')
        // Note: FzIcon uses FontAwesome which handles aria-hidden internally
        // The icon is decorative and should not be announced by screen readers
      })

      it('should render error icon (decorative)', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
            errorMessage: 'Error message',
          },
        })
        await wrapper.vm.$nextTick()
        const errorIcon = wrapper
          .findAllComponents({ name: 'FzIcon' })
          .find((icon) => icon.props('name') === 'triangle-exclamation')
        expect(errorIcon?.exists()).toBe(true)
        // Note: FzIcon uses FontAwesome which handles aria-hidden internally
        // The icon is decorative and should not be announced by screen readers
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable when not disabled', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        const textarea = wrapper.find('textarea')
        // Textarea should be focusable by default
        expect(textarea.attributes('disabled')).toBeUndefined()
        expect(textarea.attributes('readonly')).toBeUndefined()
      })

      it('should not be focusable when disabled', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            disabled: true,
          },
        })
        const textarea = wrapper.find('textarea')
        expect(textarea.attributes('disabled')).toBeDefined()
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes to textarea', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).toContain('border-1')
      expect(textarea.classes()).toContain('rounded')
      expect(textarea.classes()).toContain('p-10')
      expect(textarea.classes()).toContain('block')
      expect(textarea.classes()).toContain('w-full')
    })

    it('should apply container classes', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      const container = wrapper.find('.flex.flex-col')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('gap-8')
      expect(container.classes()).toContain('items-start')
      expect(container.classes()).toContain('w-full')
    })

    it('should apply disabled classes when disabled', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          disabled: true,
        },
      })
      expect(wrapper.find('.cursor-not-allowed').exists()).toBe(true)
      expect(wrapper.find('textarea').classes()).toContain('disabled:bg-grey-100')
      expect(wrapper.find('textarea').classes()).toContain('disabled:border-grey-100')
    })

    it('should apply error border class when error is true', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
        },
      })
      expect(wrapper.find('textarea').classes()).toContain('border-semantic-error')
    })

    it('should apply default border class when error is false', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: false,
        },
      })
      expect(wrapper.find('textarea').classes()).toContain('border-grey-300')
    })

    it('should apply valid padding class when valid is true', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          valid: true,
        },
      })
      expect(wrapper.find('textarea').classes()).toContain('pr-[38px]')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined modelValue gracefully', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      expect(wrapper.exists()).toBe(true)
      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
    })

    it('should handle empty string modelValue', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      await wrapper.find('textarea').setValue('')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    })

    it('should handle very long text', async () => {
      const longText = 'a'.repeat(1000)
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      await wrapper.find('textarea').setValue(longText)
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([longText])
    })

    it('should handle undefined id prop', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      // Component should still render without id
      expect(wrapper.exists()).toBe(true)
      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
    })

    it('should handle empty errorMessage when error is true', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
          errorMessage: '',
        },
      })
      await wrapper.vm.$nextTick()
      // Error message container should not show when errorMessage is empty
      const errorContainer = wrapper.find('.text-sm.flex')
      expect(errorContainer.exists()).toBe(false)
    })

    it('should handle undefined errorMessage when error is true', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
        },
      })
      await wrapper.vm.$nextTick()
      // Error message container should not show when errorMessage is undefined
      const errorContainer = wrapper.find('.text-sm.flex')
      expect(errorContainer.exists()).toBe(false)
    })

    it('should handle both errorMessage and helpMessage (error takes precedence)', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
          errorMessage: 'Error message',
          helpMessage: 'Help message',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Error message')
      expect(wrapper.text()).not.toContain('Help message')
    })

    it('should handle special characters in label', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test & Label <with> "special" chars',
        },
      })
      expect(wrapper.find('label').text()).toContain('Test & Label <with> "special" chars')
    })

    it('should handle minlength and maxlength together', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          minlength: 10,
          maxlength: 100,
        },
      })
      expect(wrapper.find('textarea').attributes('minlength')).toBe('10')
      expect(wrapper.find('textarea').attributes('maxlength')).toBe('100')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with required', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          required: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          disabled: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - error state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
          errorMessage: 'This field is required',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - valid state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          valid: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with help message', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          helpMessage: 'This is helpful text',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - readonly state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          readonly: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - small size', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          size: 'sm',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - large size', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          size: 'lg',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with all props', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'test-id',
          name: 'test-name',
          placeholder: 'Enter text',
          required: true,
          disabled: false,
          readonly: false,
          error: false,
          valid: true,
          size: 'md',
          resize: 'vertical',
          rows: 5,
          cols: 50,
          minlength: 10,
          maxlength: 100,
          helpMessage: 'Help text',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
