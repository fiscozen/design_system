import type { 
  FzContainerResponsive, 
  FzContainerDisplay, 
  FzContainerDirection, 
  FzContainerWrap, 
  FzContainerJustify, 
  FzContainerAlign, 
  FzContainerGap, 
  FzContainerSpacing, 
  FzContainerSize, 
  FzContainerOverflow, 
  FzContainerGridCols, 
  FzContainerGridRows 
} from './types'

// Breakpoint prefixes for Tailwind
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as const

/**
 * Generate responsive classes from a responsive value
 */
export function generateResponsiveClasses<T>(
  value: FzContainerResponsive<T> | undefined,
  mapper: (val: T) => string | string[]
): string[] {
  if (!value) return []
  
  const classes: string[] = []
  
  if (typeof value === 'object') {
    // Handle responsive object
    Object.entries(value).forEach(([breakpoint, val]) => {
      if (val !== undefined) {
        const mappedClasses = mapper(val as T)
        const classArray = Array.isArray(mappedClasses) ? mappedClasses : [mappedClasses]
        
        if (breakpoint === 'xs') {
          // xs is the default (no prefix)
          classes.push(...classArray)
        } else {
          // Add breakpoint prefix
          classes.push(...classArray.map(cls => `${breakpoint}:${cls}`))
        }
      }
    })
  } else {
    // Handle simple value
    const mappedClasses = mapper(value as T)
    const classArray = Array.isArray(mappedClasses) ? mappedClasses : [mappedClasses]
    classes.push(...classArray)
  }
  
  return classes
}

// Display mappers
export const displayMapper = (display: FzContainerDisplay): string => {
  const displayMap: Record<FzContainerDisplay, string> = {
    'flex': 'flex',
    'grid': 'grid',
    'block': 'block',
    'inline-flex': 'inline-flex',
    'inline-grid': 'inline-grid'
  }
  return displayMap[display]
}

// Direction mappers
export const directionMapper = (direction: FzContainerDirection): string => {
  const directionMap: Record<FzContainerDirection, string> = {
    'row': 'flex-row',
    'column': 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse'
  }
  return directionMap[direction]
}

// Wrap mappers
export const wrapMapper = (wrap: FzContainerWrap): string => {
  // Handle boolean values
  if (typeof wrap === 'boolean') {
    return wrap ? 'flex-wrap' : 'flex-nowrap'
  }
  
  // Handle string values
  const wrapMap: Record<string, string> = {
    'wrap': 'flex-wrap',
    'nowrap': 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse'
  }
  return wrapMap[wrap] || 'flex-nowrap'
}

// Justify mappers
export const justifyMapper = (justify: FzContainerJustify): string => {
  const justifyMap: Record<FzContainerJustify, string> = {
    'start': 'justify-start',
    'end': 'justify-end',
    'center': 'justify-center',
    'between': 'justify-between',
    'around': 'justify-around',
    'evenly': 'justify-evenly',
    'stretch': 'justify-stretch'
  }
  return justifyMap[justify]
}

// Align mappers
export const alignMapper = (align: FzContainerAlign): string => {
  const alignMap: Record<FzContainerAlign, string> = {
    'start': 'items-start',
    'end': 'items-end',
    'center': 'items-center',
    'stretch': 'items-stretch',
    'baseline': 'items-baseline'
  }
  return alignMap[align]
}

// Semantic spacing mapping to Tailwind values
const spacingSemanticMap: Record<string, string> = {
  'none': '0',
  'xs': '2',
  'sm': '8', 
  'md': '16',
  'lg': '24',
  'xl': '32',
  '2xl': '48'
}

/**
 * Maps semantic spacing values to Tailwind numeric values
 */
function mapSemanticSpacing(value: string): string {
  return spacingSemanticMap[value] || value
}

// Gap mappers
export const gapMapper = (gap: FzContainerGap): string => `gap-${mapSemanticSpacing(gap)}`
export const rowGapMapper = (gap: FzContainerGap): string => `gap-y-${mapSemanticSpacing(gap)}`
export const colGapMapper = (gap: FzContainerGap): string => `gap-x-${mapSemanticSpacing(gap)}`

// Spacing mappers
export const paddingMapper = (spacing: FzContainerSpacing): string => `p-${mapSemanticSpacing(spacing)}`
export const paddingTopMapper = (spacing: FzContainerSpacing): string => `pt-${mapSemanticSpacing(spacing)}`
export const paddingRightMapper = (spacing: FzContainerSpacing): string => `pr-${mapSemanticSpacing(spacing)}`
export const paddingBottomMapper = (spacing: FzContainerSpacing): string => `pb-${mapSemanticSpacing(spacing)}`
export const paddingLeftMapper = (spacing: FzContainerSpacing): string => `pl-${mapSemanticSpacing(spacing)}`
export const paddingXMapper = (spacing: FzContainerSpacing): string => `px-${mapSemanticSpacing(spacing)}`
export const paddingYMapper = (spacing: FzContainerSpacing): string => `py-${mapSemanticSpacing(spacing)}`

