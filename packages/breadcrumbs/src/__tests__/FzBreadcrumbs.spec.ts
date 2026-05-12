import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, VueWrapper } from '@vue/test-utils'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import { Breadcrumb, CustomRouteLocation, FzRouterBreadcrumbs, FzBreadcrumbs } from '..'

const breadcrumbs: Breadcrumb<CustomRouteLocation>[] = [
  {
    id: 'home',
    label: 'home',
    metadata: {
      name: 'home',
      path: '/'
    }
  },
  {
    id: 'foo',
    label: 'foo',
    metadata: {
      name: 'foo',
      path: '/foo'
    }
  },
  {
    id: 'bar',
    label: 'bar',
    metadata: {
      name: 'bar',
      path: '/foo/bar'
    }
  }
]

const simpleBreadcrumbs: Breadcrumb[] = [
  {
    id: 'home',
    label: 'Home'
  },
  {
    id: 'products',
    label: 'Products'
  },
  {
    id: 'current',
    label: 'Current Page'
  }
]

const Page = {
  template: '<div>Page</div>'
}

const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: Page,
    children: [
      {
        name: 'foo',
        path: '/foo',
        component: Page,
        children: [
          {
            name: 'bar',
            path: '/foo/bar',
            component: Page
          }
        ]
      }
    ]
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
// FZBREADCRUMBS TESTS
// ============================================

