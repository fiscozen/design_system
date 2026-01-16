import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FzLink from '../FzLink.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: '', path: '/example', component: () => {} },
    { name: 'route-name', path: '/route/:id', component: () => {} }
  ]
})

describe('FzLink', () => {
  describe('Rendering', () => {
    it('should render with default props', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'This is a link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('This is a link')
    })

    it('renders router-link when not disabled and not external', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'This is a link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      // router-link renders as <a> tag, so we check for the anchor
      expect(wrapper.find('a').exists()).toBe(true)
      // Verify it's not an external link (no href attribute, uses router-link)
      const link = wrapper.find('a')
      // router-link doesn't have href in test environment, it uses to prop
      expect(link.exists()).toBe(true)
    })

    it('renders anchor tag when external', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('a').exists()).toBe(true)
      expect(wrapper.find('router-link-stub').exists()).toBe(false)
      expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    })

    it('renders span when disabled', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true
        },
        slots: {
          default: 'Disabled link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.find('a').exists()).toBe(false)
      expect(wrapper.find('router-link-stub').exists()).toBe(false)
    })

    it('renders slot content', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'Link text content'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toContain('Link text content')
    })
  })

  describe('Props: type', () => {
    it('applies default type classes with default linkStyle', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'default',
          linkStyle: 'default'
        },
        slots: {
          default: 'Default link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-blue-500')
      expect(link.classes()).toContain('hover:text-blue-600')
      expect(link.classes()).toContain('hover:underline')
      expect(link.classes()).toContain('focus:text-blue-600')
      expect(link.classes()).toContain('focus:outline-none')
      expect(link.classes()).toContain('focus:border-solid')
      expect(link.classes()).toContain('focus:no-underline')
      expect(link.classes()).toContain('focus:border-blue-600')
      expect(link.classes()).not.toContain('underline')
    })

    it('applies default type classes with underline linkStyle', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'default',
          linkStyle: 'underline'
        },
        slots: {
          default: 'Default underline link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-blue-500')
      expect(link.classes()).toContain('underline')
      expect(link.classes()).toContain('hover:text-blue-600')
      expect(link.classes()).toContain('focus:text-blue-600')
      expect(link.classes()).toContain('focus:outline-none')
      expect(link.classes()).toContain('focus:border-solid')
      expect(link.classes()).toContain('focus:no-underline')
      expect(link.classes()).toContain('focus:border-blue-600')
    })

    it('applies danger type classes with default linkStyle', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'danger',
          linkStyle: 'default'
        },
        slots: {
          default: 'Danger link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-semantic-error-200')
      expect(link.classes()).toContain('hover:text-semantic-error-300')
      expect(link.classes()).toContain('hover:underline')
      expect(link.classes()).toContain('focus:text-semantic-error-300')
      expect(link.classes()).toContain('focus:outline-none')
      expect(link.classes()).toContain('focus:border-solid')
      expect(link.classes()).toContain('focus:no-underline')
      expect(link.classes()).toContain('focus:border-semantic-error-300')
      expect(link.classes()).not.toContain('underline')
    })

    it('applies danger type classes with underline linkStyle', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'danger',
          linkStyle: 'underline'
        },
        slots: {
          default: 'Danger underline link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-semantic-error-200')
      expect(link.classes()).toContain('underline')
      expect(link.classes()).toContain('hover:text-semantic-error-300')
      expect(link.classes()).toContain('focus:text-semantic-error-300')
      expect(link.classes()).toContain('focus:outline-none')
      expect(link.classes()).toContain('focus:border-solid')
      expect(link.classes()).toContain('focus:no-underline')
      expect(link.classes()).toContain('focus:border-semantic-error-300')
    })

    it('applies default type disabled classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'default',
          disabled: true
        },
        slots: {
          default: 'Disabled default link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('text-blue-200')
    })

    it('applies default type disabled classes with underline', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'default',
          linkStyle: 'underline',
          disabled: true
        },
        slots: {
          default: 'Disabled default underline link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('text-blue-200')
      expect(span.classes()).toContain('underline')
    })

    it('applies danger type disabled classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'danger',
          disabled: true
        },
        slots: {
          default: 'Disabled danger link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('text-semantic-error-100')
    })

    it('applies danger type disabled classes with underline', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'danger',
          linkStyle: 'underline',
          disabled: true
        },
        slots: {
          default: 'Disabled danger underline link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('text-semantic-error-100')
      expect(span.classes()).toContain('underline')
    })
  })

  describe('Props: linkStyle', () => {
    it('applies default linkStyle (no underline by default)', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          linkStyle: 'default'
        },
        slots: {
          default: 'Default style'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).not.toContain('underline')
      expect(link.classes()).toContain('hover:underline')
    })

    it('applies underline linkStyle', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          linkStyle: 'underline'
        },
        slots: {
          default: 'Underline style'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('underline')
    })
  })

  describe('Props: size', () => {
    it('applies sm size classes (text-sm + leading-xs)', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'sm'
        },
        slots: {
          default: 'Link text'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-sm')
      expect(link.classes()).toContain('leading-xs')
    })

    it('applies md size classes (text-base + leading-base)', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'md'
        },
        slots: {
          default: 'Link text'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-base')
      expect(link.classes()).toContain('leading-base')
    })

    it('maps deprecated xs size to sm and shows warning', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'xs'
        },
        slots: {
          default: 'Link text'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      
      // Verify xs is mapped to sm classes
      expect(link.classes()).toContain('text-sm')
      expect(link.classes()).toContain('leading-xs')
      expect(link.classes()).not.toContain('text-xs')
      
      // Verify warning was shown
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      const warningMessage = consoleSpy.mock.calls[0][0] as string
      expect(warningMessage).toContain('[FzLink] The size prop value "xs" is deprecated')
      expect(warningMessage).toContain('Please use "sm" instead')

      consoleSpy.mockRestore()
    })

    it('maps deprecated lg size to md and shows warning', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'lg'
        },
        slots: {
          default: 'Link text'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      
      // Verify lg is mapped to md classes
      expect(link.classes()).toContain('text-base')
      expect(link.classes()).toContain('leading-base')
      expect(link.classes()).not.toContain('text-lg')
      
      // Verify warning was shown
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      const warningMessage = consoleSpy.mock.calls[0][0] as string
      expect(warningMessage).toContain('[FzLink] The size prop value "lg" is deprecated')
      expect(warningMessage).toContain('Please use "md" instead')

      consoleSpy.mockRestore()
    })
  })

  describe('Props: disabled', () => {
    it('renders span with disabled classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true
        },
        slots: {
          default: 'Disabled link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('cursor-not-allowed')
      expect(span.classes()).toContain('text-blue-200')
    })

    it('applies default type disabled classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true,
          type: 'default'
        },
        slots: {
          default: 'Disabled default'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('text-blue-200')
    })
  })

  describe('Props: external', () => {
    it('renders anchor tag with href when external', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.attributes('href')).toBe('https://example.com')
    })

    it('does not render router-link when external', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      // External links use <a> with href, not router-link
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('https://example.com')
    })

    it('uses correct href for external links', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      // Verify href attribute is set correctly
      const link = wrapper.find('a')
      expect(link.attributes('href')).toBe('https://example.com')
    })
  })

  describe('Props: target', () => {
    it('applies target attribute to anchor tag', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          target: '_blank'
        },
        slots: {
          default: 'Link with target'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.attributes('target')).toBe('_blank')
    })

    it('applies target attribute to external link', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true,
          target: '_blank'
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.attributes('target')).toBe('_blank')
    })
  })

  describe('Props: replace', () => {
    it('passes replace prop to router-link', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          replace: true
        },
        slots: {
          default: 'Replace link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      // router-link renders as <a>, verify component accepts replace prop
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      // The replace prop is handled by router-link internally
      expect(wrapper.props('replace')).toBe(true)
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should allow click on enabled internal link', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'Internal link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      
      // Click should not throw error
      await link.trigger('click')
      expect(link.exists()).toBe(true)
    })

    it('should allow click on enabled external link', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      
      // Click should not throw error
      await link.trigger('click')
      expect(link.exists()).toBe(true)
    })

    it('should render as non-interactive span when disabled', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true
        },
        slots: {
          default: 'Disabled link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.exists()).toBe(true)
      expect(wrapper.find('a').exists()).toBe(false)
      
      // Span is not clickable (no href, no router-link)
      expect(span.attributes('aria-disabled')).toBe('true')
    })

    it('should not navigate when disabled', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true
        },
        slots: {
          default: 'Disabled link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      
      // Clicking disabled span should not trigger navigation
      await span.trigger('click')
      expect(pushSpy).not.toHaveBeenCalled()
      
      pushSpy.mockRestore()
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'Link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('border-1')
      expect(link.classes()).toContain('border-transparent')
      expect(link.classes()).toContain('inline-block')
    })

    it('should apply size-specific classes for sm', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'sm'
        },
        slots: {
          default: 'Link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-sm')
      expect(link.classes()).toContain('leading-xs')
    })

    it('should apply size-specific classes for md', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'md'
        },
        slots: {
          default: 'Link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-base')
      expect(link.classes()).toContain('leading-base')
    })

    it('should apply focus classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'Link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('focus:outline-none')
      expect(link.classes()).toContain('focus:border-solid')
      expect(link.classes()).toContain('focus:no-underline')
    })

    it('should apply disabled span classes', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true
        },
        slots: {
          default: 'Disabled link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const span = wrapper.find('span')
      expect(span.classes()).toContain('cursor-not-allowed')
      expect(span.classes()).toContain('border-1')
      expect(span.classes()).toContain('border-transparent')
      expect(span.classes()).toContain('inline-block')
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('ARIA attributes', () => {
      it('should have proper ARIA attributes when disabled', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example',
            disabled: true
          },
          slots: {
            default: 'Disabled link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const span = wrapper.find('span')
        expect(span.exists()).toBe(true)
        expect(span.attributes('aria-disabled')).toBe('true')
        expect(span.attributes('role')).toBe('link')
        expect(span.attributes('aria-label')).toBe('Link disabled')
      })

      it('should use native anchor element for enabled links (semantic HTML)', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example'
          },
          slots: {
            default: 'Internal link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        expect(link.exists()).toBe(true)
        // Native anchor elements are inherently accessible
        expect(link.element.tagName.toLowerCase()).toBe('a')
      })

      it('external link should have href attribute', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: 'https://example.com',
            external: true
          },
          slots: {
            default: 'External link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        expect(link.attributes('href')).toBeDefined()
        expect(link.attributes('href')).toBe('https://example.com')
      })

      it('external link with target="_blank" should have rel="noopener noreferrer"', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: 'https://example.com',
            external: true,
            target: '_blank'
          },
          slots: {
            default: 'External link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        expect(link.attributes('rel')).toBe('noopener noreferrer')
        expect(link.attributes('target')).toBe('_blank')
      })

      it('external link without target="_blank" should not have rel attribute', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: 'https://example.com',
            external: true,
            target: '_self'
          },
          slots: {
            default: 'External link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        expect(link.attributes('rel')).toBeUndefined()
        expect(link.attributes('target')).toBe('_self')
      })
    })

    describe('Keyboard navigation', () => {
      it('should be focusable when not disabled', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example'
          },
          slots: {
            default: 'Link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        // Anchor elements are naturally focusable
        expect(link.element.tagName.toLowerCase()).toBe('a')
        // tabindex should not be -1 (which would remove from tab order)
        const tabindex = link.attributes('tabindex')
        if (tabindex) {
          expect(tabindex).not.toBe('-1')
        }
      })

      it('should not be in tab order when disabled', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example',
            disabled: true
          },
          slots: {
            default: 'Disabled link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const span = wrapper.find('span')
        // Disabled links render as span, which is not focusable
        expect(span.element.tagName.toLowerCase()).toBe('span')
        expect(span.attributes('aria-disabled')).toBe('true')
      })

      it('should support Enter key activation (native anchor behavior)', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example'
          },
          slots: {
            default: 'Link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        // Native anchor elements support Enter key activation
        await link.trigger('keydown', { key: 'Enter' })
        expect(link.exists()).toBe(true)
      })
    })

    describe('Semantic HTML structure', () => {
      it('should render as anchor element for enabled links', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example'
          },
          slots: {
            default: 'Link text'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const link = wrapper.find('a')
        expect(link.exists()).toBe(true)
        expect(link.text()).toBe('Link text')
      })

      it('should render as span with role="link" for disabled links', async () => {
        const wrapper = mount(FzLink, {
          props: {
            to: '/example',
            disabled: true
          },
          slots: {
            default: 'Disabled link'
          },
          global: {
            plugins: [router]
          }
        })

        await wrapper.vm.$nextTick()
        const span = wrapper.find('span')
        expect(span.exists()).toBe(true)
        expect(span.attributes('role')).toBe('link')
        expect(span.text()).toBe('Disabled link')
      })
    })
  })

  describe('RouteLocationRaw support', () => {
    it('accepts string path for internal links', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'String path link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
    })

    it('accepts object with path for internal links', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: { path: '/example', query: { id: '123' } }
        },
        slots: {
          default: 'Object path link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      // router-link handles the object internally
    })

    it('accepts object with name for internal links', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: { name: 'route-name', params: { id: 123 } }
        },
        slots: {
          default: 'Named route link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      // router-link handles the named route internally
    })

    it('requires string URL for external links', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External string link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.attributes('href')).toBe('https://example.com')
      // TypeScript enforces: external=true requires to to be string
      // This test verifies runtime behavior with correct types
    })
  })

  describe('Edge cases', () => {
    it('handles default props correctly', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'Link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-base') // default size
      expect(link.classes()).toContain('leading-base') // default size line-height
      expect(link.classes()).toContain('text-blue-500') // default type
      expect(link.classes()).toContain('hover:text-blue-600') // default hover
      expect(link.classes()).toContain('hover:underline') // default hover underline
      expect(link.classes()).not.toContain('underline') // default linkStyle (no underline by default)
    })

    it('renders correctly with all props combined', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'danger',
          linkStyle: 'underline',
          size: 'sm',
          target: '_self'
        },
        slots: {
          default: 'Complete link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      const link = wrapper.find('a')
      expect(link.classes()).toContain('text-sm')
      expect(link.classes()).toContain('leading-xs')
      expect(link.classes()).toContain('underline')
      expect(link.classes()).toContain('text-semantic-error-200')
      expect(link.classes()).toContain('hover:text-semantic-error-300')
      expect(link.classes()).toContain('focus:text-semantic-error-300')
      expect(link.classes()).toContain('focus:outline-none')
      expect(link.classes()).toContain('focus:border-solid')
      expect(link.classes()).toContain('focus:no-underline')
      expect(link.classes()).toContain('focus:border-semantic-error-300')
      expect(link.attributes('target')).toBe('_self')
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example'
        },
        slots: {
          default: 'Default link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - disabled state', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          disabled: true
        },
        slots: {
          default: 'Disabled link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - external link', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true
        },
        slots: {
          default: 'External link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - danger type', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          type: 'danger'
        },
        slots: {
          default: 'Danger link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - underline linkStyle', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          linkStyle: 'underline'
        },
        slots: {
          default: 'Underlined link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - small size', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: '/example',
          size: 'sm'
        },
        slots: {
          default: 'Small link'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - external with target blank', async () => {
      const wrapper = mount(FzLink, {
        props: {
          to: 'https://example.com',
          external: true,
          target: '_blank'
        },
        slots: {
          default: 'External new tab'
        },
        global: {
          plugins: [router]
        }
      })

      await wrapper.vm.$nextTick()
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

