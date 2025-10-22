export type FzContainerGap = 'sm' | 'base' | 'lg'

export type FzContainerOrientation = 'vertical' | 'horizontal'

export interface FzContainerProps {
  /**
   * Whether to use main container styles instead of section styles
   * @default false
   */
  main?: boolean
  
  /**
   * Gap size for the container
   * @default 'base'
   */
  gap?: FzContainerGap

  /**
   * Layout orientation of the container
   * @default 'vertical'
   */
  orientation?: FzContainerOrientation
  
  /**
   * Custom HTML tag to use for the container
   * @default 'div'
   */
  tag?: string
}

export interface FzContainerSlots {
  /**
   * Default slot for container content
   */
  default(props: {}): any
}