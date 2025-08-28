export type FzContainerDisplay = 'flex' | 'grid' | 'block' | 'inline-flex' | 'inline-grid'

export type FzContainerDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'

export type FzContainerWrap = 'wrap' | 'nowrap' | 'wrap-reverse'

export type FzContainerJustify = 
  | 'start' 
  | 'end' 
  | 'center' 
  | 'between' 
  | 'around' 
  | 'evenly'
  | 'stretch'

export type FzContainerAlign = 
  | 'start' 
  | 'end' 
  | 'center' 
  | 'stretch' 
  | 'baseline'

export type FzContainerGap = 
  | '0' 
  | '1' 
  | '2' 
  | '4' 
  | '6' 
  | '8' 
  | '10' 
  | '12' 
  | '14' 
  | '16' 
  | '20' 
  | '24' 
  | '32' 
  | '40' 
  | '48' 
  | '64'

export type FzContainerSpacing = 
  | '0' 
  | '1' 
  | '2' 
  | '4' 
  | '6' 
  | '8' 
  | '10' 
  | '12' 
  | '14' 
  | '16' 
  | '20' 
  | '24' 
  | '32' 
  | '40' 
  | '48' 
  | '64'

export type FzContainerSize = 
  | 'auto' 
  | 'full' 
  | 'screen' 
  | 'fit' 
  | 'max' 
  | 'min'

export type FzContainerOverflow = 'visible' | 'hidden' | 'scroll' | 'auto'

// Grid specific types
export type FzContainerGridCols = 
  | '1' 
  | '2' 
  | '3' 
  | '4' 
  | '5' 
  | '6' 
  | '7' 
  | '8' 
  | '9' 
  | '10' 
  | '11' 
  | '12'
  | 'none'

export type FzContainerGridRows = 
  | '1' 
  | '2' 
  | '3' 
  | '4' 
  | '5' 
  | '6'
  | 'none'

// Responsive breakpoint type
export type FzContainerResponsive<T> = T | {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

export interface FzContainerProps {
  /**
   * Display type for the container
   * @default 'flex'
   */
  display?: FzContainerResponsive<FzContainerDisplay>
  
  /**
   * Flex direction (only for flex/inline-flex)
   * @default 'row'
   */
  direction?: FzContainerResponsive<FzContainerDirection>
  
  /**
   * Flex wrap behavior (only for flex/inline-flex)
   * @default 'nowrap'
   */
  wrap?: FzContainerResponsive<FzContainerWrap>
  
  /**
   * Justify content alignment
   * @default 'start'
   */
  justify?: FzContainerResponsive<FzContainerJustify>
  
  /**
   * Align items
   * @default 'stretch'
   */
  align?: FzContainerResponsive<FzContainerAlign>
  
  /**
   * Gap between items
   * @default '0'
   */
  gap?: FzContainerResponsive<FzContainerGap>
  
  /**
   * Row gap (when different from gap)
   */
  rowGap?: FzContainerResponsive<FzContainerGap>
  
  /**
   * Column gap (when different from gap)
   */
  colGap?: FzContainerResponsive<FzContainerGap>
  
  /**
   * Padding for all sides
   */
  padding?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Padding top
   */
  paddingTop?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Padding right
   */
  paddingRight?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Padding bottom
   */
  paddingBottom?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Padding left
   */
  paddingLeft?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Padding for X axis (left and right)
   */
  paddingX?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Padding for Y axis (top and bottom)
   */
  paddingY?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin for all sides
   */
  margin?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin top
   */
  marginTop?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin right
   */
  marginRight?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin bottom
   */
  marginBottom?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin left
   */
  marginLeft?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin for X axis (left and right)
   */
  marginX?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Margin for Y axis (top and bottom)
   */
  marginY?: FzContainerResponsive<FzContainerSpacing>
  
  /**
   * Width of the container
   */
  width?: FzContainerResponsive<FzContainerSize>
  
  /**
   * Height of the container
   */
  height?: FzContainerResponsive<FzContainerSize>
  
  /**
   * Max width of the container
   */
  maxWidth?: FzContainerResponsive<FzContainerSize>
  
  /**
   * Max height of the container
   */
  maxHeight?: FzContainerResponsive<FzContainerSize>
  
  /**
   * Min width of the container
   */
  minWidth?: FzContainerResponsive<FzContainerSize>
  
  /**
   * Min height of the container
   */
  minHeight?: FzContainerResponsive<FzContainerSize>
  
  /**
   * Overflow behavior
   */
  overflow?: FzContainerResponsive<FzContainerOverflow>
  
  /**
   * Overflow X behavior
   */
  overflowX?: FzContainerResponsive<FzContainerOverflow>
  
  /**
   * Overflow Y behavior
   */
  overflowY?: FzContainerResponsive<FzContainerOverflow>
  
  // Grid specific props
  /**
   * Grid template columns (only for grid/inline-grid)
   */
  gridCols?: FzContainerResponsive<FzContainerGridCols>
  
  /**
   * Grid template rows (only for grid/inline-grid)
   */
  gridRows?: FzContainerResponsive<FzContainerGridRows>
  
  /**
   * Whether the container should take full width
   * @default false
   */
  fullWidth?: boolean
  
  /**
   * Whether the container should take full height
   * @default false
   */
  fullHeight?: boolean
  
  /**
   * Custom CSS class to apply to the container
   */
  class?: string
  
  /**
   * Custom HTML tag to use for the container
   * @default 'div'
   */
  tag?: string
  
  /**
   * Whether to center the container horizontally
   * @default false
   */
  centerX?: boolean
  
  /**
   * Whether to center the container vertically
   * @default false
   */
  centerY?: boolean
  
  /**
   * Whether to center the container both horizontally and vertically
   * @default false
   */
  center?: boolean
}

export interface FzContainerSlots {
  /**
   * Default slot for container content
   */
  default(props: {}): any
}