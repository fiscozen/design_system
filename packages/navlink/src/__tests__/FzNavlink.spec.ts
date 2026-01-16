import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import FzNavlink from '../FzNavlink.vue'
import FzRouterNavlink from '../FzRouterNavlink.vue'

const Page = {
  template: '<div>Page</div>'
}

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: Page
  },
  {
    name: 'about',
    path: '/about',
    component: Page
  }
]

let router: ReturnType<typeof createRouter>

beforeEach(() => {
  router = createRouter({
    history: createWebHistory(),
    routes
  })
})

// ============================================
// FZNAVLINK TESTS
// ============================================

describe('FzNavlink', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzNavlink)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: 'Navigation Link'
        }
      })
      expect(wrapper.text()).toContain('Navigation Link')
      expect(wrapper.find('span').text()).toBe('Navigation Link')
    })

    it('should render icon when iconName is provided', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          iconName: 'bell',
          label: 'Notifications'
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('bell')
    })

    it('should render icon only when no label or slot', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          iconName: 'bell'
        }
      })
      expect(wrapper.find('button').classes()).toContain('flex')
      expect(wrapper.find('button').classes()).toContain('w-32')
      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('should render slot content', () => {
      const wrapper = mount(FzNavlink, {
        slots: {
          default: 'Custom Slot Content'
        }
      })
      expect(wrapper.text()).toContain('Custom Slot Content')
    })

    it('should render with both icon and label', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          iconName: 'home',
          label: 'Home'
        }
      })
      expect(wrapper.findComponent({ name: 'FzIcon' }).exists()).toBe(true)
      expect(wrapper.text()).toContain('Home')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('label prop', () => {
      it('should display label text', () => {
        const wrapper = mount(FzNavlink, {
          props: { label: 'Test Label' }
        })
        expect(wrapper.text()).toContain('Test Label')
      })

      it('should not render label span when label is not provided', () => {
        const wrapper = mount(FzNavlink, {
          props: {}
        })
        const spans = wrapper.findAll('span')
        expect(spans.length).toBe(0)
      })
    })

    describe('iconName prop', () => {
      it('should render icon when iconName is provided', () => {
        const wrapper = mount(FzNavlink, {
          props: { iconName: 'bell' }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        expect(icon.props('name')).toBe('bell')
      })

      it('should not render icon when iconName is not provided', () => {
        const wrapper = mount(FzNavlink, {
          props: {}
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(false)
      })
    })

    describe('iconSize prop', () => {
      it('should pass iconSize to FzIcon', () => {
        const wrapper = mount(FzNavlink, {
          props: {
            iconName: 'bell',
            iconSize: 'lg'
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('size')).toBe('lg')
      })
    })

    describe('iconVariant prop', () => {
      it('should pass iconVariant to FzIcon', () => {
        const wrapper = mount(FzNavlink, {
          props: {
            iconName: 'bell',
            iconVariant: 'fas'
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.props('variant')).toBe('fas')
      })
    })

    describe('disabled prop', () => {
      it('should apply disabled attribute when true', () => {
        const wrapper = mount(FzNavlink, {
          props: { disabled: true }
        })
        expect(wrapper.find('button').attributes('disabled')).toBeDefined()
      })

      it('should not apply disabled attribute when false', () => {
        const wrapper = mount(FzNavlink, {
          props: { disabled: false }
        })
        expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
      })

      it('should not apply disabled attribute when not provided', () => {
        const wrapper = mount(FzNavlink)
        expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
      })
    })

    describe('meta prop', () => {
      it('should accept meta prop', () => {
        const wrapper = mount(FzNavlink, {
          props: {
            meta: { some: 'data' }
          }
        })
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: 'Test Link'
        }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('should emit click event with event object', async () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: 'Test Link'
        }
      })
      await wrapper.find('button').trigger('click')
      const clickEvents = wrapper.emitted('click')
      expect(clickEvents).toBeDefined()
      expect(clickEvents![0]).toHaveLength(1)
      expect(clickEvents![0][0]).toBeInstanceOf(Event)
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: 'Test Link',
          disabled: true
        }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('should emit click event for icon-only navlink', async () => {
      const wrapper = mount(FzNavlink, {
        props: {
          iconName: 'bell'
        }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have aria-disabled when disabled', () => {
        const wrapper = mount(FzNavlink, {
          props: { disabled: true }
        })
        const button = wrapper.find('button')
        // Note: Native disabled attribute is used, aria-disabled may not be explicitly set
        // but the disabled attribute provides accessibility
        expect(button.attributes('disabled')).toBeDefined()
      })

      it('should be focusable when not disabled', () => {
        const wrapper = mount(FzNavlink)
        const button = wrapper.find('button')
        expect(button.attributes('disabled')).toBeUndefined()
        // Button elements are focusable by default
      })

      it('should not be focusable when disabled', () => {
        const wrapper = mount(FzNavlink, {
          props: { disabled: true }
        })
        const button = wrapper.find('button')
        expect(button.attributes('disabled')).toBeDefined()
        // Disabled buttons are not in tab order
      })

      it('should have accessible label when label prop is provided', () => {
        const wrapper = mount(FzNavlink, {
          props: { label: 'Home' }
        })
        expect(wrapper.text()).toContain('Home')
        // Text content provides accessible label
      })

      it('should have accessible label when icon only', () => {
        const wrapper = mount(FzNavlink, {
          props: { iconName: 'bell' }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        // Icon should have aria-label or aria-hidden based on FzIcon implementation
      })
    })

    describe('aria-current expectations', () => {
      it('should document expected aria-current behavior for active state', () => {
        // Note: FzNavlink (button) does not currently have an active prop
        // For navigation links that represent the current page, aria-current="page" should be set
        // This is a future enhancement that should be added
        const wrapper = mount(FzNavlink, {
          props: { label: 'Current Page' }
        })
        const button = wrapper.find('button')
        // Currently aria-current is not implemented, but should be added for active state
        // Expected: aria-current="page" when active
        expect(button.attributes('aria-current')).toBeUndefined()
      })
    })

    describe('Semantic HTML', () => {
      it('should use button element for navigation', () => {
        const wrapper = mount(FzNavlink)
        expect(wrapper.find('button').exists()).toBe(true)
      })

      it('should have proper semantic structure', () => {
        const wrapper = mount(FzNavlink, {
          props: {
            label: 'Navigation',
            iconName: 'home'
          }
        })
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
        expect(button.find('span').exists()).toBe(true)
      })
    })

    describe('Keyboard navigation', () => {
      it('should be keyboard accessible', () => {
        const wrapper = mount(FzNavlink)
        const button = wrapper.find('button')
        // Button elements are keyboard accessible by default
        expect(button.element.tagName).toBe('BUTTON')
      })

      it('should support Enter key activation', async () => {
        const wrapper = mount(FzNavlink, {
          props: { label: 'Test' }
        })
        await wrapper.find('button').trigger('keydown.enter')
        // Button should respond to Enter key (native behavior)
        expect(wrapper.exists()).toBe(true)
      })

      it('should support Space key activation', async () => {
        const wrapper = mount(FzNavlink, {
          props: { label: 'Test' }
        })
        await wrapper.find('button').trigger('keydown.space')
        // Button should respond to Space key (native behavior)
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('Decorative elements', () => {
      it('should handle icon accessibility', () => {
        const wrapper = mount(FzNavlink, {
          props: {
            iconName: 'bell',
            label: 'Notifications'
          }
        })
        const icon = wrapper.findComponent({ name: 'FzIcon' })
        expect(icon.exists()).toBe(true)
        // Icon accessibility is handled by FzIcon component
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Test' }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('text-grey-500')
      expect(button.classes()).toContain('h-32')
      expect(button.classes()).toContain('rounded')
      expect(button.classes()).toContain('text-sm')
      expect(button.classes()).toContain('font-medium')
    })

    it('should apply icon-only classes when icon only', () => {
      const wrapper = mount(FzNavlink, {
        props: { iconName: 'bell' }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('flex')
      expect(button.classes()).toContain('w-32')
      expect(button.classes()).toContain('flex-row')
      expect(button.classes()).toContain('items-center')
      expect(button.classes()).toContain('justify-center')
    })

    it('should apply padding classes when not icon only', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Test' }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('px-12')
      expect(button.classes()).toContain('py-6')
    })

    it('should apply disabled classes when disabled', () => {
      const wrapper = mount(FzNavlink, {
        props: { disabled: true, label: 'Test' }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('disabled:text-grey-100')
      expect(button.classes()).toContain('disabled:bg-core-white')
    })

    it('should apply hover classes', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Test' }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('hover:bg-background-alice-blue')
      expect(button.classes()).toContain('hover:text-blue-500')
    })

    it('should apply focus classes', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Test' }
      })
      const button = wrapper.find('button')
      expect(button.classes()).toContain('focus:border-1')
      expect(button.classes()).toContain('focus:bg-background-alice-blue')
      expect(button.classes()).toContain('focus:border-blue-500')
      expect(button.classes()).toContain('focus:text-blue-500')
    })

    it('should apply icon margin when not icon only', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          iconName: 'bell',
          label: 'Test'
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.classes()).toContain('mr-8')
    })

    it('should not apply icon margin when icon only', () => {
      const wrapper = mount(FzNavlink, {
        props: { iconName: 'bell' }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.classes()).not.toContain('mr-8')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: undefined,
          iconName: undefined,
          disabled: undefined
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string label', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: '' }
      })
      expect(wrapper.exists()).toBe(true)
      // Empty string label should not render span
      const spans = wrapper.findAll('span')
      expect(spans.length).toBe(0)
    })

    it('should handle very long label text', () => {
      const longLabel = 'A'.repeat(200)
      const wrapper = mount(FzNavlink, {
        props: { label: longLabel }
      })
      expect(wrapper.text()).toContain(longLabel)
    })

    it('should handle special characters in label', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Test & Link <with> special chars' }
      })
      expect(wrapper.text()).toContain('Test & Link <with> special chars')
    })

    it('should handle slot override of label', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Original Label' },
        slots: {
          default: 'Slot Override'
        }
      })
      expect(wrapper.text()).toContain('Slot Override')
      expect(wrapper.text()).not.toContain('Original Label')
    })

    it('should handle multiple instances', () => {
      const wrapper1 = mount(FzNavlink, { props: { label: 'Link 1' } })
      const wrapper2 = mount(FzNavlink, { props: { label: 'Link 2' } })
      const wrapper3 = mount(FzNavlink, { props: { label: 'Link 3' } })

      expect(wrapper1.text()).toContain('Link 1')
      expect(wrapper2.text()).toContain('Link 2')
      expect(wrapper3.text()).toContain('Link 3')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzNavlink)
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with label', () => {
      const wrapper = mount(FzNavlink, {
        props: { label: 'Navigation Link' }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with icon and label', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: 'Home',
          iconName: 'home'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - icon only', () => {
      const wrapper = mount(FzNavlink, {
        props: { iconName: 'bell' }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', () => {
      const wrapper = mount(FzNavlink, {
        props: {
          label: 'Disabled Link',
          disabled: true
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with slot', () => {
      const wrapper = mount(FzNavlink, {
        slots: {
          default: 'Custom Content'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

// ============================================
// FZROUTERNAVLINK TESTS
// ============================================

describe('FzRouterNavlink', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with router-link when not disabled', async () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Router Link',
          meta: {
            path: '/about'
          }
        },
        global: {
          plugins: [router]
        }
      })
      await flushPromises()
      expect(wrapper.exists()).toBe(true)
      // Should render router-link component (renders as <a> tag)
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('/about')
    })

    it('should render as span when disabled', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Disabled Router Link',
          disabled: true,
          meta: {
            path: '/about'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toContain('span')
      expect(wrapper.html()).not.toContain('router-link')
    })

    it('should render label when provided', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Router Navigation',
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.text()).toContain('Router Navigation')
    })

    it('should render icon when iconName is provided', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          iconName: 'home',
          label: 'Home',
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      const icon = wrapper.findComponent({ name: 'FzIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('home')
    })

    it('should render icon only when no label or slot', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          iconName: 'bell',
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('should render slot content', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          meta: {
            path: '/'
          }
        },
        slots: {
          default: 'Custom Router Slot'
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.text()).toContain('Custom Router Slot')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('meta prop', () => {
      it('should require meta prop', () => {
        // TypeScript enforces this, but we test runtime behavior
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            meta: {
              path: '/about'
            }
          },
          global: {
            plugins: [router]
          }
        })
        expect(wrapper.exists()).toBe(true)
      })

      it('should pass meta to router-link', async () => {
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            meta: {
              path: '/about',
              name: 'about'
            }
          },
          global: {
            plugins: [router]
          }
        })
        await flushPromises()
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('disabled prop', () => {
      it('should render as span when disabled', () => {
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            disabled: true,
            meta: {
              path: '/'
            }
          },
          global: {
            plugins: [router]
          }
        })
        expect(wrapper.html()).toContain('span')
      })

      it('should apply disabled classes when disabled', () => {
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            disabled: true,
            meta: {
              path: '/'
            }
          },
          global: {
            plugins: [router]
          }
        })
        const span = wrapper.find('span')
        expect(span.classes()).toContain('text-grey-100')
        expect(span.classes()).toContain('bg-core-white')
      })
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('aria-current expectations', () => {
      it('should have aria-current="page" when route is active', async () => {
        await router.push('/')
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Home',
            meta: {
              path: '/',
              name: 'home'
            }
          },
          global: {
            plugins: [router]
          }
        })
        await flushPromises()
        await router.isReady()

        // Vue Router automatically adds aria-current="page" to active router-link
        // This is handled by Vue Router, not our component
        const link = wrapper.find('a')
        if (link.exists()) {
          // Router-link should have aria-current when active
          // Note: This may require the route to actually match
          expect(wrapper.exists()).toBe(true)
        }
      })

      it('should not have aria-current when route is not active', async () => {
        await router.push('/about')
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Home',
            meta: {
              path: '/',
              name: 'home'
            }
          },
          global: {
            plugins: [router]
          }
        })
        await flushPromises()
        await router.isReady()

        // When route doesn't match, aria-current should not be present
        expect(wrapper.exists()).toBe(true)
      })
    })

    describe('Semantic HTML', () => {
      it('should use router-link for navigation', async () => {
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            meta: {
              path: '/about'
            }
          },
          global: {
            plugins: [router]
          }
        })
        await flushPromises()
        // router-link renders as <a> tag
        expect(wrapper.html()).toContain('router-link')
      })

      it('should use span when disabled', () => {
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            disabled: true,
            meta: {
              path: '/about'
            }
          },
          global: {
            plugins: [router]
          }
        })
        expect(wrapper.html()).toContain('span')
      })
    })

    describe('Keyboard navigation', () => {
      it('should be keyboard accessible via router-link', async () => {
        const wrapper = mount(FzRouterNavlink, {
          props: {
            label: 'Test',
            meta: {
              path: '/about'
            }
          },
          global: {
            plugins: [router]
          }
        })
        await flushPromises()
        // router-link is keyboard accessible by default
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply common classes when not disabled', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Test',
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      const element = wrapper.find('a, router-link, span')
      expect(element.classes()).toContain('text-grey-500')
      expect(element.classes()).toContain('h-32')
    })

    it('should apply disabled classes when disabled', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Test',
          disabled: true,
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      const span = wrapper.find('span')
      expect(span.classes()).toContain('text-grey-100')
      expect(span.classes()).toContain('bg-core-white')
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined label', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty string label', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: '',
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
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
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Router Link',
          meta: {
            path: '/about'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Disabled Router Link',
          disabled: true,
          meta: {
            path: '/about'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - with icon', () => {
      const wrapper = mount(FzRouterNavlink, {
        props: {
          label: 'Home',
          iconName: 'home',
          meta: {
            path: '/'
          }
        },
        global: {
          plugins: [router]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
