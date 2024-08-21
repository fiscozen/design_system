import { Ref } from 'vue'

type PositionPrimary = 'bottom' | 'left' | 'top' | 'right' | 'auto' | 'auto-vertical'
type PositionSecondary = 'start' | 'end'
export type FzFloatingPosition = PositionPrimary | `${PositionPrimary}-${PositionSecondary}`

export interface FzFloatingProps {
  isOpen: boolean
  position?: FzFloatingPosition
  container?: string | null
  contentClass?:
    | string
    | string[]
    | Record<string, boolean | undefined>
    | Array<string | Record<string, boolean | undefined>>
  openerClass?:
    | string
    | string[]
    | Record<string, boolean | undefined>
    | Array<string | Record<string, boolean | undefined>>
  overrideContentClass?: boolean
  teleport?: boolean
  useViewport?: boolean
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
  useViewport?: Ref<boolean>
  callback?: (
    rect: Ref<DOMRect | undefined>,
    openerRect: Ref<DOMRect | undefined>,
    containerRect: Ref<DOMRect | undefined>,
    position: Ref<FzFloatingPosition>,
    actualPosition: Ref<FzFloatingPosition | undefined>
  ) => void
}
