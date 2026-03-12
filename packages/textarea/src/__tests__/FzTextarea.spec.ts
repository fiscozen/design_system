import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzTextarea } from '..'

describe('FzTextarea', () => {
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

    it('should not render label element when label is not provided', () => {
      const wrapper = mount(FzTextarea)
      expect(wrapper.find('label').exists()).toBe(false)
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

    it('should render error message via FzAlert when error is true and errorMessage slot is provided', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
        },
        slots: {
          errorMessage: 'This field is required',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('This field is required')
      const alert = wrapper.findComponent({ name: 'FzAlert' })
      expect(alert.exists()).toBe(true)
      expect(alert.props('tone')).toBe('error')
      expect(alert.props('variant')).toBe('text')
    })

    it('should render help text when helpText slot is provided', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
        slots: {
          helpText: 'This is helpful text',
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
        },
        slots: {
          errorMessage: 'This field is required',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain('This field is required')
    })
  })

  describe('Props', () => {
    describe('size prop (deprecated)', () => {
      it('should always use text-base regardless of size prop', () => {
        const smWrapper = mount(FzTextarea, {
          props: { label: 'Test Label', size: 'sm' },
        })
        const lgWrapper = mount(FzTextarea, {
          props: { label: 'Test Label', size: 'lg' },
        })
        expect(smWrapper.find('textarea').classes()).toContain('text-base')
        expect(smWrapper.find('textarea').classes()).not.toContain('text-sm')
        expect(lgWrapper.find('textarea').classes()).toContain('text-base')
        expect(lgWrapper.find('textarea').classes()).not.toContain('text-lg')
      })

      it('should use text-base by default', () => {
        const wrapper = mount(FzTextarea, {
          props: { label: 'Test Label' },
        })
        expect(wrapper.find('textarea').classes()).toContain('text-base')
      })

      it('should emit console.warn when size is not md', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        mount(FzTextarea, {
          props: { label: 'Test Label', size: 'sm' },
        })
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('"size" prop is deprecated')
        )
        warnSpy.mockRestore()
      })

      it('should emit console.warn when size is md (any value triggers warning)', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        mount(FzTextarea, {
          props: { label: 'Test Label', size: 'md' },
        })
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('"size" prop is deprecated')
        )
        warnSpy.mockRestore()
      })

      it('should not emit console.warn when size is not provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        mount(FzTextarea, {
          props: { label: 'Test Label' },
        })
        expect(warnSpy).not.toHaveBeenCalled()
        warnSpy.mockRestore()
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

      it('should apply grey label color when readonly', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            readonly: true,
          },
        })
        expect(wrapper.find('label').classes()).toContain('text-grey-300')
      })

      it('should apply same visual styling as disabled (matching FzInput)', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            readonly: true,
          },
        })
        const textarea = wrapper.find('textarea')
        expect(textarea.classes()).toContain('bg-grey-100')
        expect(textarea.classes()).toContain('border-grey-100')
        expect(textarea.classes()).toContain('text-grey-300')
        expect(textarea.classes()).toContain('cursor-not-allowed')
      })

      it('should apply cursor-not-allowed to container when readonly', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            readonly: true,
          },
        })
        expect(wrapper.find('.cursor-not-allowed').exists()).toBe(true)
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
        expect(wrapper.find('textarea').classes()).toContain('border-semantic-error-200')
        expect(wrapper.find('textarea').classes()).toContain('focus:border-semantic-error-300')
      })

      it('should apply default border class when false', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: false,
          },
        })
        expect(wrapper.find('textarea').classes()).toContain('border-grey-300')
        expect(wrapper.find('textarea').classes()).toContain('focus:border-blue-600')
      })
    })

    describe('valid prop', () => {
      it('should render check icon with fixed sm size', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            valid: true,
          },
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props('name')).toBe('check')
        expect(icon.props('size')).toBe('sm')
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
      it('should apply explicit id to textarea and label for attribute', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-textarea-id',
          },
        })
        expect(wrapper.find('textarea').attributes('id')).toBe('test-textarea-id')
        expect(wrapper.find('label').attributes('for')).toBe('test-textarea-id')
      })

      it('should auto-generate id when id prop is not provided', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        const textarea = wrapper.find('textarea')
        const label = wrapper.find('label')
        const textareaId = textarea.attributes('id')
        expect(textareaId).toBeTruthy()
        expect(textareaId).toMatch(/^fz-textarea-/)
        expect(label.attributes('for')).toBe(textareaId)
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

  describe('Events', () => {
    it('should forward blur event to parent via $attrs', async () => {
      const onBlur = vi.fn()
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
        attrs: { onBlur },
      })
      await wrapper.find('textarea').trigger('blur')
      expect(onBlur).toHaveBeenCalledTimes(1)
    })

    it('should forward focus event to parent via $attrs', async () => {
      const onFocus = vi.fn()
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
        attrs: { onFocus },
      })
      await wrapper.find('textarea').trigger('focus')
      expect(onFocus).toHaveBeenCalledTimes(1)
    })

    it('should forward paste event to parent via $attrs', async () => {
      const onPaste = vi.fn()
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
        attrs: { onPaste },
      })
      await wrapper.find('textarea').trigger('paste')
      expect(onPaste).toHaveBeenCalledTimes(1)
    })

    it('should forward arbitrary native events via $attrs', async () => {
      const onKeydown = vi.fn()
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
        attrs: { onKeydown },
      })
      await wrapper.find('textarea').trigger('keydown')
      expect(onKeydown).toHaveBeenCalledTimes(1)
    })

    it('should emit update:modelValue when textarea value changes', async () => {
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
      })
      const textarea = wrapper.find('textarea')
      await textarea.setValue('New value')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['New value'])
    })

    it('should not apply $attrs to root element (inheritAttrs: false)', () => {
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
        attrs: { 'data-custom': 'value' },
      })
      const root = wrapper.find('.fz-textarea')
      const textarea = wrapper.find('textarea')
      expect(root.attributes('data-custom')).toBeUndefined()
      expect(textarea.attributes('data-custom')).toBe('value')
    })
  })

  describe('Expose', () => {
    it('should expose textareaRef for programmatic focus', () => {
      const wrapper = mount(FzTextarea, {
        props: { label: 'Test Label' },
      })
      expect(wrapper.vm.textareaRef).toBeDefined()
      expect(wrapper.vm.textareaRef).toBeInstanceOf(HTMLTextAreaElement)
    })
  })

  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have label associated with textarea via id, for, and aria-labelledby', () => {
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
        expect(label.attributes('id')).toBe('test-id-label')
        expect(textarea.attributes('aria-labelledby')).toBe('test-id-label')
      })

      it('should not have aria-labelledby when label is not provided', () => {
        const wrapper = mount(FzTextarea, {
          props: { id: 'test-id' },
        })
        expect(wrapper.find('textarea').attributes('aria-labelledby')).toBeUndefined()
      })

      it('should have aria-required="true" when required', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            required: true,
          },
        })
        expect(wrapper.find('textarea').attributes('aria-required')).toBe('true')
      })

      it('should have aria-required="false" when not required', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-required')).toBe('false')
      })

      it('should have aria-invalid="true" when error', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
      })

      it('should have aria-invalid="false" when no error', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('false')
      })

      it('should have aria-disabled="true" when disabled', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            disabled: true,
          },
        })
        expect(wrapper.find('textarea').attributes('aria-disabled')).toBe('true')
      })

      it('should have aria-disabled="false" when not disabled', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-disabled')).toBe('false')
      })

      it('should have aria-describedby linking to error message when error is present', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-id',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('test-id-error')
      })

      it('should have aria-describedby linking to help text when helpText slot is present', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-id',
          },
          slots: {
            helpText: 'Help message',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('test-id-help')
      })

      it('should not have aria-describedby when no error or help message', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-describedby')).toBeUndefined()
      })

      it('should link aria-describedby to error message over help text when both slots present', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-id',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
            helpText: 'Help message',
          },
        })
        expect(wrapper.find('textarea').attributes('aria-describedby')).toBe('test-id-error')
      })
    })

    describe('Error message accessibility', () => {
      it('should have role="alert" on error message container', async () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
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

      it('should have id on error message container matching aria-describedby', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-id',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })
        const errorContainer = wrapper.find('[role="alert"]')
        expect(errorContainer.attributes('id')).toBe('test-id-error')
      })

      it('should have id on help text matching aria-describedby', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            id: 'test-id',
          },
          slots: {
            helpText: 'Help message',
          },
        })
        const helpSpan = wrapper.find(`#test-id-help`)
        expect(helpSpan.exists()).toBe(true)
        expect(helpSpan.text()).toContain('Help message')
      })
    })

    describe('Decorative icons accessibility', () => {
      it('should have aria-hidden on valid check icon', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            valid: true,
          },
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.attributes('aria-hidden')).toBe('true')
      })

      it('should have aria-hidden on error icon rendered by FzAlert', () => {
        const wrapper = mount(FzTextarea, {
          props: {
            label: 'Test Label',
            error: true,
          },
          slots: {
            errorMessage: 'Error message',
          },
        })
        const errorIcon = wrapper
          .findAllComponents({ name: 'FzIcon' })
          .find((icon) => icon.props('name') === 'circle-xmark')
        expect(errorIcon?.exists()).toBe(true)
        expect(errorIcon?.attributes('aria-hidden')).toBe('true')
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
      expect(textarea.classes()).toContain('outline-none')
      expect(textarea.classes()).toContain('focus:ring-0')
      expect(textarea.classes()).toContain('focus:outline-none')
      expect(textarea.classes()).toContain('bg-core-white')
      expect(textarea.classes()).toContain('text-core-black')
      expect(textarea.classes()).toContain('cursor-text')
      expect(textarea.classes()).toContain('min-w-[96px]')
      expect(textarea.classes()).toContain('placeholder:text-grey-300')
    })

    it('should apply container classes with fz-textarea identifier', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      const container = wrapper.find('.fz-textarea')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('flex-col')
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
      expect(wrapper.find('textarea').classes()).toContain('bg-grey-100')
      expect(wrapper.find('textarea').classes()).toContain('border-grey-100')
      expect(wrapper.find('textarea').classes()).toContain('text-grey-300')
      expect(wrapper.find('textarea').classes()).toContain('cursor-not-allowed')
    })

    it('should apply error border and focus classes when error is true', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
        },
      })
      expect(wrapper.find('textarea').classes()).toContain('border-semantic-error-200')
      expect(wrapper.find('textarea').classes()).toContain('focus:border-semantic-error-300')
    })

    it('should apply default border and focus classes when error is false', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: false,
        },
      })
      expect(wrapper.find('textarea').classes()).toContain('border-grey-300')
      expect(wrapper.find('textarea').classes()).toContain('focus:border-blue-600')
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

    it('should apply font-normal text-base to label', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
      })
      const label = wrapper.find('label')
      expect(label.classes()).toContain('font-normal')
      expect(label.classes()).toContain('text-base')
      expect(label.classes()).toContain('text-core-black')
    })

    it('should apply grey label when disabled or readonly', () => {
      const disabledWrapper = mount(FzTextarea, {
        props: { label: 'Test Label', disabled: true },
      })
      expect(disabledWrapper.find('label').classes()).toContain('text-grey-300')
      expect(disabledWrapper.find('label').classes()).not.toContain('text-core-black')

      const readonlyWrapper = mount(FzTextarea, {
        props: { label: 'Test Label', readonly: true },
      })
      expect(readonlyWrapper.find('label').classes()).toContain('text-grey-300')
      expect(readonlyWrapper.find('label').classes()).not.toContain('text-core-black')
    })

    it('should apply font-normal text-base to help text', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
        },
        slots: {
          helpText: 'Help text',
        },
      })
      const helpSpan = wrapper.find('span')
      expect(helpSpan.classes()).toContain('font-normal')
      expect(helpSpan.classes()).toContain('text-base')
      expect(helpSpan.classes()).toContain('text-grey-500')
    })

    it('should apply grey help text color when disabled', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          disabled: true,
        },
        slots: {
          helpText: 'Help text',
        },
      })
      const helpSpan = wrapper.find('span')
      expect(helpSpan.classes()).toContain('text-grey-300')
      expect(helpSpan.classes()).not.toContain('text-grey-500')
    })
  })

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

    it('should not show error when error is true but no errorMessage slot', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
        },
      })
      await wrapper.vm.$nextTick()
      const errorContainer = wrapper.find('[role="alert"]')
      expect(errorContainer.exists()).toBe(false)
    })

    it('should handle both errorMessage and helpText slots (error takes precedence)', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
        },
        slots: {
          errorMessage: 'Error message',
          helpText: 'Help message',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Error message')
      expect(wrapper.text()).not.toContain('Help message')
    })

    it('should show error message even when disabled', async () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          error: true,
          disabled: true,
        },
        slots: {
          errorMessage: 'Error on disabled',
        },
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Error on disabled')
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
      expect(wrapper.find('textarea').attributes('aria-disabled')).toBe('true')
    })

    it('should grey out help text when disabled', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          disabled: true,
        },
        slots: {
          helpText: 'Help text',
        },
      })
      const helpSpan = wrapper.find('span')
      expect(helpSpan.classes()).toContain('text-grey-300')
      expect(helpSpan.classes()).not.toContain('text-grey-500')
      expect(wrapper.find('label').classes()).toContain('text-grey-300')
    })

    it('should show required asterisk with help text simultaneously', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          required: true,
        },
        slots: {
          helpText: 'This field is mandatory',
        },
      })
      expect(wrapper.find('label').text()).toContain('*')
      expect(wrapper.text()).toContain('This field is mandatory')
      expect(wrapper.find('textarea').attributes('aria-required')).toBe('true')
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

  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-default',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with required', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-required',
          required: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-disabled',
          disabled: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - error state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-error',
          error: true,
        },
        slots: {
          errorMessage: 'This field is required',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - valid state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-valid',
          valid: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with help text slot', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-help',
        },
        slots: {
          helpText: 'This is helpful text',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - readonly state', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-readonly',
          readonly: true,
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - small size', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-sm',
          size: 'sm',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - large size', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-lg',
          size: 'lg',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with all props and slots', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-all',
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
        },
        slots: {
          helpText: 'Help text',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - error with disabled', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-error-disabled',
          error: true,
          disabled: true,
        },
        slots: {
          errorMessage: 'Error on disabled',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - help with disabled', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-help-disabled',
          disabled: true,
        },
        slots: {
          helpText: 'Help text',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - required with help', () => {
      const wrapper = mount(FzTextarea, {
        props: {
          label: 'Test Label',
          id: 'snapshot-required-help',
          required: true,
        },
        slots: {
          helpText: 'Mandatory field',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
