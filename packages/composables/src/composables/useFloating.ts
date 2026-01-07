import { FzFloatingPosition, FzRect, FzUseFloatingArgs, FzAbsolutePosition } from '../types'
import { ref, reactive, onUnmounted, Ref, nextTick, ToRefs } from 'vue'
import { calcRealPos, getHighestAvailableSpacePos } from '../utils'

// ============================================================================
// Types
// ============================================================================

interface DOMRefs {
  element: HTMLElement
  container: HTMLElement
  opener: HTMLElement | null
}

interface Rects {
  element: DOMRect
  container: DOMRect
  opener: DOMRect | null
}

interface Margins {
  left: number
  right: number
  top: number
  bottom: number
}

interface Transform {
  x: number
  y: number
}

interface PositionResult {
  position: FzAbsolutePosition
  transform: Transform
}

type PositionCalculator = (opener: DOMRect, margins: Margins) => PositionResult

// ============================================================================
// Pure Functions - DOM Reference Resolution
// ============================================================================

const resolveElement = (domRef: string | HTMLElement | null): HTMLElement | null =>
  typeof domRef === 'string' ? document.querySelector(domRef) : domRef

const getMargins = (style: CSSStyleDeclaration): Margins => ({
  left: parseFloat(style.marginLeft),
  right: parseFloat(style.marginRight),
  top: parseFloat(style.marginTop),
  bottom: parseFloat(style.marginBottom)
})

// ============================================================================
// Position Calculators - Pure Functions using Pattern Matching
// ============================================================================

const positionCalculators: Record<string, PositionCalculator> = {
  // Bottom positions
  'bottom': (opener, margins) => ({
    position: {
      x: opener.left - margins.left + opener.width / 2,
      y: opener.bottom
    },
    transform: { x: -50, y: 0 }
  }),

  'bottom-start': (opener, margins) => ({
    position: {
      x: opener.left - margins.left - margins.right,
      y: opener.bottom
    },
    transform: { x: 0, y: 0 }
  }),

  'bottom-end': (opener) => ({
    position: {
      x: opener.right,
      y: opener.bottom
    },
    transform: { x: -100, y: 0 }
  }),

  // Top positions
  'top': (opener, margins) => ({
    position: {
      x: opener.left - margins.left + opener.width / 2,
      y: opener.top - margins.top - margins.bottom
    },
    transform: { x: -50, y: -100 }
  }),

  'top-start': (opener, margins) => ({
    position: {
      x: opener.left - margins.left - margins.right,
      y: opener.top - margins.top - margins.bottom
    },
    transform: { x: 0, y: -100 }
  }),

  'top-end': (opener, margins) => ({
    position: {
      x: opener.right,
      y: opener.top - margins.top - margins.bottom
    },
    transform: { x: -100, y: -100 }
  }),

  // Left positions
  'left': (opener, margins) => ({
    position: {
      x: opener.left - margins.left - margins.right,
      y: opener.top - margins.top + opener.height / 2
    },
    transform: { x: -100, y: -50 }
  }),

  'left-start': (opener, margins) => ({
    position: {
      x: opener.left - margins.left - margins.right,
      y: opener.top - margins.top - margins.bottom
    },
    transform: { x: -100, y: 0 }
  }),

  'left-end': (opener, margins) => ({
    position: {
      x: opener.left - margins.left - margins.right,
      y: opener.bottom
    },
    transform: { x: -100, y: -100 }
  }),

  // Right positions
  'right': (opener, margins) => ({
    position: {
      x: opener.right,
      y: opener.top - margins.top + opener.height / 2
    },
    transform: { x: 0, y: -50 }
  }),

  'right-start': (opener, margins) => ({
    position: {
      x: opener.right,
      y: opener.top - margins.top - margins.bottom
    },
    transform: { x: 0, y: 0 }
  }),

  'right-end': (opener) => ({
    position: {
      x: opener.right,
      y: opener.bottom
    },
    transform: { x: 0, y: -100 }
  })
}

const calculatePositionWithOpener = (
  position: FzFloatingPosition,
  opener: DOMRect,
  margins: Margins
): PositionResult => {
  const calculator = positionCalculators[position]
  return calculator
    ? calculator(opener, margins)
    : { position: { x: 0, y: 0 }, transform: { x: 0, y: 0 } }
}

