import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { FzPopover } from '..'
import { anchoredContentStyle, isAutoPosition, supportsCssAnchoring } from '../utils'

/**
 * jsdom has neither the Popover API nor `window.CSS`, so FzPopover feature-detects
 * its way to the JS engine here — which makes the fallback the default subject of
 * these tests. The CSS engine is exercised by faking the two capabilities; its real
 * behaviour (placement, light dismiss, Esc) can only be checked in a browser, and
 * lives in the Storybook play functions plus a Playwright probe.
 */
function enableCssAnchoring() {
  Object.defineProperty(HTMLElement.prototype, 'popover', {
    value: null,
    writable: true,
    configurable: true
  })
  HTMLElement.prototype.showPopover = vi.fn()
  HTMLElement.prototype.hidePopover = vi.fn()
  vi.stubGlobal('CSS', { supports: () => true })
}

function restoreCssAnchoring() {
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>
  delete proto.popover
  delete proto.showPopover
  delete proto.hidePopover
  vi.unstubAllGlobals()
}

const slots = {
  opener: '<button>Apri</button>',
  default: '<div>Contenuto</div>'
}

beforeEach(() => {
  // FzFloating needs both, and jsdom provides neither.
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})

describe('supportsCssAnchoring', () => {
  afterEach(restoreCssAnchoring)

  it('should be false in an environment without the Popover API', () => {
    expect(supportsCssAnchoring()).toBe(false)
  })

  it('should be false when the browser knows the Popover API but not anchor positioning', () => {
    enableCssAnchoring()
    vi.stubGlobal('CSS', { supports: (value: string) => !value.startsWith('anchor-name') })
    expect(supportsCssAnchoring()).toBe(false)
  })

  it('should be false when position-area is unsupported', () => {
    enableCssAnchoring()
    vi.stubGlobal('CSS', { supports: (value: string) => !value.startsWith('position-area') })
    expect(supportsCssAnchoring()).toBe(false)
  })

  it('should be true when all three features are present', () => {
    enableCssAnchoring()
    expect(supportsCssAnchoring()).toBe(true)
  })
})

describe('isAutoPosition', () => {
  it.each(['auto', 'auto-vertical', 'auto-start', 'auto-vertical-end'] as const)(
    'should treat %s as auto',
    (position) => {
      expect(isAutoPosition(position)).toBe(true)
    }
  )

  it.each(['bottom', 'bottom-start', 'top-end', 'left', 'right-start'] as const)(
    'should treat %s as a fixed placement',
    (position) => {
      expect(isAutoPosition(position)).toBe(false)
    }
  )
})

describe('anchoredContentStyle', () => {
  it('should map each placement to its position-area', () => {
    const area = (position: Parameters<typeof anchoredContentStyle>[0]) =>
      anchoredContentStyle(position, 4, '--a', false).positionArea

    expect(area('bottom-start')).toBe('block-end span-inline-end')
    expect(area('bottom-end')).toBe('block-end span-inline-start')
    expect(area('bottom')).toBe('block-end center')
    expect(area('top-start')).toBe('block-start span-inline-end')
    expect(area('left')).toBe('inline-start center')
    expect(area('right-end')).toBe('inline-end span-block-start')
  })

  it('should put the offset on the side that faces the anchor', () => {
    expect(anchoredContentStyle('bottom-start', 8, '--a', false).marginTop).toBe('8px')
    expect(anchoredContentStyle('top-start', 8, '--a', false).marginBottom).toBe('8px')
    expect(anchoredContentStyle('left', 8, '--a', false).marginRight).toBe('8px')
    expect(anchoredContentStyle('right', 8, '--a', false).marginLeft).toBe('8px')
  })

  it('should flip along the axis the placement uses', () => {
    expect(anchoredContentStyle('bottom-start', 4, '--a', false).positionTryFallbacks).toBe(
      'flip-block'
    )
    expect(anchoredContentStyle('right', 4, '--a', false).positionTryFallbacks).toBe('flip-inline')
  })

  it('should ask for the anchor width only when matchOpenerWidth is set', () => {
    expect(anchoredContentStyle('bottom-start', 4, '--a', false).minWidth).toBeUndefined()
    expect(anchoredContentStyle('bottom-start', 4, '--a', true).minWidth).toBe(
      'anchor-size(--a width)'
    )
  })

  it('should never cap the height: a box that cannot overflow never flips', () => {
    const style = anchoredContentStyle('bottom-start', 4, '--a', false)
    expect(style.maxHeight).toBeUndefined()
  })
})

