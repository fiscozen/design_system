import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp } from 'vue'
import { vColor } from '../vColor'
import { setupFzStyle } from '../../index'

describe('v-color Directive', () => {
  let app: ReturnType<typeof createApp>
  let consoleErrorSpy: any

  beforeEach(() => {
    app = createApp({})
    setupFzStyle(app)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('Valid usage on paragraph', () => {
    it('should apply default color class (blue-500)', async () => {
      const TestComponent = {
        template: '<p v-color:blue>Test text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-500')).toBe(true)
    })

    it('should apply explicit weight class', async () => {
      const TestComponent = {
        template: '<p v-color:blue="300">Test text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-300')).toBe(true)
    })

    it('should apply semantic color with default weight', async () => {
      const TestComponent = {
        template: '<p v-color:semantic-error>Error text</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-semantic-error-200')).toBe(true)
    })

    it('should remove color classes when value is false', async () => {
      const TestComponent = {
        template: '<p v-color:blue="false">Test text</p>',
        data() {
          return { hasColor: true }
        },
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      // First apply color
      await wrapper.setData({ hasColor: true })
      await wrapper.vm.$nextTick()

      // Then remove it
      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-500')).toBe(false)
    })
  })

  describe('Valid usage on headings', () => {
    it('should apply color to H1', async () => {
      const TestComponent = {
        template: '<h1 v-color:blue>Heading</h1>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-500')).toBe(true)
    })

    it('should apply color to H2', async () => {
      const TestComponent = {
        template: '<h2 v-color:purple="700">Heading</h2>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-purple-700')).toBe(true)
    })

    it('should not log error for valid H2 with v-color (regression test for false positive)', async () => {
      // This test verifies the fix for the original issue:
      // H2 with v-color should not log "[v-color] Directive can not be used on: h2"
      const TestComponent = {
        template: '<h2 v-color:blue>Heading</h2>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-500')).toBe(true)
      // Critical: verify no error was logged for valid H2 usage
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should apply color to H3', async () => {
      const TestComponent = {
        template: '<h3 v-color:semantic-success>Success</h3>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-semantic-success-200')).toBe(true)
    })
  })

  describe('Invalid usage', () => {
    it('should not apply class on invalid element', async () => {
      const TestComponent = {
        template: '<div v-color:blue>Test</div>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-500')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle invalid color name', async () => {
      const TestComponent = {
        template: '<p v-color:invalid>Test</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-invalid-500')).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('Class removal', () => {
    it('should remove existing color classes when new color is applied', async () => {
      const TestComponent = {
        template: '<p v-color:blue class="text-orange-500">Test</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-blue-500')).toBe(true)
      expect(element.classList.contains('text-orange-500')).toBe(false)
    })

    it('should not remove non-color text classes', async () => {
      const TestComponent = {
        template: '<p v-color:blue class="text-sm text-left">Test</p>',
      }
      const wrapper = mount(TestComponent, {
        global: {
          directives: {
            color: vColor,
          },
        },
      })

      await wrapper.vm.$nextTick()
      const element = wrapper.element as HTMLElement
      expect(element.classList.contains('text-sm')).toBe(true)
      expect(element.classList.contains('text-left')).toBe(true)
      expect(element.classList.contains('text-blue-500')).toBe(true)
    })
  })
})

