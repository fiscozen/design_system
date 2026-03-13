import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { provideQueryStringRoute } from '@fiscozen/composables'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import FzPagination from '../FzPagination.vue'

describe('FzPagination', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('renders nav element when totalPages > 1', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('does not render when totalPages <= 1', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 1, currentPage: 1 }
      })

      expect(wrapper.find('nav').exists()).toBe(false)
    })

    it('does not render when totalPages is 0', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 0, currentPage: 0 }
      })

      expect(wrapper.find('nav').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('has aria-label on nav element', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      expect(wrapper.find('nav').attributes('aria-label')).toBe('Paginazione')
    })
  })

  describe('v-model / page navigation', () => {
    it('emits update:currentPage when a page button is clicked', async () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const buttons = wrapper.findAll('button')
      const page2Button = buttons.find(b => b.text().trim() === '2')
      expect(page2Button).toBeTruthy()

      await page2Button!.trigger('click')
      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([2])
    })

    it('emits update:currentPage with next page on next click', async () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const buttons = wrapper.findAll('button')
      const nextButton = buttons[buttons.length - 1]

      await nextButton.trigger('click')
      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([2])
    })

    it('emits update:currentPage with prev page on prev click', async () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 3 }
      })

      const buttons = wrapper.findAll('button')
      const prevButton = buttons[0]

      await prevButton.trigger('click')
      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([2])
    })
  })

  describe('Disabled state', () => {
    it('prev button is disabled on first page', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const buttons = wrapper.findAll('button')
      const prevButton = buttons[0]
      expect(prevButton.attributes('disabled')).toBeDefined()
    })

    it('next button is disabled on last page', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 5 }
      })

      const buttons = wrapper.findAll('button')
      const nextButton = buttons[buttons.length - 1]
      expect(nextButton.attributes('disabled')).toBeDefined()
    })

    it('prev button is not disabled on page > 1', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 3 }
      })

      const buttons = wrapper.findAll('button')
      const prevButton = buttons[0]
      expect(prevButton.attributes('disabled')).toBeUndefined()
    })

    it('next button is not disabled on page < totalPages', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 3 }
      })

      const buttons = wrapper.findAll('button')
      const nextButton = buttons[buttons.length - 1]
      expect(nextButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Page variants', () => {
    it('renders page number buttons for small page count', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 3, currentPage: 1 }
      })

      const buttons = wrapper.findAll('button')
      const pageLabels = buttons.map(b => b.text().trim()).filter(t => !isNaN(Number(t)))
      expect(pageLabels).toContain('1')
      expect(pageLabels).toContain('2')
      expect(pageLabels).toContain('3')
    })

    it('renders prev and next buttons', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const html = wrapper.html()
      expect(html).toContain('Indietro')
      expect(html).toContain('Avanti')
    })
  })

  describe('Options prop', () => {
    it('uses custom prev/next labels from options', () => {
      const wrapper = mount(FzPagination, {
        props: {
          totalPages: 5,
          currentPage: 1,
          options: { prev: { label: 'Back' }, next: { label: 'Forward' } }
        }
      })

      const html = wrapper.html()
      expect(html).toContain('Back')
      expect(html).toContain('Forward')
      expect(html).not.toContain('Indietro')
      expect(html).not.toContain('Avanti')
    })

    it('hides prev/next when options disable them', () => {
      const wrapper = mount(FzPagination, {
        props: {
          totalPages: 5,
          currentPage: 3,
          options: { prev: { show: false }, next: { show: false } }
        }
      })

      const html = wrapper.html()
      expect(html).not.toContain('Indietro')
      expect(html).not.toContain('Avanti')
    })

    it('works with default options when none provided', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const html = wrapper.html()
      expect(html).toContain('Indietro')
      expect(html).toContain('Avanti')
    })
  })

  describe('Environment prop', () => {
    it('defaults to frontoffice', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      expect(wrapper.props('environment')).toBe('frontoffice')
    })

    it('accepts backoffice environment', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1, environment: 'backoffice' }
      })

      expect(wrapper.props('environment')).toBe('backoffice')
    })
  })

  describe('Position prop', () => {
    it('defaults to justify-end', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const nav = wrapper.find('nav')
      expect(nav.classes()).toContain('justify-end')
    })

    it('applies justify-start for position start', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1, position: 'start' }
      })

      const nav = wrapper.find('nav')
      expect(nav.classes()).toContain('justify-start')
    })

    it('applies justify-center for position center', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1, position: 'center' }
      })

      const nav = wrapper.find('nav')
      expect(nav.classes()).toContain('justify-center')
    })
  })

  describe('buttonClasses', () => {
    it('applies fz-pagination-disable-truncate to current page button', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 3 }
      })

      const buttons = wrapper.findAll('button')
      const currentButton = buttons.find(b => b.text().trim() === '3')
      expect(currentButton).toBeTruthy()
      expect(currentButton!.classes()).toContain('fz-pagination-disable-truncate')
    })

    it('does not apply fz-pagination-disable-truncate to non-current page buttons', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 3 }
      })

      const buttons = wrapper.findAll('button')
      const otherButton = buttons.find(b => b.text().trim() === '2')
      expect(otherButton).toBeTruthy()
      expect(otherButton!.classes()).not.toContain('fz-pagination-disable-truncate')
    })

    it('applies min-w-44 to all buttons', () => {
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach(b => {
        expect(b.classes()).toContain('!min-w-44')
      })
    })
  })

  describe('Mobile layout', () => {
    it('wraps prev/next in spans with mobile classes', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 3 }
      })

      const prevSpan = wrapper.find('span.justify-start')
      expect(prevSpan.exists()).toBe(true)
      expect(prevSpan.classes()).toContain('flex-1')

      const nextSpan = wrapper.find('span.justify-end')
      expect(nextSpan.exists()).toBe(true)
      expect(nextSpan.classes()).toContain('flex-1')
    })
  })

  describe('URL sync (syncUrl)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/app', search: '', hash: '' },
        writable: true,
      })
      vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
      vi.spyOn(window.history, 'pushState').mockImplementation(() => {})
      vi.spyOn(window, 'history', 'get').mockReturnValue({
        ...window.history,
        state: {},
        replaceState: window.history.replaceState,
        pushState: window.history.pushState,
      })
    })

    it('uses "page" as default urlKey', () => {
      window.location.search = '?page=5'
      const wrapper = mount(FzPagination, {
        props: { totalPages: 10, currentPage: 1 }
      })

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([5])
    })

    it('emits initial page from URL on mount', () => {
      window.location.search = '?page=5'
      const wrapper = mount(FzPagination, {
        props: { totalPages: 10, currentPage: 1 }
      })

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([5])
    })

    it('does not emit if URL value matches currentPage', () => {
      window.location.search = '?page=3'
      const wrapper = mount(FzPagination, {
        props: { totalPages: 10, currentPage: 3 }
      })

      expect(wrapper.emitted('update:currentPage')).toBeFalsy()
    })

    it('does not emit if urlKey is absent from URL', () => {
      window.location.search = ''
      const wrapper = mount(FzPagination, {
        props: { totalPages: 10, currentPage: 1 }
      })

      expect(wrapper.emitted('update:currentPage')).toBeFalsy()
    })

    it('updates URL on page click', async () => {
      window.location.search = '?page=1'
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1 }
      })

      const pageButtons = wrapper.findAll('button').filter(
        btn => btn.text() === '3'
      )
      expect(pageButtons.length).toBeGreaterThan(0)
      await pageButtons[0].trigger('click')

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(window.history.replaceState).toHaveBeenCalledWith(
        expect.objectContaining({ __queryString: expect.objectContaining({ page: 3 }) }),
        '',
        expect.any(String)
      )
    })

    it('supports custom urlKey', () => {
      window.location.search = '?p=7'
      const wrapper = mount(FzPagination, {
        props: { totalPages: 10, currentPage: 1, urlKey: 'p' }
      })

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(wrapper.emitted('update:currentPage')![0]).toEqual([7])
    })

    it('works with provideQueryStringRoute', () => {
      window.location.search = '?page=4'
      const mockRoute = { query: { page: '4' } } as unknown as RouteLocationNormalizedLoaded

      const Parent = defineComponent({
        setup() {
          provideQueryStringRoute(mockRoute)
          return () => h(FzPagination, {
            totalPages: 10,
            currentPage: 1,
          })
        }
      })

      const wrapper = mount(Parent)
      const pagination = wrapper.findComponent(FzPagination)

      expect(pagination.emitted('update:currentPage')).toBeTruthy()
      expect(pagination.emitted('update:currentPage')![0]).toEqual([4])
    })

    it('does not sync when syncUrl is false', () => {
      window.location.search = '?page=5'
      const wrapper = mount(FzPagination, {
        props: { totalPages: 10, currentPage: 1, syncUrl: false }
      })

      expect(wrapper.emitted('update:currentPage')).toBeFalsy()
    })

    it('does not update URL on click when syncUrl is false', async () => {
      window.location.search = ''
      const wrapper = mount(FzPagination, {
        props: { totalPages: 5, currentPage: 1, syncUrl: false }
      })

      const pageButtons = wrapper.findAll('button').filter(
        btn => btn.text() === '3'
      )
      await pageButtons[0].trigger('click')

      expect(wrapper.emitted('update:currentPage')).toBeTruthy()
      expect(window.history.replaceState).not.toHaveBeenCalled()
    })
  })
})
