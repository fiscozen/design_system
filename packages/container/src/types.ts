export type FzContainerGap = 'sm' | 'base' | 'lg'

export type FzContainerOrientation = 'vertical' | 'horizontal'

/**
 * Layout behavior for horizontal containers
 * 
 * Controls how child elements expand to fill available space.
 * Only applies when orientation is 'horizontal'.
 * 
 * **Currently implemented:**
 * - `default`: All elements maintain their natural size (flex-grow: 0)
 * - `expand-first`: First element expands to fill available space, others maintain natural size
 * 
 * **Future layouts (not yet implemented):**
 * - `expand-last`: Last element expands to fill available space
 * - `space-between`: Elements distributed with space between them
 * - `expand-all`: All elements expand equally to fill available space
 */
export type FzContainerLayout = 
  | 'default'
  | 'expand-first'

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
   * Layout behavior for horizontal containers
   * 
   * Controls how child elements expand to fill available space.
   * Only applies when orientation is 'horizontal'.
   * 
   * @default 'default'
   * @see FzContainerLayout for available options and implementation status
   */
  layout?: FzContainerLayout
  
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