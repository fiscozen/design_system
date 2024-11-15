import { FzAbsolutePosition, FzFloatingPosition } from '../../types'

type MainPosition = 'right' | 'left' | 'top' | 'bottom'
interface PositionListItem {
  key: MainPosition
  space: number
}
const windowDOMrect = new DOMRect(0, 0, window.innerWidth, window.innerHeight)
export const getHighestAvailableSpacePos = (
  container: HTMLElement | null,
  el: HTMLElement,
  opener: HTMLElement,
  justify?: 'start' | 'end',
  verticalOnly?: boolean
): FzFloatingPosition => {
  let mainPosition: MainPosition = verticalOnly ? 'bottom' : 'right'

  let positionRes: FzFloatingPosition = verticalOnly ? 'bottom-start' : 'right-start'

  windowDOMrect.width = window.innerWidth
  windowDOMrect.height = window.innerHeight
  windowDOMrect.x = 0
  windowDOMrect.y = 0
  const containerRect = container ? container.getBoundingClientRect() : windowDOMrect
  const elRect = el.getBoundingClientRect()
  const openerRect = opener.getBoundingClientRect()

  const spaceLeftNormalized =
    (openerRect.left - containerRect.left - elRect.width) / containerRect.width
  const spaceRightNormalized =
    (containerRect.right - openerRect.right - elRect.width) / containerRect.width
  const spaceTopNormalized =
    (openerRect.top - containerRect.top - elRect.height) / containerRect.height
  const spaceBottomNormalized =
    (containerRect.bottom - openerRect.bottom - elRect.height) / containerRect.height

  let positionList = [
    {
      key: 'right',
      space: spaceRightNormalized
    } as PositionListItem,
    {
      key: 'top',
      space: spaceTopNormalized
    } as PositionListItem,
    {
      key: 'bottom',
      space: spaceBottomNormalized
    } as PositionListItem,
    {
      key: 'left',
      space: spaceLeftNormalized
    } as PositionListItem
  ].sort((a, b) => b.space - a.space)

  if (verticalOnly) {
    positionList = positionList.filter((pos) => pos.key === 'top' || pos.key === 'bottom')
  }

  mainPosition = positionList[0].key

  if (!justify) {
    const centerDiff = (elRect.height - openerRect.height) / 2
    switch (mainPosition) {
      case 'right':
      case 'left':
        if (containerRect.top > openerRect.top - centerDiff) {
          justify = 'end'
        }
        if (containerRect.bottom < openerRect.top - centerDiff) {
          justify = 'start'
        }
        break
      default:
        break
    }
  }

  positionRes = justify ? `${mainPosition}-${justify}` : mainPosition
  return positionRes
}

export const calcRealPos = (
  rect: DOMRect,
  pos: FzAbsolutePosition,
  translateX: number,
  translateY: number
): FzAbsolutePosition => {
  return {
    x: pos.x + (rect.width * translateX) / 100,
    y: pos.y + (rect.height * translateY) / 100
  }
}

