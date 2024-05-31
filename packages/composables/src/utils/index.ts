import { FzAbsolutePosition, FzFloatingPosition } from '../types'

type MainPosition = 'right' | 'left' | 'top' | 'bottom'
interface PositionListItem {
  key: MainPosition
  space: number
}

export const getHighestAvailableSpacePos = (
  container: HTMLElement,
  el: HTMLElement,
  opener: HTMLElement,
  justify?: 'start' | 'end'
): FzFloatingPosition => {
  let mainPosition: MainPosition = 'right'

  let positionRes: FzFloatingPosition = 'right-start'

  const containerRect = container.getBoundingClientRect()
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

  const positionList = [
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

  mainPosition = positionList[0].key

  if (!justify) {
    switch (mainPosition) {
      case 'right':
      case 'left':
        const centerDiff = (elRect.height - openerRect.height) / 2
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
