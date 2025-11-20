import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzCurrencyInput } from '..'

describe('FzCurrencyInput', () => {
  describe('Currency formatting', () => {
    it('renders floating numbers as currency', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          amount: 1234.56,
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
        },
      })

      const inputElement = wrapper.find('input')
      await inputElement.trigger('blur')
      // flushPromises doesn't seem to be enough since the implementation
      // of the composable uses setTimeout itself
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1234,56')
    })

    it('should not allow inputs other than digits and separators', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          amount: 0,
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
        },
      })

      const inputElement = wrapper.find('input')
      await inputElement.setValue('as12.3')
      await inputElement.trigger('input')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('12.3')
      await inputElement.trigger('blur')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('12,30')
    })

    it('should allow to set value at 0', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          amount: 10,
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
        },
      })

      const inputElement = wrapper.find('input')
      await inputElement.trigger('blur')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('10,00')
      wrapper.setProps({ amount: 0 })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('0,00')
    })
  })

  describe('Paste handling', () => {
    it('should handle pasted values using the best possible heuristic to parse and render it correctly', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
        },
      })

      const inputElement = wrapper.find('input')

      // Test case 1: Multiple separators (thousands and decimal)
      await inputElement.trigger('paste', {
        clipboardData: {
          getData() {
            return '1.233.222,43'
          },
        },
      })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1233222,43')

      // Test case 2: Single separator with less than 3 digits after (decimal)
      await inputElement.trigger('paste', {
        clipboardData: {
          getData() {
            return '1.23'
          },
        },
      })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1,23')

      // Test case 3: Comma as decimal separator
      await inputElement.trigger('paste', {
        clipboardData: {
          getData() {
            return '1,23'
          },
        },
      })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1,23')

      // Test case 4: Multiple dots (thousands separator)
      await inputElement.trigger('paste', {
        clipboardData: {
          getData() {
            return '1.232.111'
          },
        },
      })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1232111,00')

      // Test case 5: Single dot with 3 digits after (ambiguous - treated as decimal)
      await inputElement.trigger('paste', {
        clipboardData: {
          getData() {
            return '1.232'
          },
        },
      })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1,23')

      // Test case 6: Single dot with more than 3 digits after (ambiguous - treated as decimal)
      await inputElement.trigger('paste', {
        clipboardData: {
          getData() {
            return '1.232555'
          },
        },
      })
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1,23')
    })
  })

  describe('Value constraints', () => {
    it('should limit value according to min/max setting', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          amount: 10,
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
          min: 2,
          max: 20,
        },
      })

      const inputElement = wrapper.find('input')
      await inputElement.trigger('blur')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('10,00')
      await wrapper.setProps({ amount: 1 })
      await inputElement.trigger('blur')
      expect(inputElement.element.value).toBe('2,00')
      await wrapper.setProps({ amount: 23 })
      await inputElement.trigger('blur')
      expect(inputElement.element.value).toBe('20,00')
    })
  })

  describe('Step quantization', () => {
    it('should step correctly when using quantization via the step prop', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          amount: 1,
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
          step: 4,
        },
      })

      const inputElement = wrapper.find('input')
      const arrowUp = wrapper.find('.fz__currencyinput__arrowup')
      const arrowDown = wrapper.find('.fz__currencyinput__arrowdown')

      await inputElement.trigger('blur')
      expect(inputElement.element.value).toBe('1,00')
      await arrowUp.trigger('click')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('5,00')
      await arrowDown.trigger('click')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('1,00')
      await arrowDown.trigger('click')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('-3,00')
    })

    it('should enforce quantization via the forceStep prop', async () => {
      const wrapper = mount(FzCurrencyInput, {
        props: {
          label: 'Label',
          amount: 8,
          'onUpdate:amount': (e) => wrapper.setProps({ amount: e }),
          step: 4,
          forceStep: true,
        },
      })

      const inputElement = wrapper.find('input')
      await inputElement.trigger('blur')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('8,00')
      await wrapper.setProps({ amount: 5 })
      await inputElement.trigger('blur')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('4,00')
      await wrapper.setProps({ amount: -7 })
      await inputElement.trigger('blur')
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      expect(inputElement.element.value).toBe('-8,00')
    })
  })
})

