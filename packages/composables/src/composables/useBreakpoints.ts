import { useMediaQuery } from './useMediaQuery'

function useBreakpoints<T extends string>(breakpoints: Record<T, `${number}px`>) {
  return {
    isGreater(breakpoint: T) {
      return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`)
    },
    isSmaller(breakpoint: T) {
      return useMediaQuery(`(max-width: ${breakpoints[breakpoint]})`)
    },
    isInBetween(min: T, max: T) {
      return useMediaQuery(`(min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`)
    }
  }
}

export { useBreakpoints }
