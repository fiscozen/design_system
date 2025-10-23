export type FzContainerGap = 'sm' | 'base' | 'lg'

/**
 * Layout behavior for horizontal containers
 * 
 * Controls how child elements expand to fill available space.
 * Only applies when horizontal is true.
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
   * If true, elements align horizontally. Otherwise, vertically (default)
   * @default false
   */
  horizontal?: boolean
  
  /**
   * Layout behavior for horizontal containers
   * 
   * Controls how child elements expand to fill available space.
   * Only applies when horizontal is true.
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