import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import {
  FzAppTemplate,
  FzSidebarTemplate,
  FzListTemplate,
  FzDetailTemplate
} from '..'

/**
 * Verifies the shell + page-content pairs that `layouts.json` advertises in each
 * entry's `nestWithin`.
 *
 * The manifest is what tells every consuming repo which layouts may be composed
 * together, and the plugin presents an unlisted pair as "unverified — ask". That
 * promise is only worth making if the listed pairs are actually exercised, so
 * each one gets a test here. The invariant that matters is landmark ownership:
 * the shell owns `<main>`, the nested page-content layout must not add a second
 * one (which is what its documented `mainAs="div"` is for), and the nested
 * layout's own complementary rail must survive the nesting.
 *
 * Adding a `nestWithin` entry to the manifest means adding a case here.
 */

// ---------------------------------------------------------------------------
// window.matchMedia mock — jsdom doesn't provide it and both shells query
// `(min-width: 1200px)`. Desktop keeps the shells in their persistent-rail
// state, which is the layout the pairs are documented against.
// ---------------------------------------------------------------------------
const originalMatchMedia = window.matchMedia

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: originalMatchMedia
  })
})

const SHELLS = [
  { name: 'FzAppTemplate', component: FzAppTemplate },
  { name: 'FzSidebarTemplate', component: FzSidebarTemplate }
] as const

describe('layout composition (manifest `nestWithin`)', () => {
  describe.each(SHELLS)('$name', ({ component: Shell }) => {
    it('owns exactly one main landmark on its own', () => {
      const wrapper = mount(Shell, { slots: { default: 'content' } })
      expect(wrapper.findAll('main')).toHaveLength(1)
    })

    it('hosts FzListTemplate without a second main landmark', () => {
      const wrapper = mount(Shell, {
        slots: {
          default: () =>
            h(
              FzListTemplate,
              { mainAs: 'div', filtersLabel: 'Filtri' },
              {
                filters: () => 'filters',
                header: () => 'toolbar',
                default: () => 'rows'
              }
            )
        }
      })

      // The shell owns the single `main`; the nested layout renders its content
      // region as a plain container instead.
      expect(wrapper.findAll('main')).toHaveLength(1)
      expect(wrapper.find('.fz-list-template').exists()).toBe(true)
      expect(wrapper.text()).toContain('rows')
      // The nested layout's own complementary rail survives, and stays named so
      // it is distinguishable from any rail the shell contributes.
      const rails = wrapper.findAll('aside[aria-label="Filtri"]')
      expect(rails).toHaveLength(1)
    })

    it('hosts FzDetailTemplate without a second main landmark', () => {
      const wrapper = mount(Shell, {
        slots: {
          default: () =>
            h(
              FzDetailTemplate,
              { mainAs: 'div', sidebarLabel: 'Riepilogo' },
              {
                sidebar: () => 'summary',
                toolbar: () => 'actions',
                default: () => 'body'
              }
            )
        }
      })

      expect(wrapper.findAll('main')).toHaveLength(1)
      expect(wrapper.find('.fz-detail-template').exists()).toBe(true)
      expect(wrapper.text()).toContain('body')
      expect(wrapper.findAll('aside[aria-label="Riepilogo"]')).toHaveLength(1)
    })

    it('produces two main landmarks if the nested layout keeps its default mainAs', () => {
      // Documents *why* `whenNested.props` in the manifest is not optional: drop
      // the prop and the page exposes two `main` landmarks, which is invalid.
      const wrapper = mount(Shell, {
        slots: { default: () => h(FzListTemplate, null, { default: () => 'rows' }) }
      })
      expect(wrapper.findAll('main')).toHaveLength(2)
    })
  })
})
