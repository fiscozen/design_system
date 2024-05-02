import { FzFloatingPosition, FzRect, FzUseFloatingArgs } from '../types'
import { ref, reactive, onUnmounted, Ref, nextTick, computed } from 'vue'
import { calcRealPos, getHighestAvailableSpacePos } from '../utils'

export const useFloating = (
  args: FzUseFloatingArgs
): {
  float: FzRect;
  rect: Ref<DOMRect | null>;
  floatObserver: Ref<IntersectionObserver>;
  setPosition: () => Promise<void>;
} => {
  const safeElementDomRef = ref<HTMLElement | null>(null)
  const safeContainerDomRef = ref<HTMLElement | null>(null)
  const safeOpenerDomRef = ref<HTMLElement | null>(null)
  const rect = ref<DOMRect | null>(null)
  const float = reactive<FzRect>({
    position: { x: 0, y: 0 }
  })
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
    ...args.element.intersectionOptions
  }

  const handleIntersect = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {}

  const floatObserver = ref(new IntersectionObserver(handleIntersect, options))

  const setPosition = () => nextTick(() => {
    safeElementDomRef.value =
      typeof args.element.domRef.value === 'string'
        ? document.querySelector(args.element.domRef.value)
        : args.element.domRef.value
    if (!args.container) {
      safeContainerDomRef.value = document.body
    } else {
      safeContainerDomRef.value =
        typeof args.container.domRef.value === 'string'
          ? document.querySelector(args.container.domRef.value)
          : args.container.domRef.value
      safeContainerDomRef.value ??= document.body
    }

    if (!safeElementDomRef.value) {
      throw new Error('missing reference element for floating behavior')
    }

    if (args.opener) {
      safeOpenerDomRef.value =
        typeof args.opener.domRef.value === 'string'
          ? document.querySelector(args.opener.domRef.value)
          : args.opener.domRef.value
    }

    rect.value = safeElementDomRef.value.getBoundingClientRect()
    const openerRect = safeOpenerDomRef.value?.getBoundingClientRect()
    const containerRect = safeContainerDomRef.value.getBoundingClientRect()

    // multiple observer calls on same target do not cause multiple registrations
    floatObserver.value.observe(safeElementDomRef.value)
    floatObserver.value.observe(safeContainerDomRef.value)

    let position: FzFloatingPosition = args.position ? args.position.value : 'auto'

    let translateY = 0
    let translateX = 0

    if (args.opener && safeOpenerDomRef.value && openerRect) {
      switch (position) {
        case 'auto':
          position = getHighestAvailableSpacePos(
            safeContainerDomRef.value,
            safeElementDomRef.value,
            safeOpenerDomRef.value
          )
          break
        case 'auto-start':
          position = getHighestAvailableSpacePos(
            safeContainerDomRef.value,
            safeElementDomRef.value,
            safeOpenerDomRef.value,
            'start'
          )
          break
        case 'auto-end':
          position = getHighestAvailableSpacePos(
            safeContainerDomRef.value,
            safeElementDomRef.value,
            safeOpenerDomRef.value,
            'end'
          )
          break
        default:
          break
      }
      switch (position) {
        case 'bottom':
          float.position.y = openerRect.bottom
          float.position.x = openerRect.left + openerRect.width / 2
          translateX = -50
          translateY = 0
          break
        case 'bottom-start':
          float.position.y = openerRect.bottom
          float.position.x = openerRect.left
          translateX = 0
          translateY = 0
          break
        case 'bottom-end':
          float.position.y = openerRect.bottom
          float.position.x = openerRect.right
          translateX = -100
          translateY = 0
          break
        case 'left-start':
          float.position.y = openerRect.top
          float.position.x = openerRect.left
          translateX = -100
          translateY = 0
          break
        case 'left':
          float.position.y = openerRect.top + openerRect.height / 2
          float.position.x = openerRect.left
          translateY = -50
          translateX = -100
          break
        case 'left-end':
          float.position.y = openerRect.bottom
          float.position.x = openerRect.left
          translateY = -100
          translateX = -100
          break
        case 'top-start':
          float.position.y = openerRect.top
          float.position.x = openerRect.left
          translateY = -100
          translateX = 0
          break
        case 'top':
          float.position.y = openerRect.top
          float.position.x = openerRect.left + openerRect.width / 2
          translateX = -50
          translateY = -100
          break
        case 'top-end':
          float.position.y = openerRect.top
          float.position.x = openerRect.right
          translateX = -100
          translateY = -100
          break
        case 'right-start':
          float.position.y = openerRect.top
          float.position.x = openerRect.right
          translateX = 0
          translateY = 0
          break
        case 'right':
          float.position.y = openerRect.top + openerRect.height / 2
          float.position.x = openerRect.right
          translateY = -50
          translateX = 0
          break
        case 'right-end':
          float.position.y = openerRect.bottom
          float.position.x = openerRect.right
          translateY = -100
          translateX = 0
          break
        default:
          break
      }
    } else {
      switch (position) {
        case 'bottom':
          float.position.y = containerRect.bottom - rect.value.height
          float.position.x = containerRect.left + containerRect.width / 2
          translateX = -50
          break
        case 'left-end':
        case 'bottom-start':
          float.position.y = containerRect.bottom - rect.value.height
          float.position.x = containerRect.left
          break
        case 'right-end':
        case 'bottom-end':
          float.position.y = containerRect.bottom - rect.value.height
          float.position.x = containerRect.right - rect.value.width
          break
        case 'left':
          float.position.y = containerRect.top + (containerRect.height - rect.value.height) / 2
          float.position.x = containerRect.left
          break
        case 'top-start':
        case 'left-start':
          float.position.y = containerRect.top
          float.position.x = containerRect.left
          break
        case 'top':
          float.position.y = containerRect.top
          float.position.x = containerRect.left + (containerRect.width - rect.value.width) / 2
          break
        case 'top-end':
        case 'right-start':
          float.position.y = containerRect.top
          float.position.x = containerRect.right - rect.value.width
        case 'right':
          float.position.y = containerRect.top + (containerRect.height - rect.value.height) / 2
          float.position.x = containerRect.right - rect.value.width
          break
        default:
          break
      }
    }

    const realPos = calcRealPos(rect.value, float.position, translateX, translateY)

    if (realPos.x < containerRect.left) {
      float.position.x = containerRect.left;
      translateX = 0
    }

    if ((realPos.x + rect.value.width) > containerRect.right) {
      float.position.x = containerRect.right - rect.value.width;
      translateX = 0
    }
    
    if (realPos.y < containerRect.top) {
      float.position.y = containerRect.top;
      translateY = 0
    }

    if ((realPos.y + rect.value.height) > containerRect.bottom) {
      float.position.y = containerRect.bottom - rect.value.height;
      translateY = 0
    }

    safeElementDomRef.value.style.top = `${float.position.y}px`
    safeElementDomRef.value.style.left = `${float.position.x}px`
    safeElementDomRef.value.style.transform = `translateY(${translateY}%) translateX(${translateX}%)`
    safeElementDomRef.value.style.position = 'absolute'

    rect.value = safeElementDomRef.value.getBoundingClientRect()
  })

  onUnmounted(() => {
    floatObserver.value.disconnect()
  })

  return {
    float,
    rect,
    floatObserver,
    setPosition
  }
}