const calculatePositionWithoutOpener = (
  position: FzFloatingPosition,
  container: DOMRect,
  element: DOMRect
): PositionResult => {
  const { left, right, top, bottom, width, height } = container
  const { width: elWidth, height: elHeight } = element

  switch (position) {
    case 'bottom':
      return {
        position: { x: left + width / 2, y: bottom - elHeight },
        transform: { x: -50, y: 0 }
      }

    case 'bottom-start':
    case 'left-end':
      return {
        position: { x: left, y: bottom - elHeight },
        transform: { x: 0, y: 0 }
      }

    case 'bottom-end':
    case 'right-end':
      return {
        position: { x: right - elWidth, y: bottom - elHeight },
        transform: { x: 0, y: 0 }
      }

    case 'top':
      return {
        position: { x: left + (width - elWidth) / 2, y: top },
        transform: { x: 0, y: 0 }
      }

    case 'top-start':
    case 'left-start':
      return {
        position: { x: left, y: top },
        transform: { x: 0, y: 0 }
      }

    case 'top-end':
    case 'right-start':
      return {
        position: { x: right - elWidth, y: top },
        transform: { x: 0, y: 0 }
      }

    case 'left':
      return {
        position: { x: left, y: top + (height - elHeight) / 2 },
        transform: { x: 0, y: 0 }
      }

    case 'right':
      return {
        position: { x: right - elWidth, y: top + (height - elHeight) / 2 },
        transform: { x: 0, y: 0 }
      }

    default:
      return { position: { x: 0, y: 0 }, transform: { x: 0, y: 0 } }
  }
}

// ============================================================================
// Boundary Correction - Pure Function
// ============================================================================

const applyBoundaryCorrections = (
  realPosition: FzAbsolutePosition,
  element: DOMRect,
  container: DOMRect,
  transform: Transform
): { position: FzAbsolutePosition; transform: Transform } => {
  const correctedPosition = { ...realPosition }
  const correctedTransform = { ...transform }

  // Left boundary
  if (realPosition.x < container.left) {
    correctedPosition.x = container.left
    correctedTransform.x = 0
  }

  // Right boundary
  if (realPosition.x + element.width > container.right) {
    const fixedX = container.right - element.width
    if (fixedX > 0) {
      correctedPosition.x = fixedX
    }
    correctedTransform.x = 0
  }

  // Top boundary
  if (realPosition.y < container.top) {
    correctedPosition.y = container.top
    correctedTransform.y = 0
  }

  // Bottom boundary
  if (realPosition.y + element.height > container.bottom) {
    const fixedY = container.bottom - element.height
    if (fixedY > 0) {
      correctedPosition.y = fixedY
    }
    correctedTransform.y = 0
  }

  return { position: correctedPosition, transform: correctedTransform }
}

// ============================================================================
// Auto Position Resolution - Pure Function
// ============================================================================

type AutoPositionType = 'auto' | 'auto-vertical' | 'auto-start' | 'auto-vertical-start' | 'auto-end' | 'auto-vertical-end'

const resolveAutoPosition = (
  autoType: AutoPositionType,
  container: HTMLElement | null,
  element: HTMLElement,
  opener: HTMLElement,
  useViewport: boolean
): FzFloatingPosition => {
  const containerEl = useViewport ? null : container

  switch (autoType) {
    case 'auto':
      return getHighestAvailableSpacePos(containerEl, element, opener)

    case 'auto-vertical':
      return getHighestAvailableSpacePos(containerEl, element, opener, undefined, true)

    case 'auto-start':
      return getHighestAvailableSpacePos(containerEl, element, opener, 'start')

    case 'auto-vertical-start':
      return getHighestAvailableSpacePos(containerEl, element, opener, 'start', true)

    case 'auto-end':
      return getHighestAvailableSpacePos(containerEl, element, opener, 'end')

    case 'auto-vertical-end':
      return getHighestAvailableSpacePos(containerEl, element, opener, 'end', true)

    default:
      return 'bottom-start'
  }
}

const isAutoPosition = (position: FzFloatingPosition): position is AutoPositionType =>
  position.startsWith('auto')

// ============================================================================
// Main Composable
// ============================================================================

