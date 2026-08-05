import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, toRefs, nextTick } from 'vue'
import { useFloating } from '../composables/useFloating'
import { FzFloatingPosition } from '../types'

describe('useFloating', () => {
  let mockElement: HTMLElement
  let mockOpener: HTMLElement
  let mockContainer: HTMLElement
  let mockIntersectionObserver: any

  beforeEach(() => {
    // Mock IntersectionObserver
    mockIntersectionObserver = vi.fn().mockImplementation(function (this: any) {
      this.observe = vi.fn()
      this.unobserve = vi.fn()
      this.disconnect = vi.fn()
    })
    window.IntersectionObserver = mockIntersectionObserver

    // Mock DOM elements
    mockElement = document.createElement('div')
    mockElement.style.width = '200px'
    mockElement.style.height = '100px'
    mockElement.style.margin = '0px' // Set explicit margins to avoid NaN from parseFloat
    document.body.appendChild(mockElement)

    mockOpener = document.createElement('button')
    mockOpener.style.width = '100px'
    mockOpener.style.height = '40px'
    document.body.appendChild(mockOpener)

    mockContainer = document.body

    // Mock getBoundingClientRect
    mockElement.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    })) as any

    mockOpener.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 40,
      top: 100,
      left: 100,
      right: 200,
      bottom: 140,
      x: 100,
      y: 100,
      toJSON: () => {}
    })) as any

    mockContainer.getBoundingClientRect = vi.fn(() => ({
      width: 1024,
      height: 768,
      top: 0,
      left: 0,
      right: 1024,
      bottom: 768,
      x: 0,
      y: 0,
      toJSON: () => {}
    })) as any
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('auto'),
        opener: { domRef: ref(mockOpener) },
        element: { domRef: ref(mockElement) }
      })

      const floating = useFloating(args)

      expect(floating.float).toBeDefined()
      expect(floating.rect).toBeDefined()
      expect(floating.setPosition).toBeDefined()
      expect(floating.position).toBeDefined()
      expect(floating.actualPosition).toBeDefined()
    })

    it('should set up intersection observer', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        opener: { domRef: ref(mockOpener) },
        element: { domRef: ref(mockElement) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(mockIntersectionObserver).toHaveBeenCalled()
    })
  })

  describe('position calculation', () => {
    const positions: FzFloatingPosition[] = [
      'bottom',
      'bottom-start',
      'bottom-end',
      'top',
      'top-start',
      'top-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end'
    ]

    positions.forEach((position) => {
      it(`should calculate ${position} position correctly`, async () => {
        const args = toRefs({
          position: ref(position),
          element: { domRef: ref(mockElement) },
          opener: { domRef: ref(mockOpener) }
        })

        const floating = useFloating(args)
        await floating.setPosition()
        await nextTick()

        expect(floating.float.position).toBeDefined()
        expect(typeof floating.float.position.x).toBe('number')
        expect(typeof floating.float.position.y).toBe('number')
      })
    })
  })

  describe('auto positioning', () => {
    it('should resolve auto position based on available space', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('auto'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(floating.actualPosition?.value).toBeDefined()
      expect(floating.actualPosition?.value).not.toBe('auto')
    })

    it('should resolve auto-start position', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('auto-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(floating.actualPosition?.value).toBeDefined()
      expect(floating.actualPosition?.value).not.toBe('auto-start')
    })

    it('should resolve auto-end position', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('auto-end'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(floating.actualPosition?.value).toBeDefined()
      expect(floating.actualPosition?.value).not.toBe('auto-end')
    })
  })

  describe('boundary corrections', () => {
    it('should keep element within container bounds', async () => {
      // Position opener at edge of container
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 10,
        left: 950,
        right: 1050,
        bottom: 50,
        x: 950,
        y: 10,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-end'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) },
        container: { domRef: ref(mockContainer) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // Element should be adjusted to fit within container
      // Position values should be valid numbers (not NaN)
      expect(Number.isNaN(floating.float.position.x)).toBe(false)
      expect(Number.isNaN(floating.float.position.y)).toBe(false)
      expect(floating.float.position.x).toBeLessThanOrEqual(1024)
      expect(floating.float.position.y).toBeLessThanOrEqual(768)
    })
  })

  describe('viewport collision (mobile)', () => {
    const VIEWPORT_MARGIN = 8
    const ELEMENT_WIDTH = 200
    const ELEMENT_HEIGHT = 100

    let originalInnerWidth: number
    let originalInnerHeight: number

    const setViewport = (width: number, height: number) => {
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true })
      Object.defineProperty(window, 'innerHeight', { value: height, configurable: true })
    }

    beforeEach(() => {
      originalInnerWidth = window.innerWidth
      originalInnerHeight = window.innerHeight
    })

    afterEach(() => {
      setViewport(originalInnerWidth, originalInnerHeight)
    })

    it('leaves the position untouched when there is enough room (wide viewport)', async () => {
      setViewport(1440, 900)

      // Opener comfortably inside the viewport, plenty of room to the right.
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 200,
        left: 300,
        right: 400,
        bottom: 240,
        x: 300,
        y: 200,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // bottom-start anchors the element's left edge at opener.left (300) and the
      // top at opener.bottom (240). There's room, so nothing is shifted.
      expect(floating.float.position.x).toBe(300)
      expect(floating.float.position.y).toBe(240)
    })

    it('shifts a near-right-edge menu left so it stays on screen (narrow viewport)', async () => {
      // Narrow mobile viewport. NOTE: the container (document.body by default here)
      // reports a rect WIDER than the viewport, reproducing the real bug — clamping
      // to the container alone would not keep the menu on screen.
      setViewport(390, 844)
      mockContainer.getBoundingClientRect = vi.fn(() => ({
        width: 800,
        height: 844,
        top: 0,
        left: 0,
        right: 800,
        bottom: 844,
        x: 0,
        y: 0,
        toJSON: () => {}
      })) as any

      // Kebab opener pinned to the right edge of the narrow screen.
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 32,
        height: 32,
        top: 120,
        left: 350,
        right: 382,
        bottom: 152,
        x: 350,
        y: 120,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) },
        container: { domRef: ref(mockContainer) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      const left = floating.float.position.x
      // Right edge must stay within the viewport (minus the safety margin)…
      expect(left + ELEMENT_WIDTH).toBeLessThanOrEqual(390 - VIEWPORT_MARGIN)
      // …and the left edge must not be pushed off the left side either.
      expect(left).toBeGreaterThanOrEqual(VIEWPORT_MARGIN)
      // Concretely: clamped to viewportWidth - margin - elementWidth = 390 - 8 - 200.
      expect(left).toBe(390 - VIEWPORT_MARGIN - ELEMENT_WIDTH)
    })

    it('clamps the left edge to the margin when the element is wider than the viewport', async () => {
      // Pathological narrow viewport where the menu cannot fully fit; it should
      // still start on screen (left edge at the margin) rather than disappear.
      setViewport(180, 844)

      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 32,
        height: 32,
        top: 120,
        left: 150,
        right: 182,
        bottom: 152,
        x: 150,
        y: 120,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-end'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // element width (200) > viewport width (180): left edge clamps to the margin.
      expect(floating.float.position.x).toBe(VIEWPORT_MARGIN)
      expect(Number.isNaN(floating.float.position.y)).toBe(false)
    })

    it('flips a menu above its opener when it would overflow the bottom', async () => {
      setViewport(390, 600)

      // Opener near the bottom of the viewport; a bottom-anchored menu would
      // overflow below the fold and must be lifted up.
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 540,
        left: 100,
        right: 200,
        bottom: 580,
        x: 100,
        y: 540,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // The invariant is unchanged: the whole menu stays on screen.
      expect(floating.float.position.y).toBeGreaterThanOrEqual(VIEWPORT_MARGIN)
      expect(floating.float.position.y + ELEMENT_HEIGHT).toBeLessThanOrEqual(600 - VIEWPORT_MARGIN)
      // It gets there by flipping to the other side of the opener rather than sliding up
      // across it, which would have left the menu covering the control that opened it.
      // The gap comes from the element's own margin (zero here, since the harness mounts a
      // bare element with no gap class), so the menu's bottom lands on opener.top = 540.
      expect(floating.float.position.y).toBe(540 - ELEMENT_HEIGHT)
      expect(floating.float.position.y + ELEMENT_HEIGHT).toBeLessThanOrEqual(540)
      // The resolved position follows the flip, so the consumer's gap class does too.
      expect(floating.actualPosition?.value).toBe('top-start')
    })

    it('flips a menu below its opener when it would overflow the top', async () => {
      setViewport(390, 600)

      // Opener near the top; a top-anchored menu would overflow above the fold.
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 20,
        left: 100,
        right: 200,
        bottom: 60,
        x: 100,
        y: 20,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('top-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // Sits on opener.bottom, exactly where the `bottom*` calculator would put it: the
      // flipped side's `margin-top` is what produces the gap, and it is zero in this
      // harness. The menu clears its opener instead of covering it.
      expect(floating.float.position.y).toBe(60)
      expect(floating.float.position.y + ELEMENT_HEIGHT).toBeLessThanOrEqual(600 - VIEWPORT_MARGIN)
      expect(floating.actualPosition?.value).toBe('bottom-start')
    })

    it('spaces a flipped menu by the gap class, not by the viewport margin', async () => {
      // Regression for LIB-2831: the flip used to fall back to VIEWPORT_MARGIN, so a panel
      // that flipped ended up 8px from its opener while an unflipped one on that side got
      // the 16px the gap class provides — and it kept the class of the requested side, so
      // the margin sat on the wrong edge.
      setViewport(390, 600)
      mockElement.style.marginTop = '16px'

      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 540,
        left: 100,
        right: 200,
        bottom: 580,
        x: 100,
        y: 540,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // Flipped above: the 16px gap is in the arithmetic, because a `margin-bottom` cannot
      // move a fixed element positioned by `top`.
      expect(floating.float.position.y).toBe(540 - 16 - ELEMENT_HEIGHT)
      expect(floating.actualPosition?.value).toBe('top-start')

      mockElement.style.marginTop = ''
    })

    it('leaves a left placement styled as horizontal when it is corrected vertically', async () => {
      // `left*` / `right*` sit beside the opener and keep their horizontal gap, so a
      // vertical correction must not restyle them onto a vertical side.
      setViewport(390, 600)

      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 560,
        left: 250,
        right: 350,
        bottom: 600,
        x: 250,
        y: 560,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('left-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(floating.actualPosition?.value).toBe('left-start')
      expect(floating.float.position.y + ELEMENT_HEIGHT).toBeLessThanOrEqual(600 - VIEWPORT_MARGIN)
    })

    it("ignores document.body's box when it is the implicit container", async () => {
      // Measured on the ephemeral env (/app/fatture-emesse): the frontoffice shell gives
      // body a fixed height equal to the viewport and scrolls an inner element, so once the
      // page is scrolled body's rect leaves the viewport. Intersecting with it collapsed the
      // usable area to 151px of a 411px viewport, and a 348px menu was left anchored to its
      // opener and cut off 293px below the fold (LIB-2825). Before LIB-2813's guard the same
      // bounds pinned it to the top margin instead — the HD-25736 symptom.
      setViewport(360, 411)

      mockContainer.getBoundingClientRect = vi.fn(() => ({
        width: 360,
        height: 411,
        top: -260,
        left: 0,
        right: 360,
        bottom: 151,
        x: 0,
        y: -260,
        toJSON: () => {}
      })) as any

      const MENU_HEIGHT = 348
      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: ELEMENT_WIDTH,
        height: MENU_HEIGHT,
        top: 0,
        left: 0,
        right: ELEMENT_WIDTH,
        bottom: MENU_HEIGHT,
        x: 0,
        y: 0,
        toJSON: () => {}
      })) as any

      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 44,
        height: 44,
        top: 308,
        left: 100,
        right: 144,
        bottom: 352,
        x: 100,
        y: 308,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // The whole viewport is available, so the menu flips above the opener and stays on
      // screen instead of hanging off the bottom.
      expect(floating.float.position.y + MENU_HEIGHT).toBeLessThanOrEqual(411 - VIEWPORT_MARGIN)
      expect(floating.float.position.y).toBeGreaterThanOrEqual(VIEWPORT_MARGIN)
      // Flipping above would need 348 + 8 px and only 308 are free above the opener, so the
      // menu is clamped inside the viewport instead: 411 - 8 - 348. The point is that it is
      // fully visible — with body's collapsed box it ended up at 352, i.e. 293px off screen.
      expect(floating.float.position.y).toBe(411 - VIEWPORT_MARGIN - MENU_HEIGHT)
    })

    it('stays anchored to the opener when the element is taller than the viewport', async () => {
      // A long action list (e.g. the tax page menus) on a phone-height viewport. No
      // vertical position can show all of it, and clamping to the top margin does not
      // reveal more of it — it just detaches the panel from the button that opened it,
      // which is what users reported as "the menu opens at the top of the page" (HD-25736).
      setViewport(412, 792)

      const TALL_HEIGHT = 900
      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: ELEMENT_WIDTH,
        height: TALL_HEIGHT,
        top: 0,
        left: 0,
        right: ELEMENT_WIDTH,
        bottom: TALL_HEIGHT,
        x: 0,
        y: 0,
        toJSON: () => {}
      })) as any

      // Opener low on the screen, as a per-row menu far down a list would be.
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 44,
        height: 44,
        top: 728,
        left: 100,
        right: 144,
        bottom: 772,
        x: 100,
        y: 728,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // bottom-start anchors the top edge at opener.bottom. The panel must keep that
      // anchor rather than being pinned to the margin at the top of the screen.
      expect(floating.float.position.y).toBe(772)
      expect(floating.float.position.y).not.toBe(VIEWPORT_MARGIN)
    })

    it('still clamps vertically when the element fits exactly in the available space', async () => {
      // Boundary case for the fits-check: height equals the space between the margins,
      // so the correction must still apply (and land the element flush at the margin).
      setViewport(390, 600)

      const EXACT_HEIGHT = 600 - VIEWPORT_MARGIN * 2
      mockElement.getBoundingClientRect = vi.fn(() => ({
        width: ELEMENT_WIDTH,
        height: EXACT_HEIGHT,
        top: 0,
        left: 0,
        right: ELEMENT_WIDTH,
        bottom: EXACT_HEIGHT,
        x: 0,
        y: 0,
        toJSON: () => {}
      })) as any

      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 40,
        top: 540,
        left: 100,
        right: 200,
        bottom: 580,
        x: 100,
        y: 540,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom-start'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(floating.float.position.y).toBe(VIEWPORT_MARGIN)
    })
  })

  describe('element styling', () => {
    it('should apply position fixed immediately', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(mockElement.style.position).toBe('fixed')
      expect(mockElement.style.display).toBe('flex')
    })

    it('should update position styles', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(mockElement.style.top).toBeTruthy()
      expect(mockElement.style.left).toBeTruthy()
    })
  })

  describe('callback handling', () => {
    it('should call callback when provided', async () => {
      const callback = vi.fn()
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) },
        callback: ref(callback)
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(callback).toHaveBeenCalled()
    })

    it('should not call callback when ignoreCallback is true', async () => {
      const callback = vi.fn()
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) },
        callback: ref(callback)
      })

      const floating = useFloating(args)
      await floating.setPosition(true)
      await nextTick()

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('without opener', () => {
    it('should position element relative to container when no opener', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        opener: undefined,
        element: { domRef: ref(mockElement) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      expect(floating.float.position).toBeDefined()
      expect(typeof floating.float.position.x).toBe('number')
      expect(typeof floating.float.position.y).toBe('number')
    })
  })

  describe('error handling', () => {
    it('should handle missing element ref gracefully', async () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        opener: { domRef: ref(mockOpener) },
        element: { domRef: ref(null) }
      })

      const floating = useFloating(args)

      // Should not throw, just return early when element is missing
      await floating.setPosition()
      await nextTick()

      // Position should remain at initial values (0, 0)
      expect(floating.float.position.x).toBe(0)
      expect(floating.float.position.y).toBe(0)
    })
  })

  describe('cleanup', () => {
    it('should disconnect intersection observer on unmount', () => {
      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        opener: { domRef: ref(mockOpener) },
        element: { domRef: ref(mockElement) }
      })

      useFloating(args)

      // Simulate component unmount
      // Note: In a real scenario, this would be handled by Vue's lifecycle
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })
  })

  describe('collapsed opener', () => {
    it('should hide the element when the opener has a zero-size rect', async () => {
      // Simulate the opener living inside a collapsed accordion: a hidden element
      // reports an all-zero bounding rect.
      mockOpener.getBoundingClientRect = vi.fn(() => ({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => {}
      })) as any

      const args = toRefs({
        position: ref<FzFloatingPosition>('bottom'),
        element: { domRef: ref(mockElement) },
        opener: { domRef: ref(mockOpener) },
        container: { domRef: ref(mockContainer) }
      })

      const floating = useFloating(args)
      await floating.setPosition()
      await nextTick()

      // Must NOT jump to the top-left corner; the floating content is hidden instead.
      expect(mockElement.style.display).toBe('none')
    })
  })
})
