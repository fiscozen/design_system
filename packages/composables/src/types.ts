import { Ref } from 'vue'

export type FzFloatingPosition =
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'auto-start'
  | 'auto'
  | 'auto-end'

export interface FzFloatingProps {
  isOpen: boolean
  position?: FzFloatingPosition
  container?: string | null
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
