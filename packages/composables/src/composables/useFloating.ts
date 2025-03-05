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

  const setPosition = () =>
    nextTick(() => {
      actualPosition.value = args.position ? args.position.value : 'auto'
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

      const elStyle = window.getComputedStyle(safeElementDomRef.value as HTMLElement)

      // multiple observer calls on same target do not cause multiple registrations
      floatObserver.value.observe(safeElementDomRef.value as HTMLElement)
      floatObserver.value.observe(safeContainerDomRef.value as HTMLElement)

      let translateY = 0
      let translateX = 0

      if (args.opener?.value && safeOpenerDomRef.value && openerRect?.value) {
        const leftWithoutXMargin =
          openerRect.value.left - parseFloat(elStyle.marginLeft) - parseFloat(elStyle.marginRight)
        const leftWithoutLeftMargin = openerRect.value.left - parseFloat(elStyle.marginLeft)
        const topWithoutYMargin =
          openerRect.value.top - parseFloat(elStyle.marginTop) - parseFloat(elStyle.marginBottom)
        const topWithoutTopMargin = openerRect.value.top - parseFloat(elStyle.marginTop)

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
        switch (actualPosition.value) {
          case 'bottom':
            float.position.y = openerRect.value.bottom
            float.position.x = leftWithoutLeftMargin + openerRect.value.width / 2
            translateX = -50
            translateY = 0
            break
          case 'bottom-start':
            float.position.y = openerRect.value.bottom
            float.position.x = leftWithoutXMargin
            translateX = 0
            translateY = 0
            break
          case 'bottom-end':
            float.position.y = openerRect.value.bottom
            float.position.x = openerRect.value.right
            translateX = -100
            translateY = 0
            break
          case 'left-start':
            float.position.y = topWithoutYMargin
            float.position.x = leftWithoutXMargin
            translateX = -100
            translateY = 0
            break
          case 'left':
            float.position.y = topWithoutTopMargin + openerRect.value.height / 2
            float.position.x = leftWithoutXMargin
            translateY = -50
            translateX = -100
            break
          case 'left-end':
            float.position.y = openerRect.value.bottom
            float.position.x = leftWithoutXMargin
            translateY = -100
            translateX = -100
            break
          case 'top-start':
            float.position.y = topWithoutYMargin
            float.position.x = leftWithoutXMargin
            translateY = -100
            translateX = 0
            break
          case 'top':
            float.position.y = topWithoutYMargin
            float.position.x = leftWithoutLeftMargin + openerRect.value.width / 2
            translateX = -50
            translateY = -100
            break
          case 'top-end':
            float.position.y = topWithoutYMargin
            float.position.x = openerRect.value.right
            translateX = -100
            translateY = -100
            break
          case 'right-start':
            float.position.y = topWithoutYMargin
            float.position.x = openerRect.value.right
            translateX = 0
            translateY = 0
            break
          case 'right':
            float.position.y = topWithoutTopMargin + openerRect.value.height / 2
            float.position.x = openerRect.value.right
            translateY = -50
            translateX = 0
            break
          case 'right-end':
            float.position.y = openerRect.value.bottom
            float.position.x = openerRect.value.right
            translateY = -100
            translateX = 0
            break
          default:
            break
        }
      } else {
        switch (actualPosition.value) {
          case 'bottom':
            float.position.y = containerRect.value.bottom - rect.value.height
            float.position.x = containerRect.value.left + containerRect.value.width / 2
            translateX = -50
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
          case 'right':
            float.position.y =
              containerRect.value.top + (containerRect.value.height - rect.value.height) / 2
            float.position.x = containerRect.value.right - rect.value.width
            break
          default:
            break
        }
      }

      const realPos = calcRealPos(rect.value, float.position, translateX, translateY)

      float.position.x = realPos.x
      float.position.y = realPos.y

      if (realPos.x < containerRect.value.left) {
        float.position.x = containerRect.value.left
        translateX = 0
      }

      if (realPos.x + rect.value.width > containerRect.value.right) {
        const fixVal = containerRect.value.right - rect.value.width
        if (fixVal > 0) {
          float.position.x = fixVal
        }
        translateX = 0
      }

      if (realPos.y < containerRect.value.top) {
        float.position.y = containerRect.value.top
        translateY = 0
      }

      if (realPos.y + rect.value.height > containerRect.value.bottom) {
        const fixVal = containerRect.value.bottom - rect.value.height
        if (fixVal > 0) {
          float.position.y = fixVal
        }
        translateY = 0
      }

      if(float.position.y < 0) float.position.y = 0
      if(float.position.x < 0) float.position.x = 0

      safeElementDomRef.value.style.top = `${float.position.y}px`
      safeElementDomRef.value.style.left = `${float.position.x}px`
      safeElementDomRef.value.style.position = 'fixed'
      safeElementDomRef.value.style.display = 'flex'

      rect.value = safeElementDomRef.value.getBoundingClientRect()

      if (args.callback?.value) {
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