describe('FzPopover — JS engine (jsdom default)', () => {
  it('should render FzFloating, not a native popover', () => {
    const wrapper = mount(FzPopover, { slots })
    expect(wrapper.findComponent({ name: 'FzFloating' }).exists()).toBe(true)
    expect(wrapper.find('.fz-popover__content').exists()).toBe(false)
  })

  it('should clamp against the viewport rather than the body', () => {
    // Regression lock: FzFloating's default boundary is document.body ∩ viewport,
    // and on a page shorter than the viewport that drags the content over its own
    // opener. The popover always asks for viewport semantics.
    const wrapper = mount(FzPopover, { slots })
    expect(wrapper.findComponent({ name: 'FzFloating' }).props('useViewport')).toBe(true)
  })

  it('should open and close through the slot props', async () => {
    // A string slot gets no slot props, so the opener is a render function: this is
    // also the shape a consumer writes, since the popover attaches no handler itself.
    const wrapper = mount(FzPopover, {
      slots: {
        opener: (params: { toggle: () => void }) =>
          h('button', { onClick: params.toggle }, 'Apri'),
        default: '<div>Contenuto</div>'
      }
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('fzpopover:toggle')![0]).toEqual([true])
    expect(wrapper.emitted('update:open')![0]).toEqual([true])

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('fzpopover:toggle')![1]).toEqual([false])
  })

  it('should honour v-model:open from the outside', async () => {
    const wrapper = mount(FzPopover, { slots, props: { open: false } })
    await wrapper.setProps({ open: true })
    expect(wrapper.emitted('fzpopover:toggle')![0]).toEqual([true])
  })

  it('should take the JS engine for auto placements', () => {
    const wrapper = mount(FzPopover, { slots, props: { position: 'auto-vertical-start' } })
    expect(wrapper.findComponent({ name: 'FzFloating' }).exists()).toBe(true)
  })
})

describe('FzPopover — CSS engine', () => {
  beforeEach(enableCssAnchoring)
  afterEach(restoreCssAnchoring)

  it('should render a native popover instead of FzFloating', () => {
    const wrapper = mount(FzPopover, { slots })
    expect(wrapper.find('.fz-popover__content').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'FzFloating' }).exists()).toBe(false)
  })

  it('should anchor the content to the opener', async () => {
    const wrapper = mount(FzPopover, { slots })
    // The name is written after the flush, once the opener ref is populated.
    await wrapper.vm.$nextTick()
    const anchorName = wrapper.get('.fz-popover__opener').element.style.getPropertyValue(
      'anchor-name'
    )
    expect(anchorName).toMatch(/^--fz-popover-\d+$/)
    expect(wrapper.get('.fz-popover__content').attributes('style')).toContain(
      `position-anchor: ${anchorName}`
    )
  })

  it('should give each instance its own anchor name and id', async () => {
    // Every mount() is its own Vue app: an app-scoped id (useId()) would repeat, and
    // two popovers would anchor to the same opener.
    const first = mount(FzPopover, { slots })
    const second = mount(FzPopover, { slots })
    await Promise.all([first.vm.$nextTick(), second.vm.$nextTick()])

    const anchorOf = (w: typeof first) =>
      w.get('.fz-popover__opener').element.style.getPropertyValue('anchor-name')
    const idOf = (w: typeof first) => w.get('.fz-popover__content').attributes('id')

    expect(anchorOf(first)).not.toBe(anchorOf(second))
    expect(idOf(first)).not.toBe(idOf(second))
  })

  it('should drive the native popover when the model changes', async () => {
    // Attached on purpose: showPopover() throws on a disconnected element, so the
    // component skips it — and Vue Test Utils mounts detached by default.
    const wrapper = mount(FzPopover, {
      slots,
      props: { open: false },
      attachTo: document.body
    })
    await wrapper.setProps({ open: true })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.fz-popover__content').element.showPopover).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should fall back to FzFloating on forceFallback', () => {
    const wrapper = mount(FzPopover, { slots, props: { forceFallback: true } })
    expect(wrapper.findComponent({ name: 'FzFloating' }).exists()).toBe(true)
  })
})
