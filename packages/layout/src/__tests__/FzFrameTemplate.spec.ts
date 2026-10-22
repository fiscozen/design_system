import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick } from 'vue'
import { FzFrameTemplate, FZ_PAGE_SCROLL_TARGET } from '..'

/**
 * Structural, a11y and API coverage for the backoffice frame shell.
 *
 * NOTE ON SCOPE — jsdom has **no layout engine**: every `clientHeight` is 0 and
 * `getComputedStyle` resolves no boxes. The claim this shell exists to make (the
 * content region resolves to a *definite* height under `contentHeight="bounded"`,
 * and is the app's scroll container under `"scroll"`) is therefore not testable
 * here, and asserting it in jsdom would produce a test that passes on a collapsed
 * layout. That contract is covered by the play function in
 * `apps/storybook/src/stories/templates/FzFrameTemplate.stories.ts`, which runs in
 * real Chromium. What is asserted here is everything a DOM without layout can
 * actually prove.
 */

// ---------------------------------------------------------------------------
// window.matchMedia mock (not provided by jsdom). The one query the shell uses
// is `(min-width: 1024px)` — the `lg` token, not the `desktop` one the other
// shells query; see the component doc.
// ---------------------------------------------------------------------------
const originalMatchMedia = window.matchMedia
let isDesktop = true

