import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vBold } from '../vBold'

describe('v-bold Directive', () => {
  let consoleErrorSpy: any

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('Valid usage on paragraph', () => {
    it('should apply font-semibold class', async () => {
      const TestComponent = {
        template: '<p v-bold>Bold text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            bold: vBold,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('font-semibold')).toBe(true)
    })

    it('should remove font-semibold when value is false', async () => {
      const TestComponent = {
        template: '<p v-bold="false">Normal text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            bold: vBold,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('font-semibold')).toBe(false)
    })

    it('should update when binding changes', async () => {
      const TestComponent = {
        template: '<p v-bold="isBold">Text</p>',
        data() {
          return { isBold: true }
        },
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            bold: vBold,
          },
        },
      })

      await wrapper.vm.$nextTick()
      let element = wrapper.element as HTMLElement
      expect(element.classList.contains('font-semibold')).toBe(true)

      await wrapper.setData({ isBold: false })
      await wrapper.vm.$nextTick()
      element = wrapper.element as HTMLElement
      expect(element.classList.contains('font-semibold')).toBe(false)
    })
  })

  describe('Invalid usage', () => {
    it('should not apply class on invalid element', async () => {
      const TestComponent = {
        template: '<div v-bold>Test</div>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            bold: vBold,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('font-semibold')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should not apply class on heading', async () => {
      const TestComponent = {
        template: '<h1 v-bold>Heading</h1>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            bold: vBold,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('font-semibold')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})

