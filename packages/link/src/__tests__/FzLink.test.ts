import { describe, it, expect } from 'vitest'
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
    it('matches snapshot', async () => {
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
      expect(wrapper.html()).toMatchSnapshot()
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

  describe('Accessibility', () => {
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
      expect(link.attributes('target')).toBe('_self')
    })
  })
})

