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

/**
 * Base props shared by all container variants
 */
interface FzContainerBaseProps {
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

/**
 * Props for vertical container (default)
 * Layout prop is not available
 */
interface FzContainerPropsVertical extends FzContainerBaseProps {
  /**
   * If true, elements align horizontally. Otherwise, vertically (default)
   * @default false
   */
  horizontal?: false
}

/**
 * Props for horizontal container
 * Layout prop is available to control element expansion
 */
interface FzContainerPropsHorizontal extends FzContainerBaseProps {
  /**
   * Elements align horizontally
   */
  horizontal: true
  
  /**
   * Layout behavior for horizontal containers
   * 
   * Controls how child elements expand to fill available space.
   * 
   * @default 'default'
   * @see FzContainerLayout for available options and implementation status
   */
  layout?: FzContainerLayout
}

/**
 * Container props - union of vertical and horizontal variants
 */
export type FzContainerProps = FzContainerPropsVertical | FzContainerPropsHorizontal

export interface FzContainerSlots {
  /**
   * Default slot for container content
   */
  default(props: {}): any
}