// FzButtonGroup.test.ts

import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import FzButtonGroup from '../FzButtonGroup.vue'

describe('FzButtonGroup', () => {
  describe('Rendering', () => {
    it('renders correctly with buttons', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
      })
      expect(wrapper.html()).to.include('Button 1')
      expect(wrapper.html()).to.include('Button 2')
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders with empty slot', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: ''
        }
      })
      expect(wrapper.html()).toBeTruthy()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('renders single button correctly', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: '<button>Single Button</button>'
        }
      })
      expect(wrapper.html()).to.include('Single Button')
    })
  })

  describe('Layout', () => {
    it('applies horizontal layout classes', () => {
      const wrapper = mount(FzButtonGroup)
      expect(wrapper.classes()).to.include('flex')
      expect(wrapper.classes()).to.include('flex-row')
      expect(wrapper.classes()).not.to.include('flex-col')
    })

    it('applies fixed gap class', () => {
      const wrapper = mount(FzButtonGroup)
      expect(wrapper.classes()).to.include('gap-16')
    })
  })

  describe('Accessibility', () => {
    it('renders semantic container element', () => {
      const wrapper = mount(FzButtonGroup)
      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
    })

    it('preserves button accessibility attributes', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: '<button aria-label="Action 1">Button 1</button><button aria-label="Action 2">Button 2</button>'
        }
      })
      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-label')).toBe('Action 1')
      expect(buttons[1].attributes('aria-label')).toBe('Action 2')
    })

    it('allows button children to maintain keyboard navigation', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: '<button>Button 1</button><button>Button 2</button>'
        }
      })
      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.element.tagName).toBe('BUTTON')
      })
    })

    it('does not interfere with button disabled state', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: '<button disabled>Disabled Button</button>'
        }
      })
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('handles many buttons correctly', () => {
      const buttons = Array.from({ length: 10 }, (_, i) => `<button>Button ${i + 1}</button>`).join('')
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: buttons
        }
      })
      const buttonElements = wrapper.findAll('button')
      expect(buttonElements.length).toBe(10)
    })

    it('handles buttons with different content types', () => {
      const wrapper = mount(FzButtonGroup, {
        slots: {
          default: '<button>Text</button><button><span>HTML</span></button>'
        }
      })
      expect(wrapper.html()).to.include('Text')
      expect(wrapper.html()).to.include('<span>HTML</span>')
    })
  })
})
