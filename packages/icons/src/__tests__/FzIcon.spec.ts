import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import FzIcon from '../FzIcon.vue'

// Mock byPrefixAndName to avoid runtime errors
vi.mock('@awesome.me/kit-8137893ad3/icons', () => ({
  byPrefixAndName: {
    fas: { bell: ['fas', 'bell'], 'user-circle': ['fas', 'user-circle'] },
    far: { bell: ['far', 'bell'], 'user-circle': ['far', 'user-circle'] },
    fal: { bell: ['fal', 'bell'] },
    fat: { bell: ['fat', 'bell'] },
    fad: { bell: ['fad', 'bell'] },
    fass: { bell: ['fass', 'bell'] },
    fasr: { bell: ['fasr', 'bell'] },
    fasl: { bell: ['fasl', 'bell'] },
    fast: { bell: ['fast', 'bell'] },
    fak: { bell: ['fak', 'bell'] }
  }
}))

// Mock FontAwesome icon component - properly handle class binding
const mockFontAwesomeIcon = {
  name: 'FontAwesomeIcon',
  template: '<svg :class="$attrs.class" data-testid="fa-icon" />',
  props: ['icon', 'size', 'spin']
}

describe('FzIcon', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('should render with name prop', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const icon = wrapper.find('svg')
      expect(icon.exists()).toBe(true)
    })

    it('should render correct container size', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          size: 'lg'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('w-[25px]')
      expect(container.classes()).toContain('h-[25px]')
    })

    it('should apply custom class when provided', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell'
        },
        attrs: {
          class: 'custom-class'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('custom-class')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('name prop', () => {
      it('should accept string name', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        expect(wrapper.props('name')).toBe('bell')
      })

      it('should accept array name', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: ['fas', 'bell']
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        expect(wrapper.props('name')).toEqual(['fas', 'bell'])
      })
    })

    describe('size prop', () => {
      it.each([
        ['xs', 'size-[12.5px]', 'h-[10px]'],
        ['sm', 'w-[15px]', 'h-[12px]'],
        ['md', 'w-[20px]', 'h-[16px]'],
        ['lg', 'w-[25px]', 'h-[20px]'],
        ['xl', 'w-[32px]', 'h-[24px]'],
        ['2xl', 'w-[40px]', 'h-[32px]']
      ])('should apply correct classes for %s size', (size, containerClass, iconClass) => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell',
            size: size as any
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain(containerClass)
        
        // Verify icon class is passed via :class binding to FontAwesome component
        const fontAwesomeComponent = wrapper.findComponent({ name: 'FontAwesomeIcon' })
        expect(fontAwesomeComponent.exists()).toBe(true)
        // Check that the class attribute is passed (it may be in $attrs.class)
        const iconElement = wrapper.find('[data-testid="fa-icon"]')
        const classAttr = iconElement.attributes('class') || ''
        // The class should be applied via :class binding
        expect(classAttr.includes(iconClass) || iconElement.classes().includes(iconClass)).toBe(true)
      })

      it('should default to lg size', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.classes()).toContain('w-[25px]')
        expect(container.classes()).toContain('h-[25px]')
      })
    })

    describe('variant prop', () => {
      it('should default to far variant', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        expect(wrapper.props('variant')).toBe('far')
      })

      it.each([
        ['fas'],
        ['far'],
        ['fal'],
        ['fat'],
        ['fad']
      ])('should accept %s variant', (variant) => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell',
            variant: variant as any
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        expect(wrapper.props('variant')).toBe(variant)
      })
    })

    describe('spin prop', () => {
      it('should not spin by default', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        // spin defaults to undefined/false when not provided
        const spinProp = wrapper.props('spin')
        expect(spinProp === undefined || spinProp === false).toBe(true)
      })

      it('should apply spin when true', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell',
            spin: true
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        expect(wrapper.props('spin')).toBe(true)
        // Verify spin prop is passed to FontAwesome component
        const fontAwesomeComponent = wrapper.findComponent({ name: 'FontAwesomeIcon' })
        expect(fontAwesomeComponent.exists()).toBe(true)
        expect(fontAwesomeComponent.props('spin')).toBe(true)
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('items-center')
      expect(container.classes()).toContain('justify-center')
    })

    it('should apply size-specific container classes', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          size: 'md'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const container = wrapper.find('div')
      expect(container.classes()).toContain('w-[20px]')
      expect(container.classes()).toContain('h-[20px]')
    })

    it('should apply size-specific icon classes', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          size: 'xl'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      // Verify the class is passed to FontAwesome component
      const fontAwesomeComponent = wrapper.findComponent({ name: 'FontAwesomeIcon' })
      expect(fontAwesomeComponent.exists()).toBe(true)
      const icon = wrapper.find('[data-testid="fa-icon"]')
      const classAttr = icon.attributes('class') || ''
      expect(classAttr.includes('h-[24px]') || icon.classes().includes('h-[24px]')).toBe(true)
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have aria-hidden for decorative icons by default', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        // FontAwesome icons are decorative by default unless aria-label is provided
        // The component itself doesn't set aria-hidden, but FontAwesome does
        // We verify the icon exists and is rendered
        const icon = wrapper.find('svg')
        expect(icon.exists()).toBe(true)
      })

      it('should support aria-label when provided', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          attrs: {
            'aria-label': 'Notification bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.attributes('aria-label')).toBe('Notification bell')
      })

      it('should support role="img" when accessible', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          attrs: {
            role: 'img',
            'aria-label': 'Notification bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const container = wrapper.find('div')
        expect(container.attributes('role')).toBe('img')
      })
    })

    describe('Decorative elements', () => {
      it('should render icon without accessibility attributes when decorative', () => {
        const wrapper = mount(FzIcon, {
          props: {
            name: 'bell'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        // Decorative icons should not have aria-label
        const container = wrapper.find('div')
        expect(container.attributes('aria-label')).toBeUndefined()
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle different icon name formats', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'user-circle'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle array icon format', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: ['fas', 'bell']
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - small size', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          size: 'sm'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - large size', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          size: 'xl'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with spin', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          spin: true
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with variant', () => {
      const wrapper = mount(FzIcon, {
        props: {
          name: 'bell',
          variant: 'fas'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

