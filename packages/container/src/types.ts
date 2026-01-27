/**
 * Gap sizes available for main containers
 * 
 * Main containers are intended for page-level sections and use larger spacing values.
 * Available sizes: sm (32px), base (48px), lg (64px)
 */
export type FzContainerMainGap = 'sm' | 'base' | 'lg'

/**
 * Gap sizes available for section containers
 * 
 * Section containers are for content within sections and use smaller spacing values.
 * Available sizes: none (0px), xs (8px), sm (16px), base (24px), lg (32px)
 */
export type FzContainerSectionGap = 'none' | 'xs' | 'sm' | 'base' | 'lg'

/**
 * Layout behavior for horizontal containers
 * 
 * Controls how child elements expand to fill available space.
 * Only applies when horizontal is true.
 * 
 * **Available layouts:**
 * - `default`: All elements maintain their natural size (flex-grow: 0)
 * - `expand-first`: First element expands to fill available space, others maintain natural size
 * - `expand-all`: All elements expand equally to fill available space (flex-grow: 1 on all children)
 * - `space-between`: Elements distributed with space between them (justify-content: space-between)
 * - `expand-last`: Last element expands to fill available space, others maintain natural size
 */
export type FzContainerLayout = 
  | 'default'
  | 'expand-first'
  | 'expand-all'
  | 'space-between'
  | 'expand-last'

/**
 * Alignment options for container items on the cross-axis
 * 
 * Controls how child elements are aligned perpendicular to the main axis:
 * - In vertical containers: controls horizontal alignment (left/center/right)
 * - In horizontal containers: controls vertical alignment (top/center/bottom)
 * 
 * **Values:**
 * - `start`: Align items to the start of the cross-axis (left for vertical, top for horizontal)
 * - `center`: Center items on the cross-axis
 * - `end`: Align items to the end of the cross-axis (right for vertical, bottom for horizontal)
 * - `stretch`: Stretch items to fill the container on the cross-axis
 * - `baseline`: Align items along their text baseline (useful for horizontal containers with text)
 */
export type FzContainerAlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

/**
 * Common props shared by all container variants
 */
interface FzContainerCommonProps {
  /**
   * Custom HTML tag to use for the container
   * @default 'div'
   */
  tag?: string
  
  /**
   * Alignment of child elements on the cross-axis
   * 
   * @default 'start' for vertical containers, 'center' for horizontal containers
   * @see FzContainerAlignItems for available options
   */
  alignItems?: FzContainerAlignItems
}

/**
 * Props for main containers
 * 
 * Main containers use larger spacing values (sm, base, lg) for page-level sections.
 * When main is true, TypeScript will restrict gap to FzContainerMainGap values.
 */
interface FzContainerMainProps extends FzContainerCommonProps {
  /**
   * Uses main container spacing (larger gaps for page-level sections)
   */
  main: true
  
  /**
   * Gap size for the main container
   * @default 'base'
   */
  gap?: FzContainerMainGap
}

/**
 * Props for section containers
 * 
 * Section containers use smaller spacing values (none, xs, sm, base, lg) for content within sections.
 * When main is false or undefined, TypeScript will restrict gap to FzContainerSectionGap values.
 */
interface FzContainerSectionProps extends FzContainerCommonProps {
  /**
   * Uses section container spacing (smaller gaps for content within sections)
   * @default false
   */
  main?: false
  
  /**
   * Gap size for the section container
   * @default 'base'
   */
  gap?: FzContainerSectionGap
}

/**
 * Props for vertical container orientation (default)
 * 
 * Vertical containers stack elements vertically with gap applied between them.
 * The layout prop is not available in vertical orientation.
 */
interface FzContainerVerticalProps {
  /**
   * Elements align vertically (default orientation)
   * @default false
   */
  horizontal?: false
}

/**
 * Props for horizontal container orientation
 * 
 * Horizontal containers align elements horizontally in a single row.
 * The layout prop is available to control how child elements expand to fill space.
 */
interface FzContainerHorizontalProps {
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
 * FzContainer component props
 * 
 * Discriminated union type that ensures type safety based on container configuration:
 * - When main={true}: gap is restricted to 'sm' | 'base' | 'lg'
 * - When main={false}: gap is restricted to 'none' | 'xs' | 'sm' | 'base' | 'lg'
 * - When horizontal={true}: layout prop becomes available
 * - When horizontal={false}: layout prop is not available
 */
export type FzContainerProps = 
  | (FzContainerMainProps & FzContainerVerticalProps)
  | (FzContainerMainProps & FzContainerHorizontalProps)
  | (FzContainerSectionProps & FzContainerVerticalProps)
  | (FzContainerSectionProps & FzContainerHorizontalProps)

/**
 * FzContainer component slots
 */
export interface FzContainerSlots {
  /**
   * Default slot for container content
   * 
   * Accepts any valid Vue content (components, HTML elements, text).
   * Elements will be laid out according to the container's orientation and gap settings.
   */
  default(props: {}): any
}