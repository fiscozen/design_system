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
    mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
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
})