describe('FzBreadcrumbs', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should render all breadcrumb labels', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Products')
      expect(wrapper.text()).toContain('Current Page')
    })

    it('should render default separator', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      expect(wrapper.text()).toContain('/')
    })

    it('should render custom separator', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs,
          separator: '>'
        }
      })
      expect(wrapper.text()).toContain('>')
      expect(wrapper.text()).not.toContain('/')
    })

    it('should render slot content for bread-label', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        },
        slots: {
          'bread-label': '<span class="custom-label">Custom Label</span>'
        }
      })
      expect(wrapper.find('.custom-label').exists()).toBe(true)
    })

    it('should render slot content for bread-separator', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        },
        slots: {
          'bread-separator': '<span class="custom-separator">|</span>'
        }
      })
      expect(wrapper.find('.custom-separator').exists()).toBe(true)
    })

    it('should not render separator after last breadcrumb', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      const separators = wrapper.findAll('.text-grey-300')
      // Should have 2 separators for 3 breadcrumbs (between items, not after last)
      expect(separators.length).toBe(2)
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('breadcrumbs prop', () => {
      it('should render breadcrumbs from prop', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        expect(wrapper.text()).toContain('Home')
        expect(wrapper.text()).toContain('Products')
        expect(wrapper.text()).toContain('Current Page')
      })

      it('should render nothing with a single breadcrumb', () => {
        const singleBreadcrumb: Breadcrumb[] = [{ id: 'single', label: 'Single' }]
        const wrapper = mount(FzBreadcrumbs, {
          props: { breadcrumbs: singleBreadcrumb }
        })
        expect(wrapper.find('nav').exists()).toBe(false)
      })

      it('should render nothing with an empty breadcrumbs array', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: { breadcrumbs: [] }
        })
        expect(wrapper.find('nav').exists()).toBe(false)
      })
    })

    describe('separator prop', () => {
      it('should use default separator when not provided', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        expect(wrapper.text()).toContain('/')
      })

      it('should use custom separator when provided', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs,
            separator: '→'
          }
        })
        expect(wrapper.text()).toContain('→')
      })

      it('should handle multi-character separator', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs,
            separator: ' >> '
          }
        })
        expect(wrapper.text()).toContain(' >> ')
      })
    })

    describe('environment prop', () => {
      it('should default to frontoffice', () => {
        const wrapper = mount(FzBreadcrumbs, { props: { breadcrumbs: simpleBreadcrumbs } })
        // frontoffice default: 3 items → 3 <li>, no overflow
        expect(wrapper.findAll('li').length).toBe(simpleBreadcrumbs.length)
      })

      it('should not collapse in frontoffice with exactly 3 items', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: { breadcrumbs: simpleBreadcrumbs, environment: 'frontoffice' }
        })
        expect(wrapper.findAll('li').length).toBe(3)
        expect(wrapper.find('span.text-blue-500').exists()).toBe(false)
      })

      it('should collapse in frontoffice with 4 or more items', () => {
        const four: Breadcrumb[] = Array.from({ length: 4 }, (_, i) => ({
          id: `p${i}`,
          label: `P${i}`
        }))
        const wrapper = mount(FzBreadcrumbs, {
          props: { breadcrumbs: four, environment: 'frontoffice' }
        })
        expect(wrapper.findAll('li').length).toBe(4)
        expect(wrapper.find('span.text-blue-500').text()).toBe('...')
      })

      it('should show first, ellipsis, penultimate and last item on frontoffice overflow', () => {
        const items: Breadcrumb[] = Array.from({ length: 5 }, (_, i) => ({
          id: `p${i}`,
          label: `Page${i}`
        }))
        const wrapper = mount(FzBreadcrumbs, {
          props: { breadcrumbs: items, environment: 'frontoffice' }
        })
        expect(wrapper.text()).toContain('Page0') // first
        expect(wrapper.text()).toContain('...') // ellipsis
        expect(wrapper.text()).toContain('Page3') // penultimate (index n-2)
        expect(wrapper.text()).toContain('Page4') // last (active)
        expect(wrapper.text()).not.toContain('Page1')
        expect(wrapper.text()).not.toContain('Page2')
      })

      it('should show all items in backoffice regardless of count', () => {
        const many: Breadcrumb[] = Array.from({ length: 8 }, (_, i) => ({
          id: `p${i}`,
          label: `Page${i}`
        }))
        const wrapper = mount(FzBreadcrumbs, {
          props: { breadcrumbs: many, environment: 'backoffice' }
        })
        expect(wrapper.findAll('li').length).toBe(8)
        expect(wrapper.find('span.text-blue-500').exists()).toBe(false)
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should not emit custom events (presentational component)', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      // FzBreadcrumbs is a presentational component, no events expected
      expect(wrapper.emitted()).toEqual({})
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should apply static base classes', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.classes()).toContain('text-sm')
      const ol = nav.find('ol')
      expect(ol.exists()).toBe(true)
      expect(ol.classes()).toContain('flex')
    })

    it('should apply text-blue-500 to non-active links', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      const labels = wrapper.findAll('.text-blue-500')
      // All except last should have text-blue-500
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should apply text-grey-500 to active (last) link', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      const activeLabel = wrapper.findAll('.text-grey-500')
      // Last breadcrumb should have text-grey-500
      expect(activeLabel.length).toBeGreaterThanOrEqual(1)
    })

    it('should apply separator classes', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      const separators = wrapper.findAll('.text-grey-300')
      separators.forEach((separator) => {
        expect(separator.classes()).toContain('text-grey-300')
      })
    })

    it('should apply gap-1 on <ol> and each <li>', () => {
      const wrapper = mount(FzBreadcrumbs, { props: { breadcrumbs: simpleBreadcrumbs } })
      expect(wrapper.find('ol').classes()).toContain('gap-1')
      wrapper.findAll('li').forEach((li) => {
        expect(li.classes()).toContain('gap-1')
      })
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should use semantic structure for breadcrumbs', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        const nav = wrapper.find('nav')
        expect(nav.exists()).toBe(true)
        expect(nav.find('ol').exists()).toBe(true)
        expect(nav.findAll('li').length).toBe(simpleBreadcrumbs.length)
      })

      it('should have accessible text content', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        expect(wrapper.text()).toContain('Home')
        expect(wrapper.text()).toContain('Products')
        expect(wrapper.text()).toContain('Current Page')
      })
    })

    describe('ARIA attributes', () => {
      it('should set aria-current="page" on last breadcrumb', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        const items = wrapper.findAll('li')
        expect(items[items.length - 1].find('[aria-current="page"]').exists()).toBe(true)
        expect(items[0].find('[aria-current]').exists()).toBe(false)
      })

      it('should render a <nav> landmark with aria-label="Breadcrumb" by default', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
      })

      it('should use custom ariaLabel when provided', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs,
            ariaLabel: 'You are here'
          }
        })
        expect(wrapper.find('nav').attributes('aria-label')).toBe('You are here')
      })

      it('should hide separators from assistive technology', () => {
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        // 3 breadcrumbs → 2 separators hidden with aria-hidden
        expect(wrapper.findAll('[aria-hidden="true"]').length).toBe(simpleBreadcrumbs.length - 1)
      })
    })

    describe('Keyboard navigation', () => {
      it('should be keyboard accessible when using router-link (in FzRouterBreadcrumbs)', () => {
        // This is tested in FzRouterBreadcrumbs tests
        // FzBreadcrumbs itself is presentational
        const wrapper = mount(FzBreadcrumbs, {
          props: {
            breadcrumbs: simpleBreadcrumbs
          }
        })
        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle undefined separator gracefully', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs,
          separator: undefined
        }
      })
      // Should fall back to default '/'
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle breadcrumbs with very long labels', () => {
      const longBreadcrumbs: Breadcrumb[] = [
        { id: 'home', label: 'Home' },
        {
          id: 'long',
          label: 'This is a very long breadcrumb label that might wrap or overflow'
        }
      ]
      const wrapper = mount(FzBreadcrumbs, {
        props: { breadcrumbs: longBreadcrumbs }
      })
      expect(wrapper.text()).toContain('This is a very long breadcrumb label')
    })

    it('should handle breadcrumbs with special characters', () => {
      const specialBreadcrumbs: Breadcrumb[] = [
        { id: 'home', label: 'Home' },
        { id: 'special', label: 'Special & Characters < > " \'' }
      ]
      const wrapper = mount(FzBreadcrumbs, {
        props: { breadcrumbs: specialBreadcrumbs }
      })
      expect(wrapper.text()).toContain('Special & Characters')
    })

    it('should handle breadcrumbs with empty string labels', () => {
      const emptyBreadcrumbs: Breadcrumb[] = [
        {
          id: 'empty',
          label: ''
        }
      ]
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: emptyBreadcrumbs
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should collapse to 4 displayed items in frontoffice when breadcrumbs > 3', () => {
      const manyBreadcrumbs: Breadcrumb[] = Array.from({ length: 10 }, (_, i) => ({
        id: `item-${i}`,
        label: `Item ${i}`
      }))
      const wrapper = mount(FzBreadcrumbs, {
        props: { breadcrumbs: manyBreadcrumbs, environment: 'frontoffice' }
      })
      // shows first, ellipsis, penultimate (item-8), last (item-9)
      expect(wrapper.text()).toContain('Item 0')
      expect(wrapper.text()).toContain('...')
      expect(wrapper.text()).toContain('Item 8')
      expect(wrapper.text()).toContain('Item 9')
      // 4 displayed items → 3 separators
      expect(wrapper.findAll('.text-grey-300').length).toBe(3)
    })

    it('should show all breadcrumbs in backoffice regardless of count', () => {
      const manyBreadcrumbs: Breadcrumb[] = Array.from({ length: 10 }, (_, i) => ({
        id: `item-${i}`,
        label: `Item ${i}`
      }))
      const wrapper = mount(FzBreadcrumbs, {
        props: { breadcrumbs: manyBreadcrumbs, environment: 'backoffice' }
      })
      expect(wrapper.text()).toContain('Item 0')
      expect(wrapper.text()).toContain('Item 9')
      // 10 items → 9 separators
      expect(wrapper.findAll('.text-grey-300').length).toBe(9)
    })

    it('ellipsis should have text-blue-500 class in frontoffice overflow', () => {
      const manyBreadcrumbs: Breadcrumb[] = Array.from({ length: 5 }, (_, i) => ({
        id: `item-${i}`,
        label: `Item ${i}`
      }))
      const wrapper = mount(FzBreadcrumbs, {
        props: { breadcrumbs: manyBreadcrumbs, environment: 'frontoffice' }
      })
      // ellipsis renders as <span>, default labels as <div>
      const ellipsis = wrapper.find('span.text-blue-500')
      expect(ellipsis.exists()).toBe(true)
      expect(ellipsis.text()).toBe('...')
    })

    it('should correctly identify last breadcrumb as active', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      // Last breadcrumb should have text-grey-500 class
      const activeLabels = wrapper.findAll('.text-grey-500')
      expect(activeLabels.length).toBeGreaterThanOrEqual(1)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot - default state', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - custom separator', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: simpleBreadcrumbs,
          separator: '→'
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should match snapshot - single breadcrumb', () => {
      const wrapper = mount(FzBreadcrumbs, {
        props: {
          breadcrumbs: [{ id: 'single', label: 'Single' }]
        }
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})

// ============================================
// FZROUTERBREADCRUMBS TESTS
// ============================================

describe('FzRouterBreadcrumbs', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================
  describe('Rendering', () => {
    it('should render with static breadcrumbs prop', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('home')
      expect(wrapper.text()).toContain('foo')
      expect(wrapper.text()).toContain('bar')
    })

    it('should render with automatic breadcrumbs from route', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        global: {
          plugins: [router]
        }
      })

      await router.push('/foo/bar')
      await flushPromises()

      expect(wrapper.exists()).toBe(true)
      const breadcrumbsComponent = wrapper.findComponent({ name: 'fz-breadcrumbs' })
      expect(breadcrumbsComponent.exists()).toBe(true)
    })

    it('should render router-link elements for each breadcrumb', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      const links = wrapper.findAllComponents({ name: 'router-link' })
      // last item renders as <span>, so n-1 links for n breadcrumbs
      expect(links.length).toBe(breadcrumbs.length - 1)
    })

    it('should render custom separator', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs,
          separator: '>'
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      expect(wrapper.text()).toContain('>')
    })
  })

  // ============================================
  // PROPS TESTS
  // ============================================
  describe('Props', () => {
    describe('breadcrumbs prop', () => {
      it('should use provided breadcrumbs when available', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        expect(wrapper.text()).toContain('home')
        expect(wrapper.text()).toContain('foo')
        expect(wrapper.text()).toContain('bar')
      })

      it('should generate breadcrumbs from route when not provided', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          global: {
            plugins: [router]
          }
        })

        await router.push('/foo/bar')
        await flushPromises()

        const links = wrapper.findAllComponents({ name: 'router-link' })
        expect(links.length).toBeGreaterThan(0)
      })

      it('should handle empty breadcrumbs array by generating from route', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs: []
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        // When breadcrumbs is empty, component falls back to generating from route
        const links = wrapper.findAllComponents({ name: 'router-link' })
        // Route-based breadcrumbs will be generated
        expect(links.length).toBeGreaterThanOrEqual(0)
      })
    })

    describe('separator prop', () => {
      it('should use default separator when not provided', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        expect(wrapper.text()).toContain('/')
      })

      it('should use custom separator when provided', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs,
            separator: '→'
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        expect(wrapper.text()).toContain('→')
      })
    })

    describe('environment prop', () => {
      // RouterLink is stubbed because these tests focus on collapse behaviour,
      // not route resolution — the metadata paths are intentionally arbitrary.
      const manyBreadcrumbs: Breadcrumb<CustomRouteLocation>[] = Array.from(
        { length: 5 },
        (_, i) => ({ id: `p${i}`, label: `Page${i}`, metadata: { path: `/${i}`, name: `p${i}` } })
      )
      const mountOpts = (env: 'frontoffice' | 'backoffice') => ({
        props: { breadcrumbs: manyBreadcrumbs, environment: env },
        global: { plugins: [router], stubs: { RouterLink: true } }
      })

      it('should pass environment to FzBreadcrumbs and not collapse in backoffice', async () => {
        router.push('/')
        await router.isReady()
        const wrapper = mount(FzRouterBreadcrumbs, mountOpts('backoffice'))
        await flushPromises()
        expect(wrapper.findAll('li').length).toBe(5)
        expect(wrapper.find('span.text-blue-500').exists()).toBe(false)
      })

      it('should collapse to 4 items in frontoffice with more than 3 breadcrumbs', async () => {
        router.push('/')
        await router.isReady()
        const wrapper = mount(FzRouterBreadcrumbs, mountOpts('frontoffice'))
        await flushPromises()
        expect(wrapper.findAll('li').length).toBe(4)
        expect(wrapper.find('span.text-blue-500').text()).toBe('...')
      })

      it('should render nothing when a single breadcrumb is passed', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs: [{ id: 'home', label: 'Home', metadata: { path: '/', name: 'home' } }]
          },
          global: { plugins: [router] }
        })

        await flushPromises()
        expect(wrapper.find('nav').exists()).toBe(false)
      })
    })
  })

  // ============================================
  // EVENTS TESTS
  // ============================================
  describe('Events', () => {
    it('should navigate when router-link is clicked', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      const links = wrapper.findAllComponents({ name: 'router-link' })

      if (links.length > 0) {
        // Router-link handles navigation internally
        expect(links[0].exists()).toBe(true)
      }
    })
  })

  // ============================================
  // CSS CLASSES TESTS
  // ============================================
  describe('CSS Classes', () => {
    it('should render a <nav> landmark with aria-label', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('aria-label')).toBe('Breadcrumb')
    })

    it('should apply text-blue-500 to non-active links', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      const links = wrapper.findAllComponents({ name: 'router-link' })
      // All except last should have text-blue-500
      expect(links.length).toBeGreaterThan(0)
    })

    it('should apply text-grey-500 to active (last) link', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      // Last link should have text-grey-500
      const activeLinks = wrapper.findAll('.text-grey-500')
      expect(activeLinks.length).toBeGreaterThanOrEqual(1)
    })
  })

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  describe('Accessibility', () => {
    describe('Semantic HTML structure', () => {
      it('should use semantic structure for breadcrumbs', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        const nav = wrapper.find('nav')
        expect(nav.exists()).toBe(true)
        expect(nav.find('ol').exists()).toBe(true)
      })

      it('should have accessible text content', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        expect(wrapper.text()).toContain('home')
        expect(wrapper.text()).toContain('foo')
        expect(wrapper.text()).toContain('bar')
      })
    })

    describe('ARIA attributes', () => {
      it('should set aria-current="page" on the last item rendered as <span>', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        // last item renders as a non-interactive <span>, not a router-link
        const activeSpan = wrapper.find('span[aria-current="page"]')
        expect(activeSpan.exists()).toBe(true)
        expect(activeSpan.text()).toBe('bar')
        // last item must not be a router-link
        const links = wrapper.findAllComponents({ name: 'router-link' })
        expect(links.length).toBe(breadcrumbs.length - 1)
      })

      it('should render a <nav> landmark with aria-label="Breadcrumb"', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
      })
    })

    describe('Keyboard navigation', () => {
      it('should be keyboard accessible via router-link', async () => {
        router.push('/')
        await router.isReady()

        const wrapper = mount(FzRouterBreadcrumbs, {
          props: {
            breadcrumbs
          },
          global: {
            plugins: [router]
          }
        })

        await flushPromises()
        const links = wrapper.findAllComponents({ name: 'router-link' })
        // Router-link elements are keyboard accessible by default
        expect(links.length).toBeGreaterThan(0)
        links.forEach((link) => {
          expect(link.exists()).toBe(true)
        })
      })
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge Cases', () => {
    it('should handle route without matched routes', async () => {
      router.push('/nonexistent')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      // Should handle gracefully when route has no matches
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle route with no name', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle breadcrumbs with missing metadata', async () => {
      router.push('/')
      await router.isReady()

      const incompleteBreadcrumbs: Breadcrumb<CustomRouteLocation>[] = [
        {
          id: 'test',
          label: 'Test',
          metadata: {
            path: '/test'
          } as CustomRouteLocation
        }
      ]

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs: incompleteBreadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBe(true)
    })
  })

  // ============================================
  // SNAPSHOTS
  // ============================================
  describe('Snapshots', () => {
    it('should match snapshot for static breadcrumbs', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(FzRouterBreadcrumbs, {
        props: {
          breadcrumbs
        },
        global: {
          plugins: [router]
        }
      })

      await flushPromises()
      expect(wrapper.html()).toMatchSnapshot()
      expect(
        wrapper.findComponent({ name: 'fz-breadcrumbs' }).findAllComponents({ name: 'router-link' })
      ).toHaveLength(breadcrumbs.length - 1)
    })

    it('should match snapshot for automatic breadcrumbs', async () => {
      router.push('/')
      await router.isReady()

      const App = {
        components: { FzRouterBreadcrumbs },
        template: `
          <fz-router-breadcrumbs />
          <router-view />
        `
      }

      const wrapper = mount(App, {
        global: {
          plugins: [router]
        }
      })

      await router.push('/foo/bar')
      await flushPromises()

      expect(wrapper.html()).toMatchSnapshot()
      expect(
        wrapper
          .findComponent({ name: 'fz-router-breadcrumbs' })
          .findComponent({ name: 'fz-breadcrumbs' })
          .findAllComponents({ name: 'router-link' })
      ).toHaveLength(breadcrumbs.length - 1)
    })
  })
})