beforeEach(() => {
  isDesktop = true
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: isDesktop,
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

function fullSlots() {
  return {
    nav: () => h('div', { class: 'rail' }, 'rail'),
    header: (p: any) =>
      h('div', [
        h('button', { class: 'open-aside', onClick: () => p.toggleAside(true) }, 'tools'),
        h('button', { class: 'toggle-aside', onClick: () => p.toggleAside() }, 'toggle'),
        h('span', { class: 'is-desktop' }, String(p.isDesktop))
      ]),
    default: () => h('div', { class: 'page' }, 'Contenuto'),
    aside: (p: any) =>
      h('div', { class: 'tools' }, [
        h('button', { class: 'close-aside', onClick: () => p.toggleAside(false) }, 'x')
      ])
  }
}

describe('FzFrameTemplate', () => {
  // ============================================
  // REGIONS
  // ============================================
  describe('Regions', () => {
    it('renders the page without any chrome slot filled', () => {
      const wrapper = mount(FzFrameTemplate, { slots: { default: () => h('p', 'solo') } })

      expect(wrapper.find('.fz-frame-template').exists()).toBe(true)
      expect(wrapper.text()).toContain('solo')
      // Chrome regions are opt-in: an unfilled slot renders no empty box that
      // would eat 48px or 400px of the viewport.
      expect(wrapper.find('nav').exists()).toBe(false)
      expect(wrapper.find('header').exists()).toBe(false)
      expect(wrapper.find('aside').exists()).toBe(false)
    })

    it('renders every region when its slot is filled', () => {
      const wrapper = mount(FzFrameTemplate, { props: { hasAside: true }, slots: fullSlots() })

      expect(wrapper.find('nav .rail').exists()).toBe(true)
      expect(wrapper.find('header').exists()).toBe(true)
      expect(wrapper.find('.fz-frame-template__main').exists()).toBe(true)
      expect(wrapper.find('aside .tools').exists()).toBe(true)
    })

    it('omits the aside region when hasAside is false, even with the slot filled', () => {
      const wrapper = mount(FzFrameTemplate, { slots: fullSlots() })
      expect(wrapper.find('aside').exists()).toBe(false)
    })
  })

  // ============================================
  // LANDMARKS
  // ============================================
  describe('Landmarks', () => {
    it('wraps the nav slot in a real <nav>, so navLabel is exposed', async () => {
      // Regression guard: with the region as a plain <div>, `aria-label` names
      // nothing (a generic container exposes no accessible name to AT) and the
      // page has no navigation landmark at all.
      const wrapper = mount(FzFrameTemplate, {
        props: { navLabel: 'Navigazione principale' },
        slots: fullSlots()
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('aria-label')).toBe('Navigazione principale')
    })

    it('renders the toolbar as the banner landmark and the page as the single main', () => {
      const wrapper = mount(FzFrameTemplate, { props: { hasAside: true }, slots: fullSlots() })

      expect(wrapper.findAll('header')).toHaveLength(1)
      expect(wrapper.findAll('main')).toHaveLength(1)
      expect(wrapper.find('main').text()).toContain('Contenuto')
    })

    it('names the aside when asideLabel is set', () => {
      const wrapper = mount(FzFrameTemplate, {
        props: { hasAside: true, asideLabel: 'Strumenti' },
        slots: fullSlots()
      })

      expect(wrapper.find('aside').attributes('aria-label')).toBe('Strumenti')
    })
  })

  // ============================================
  // ASIDE STATE
  // ============================================
  describe('Aside', () => {
    it('keeps the aside mounted while closed', async () => {
      // The reason the tools live beside the page slot rather than inside it is
      // that they keep their state. `v-if` would preserve it across route
      // changes but destroy it on every close — the more frequent interaction —
      // so the region is mounted and hidden with `v-show`.
      const wrapper = mount(FzFrameTemplate, {
        props: { hasAside: true, asideOpen: false },
        slots: fullSlots()
      })

      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
      expect(aside.attributes('style')).toContain('display: none')
      // The slotted content is mounted, not just the region.
      expect(wrapper.find('.tools').exists()).toBe(true)
    })

    it('shows the aside when open', async () => {
      const wrapper = mount(FzFrameTemplate, {
        props: { hasAside: true, asideOpen: true },
        slots: fullSlots()
      })

      expect(wrapper.find('aside').attributes('style') ?? '').not.toContain('display: none')
    })

    it('toggles through the slot prop and emits the v-model update', async () => {
      const wrapper = mount(FzFrameTemplate, {
        props: { hasAside: true, asideOpen: false },
        slots: fullSlots()
      })

      await wrapper.find('.open-aside').trigger('click')
      expect(wrapper.emitted('update:asideOpen')?.at(-1)).toEqual([true])

      await wrapper.setProps({ asideOpen: true })
      await wrapper.find('.close-aside').trigger('click')
      expect(wrapper.emitted('update:asideOpen')?.at(-1)).toEqual([false])
    })

    it('flips the state when toggleAside is called without an argument', async () => {
      // The documented default: pass a boolean to force a state, omit to toggle.
      const wrapper = mount(FzFrameTemplate, {
        props: { hasAside: true, asideOpen: false },
        slots: fullSlots()
      })

      await wrapper.find('.toggle-aside').trigger('click')
      expect(wrapper.emitted('update:asideOpen')?.at(-1)).toEqual([true])

      await wrapper.setProps({ asideOpen: true })
      await wrapper.find('.toggle-aside').trigger('click')
      expect(wrapper.emitted('update:asideOpen')?.at(-1)).toEqual([false])
    })

    it('passes isDesktop to the chrome slots', () => {
      const wrapper = mount(FzFrameTemplate, { slots: fullSlots() })
      expect(wrapper.find('.is-desktop').text()).toBe('true')
    })
  })

  // ============================================
  // HEIGHT CONTRACT (class contract only — see the note at the top)
  // ============================================
  describe('contentHeight', () => {
    it('scrolls the content region by default', () => {
      const wrapper = mount(FzFrameTemplate, { slots: fullSlots() })
      const main = wrapper.find('.fz-frame-template__main')

      expect(main.classes()).toContain('overflow-y-auto')
      expect(main.classes()).not.toContain('overflow-hidden')
      // `min-h-full`, never `h-full`: a long page must grow past the region and
      // scroll, not be clipped by it.
      expect(wrapper.find('.fz-frame-template__surface').classes()).toContain('min-h-full')
    })

    it('clips the content region under bounded, handing a definite height down', () => {
      const wrapper = mount(FzFrameTemplate, {
        props: { contentHeight: 'bounded' },
        slots: fullSlots()
      })
      const main = wrapper.find('.fz-frame-template__main')

      expect(main.classes()).toContain('overflow-hidden')
      expect(main.classes()).not.toContain('overflow-y-auto')
      // `flex flex-col` so a child that sizes itself with `flex-1` rather than
      // `h-full` is stretched too.
      expect(main.classes()).toEqual(expect.arrayContaining(['flex', 'flex-col']))

      const surface = wrapper.find('.fz-frame-template__surface')
      expect(surface.classes()).toEqual(
        expect.arrayContaining(['flex', 'min-h-0', 'flex-1', 'flex-col', 'overflow-hidden'])
      )
      expect(surface.classes()).not.toContain('min-h-full')
    })

    it('keeps the root clipping in both contracts', () => {
      // The `h-dvh` + `overflow-hidden` root is what moves scroll off the window;
      // it does not depend on `contentHeight`.
      for (const contentHeight of ['scroll', 'bounded'] as const) {
        const wrapper = mount(FzFrameTemplate, { props: { contentHeight }, slots: fullSlots() })
        expect(wrapper.find('.fz-frame-template').classes()).toEqual(
          expect.arrayContaining(['h-dvh', 'overflow-hidden'])
        )
      }
    })
  })

  // ============================================
  // CHROME + BACKGROUND
  // ============================================
  describe('chrome and background', () => {
    it('draws the card surface by default', () => {
      const wrapper = mount(FzFrameTemplate, { slots: fullSlots() })
      const surface = wrapper.find('.fz-frame-template__surface')

      expect(surface.classes()).toContain('fz-frame-template__surface--card')
      expect(surface.classes()).toEqual(
        expect.arrayContaining(['bg-core-white', 'rounded-xl', 'border-solid'])
      )
    })

    it('draws nothing under flat, for a page that owns its own container', () => {
      const wrapper = mount(FzFrameTemplate, { props: { chrome: 'flat' }, slots: fullSlots() })
      const surface = wrapper.find('.fz-frame-template__surface')

      expect(surface.classes()).toContain('fz-frame-template__surface--flat')
      expect(surface.classes()).not.toContain('bg-core-white')
    })

    it('paints the page background as a prop, not a fall-through class', () => {
      // Consuming repos run a compose-only policy: a background reachable only
      // through `class` on the root does not exist for them.
      const page = mount(FzFrameTemplate, { slots: fullSlots() })
      expect(page.find('.fz-frame-template').classes()).toContain('bg-background-white-smoke')

      const transparent = mount(FzFrameTemplate, {
        props: { background: 'transparent' },
        slots: fullSlots()
      })
      expect(transparent.find('.fz-frame-template').classes()).not.toContain(
        'bg-background-white-smoke'
      )
    })

    it('states border-style and box-sizing explicitly, for hosts without Preflight', () => {
      // The backoffice scopes Tailwind's Preflight to `.twp`, which this shell
      // must never carry (it would reset hundreds of legacy components at once).
      // Without the reset, `border-style` is `none` and `box-sizing` is
      // `content-box` — so both are stated on every sized-and-bordered region.
      const wrapper = mount(FzFrameTemplate, {
        props: { hasAside: true, asideOpen: true },
        slots: fullSlots()
      })

      expect(wrapper.find('.fz-frame-template__surface').classes()).toEqual(
        expect.arrayContaining(['border-solid', 'box-border'])
      )
      expect(wrapper.find('.fz-frame-template__aside-surface').classes()).toEqual(
        expect.arrayContaining(['border-solid', 'box-border'])
      )
      expect(wrapper.find('.fz-frame-template__main').classes()).toContain('box-border')
      expect(wrapper.html()).not.toContain('twp')
    })

    it('floors the toolbar height instead of capping it', () => {
      // A fixed `h-48` clips taller injected chrome; a floor grows to fit it.
      const header = mount(FzFrameTemplate, { slots: fullSlots() }).find('header')
      expect(header.classes()).toContain('min-h-[48px]')
      expect(header.classes()).not.toContain('h-48')
    })
  })

  // ============================================
  // PAGE SCROLL TARGET
  // ============================================
  describe('FZ_PAGE_SCROLL_TARGET', () => {
    const Consumer = defineComponent({
      setup() {
        const target = inject(FZ_PAGE_SCROLL_TARGET, null)
        return () => h('span', { class: 'target' }, target?.value ? target.value.tagName : 'none')
      }
    })

    it('provides the content region element', async () => {
      // Under `contentHeight="scroll"` the window no longer scrolls, so app code
      // needs a handle on the region to scroll the page at all.
      const wrapper = mount(FzFrameTemplate, { slots: { default: () => h(Consumer) } })
      await nextTick()

      expect(wrapper.find('.target').text()).toBe('MAIN')
    })

    it('provides the same element under bounded', async () => {
      const wrapper = mount(FzFrameTemplate, {
        props: { contentHeight: 'bounded' },
        slots: { default: () => h(Consumer) }
      })
      await nextTick()

      expect(wrapper.find('.target').text()).toBe('MAIN')
    })
  })
})
