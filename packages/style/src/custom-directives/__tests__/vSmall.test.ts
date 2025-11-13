import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vSmall } from '../vSmall'

describe('v-small Directive', () => {
  let consoleErrorSpy: any

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('Valid usage on paragraph', () => {
    it('should apply text-sm class', async () => {
      const TestComponent = {
        template: '<p v-small>Small text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            small: vSmall,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(true)
    })

    it('should remove text-sm when value is false', async () => {
      const TestComponent = {
        template: '<p v-small="false">Normal text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            small: vSmall,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(false)
    })

    it('should update when binding changes', async () => {
      const TestComponent = {
        template: '<p v-small="isSmall">Text</p>',
        data() {
          return { isSmall: true }
        },
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            small: vSmall,
          },
        },
      })

      await wrapper.vm.$nextTick()
      let element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(true)

      await wrapper.setData({ isSmall: false })
      await wrapper.vm.$nextTick()
      element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(false)
    })
  })

  describe('Invalid usage', () => {
    it('should not apply class on invalid element', async () => {
      const TestComponent = {
        template: '<div v-small>Test</div>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            small: vSmall,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should not apply class on heading', async () => {
      const TestComponent = {
        template: '<h1 v-small>Heading</h1>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            small: vSmall,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})

