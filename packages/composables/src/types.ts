import { Ref } from 'vue'

type PositionPrimary = 'bottom' | 'left' | 'top' | 'right' | 'auto'
type PositionSecondary = 'start' | 'end'
export type FzFloatingPosition = PositionPrimary | `${PositionPrimary}-${PositionSecondary}`

export interface FzFloatingProps {
  isOpen: boolean
  position?: FzFloatingPosition
  container?: string | null,
  contentClass?: string | string[] | Record<string, boolean>
}

export interface FzAbsolutePosition {
  x: number
  y: number
}

export interface FzRect {
  position: FzAbsolutePosition
}

export interface FzFloatElement {
  domRef: Ref<string | HTMLElement | null>
  intersectionOptions?: IntersectionObserverInit
}
export interface FzUseFloatingArgs {
  element: FzFloatElement
  container?: FzFloatElement
  opener?: FzFloatElement
  position?: Ref<FzFloatingPosition>
}