export const useFloating = (
  args: ToRefs<FzUseFloatingArgs>
): {
  float: FzRect
  rect: Ref<DOMRect | undefined>
  setPosition: (ignoreCallback?: boolean) => Promise<void>
  position: Ref<FzFloatingPosition>
  actualPosition?: Ref<FzFloatingPosition | undefined>
  openerRect: Ref<DOMRect | undefined>
  containerRect: Ref<DOMRect | undefined>
} => {
  // State
  const position = ref<FzFloatingPosition>('auto')
  const actualPosition = ref<FzFloatingPosition>()
  const rect = ref<DOMRect>()
  const openerRect = ref<DOMRect>()
  const containerRect = ref<DOMRect>()
  const float = reactive<FzRect>({ position: { x: 0, y: 0 } })

  // Intersection Observer
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
    ...args.element.value.intersectionOptions
  }
  const floatObserver = ref(new IntersectionObserver(() => {}, observerOptions))

  // DOM Reference Resolution
  const resolveDOMRefs = (): DOMRefs | null => {
    const element = resolveElement(args.element.value.domRef.value)
    if (!element) {
      throw new Error('missing reference element for floating behavior')
    }

    const container = args.container?.value
      ? resolveElement(args.container.value.domRef.value) ?? document.body
      : document.body

    const opener = args.opener?.value
      ? resolveElement(args.opener.value.domRef.value)
      : null

    return { element, container, opener }
  }

  const getRects = (refs: DOMRefs): Rects => ({
    element: refs.element.getBoundingClientRect(),
    container: refs.container.getBoundingClientRect(),
    opener: refs.opener?.getBoundingClientRect() ?? null
  })

  // Main positioning function
  const setPosition = (ignoreCallback: boolean = false) =>
    nextTick(() => {
      // Step 1: Initialize position from args
      actualPosition.value = args.position?.value ?? 'auto'

      // Step 2: Resolve DOM references
      const refs = resolveDOMRefs()
      if (!refs) return

      // Step 3: Set fixed positioning immediately to prevent layout shift
      Object.assign(refs.element.style, {
        position: 'fixed',
        top: '0px',
        left: '0px'
      })

      // Step 4: Get all bounding rects
      const rects = getRects(refs)
      rect.value = rects.element
      openerRect.value = rects.opener ?? undefined
      containerRect.value = rects.container

      // Step 5: Setup observers
      floatObserver.value.observe(refs.element)
      floatObserver.value.observe(refs.container)

      // Step 6: Resolve auto position if needed
      if (isAutoPosition(actualPosition.value) && refs.opener) {
        actualPosition.value = resolveAutoPosition(
          actualPosition.value,
          refs.container,
          refs.element,
          refs.opener,
          args.useViewport?.value ?? false
        )
      }

      // Step 7: Calculate position
      const margins = getMargins(window.getComputedStyle(refs.element))
      
      const positionResult = refs.opener && rects.opener
        ? calculatePositionWithOpener(actualPosition.value!, rects.opener, margins)
        : calculatePositionWithoutOpener(actualPosition.value!, rects.container, rects.element)

      // Step 8: Apply transform to get real position
      const realPosition = calcRealPos(
        rects.element,
        positionResult.position,
        positionResult.transform.x,
        positionResult.transform.y
      )

      // Step 9: Apply boundary corrections
      const corrected = applyBoundaryCorrections(
        realPosition,
        rects.element,
        rects.container,
        positionResult.transform
      )

      // Step 10: Update float state
      float.position.x = corrected.position.x
      float.position.y = corrected.position.y

      // Step 11: Apply final styles
      Object.assign(refs.element.style, {
        top: `${float.position.y}px`,
        left: `${float.position.x}px`,
        position: 'fixed',
        display: 'flex'
      })

      // Step 12: Update rect after final positioning
      rect.value = refs.element.getBoundingClientRect()

      // Step 13: Trigger callback if provided
      if (args.callback?.value && !ignoreCallback) {
        args.callback.value(rect, openerRect, containerRect, position, actualPosition)
      }
    })

  // Cleanup
  onUnmounted(() => {
    floatObserver.value.disconnect()
  })

  return {
    float,
    rect,
    setPosition,
    position,
    actualPosition,
    openerRect,
    containerRect
  }
}
