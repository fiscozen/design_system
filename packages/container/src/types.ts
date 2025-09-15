export type FzContainerGap = 'sm' | 'base' | 'lg'

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