export const marginMapper = (spacing: FzContainerSpacing): string => `m-${mapSemanticSpacing(spacing)}`
export const marginTopMapper = (spacing: FzContainerSpacing): string => `mt-${mapSemanticSpacing(spacing)}`
export const marginRightMapper = (spacing: FzContainerSpacing): string => `mr-${mapSemanticSpacing(spacing)}`
export const marginBottomMapper = (spacing: FzContainerSpacing): string => `mb-${mapSemanticSpacing(spacing)}`
export const marginLeftMapper = (spacing: FzContainerSpacing): string => `ml-${mapSemanticSpacing(spacing)}`
export const marginXMapper = (spacing: FzContainerSpacing): string => `mx-${mapSemanticSpacing(spacing)}`
export const marginYMapper = (spacing: FzContainerSpacing): string => `my-${mapSemanticSpacing(spacing)}`

// Size mappers
export const widthMapper = (size: FzContainerSize): string => {
  const sizeMap: Record<FzContainerSize, string> = {
    'auto': 'w-auto',
    'full': 'w-full',
    'screen': 'w-screen',
    'fit': 'w-fit',
    'max': 'w-max',
    'min': 'w-min'
  }
  return sizeMap[size]
}

export const heightMapper = (size: FzContainerSize): string => {
  const sizeMap: Record<FzContainerSize, string> = {
    'auto': 'h-auto',
    'full': 'h-full',
    'screen': 'h-screen',
    'fit': 'h-fit',
    'max': 'h-max',
    'min': 'h-min'
  }
  return sizeMap[size]
}

export const maxWidthMapper = (size: FzContainerSize): string => {
  const sizeMap: Record<FzContainerSize, string> = {
    'auto': 'max-w-none',
    'full': 'max-w-full',
    'screen': 'max-w-screen',
    'fit': 'max-w-fit',
    'max': 'max-w-max',
    'min': 'max-w-min'
  }
  return sizeMap[size]
}

export const maxHeightMapper = (size: FzContainerSize): string => {
  const sizeMap: Record<FzContainerSize, string> = {
    'auto': 'max-h-none',
    'full': 'max-h-full',
    'screen': 'max-h-screen',
    'fit': 'max-h-fit',
    'max': 'max-h-max',
    'min': 'max-h-min'
  }
  return sizeMap[size]
}

export const minWidthMapper = (size: FzContainerSize): string => {
  const sizeMap: Record<FzContainerSize, string> = {
    'auto': 'min-w-0',
    'full': 'min-w-full',
    'screen': 'min-w-full',
    'fit': 'min-w-fit',
    'max': 'min-w-max',
    'min': 'min-w-min'
  }
  return sizeMap[size]
}

export const minHeightMapper = (size: FzContainerSize): string => {
  const sizeMap: Record<FzContainerSize, string> = {
    'auto': 'min-h-0',
    'full': 'min-h-full',
    'screen': 'min-h-screen',
    'fit': 'min-h-fit',
    'max': 'min-h-max',
    'min': 'min-h-min'
  }
  return sizeMap[size]
}

// Overflow mappers
export const overflowMapper = (overflow: FzContainerOverflow): string => {
  const overflowMap: Record<FzContainerOverflow, string> = {
    'visible': 'overflow-visible',
    'hidden': 'overflow-hidden',
    'scroll': 'overflow-scroll',
    'auto': 'overflow-auto'
  }
  return overflowMap[overflow]
}

export const overflowXMapper = (overflow: FzContainerOverflow): string => {
  const overflowMap: Record<FzContainerOverflow, string> = {
    'visible': 'overflow-x-visible',
    'hidden': 'overflow-x-hidden',
    'scroll': 'overflow-x-scroll',
    'auto': 'overflow-x-auto'
  }
  return overflowMap[overflow]
}

export const overflowYMapper = (overflow: FzContainerOverflow): string => {
  const overflowMap: Record<FzContainerOverflow, string> = {
    'visible': 'overflow-y-visible',
    'hidden': 'overflow-y-hidden',
    'scroll': 'overflow-y-scroll',
    'auto': 'overflow-y-auto'
  }
  return overflowMap[overflow]
}

// Grid mappers
export const gridColsMapper = (cols: FzContainerGridCols): string => {
  return cols === 'none' ? 'grid-cols-none' : `grid-cols-${cols}`
}

export const gridRowsMapper = (rows: FzContainerGridRows): string => {
  return rows === 'none' ? 'grid-rows-none' : `grid-rows-${rows}`
}

/**
 * Helper function to get centered classes
 */
export function getCenteredClasses(centerX?: boolean, centerY?: boolean, center?: boolean): string[] {
  const classes: string[] = []
  
  if (center) {
    classes.push('justify-center', 'items-center')
  } else {
    if (centerX) classes.push('justify-center')
    if (centerY) classes.push('items-center')
  }
  
  return classes
}

/**
 * Export the semantic spacing mapping for external use
 */
export { spacingSemanticMap, mapSemanticSpacing }
