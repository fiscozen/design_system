import { FzFloatingPosition } from '../types'

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

  const spaceLeftNormalized = (openerRect.left - containerRect.left) / containerRect.width
  const spaceRightNormalized = (containerRect.right - openerRect.right) / containerRect.width
  const spaceTopNormalized = (openerRect.top - containerRect.top) / containerRect.height
  const spaceBottomNormalized = (containerRect.bottom - openerRect.bottom) / containerRect.height

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
  ].sort((a, b) => a.space - b.space)

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
