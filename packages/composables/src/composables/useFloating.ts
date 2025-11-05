import { FzFloatingPosition, FzRect, FzUseFloatingArgs } from '../types'
import { ref, reactive, onUnmounted, Ref, nextTick, ToRefs } from 'vue'
import { calcRealPos, getHighestAvailableSpacePos } from '../utils'

export const useFloating = (
  args: ToRefs<FzUseFloatingArgs>
): {
  float: FzRect
  rect: Ref<DOMRect | undefined>
  setPosition: () => Promise<void>
  position: Ref<FzFloatingPosition>
  actualPosition?: Ref<FzFloatingPosition | undefined>
  openerRect: Ref<DOMRect | undefined>
  containerRect: Ref<DOMRect | undefined>
} => {
  const safeElementDomRef = ref<HTMLElement | null>(null)
  const safeContainerDomRef = ref<HTMLElement | null>(null)
  const safeOpenerDomRef = ref<HTMLElement | null>(null)
  const openerRect = ref<DOMRect | undefined>()
  const containerRect = ref<DOMRect | undefined>()
  const position = ref<FzFloatingPosition>('auto')
  const rect = ref<DOMRect | undefined>()
  const float = reactive<FzRect>({
    position: { x: 0, y: 0 }
  })
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
    ...args.element.value.intersectionOptions
  }

  const handleIntersect = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {}

  const floatObserver = ref(new IntersectionObserver(handleIntersect, options))
  const actualPosition = ref<FzFloatingPosition>()

  // Helper: Resolve DOM references
  const resolveDomReferences = () => {
    safeElementDomRef.value = (
      typeof args.element.value.domRef.value === 'string'
        ? document.querySelector(args.element.value.domRef.value)
        : args.element.value.domRef.value
    ) as HTMLElement

    if (!args.container?.value) {
      safeContainerDomRef.value = document.body
    } else {
      safeContainerDomRef.value = (
        typeof args.container.value?.domRef.value === 'string'
          ? document.querySelector(args.container.value.domRef.value)
          : args.container.value?.domRef.value
      ) as HTMLElement
      safeContainerDomRef.value ??= document.body
    }

    if (!safeElementDomRef.value) {
      throw new Error('missing reference element for floating behavior')
    }

    if (args.opener?.value) {
      safeOpenerDomRef.value = (
        typeof args.opener.value?.domRef.value === 'string'
          ? document.querySelector(args.opener.value.domRef.value)
          : args.opener.value?.domRef.value
      ) as HTMLElement
    }

    rect.value = safeElementDomRef.value.getBoundingClientRect()
    openerRect.value = safeOpenerDomRef.value?.getBoundingClientRect()
    containerRect.value = safeContainerDomRef.value.getBoundingClientRect()
  }

  // Helper: Resolve auto position to actual position
  const resolveAutoPositionValue = () => {
    if (!args.opener?.value || !safeOpenerDomRef.value) return

    switch (actualPosition.value) {
      case 'auto':
        actualPosition.value = getHighestAvailableSpacePos(
          args.useViewport?.value ? null : (safeContainerDomRef.value as HTMLElement),
          safeElementDomRef.value as HTMLElement,
          safeOpenerDomRef.value as HTMLElement
        )
        break
      case 'auto-vertical':
        actualPosition.value = getHighestAvailableSpacePos(
          args.useViewport?.value ? null : (safeContainerDomRef.value as HTMLElement),
          safeElementDomRef.value as HTMLElement,
          safeOpenerDomRef.value as HTMLElement,
          undefined,
          true
        )
        break
      case 'auto-start':
        actualPosition.value = getHighestAvailableSpacePos(
          args.useViewport?.value ? null : (safeContainerDomRef.value as HTMLElement),
          safeElementDomRef.value as HTMLElement,
          safeOpenerDomRef.value as HTMLElement,
          'start'
        )
        break
      case 'auto-vertical-start':
        actualPosition.value = getHighestAvailableSpacePos(
          args.useViewport?.value ? null : (safeContainerDomRef.value as HTMLElement),
          safeElementDomRef.value as HTMLElement,
          safeOpenerDomRef.value as HTMLElement,
          'start',
          true
        )
        break
      case 'auto-end':
        actualPosition.value = getHighestAvailableSpacePos(
          args.useViewport?.value ? null : (safeContainerDomRef.value as HTMLElement),
          safeElementDomRef.value as HTMLElement,
          safeOpenerDomRef.value as HTMLElement,
          'end'
        )
        break
      case 'auto-vertical-end':
        actualPosition.value = getHighestAvailableSpacePos(
          args.useViewport?.value ? null : (safeContainerDomRef.value as HTMLElement),
          safeElementDomRef.value as HTMLElement,
          safeOpenerDomRef.value as HTMLElement,
          'end',
          true
        )
        break
      default:
        break
    }
  }

  // Helper: Calculate position with opener
  const calculatePositionWithOpener = (
    elStyle: CSSStyleDeclaration,
    translateX: { value: number },
    translateY: { value: number }
  ) => {
    if (!openerRect.value) return

    const leftWithoutXMargin =
      openerRect.value.left - parseFloat(elStyle.marginLeft) - parseFloat(elStyle.marginRight)
    const leftWithoutLeftMargin = openerRect.value.left - parseFloat(elStyle.marginLeft)
    const topWithoutYMargin =
      openerRect.value.top - parseFloat(elStyle.marginTop) - parseFloat(elStyle.marginBottom)
    const topWithoutTopMargin = openerRect.value.top - parseFloat(elStyle.marginTop)

    switch (actualPosition.value) {
      case 'bottom':
        float.position.y = openerRect.value.bottom
        float.position.x = leftWithoutLeftMargin + openerRect.value.width / 2
        translateX.value = -50
        translateY.value = 0
        break
      case 'bottom-start':
        float.position.y = openerRect.value.bottom
        float.position.x = leftWithoutXMargin
        translateX.value = 0
        translateY.value = 0
        break
      case 'bottom-end':
        float.position.y = openerRect.value.bottom
        float.position.x = openerRect.value.right
        translateX.value = -100
        translateY.value = 0
        break
      case 'left-start':
        float.position.y = topWithoutYMargin
        float.position.x = leftWithoutXMargin
        translateX.value = -100
        translateY.value = 0
        break
      case 'left':
        float.position.y = topWithoutTopMargin + openerRect.value.height / 2
        float.position.x = leftWithoutXMargin
        translateY.value = -50
        translateX.value = -100
        break
      case 'left-end':
        float.position.y = openerRect.value.bottom
        float.position.x = leftWithoutXMargin
        translateY.value = -100
        translateX.value = -100
        break
      case 'top-start':
        float.position.y = topWithoutYMargin
        float.position.x = leftWithoutXMargin
        translateY.value = -100
        translateX.value = 0
        break
      case 'top':
        float.position.y = topWithoutYMargin
        float.position.x = leftWithoutLeftMargin + openerRect.value.width / 2
        translateX.value = -50
        translateY.value = -100
        break
      case 'top-end':
        float.position.y = topWithoutYMargin
        float.position.x = openerRect.value.right
        translateX.value = -100
        translateY.value = -100
        break
      case 'right-start':
        float.position.y = topWithoutYMargin
        float.position.x = openerRect.value.right
        translateX.value = 0
        translateY.value = 0
        break
      case 'right':
        float.position.y = topWithoutTopMargin + openerRect.value.height / 2
        float.position.x = openerRect.value.right
        translateY.value = -50
        translateX.value = 0
        break
      case 'right-end':
        float.position.y = openerRect.value.bottom
        float.position.x = openerRect.value.right
        translateY.value = -100
        translateX.value = 0
        break
      default:
        break
    }
  }

  // Helper: Calculate position without opener
  const calculatePositionWithoutOpener = (translateX: { value: number }) => {
    if (!containerRect.value || !rect.value) return

    switch (actualPosition.value) {
      case 'bottom':
        float.position.y = containerRect.value.bottom - rect.value.height
        float.position.x = containerRect.value.left + containerRect.value.width / 2
        translateX.value = -50
        break
      case 'left-end':
      case 'bottom-start':
        float.position.y = containerRect.value.bottom - rect.value.height
        float.position.x = containerRect.value.left
        break
      case 'right-end':
      case 'bottom-end':
        float.position.y = containerRect.value.bottom - rect.value.height
        float.position.x = containerRect.value.right - rect.value.width
        break
      case 'left':
        float.position.y =
          containerRect.value.top + (containerRect.value.height - rect.value.height) / 2
        float.position.x = containerRect.value.left
        break
      case 'top-start':
      case 'left-start':
        float.position.y = containerRect.value.top
        float.position.x = containerRect.value.left
        break
      case 'top':
        float.position.y = containerRect.value.top
        float.position.x =
          containerRect.value.left + (containerRect.value.width - rect.value.width) / 2
        break
      case 'top-end':
      case 'right-start':
        float.position.y = containerRect.value.top
        float.position.x = containerRect.value.right - rect.value.width
        break
      case 'right':
        float.position.y =
          containerRect.value.top + (containerRect.value.height - rect.value.height) / 2
        float.position.x = containerRect.value.right - rect.value.width
        break
      default:
        break
    }
  }

  // Helper: Apply boundary corrections
  const applyBoundaryCorrections = (
    realPos: { x: number; y: number },
    translateX: { value: number },
    translateY: { value: number }
  ) => {
    if (!containerRect.value || !rect.value) return

    if (realPos.x < containerRect.value.left) {
      float.position.x = containerRect.value.left
      translateX.value = 0
    }

    if (realPos.x + rect.value.width > containerRect.value.right) {
      const fixVal = containerRect.value.right - rect.value.width
      if (fixVal > 0) {
        float.position.x = fixVal
      }
      translateX.value = 0
    }

    if (realPos.y < containerRect.value.top) {
      float.position.y = containerRect.value.top
      translateY.value = 0
    }

    if (realPos.y + rect.value.height > containerRect.value.bottom) {
      const fixVal = containerRect.value.bottom - rect.value.height
      if (fixVal > 0) {
        float.position.y = fixVal
      }
      translateY.value = 0
    }
  }

  // Helper: Apply element styles
  const applyElementStyles = () => {
    if (!safeElementDomRef.value) return

    safeElementDomRef.value.style.top = `${float.position.y}px`
    safeElementDomRef.value.style.left = `${float.position.x}px`
    safeElementDomRef.value.style.position = 'fixed'
    safeElementDomRef.value.style.display = 'flex'
  }

  const setPosition = (ignoreCallback: boolean = false) =>
    nextTick(() => {
      actualPosition.value = args.position ? args.position.value : 'auto'

      // Step 1: Resolve DOM references
      resolveDomReferences()

      // Step 1.5: CRITICAL - Remove element from document flow immediately
      // This prevents the floating element from pushing the opener and causing layout shift
      if (safeElementDomRef.value) {
        safeElementDomRef.value.style.position = 'fixed'
        safeElementDomRef.value.style.top = '0px'
        safeElementDomRef.value.style.left = '0px'
      }

       // Recalculate all rects after content is rendered
       rect.value = safeElementDomRef.value!.getBoundingClientRect()
       openerRect.value = safeOpenerDomRef.value?.getBoundingClientRect()
       containerRect.value = safeContainerDomRef.value!.getBoundingClientRect()

       const elStyle = window.getComputedStyle(safeElementDomRef.value as HTMLElement)

      // Step 2: Setup intersection observer
      floatObserver.value.observe(safeElementDomRef.value as HTMLElement)
      floatObserver.value.observe(safeContainerDomRef.value as HTMLElement)

      // Step 3: Resolve auto positions
      resolveAutoPositionValue()

      // Step 4: Calculate position based on opener presence
      const translate = { x: { value: 0 }, y: { value: 0 } }

      if (args.opener?.value && safeOpenerDomRef.value && openerRect?.value) {
        calculatePositionWithOpener(elStyle, translate.x, translate.y)
      } else {
        calculatePositionWithoutOpener(translate.x)
      }

      // Step 5: Calculate real position and apply boundary corrections
      if (rect.value) {
        const realPos = calcRealPos(
          rect.value,
          float.position,
          translate.x.value,
          translate.y.value
        )
        float.position.x = realPos.x
        float.position.y = realPos.y

        applyBoundaryCorrections(realPos, translate.x, translate.y)
      }

      // Step 6: Apply styles to element
      applyElementStyles()

      // Step 7: Update rect after positioning
      rect.value = safeElementDomRef.value!.getBoundingClientRect()

      // Step 8: Trigger callback if provided
      if (args.callback?.value && !ignoreCallback) {
        args.callback.value(rect, openerRect, containerRect, position, actualPosition)
      }
    })

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
