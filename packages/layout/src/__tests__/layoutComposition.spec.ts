import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import {
  FzAppTemplate,
  FzSidebarTemplate,
  FzFrameTemplate,
  FzListTemplate,
  FzDetailTemplate,
  FzThreeColumnsTemplate
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
// window.matchMedia mock — jsdom doesn't provide it and the shells query
// `(min-width: 1200px)` (`FzAppTemplate`, `FzSidebarTemplate`) or
// `(min-width: 1024px)` (`FzFrameTemplate`). `matches: true` keeps every shell in
// its persistent-rail state, which is the layout the pairs are documented
// against.
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
  { name: 'FzSidebarTemplate', component: FzSidebarTemplate },
  { name: 'FzFrameTemplate', component: FzFrameTemplate }
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
  // ==========================================================================
  // The bounded pair — FzThreeColumnsTemplate needs a host that CLIPS
  // ==========================================================================
  describe('FzFrameTemplate hosts FzThreeColumnsTemplate (kind: bounded)', () => {
    function mountPair(contentHeight: 'scroll' | 'bounded') {
      return mount(FzFrameTemplate, {
        props: { contentHeight },
        slots: {
          default: () =>
            h(
              FzThreeColumnsTemplate,
              { mainAs: 'div', sidebarLabel: 'Documenti' },
              {
                'header-left': () => 'titolo',
                'sidebar-content': () => 'lista',
                'column-left': () => 'anteprima',
                'column-right-content': () => 'record'
              }
            )
        }
      })
    }

    it('hosts it without a second main landmark', () => {
      const wrapper = mountPair('bounded')

      expect(wrapper.findAll('main')).toHaveLength(1)
      expect(wrapper.find('.fz-three-columns-template').exists()).toBe(true)
      expect(wrapper.text()).toContain('record')
      // The nested layout's own complementary rail survives the nesting, named
      // so it stays distinguishable from any rail the shell contributes.
      expect(wrapper.findAll('aside[aria-label="Documenti"]')).toHaveLength(1)
    })

    it('clips its content region under contentHeight="bounded"', () => {
      // This is the whole point of the pair: `h-full` on the nested layout only
      // resolves against an ancestor with a *definite* height, and the clipping
      // region is what makes it definite. The manifest's `whenNested.note` says
      // the host must set this prop; this is that claim, as far as a DOM without
      // a layout engine can carry it (the resolved heights are asserted in the
      // Storybook play function, which runs in real Chromium).
      const main = mountPair('bounded').find('.fz-frame-template__main')

      expect(main.classes()).toContain('overflow-hidden')
      expect(main.classes()).toEqual(expect.arrayContaining(['flex', 'flex-col', 'min-h-0']))
    })

    it('does not clip under the default contentHeight — which is why the note is not optional', () => {
      // Same shell, prop omitted: the region scrolls instead of clipping, so its
      // height is indefinite again and the nested layout has nothing to fill.
      // Nesting inside the right shell is necessary but not sufficient.
      const main = mountPair('scroll').find('.fz-frame-template__main')

      expect(main.classes()).toContain('overflow-y-auto')
      expect(main.classes()).not.toContain('overflow-hidden')
    })
  })
})
