// FzButtonGroup.test.ts

import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import FzButtonGroup from '../FzButtonGroup.vue'

describe('FzButtonGroup', () => {
  describe('Rendering', () => {
    it('renders correctly with buttons', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: true,
          size: 'md'
        },
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
        props: {
          gap: false,
          size: 'md'
        },
        slots: {
          default: ''
        }
      })
      expect(wrapper.html()).toBeTruthy()
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('renders single button correctly', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: true,
          size: 'md'
        },
        slots: {
          default: '<button>Single Button</button>'
        }
      })
      expect(wrapper.html()).to.include('Single Button')
    })
  })

  describe('Layout Orientation', () => {
    it('applies horizontal layout by default', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-row')
      expect(wrapper.classes()).to.include('horizontal')
      expect(wrapper.classes()).not.to.include('flex-col')
    })

    it('applies horizontal layout when horizontal is true', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          horizontal: true,
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-row')
      expect(wrapper.classes()).to.include('horizontal')
      expect(wrapper.classes()).not.to.include('flex-col')
    })

    it('applies vertical layout when horizontal is false', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          horizontal: false,
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-col')
      expect(wrapper.classes()).to.include('vertical')
      expect(wrapper.classes()).not.to.include('flex-row')
    })
  })

  describe('Gap Spacing', () => {
    it('applies gap-disabled class when gap is false', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('gap-disabled')
    })

    it('applies gap-disabled class by default', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('gap-disabled')
    })

    describe('Gap sizes', () => {
      it('applies gap-8 for xs size', () => {
        const wrapper = mount(FzButtonGroup, {
          props: {
            gap: true,
            size: 'xs'
          }
        })
        expect(wrapper.classes()).to.include('gap-8')
        expect(wrapper.classes()).not.to.include('gap-disabled')
      })

      it('applies gap-10 for sm size', () => {
        const wrapper = mount(FzButtonGroup, {
          props: {
            gap: true,
            size: 'sm'
          }
        })
        expect(wrapper.classes()).to.include('gap-10')
        expect(wrapper.classes()).not.to.include('gap-disabled')
      })

      it('applies gap-12 for md size', () => {
        const wrapper = mount(FzButtonGroup, {
          props: {
            gap: true,
            size: 'md'
          }
        })
        expect(wrapper.classes()).to.include('gap-12')
        expect(wrapper.classes()).not.to.include('gap-disabled')
      })

      it('applies gap-16 for lg size', () => {
        const wrapper = mount(FzButtonGroup, {
          props: {
            gap: true,
            size: 'lg'
          }
        })
        expect(wrapper.classes()).to.include('gap-16')
        expect(wrapper.classes()).not.to.include('gap-disabled')
      })
    })

    describe('Gap with vertical layout', () => {
      it('applies gap classes in vertical layout', () => {
        const wrapper = mount(FzButtonGroup, {
          props: {
            horizontal: false,
            gap: true,
            size: 'md'
          }
        })
        expect(wrapper.classes()).to.include('gap-12')
        expect(wrapper.classes()).to.include('flex-col')
      })
    })
  })

  describe('Props Combinations', () => {
    it('applies correct classes for horizontal layout with gap', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          horizontal: true,
          gap: true,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-row')
      expect(wrapper.classes()).to.include('horizontal')
      expect(wrapper.classes()).to.include('gap-12')
    })

    it('applies correct classes for horizontal layout without gap', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          horizontal: true,
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-row')
      expect(wrapper.classes()).to.include('horizontal')
      expect(wrapper.classes()).to.include('gap-disabled')
    })

    it('applies correct classes for vertical layout with gap', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          horizontal: false,
          gap: true,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-col')
      expect(wrapper.classes()).to.include('vertical')
      expect(wrapper.classes()).to.include('gap-12')
    })

    it('applies correct classes for vertical layout without gap', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          horizontal: false,
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-col')
      expect(wrapper.classes()).to.include('vertical')
      expect(wrapper.classes()).to.include('gap-disabled')
    })

    it('applies all size variants correctly with gap', () => {
      const sizes = ['xs', 'sm', 'md', 'lg'] as const
      const expectedGaps = ['gap-8', 'gap-10', 'gap-12', 'gap-16']

      sizes.forEach((size, index) => {
        const wrapper = mount(FzButtonGroup, {
          props: {
            gap: true,
            size
          }
        })
        expect(wrapper.classes()).to.include(expectedGaps[index])
      })
    })
  })

  describe('Default Values', () => {
    it('uses default values when no props provided', () => {
      const wrapper = mount(FzButtonGroup)
      expect(wrapper.classes()).to.include('flex-row')
      expect(wrapper.classes()).to.include('horizontal')
      expect(wrapper.classes()).to.include('gap-disabled')
    })

    it('uses default size md when not specified', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: true
        }
      })
      expect(wrapper.classes()).to.include('gap-12')
    })

    it('uses default horizontal true when not specified', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: false,
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('flex-row')
    })

    it('uses default gap false when not specified', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          size: 'md'
        }
      })
      expect(wrapper.classes()).to.include('gap-disabled')
    })
  })

  describe('Accessibility', () => {
    it('renders semantic container element', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: false,
          size: 'md'
        }
      })
      const container = wrapper.find('div')
      expect(container.exists()).toBe(true)
    })

    it('preserves button accessibility attributes', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: false,
          size: 'md'
        },
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
        props: {
          gap: false,
          size: 'md'
        },
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
        props: {
          gap: false,
          size: 'md'
        },
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
        props: {
          gap: true,
          size: 'md'
        },
        slots: {
          default: buttons
        }
      })
      const buttonElements = wrapper.findAll('button')
      expect(buttonElements.length).toBe(10)
    })

    it('handles buttons with different content types', () => {
      const wrapper = mount(FzButtonGroup, {
        props: {
          gap: false,
          size: 'md'
        },
        slots: {
          default: '<button>Text</button><button><span>HTML</span></button>'
        }
      })
      expect(wrapper.html()).to.include('Text')
      expect(wrapper.html()).to.include('<span>HTML</span>')
    })
  })
})
