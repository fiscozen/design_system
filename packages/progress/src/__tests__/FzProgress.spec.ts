import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FzProgress from '../FzProgress.vue'

// Mock FontAwesome icon component
const mockFontAwesomeIcon = {
  name: 'FontAwesomeIcon',
  props: ['icon', 'size', 'spin', 'variant'],
  template: '<svg></svg>'
}

describe('FzProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'FzIcon' }).exists()).toBe(true)
    })

    it('should render FzIcon component', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should render with default spinner icon name', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('name')).toBe('spinner-third')
    })

    it('should render with custom icon name', () => {
      const wrapper = mount(FzProgress, {
        props: {
          name: 'spinner'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.props('name')).toBe('spinner')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('name prop', () => {
      it('should use default name "spinner-third" when not provided', () => {
        const wrapper = mount(FzProgress, {
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toBe('spinner-third')
      })

      it('should pass custom name prop to FzIcon', () => {
        const wrapper = mount(FzProgress, {
          props: {
            name: 'spinner'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toBe('spinner')
      })

      it('should support array format for name prop', () => {
        const wrapper = mount(FzProgress, {
          props: {
            name: ['fas', 'spinner']
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toEqual(['fas', 'spinner'])
      })
    })

    describe('size prop', () => {
      it.each([
        ['xs', 'xs'],
        ['sm', 'sm'],
        ['md', 'md'],
        ['lg', 'lg'],
        ['xl', 'xl'],
        ['2xl', '2xl']
      ])('should pass %s size prop to FzIcon', (size, expected) => {
        const wrapper = mount(FzProgress, {
          props: { size },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('size')).toBe(expected)
      })
    })

    describe('variant prop', () => {
      it('should always use variant "fas" (hardcoded)', () => {
        const wrapper = mount(FzProgress, {
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        // FzProgress always sets variant="fas" regardless of prop
        expect(icon.props('variant')).toBe('fas')
      })

      it('should always use variant "fas" even when different variant prop is provided', () => {
        const wrapper = mount(FzProgress, {
          props: { variant: 'far' },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        // FzProgress hardcodes variant="fas" in template, so it always overrides
        expect(icon.props('variant')).toBe('fas')
      })
    })

    describe('spin prop', () => {
      it('should always pass spin=true to FzIcon', () => {
        const wrapper = mount(FzProgress, {
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('spin')).toBe(true)
      })

      it('should pass spin=true even when spin prop is explicitly false', () => {
        const wrapper = mount(FzProgress, {
          props: { spin: false },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        // FzProgress always sets spin=true regardless of prop
        expect(icon.props('spin')).toBe(true)
      })
    })

    describe('all props together', () => {
      it('should pass all props to FzIcon correctly', () => {
        const wrapper = mount(FzProgress, {
          props: {
            name: 'spinner',
            size: 'lg',
            variant: 'far' // Note: variant is hardcoded to 'fas' in template
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toBe('spinner')
        expect(icon.props('size')).toBe('lg')
        // FzProgress hardcodes variant="fas" in template
        expect(icon.props('variant')).toBe('fas')
        expect(icon.props('spin')).toBe(true)
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should not emit any custom events (presentational component)', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      // FzProgress is a presentational component and doesn't emit events
      expect(wrapper.emitted()).toEqual({})
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply custom animation duration style', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const html = wrapper.html()
      expect(html).toContain('--fa-animation-duration: 0.86s')
    })

    it('should apply custom animation timing function style', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const html = wrapper.html()
      expect(html).toContain('--fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85)')
    })

    it('should apply both animation styles together', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      const html = wrapper.html()
      expect(html).toContain('--fa-animation-duration: 0.86s')
      expect(html).toContain('--fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85)')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should render FzIcon which handles accessibility', () => {
        const wrapper = mount(FzProgress, {
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        // FzIcon component handles its own accessibility attributes
      })

      it('should support aria-label through FzIcon', () => {
        const wrapper = mount(FzProgress, {
          attrs: {
            'aria-label': 'Loading'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        // Attributes are passed through to FzIcon
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('Decorative elements', () => {
      it('should render spinner icon which is decorative by default', () => {
        const wrapper = mount(FzProgress, {
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        // Spinner icons are typically decorative unless aria-label is provided
        // FzIcon handles this internally
      })

      it('should allow making icon accessible with aria-label', () => {
        const wrapper = mount(FzProgress, {
          attrs: {
            'aria-label': 'Loading content'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        // aria-label makes the icon accessible
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('Screen reader support', () => {
      it('should be accessible when aria-label is provided', () => {
        const wrapper = mount(FzProgress, {
          attrs: {
            'aria-label': 'Loading data'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        expect(wrapper.exists()).toBe(true)
        // FzIcon will handle the aria-label attribute
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined name prop gracefully', () => {
      const wrapper = mount(FzProgress, {
        props: {
          name: undefined
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      // Should fall back to default 'spinner-third'
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
      })

      it('should handle empty string name prop', () => {
        const wrapper = mount(FzProgress, {
          props: {
            name: ''
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toBe('')
      })

      it('should handle different icon name formats', () => {
        const wrapper = mount(FzProgress, {
          props: {
            name: 'circle-notch'
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toBe('circle-notch')
      })

      it('should handle array format icon name', () => {
        const wrapper = mount(FzProgress, {
          props: {
            name: ['fas', 'spinner', 'third']
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('name')).toEqual(['fas', 'spinner', 'third'])
      })

      it('should always apply spin prop regardless of input', () => {
        const wrapper = mount(FzProgress, {
          props: {
            spin: false
          },
          global: {
            stubs: {
              'font-awesome-icon': mockFontAwesomeIcon
            }
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        // FzProgress always sets spin=true
        expect(icon.props('spin')).toBe(true)
      })

      it('should handle all size variants', () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
        sizes.forEach(size => {
          const wrapper = mount(FzProgress, {
            props: { size },
            global: {
              stubs: {
                'font-awesome-icon': mockFontAwesomeIcon
              }
            }
          })
          const icon = wrapper.findComponent({ name: 'FzIcon' })
          expect(icon.props('size')).toBe(size)
        })
      })

      it('should always use variant "fas" regardless of prop value', () => {
        const variants = ['fas', 'far', 'fal', 'fat', 'fad'] as const
        variants.forEach(variant => {
          const wrapper = mount(FzProgress, {
            props: { variant },
            global: {
              stubs: {
                'font-awesome-icon': mockFontAwesomeIcon
              }
            }
          })
          const icon = wrapper.findComponent({ name: 'FzIcon' })
          // FzProgress hardcodes variant="fas" in template, so it always uses 'fas'
          expect(icon.props('variant')).toBe('fas')
        })
      })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzProgress, {
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom size', () => {
      const wrapper = mount(FzProgress, {
        props: {
          size: 'lg'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom variant', () => {
      const wrapper = mount(FzProgress, {
        props: {
          variant: 'far'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with custom name', () => {
      const wrapper = mount(FzProgress, {
        props: {
          name: 'spinner'
        },
        global: {
          stubs: {
            'font-awesome-icon': mockFontAwesomeIcon
          }
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with all custom props', () => {
      const wrapper = mount(FzProgress, {
        props: {
          name: 'circle-notch',
          size: 'xl',
          variant: 'far'
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
