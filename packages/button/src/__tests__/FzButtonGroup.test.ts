// FzButtonGroup.test.ts

import { mount } from '@vue/test-utils'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { FzContainer } from '@fiscozen/container'
import FzButtonGroup from '../FzButtonGroup.vue'
import FzButton from '../FzButton.vue'

describe('FzButtonGroup', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('Rendering', () => {
    it('renders correctly with buttons', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Button 1" /><FzButton label="Button 2" />'
        }
      })
      expect(wrapper.html()).to.include('Button 1')
      expect(wrapper.html()).to.include('Button 2')
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders with empty slot', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzContainer }
        },
        slots: {
          default: ''
        }
      })
      expect(wrapper.html()).toBeTruthy()
      const container = wrapper.findComponent(FzContainer)
      expect(container.exists()).toBe(true)
    })

    it('renders single button correctly', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Single Button" />'
        }
      })
      expect(wrapper.html()).to.include('Single Button')
    })
  })

  describe('Layout', () => {
    it('uses FzContainer with horizontal prop', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzContainer }
        }
      })
      const container = wrapper.findComponent(FzContainer)
      expect(container.exists()).toBe(true)
      expect(container.props('horizontal')).toBe(true)
    })

    it('uses FzContainer with gap sm (section)', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzContainer }
        }
      })
      const container = wrapper.findComponent(FzContainer)
      expect(container.props('gap')).toBe('sm')
      expect(container.props('main')).toBe(false)
    })

    it('uses FzContainer with layout expand-all', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzContainer }
        }
      })
      const container = wrapper.findComponent(FzContainer)
      expect(container.props('layout')).toBe('expand-all')
    })

    it('applies full width class', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzContainer }
        }
      })
      const container = wrapper.findComponent(FzContainer)
      expect(container.classes()).to.include('w-full')
    })

    it('applies equal flex growth to children via layout expand-all', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Button 1" /><FzButton label="Button 2" />'
        }
      })
      const container = wrapper.findComponent(FzContainer)
      expect(container.exists()).toBe(true)
      expect(container.props('layout')).toBe('expand-all')
    })
  })

  describe('Accessibility', () => {
    it('renders semantic container element', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzContainer }
        }
      })
      const container = wrapper.findComponent(FzContainer)
      expect(container.exists()).toBe(true)
    })

    it('preserves button accessibility attributes', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Button 1" aria-label="Action 1" /><FzButton label="Button 2" aria-label="Action 2" />'
        }
      })
      const buttons = wrapper.findAllComponents(FzButton)
      expect(buttons.length).toBe(2)
      // aria-label is an HTML attribute, not a prop, so we check the HTML element
      const button1 = wrapper.findAll('button')[0]
      const button2 = wrapper.findAll('button')[1]
      expect(button1.attributes('aria-label')).toBe('Action 1')
      expect(button2.attributes('aria-label')).toBe('Action 2')
    })

    it('allows button children to maintain keyboard navigation', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Button 1" /><FzButton label="Button 2" />'
        }
      })
      const buttons = wrapper.findAllComponents(FzButton)
      expect(buttons.length).toBe(2)
      buttons.forEach(button => {
        expect(button.exists()).toBe(true)
      })
    })

    it('does not interfere with button disabled state', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Disabled Button" :disabled="true" />'
        }
      })
      const button = wrapper.findComponent(FzButton)
      expect(button.props('disabled')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('handles many buttons correctly', () => {
      const buttons = Array.from({ length: 10 }, (_, i) => `<FzButton label="Button ${i + 1}" />`).join('')
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: buttons
        }
      })
      const buttonElements = wrapper.findAllComponents(FzButton)
      expect(buttonElements.length).toBe(10)
    })

    it('handles buttons with different content types', () => {
      const wrapper = mount(FzButtonGroup, {
        global: {
          components: { FzButton, FzContainer }
        },
        slots: {
          default: '<FzButton label="Text" /><FzButton label="HTML Content" />'
        }
      })
      expect(wrapper.html()).to.include('Text')
      expect(wrapper.html()).to.include('HTML Content')
    })
  })

  describe('Deprecation Warnings', () => {
    it('warns when horizontal prop is provided', () => {
      mount(FzButtonGroup, {
        props: {
          horizontal: true
        }
      })
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzButtonGroup] The "horizontal" prop is deprecated')
      )
    })

    it('warns when horizontal prop is false', () => {
      mount(FzButtonGroup, {
        props: {
          horizontal: false
        }
      })
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzButtonGroup] The "horizontal" prop is deprecated')
      )
    })

    it('warns when gap prop is provided', () => {
      mount(FzButtonGroup, {
        props: {
          gap: true
        }
      })
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzButtonGroup] The "gap" prop is deprecated')
      )
    })

    it('warns when gap prop is false', () => {
      mount(FzButtonGroup, {
        props: {
          gap: false
        }
      })
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzButtonGroup] The "gap" prop is deprecated')
      )
    })

    it('warns when size prop is provided', () => {
      mount(FzButtonGroup, {
        props: {
          size: 'md'
        }
      })
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[FzButtonGroup] The "size" prop is deprecated')
      )
    })

    it('warns when multiple deprecated props are provided', () => {
      mount(FzButtonGroup, {
        props: {
          horizontal: true,
          gap: true,
          size: 'md'
        }
      })
      expect(console.warn).toHaveBeenCalledTimes(3)
    })

    it('does not warn when deprecated props are undefined', () => {
      mount(FzButtonGroup)
      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
