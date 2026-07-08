import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, type ComputedRef } from 'vue'
import { mount } from '@vue/test-utils'
import { useBreakpoints } from '../composables/useBreakpoints'

const BREAKPOINTS = {
  xs: '376px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  '3xl': '1536px'
} as const

const originalMatchMedia = window.matchMedia

// Controls what the mocked matchMedia reports as the current viewport width.
let viewportWidth = 1024

/**
 * A matchMedia mock that actually evaluates `min-width` / `max-width` queries
 * against `viewportWidth`, so the descending-priority resolution in `current()`
 * is exercised for real instead of being short-circuited by a coarse stub.
 */
function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      const min = /min-width:\s*(\d+)px/.exec(query)
      const max = /max-width:\s*(\d+)px/.exec(query)
      let matches = true
      if (min) matches = matches && viewportWidth >= parseInt(min[1], 10)
      if (max) matches = matches && viewportWidth <= parseInt(max[1], 10)
      return {
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }
    })
  })
}

/** Resolve `current()` at a given viewport width inside a mounted component. */
function currentAt(
  width: number,
  breakpoints: Record<string, `${number}px`> = BREAKPOINTS
): string {
  viewportWidth = width
  let value = ''
  const Cmp = defineComponent({
    setup() {
      const { current } = useBreakpoints(breakpoints)
      const cur: ComputedRef<string> = current()
      value = cur.value
      return () => null
    }
  })
  const wrapper = mount(Cmp)
  const result = value
  wrapper.unmount()
  return result
}

describe('useBreakpoints', () => {
  beforeEach(() => {
    installMatchMedia()
  })

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: originalMatchMedia
    })
  })

  describe('current()', () => {
    it.each([
      [376, 'xs'],
      [639, 'xs'],
      [640, 'sm'],
      [767, 'sm'],
      [768, 'md'],
      [1023, 'md'],
      [1024, 'lg'],
      [1279, 'lg'],
      [1280, 'xl'],
      [1439, 'xl'],
      [1440, '2xl'],
      [1535, '2xl'],
      [1536, '3xl'],
      [1920, '3xl']
    ])(
      'resolves to the largest breakpoint whose min-width is met (width %ipx -> %s)',
      (width, expected) => {
        expect(currentAt(width)).toBe(expected)
      }
    )

    it('has boundary parity with a `>=` check (inclusive min-width)', () => {
      // Exactly at the breakpoint value resolves to that breakpoint, matching
      // the previous `viewportWidth >= parseInt(value)` behaviour.
      expect(currentAt(640)).toBe('sm')
      expect(currentAt(1024)).toBe('lg')
    })

    it('falls back to the smallest breakpoint below the first threshold', () => {
      expect(currentAt(320)).toBe('xs')
      expect(currentAt(0)).toBe('xs')
    })

    it('is independent of key order in the breakpoints object', () => {
      const scrambled: Record<string, `${number}px`> = {
        lg: '1024px',
        xs: '376px',
        '3xl': '1536px',
        md: '768px',
        sm: '640px',
        xl: '1280px',
        '2xl': '1440px'
      }
      expect(currentAt(1024, scrambled)).toBe('lg')
      expect(currentAt(700, scrambled)).toBe('sm')
    })
  })

  describe('isGreater / isSmaller / isInBetween', () => {
    it('reports isGreater relative to a breakpoint', () => {
      viewportWidth = 1280
      let greaterThanLg = false
      let greaterThan3xl = false
      const Cmp = defineComponent({
        setup() {
          const { isGreater } = useBreakpoints(BREAKPOINTS)
          greaterThanLg = isGreater('lg').value
          greaterThan3xl = isGreater('3xl').value
          return () => null
        }
      })
      const wrapper = mount(Cmp)
      expect(greaterThanLg).toBe(true)
      expect(greaterThan3xl).toBe(false)
      wrapper.unmount()
    })
  })
})
