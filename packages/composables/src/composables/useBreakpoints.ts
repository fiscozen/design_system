import { computed, type ComputedRef } from 'vue'
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
    },
    /**
     * Reactive name of the largest breakpoint whose `min-width` is currently
     * matched. Descending priority with an inclusive `min-width`, giving
     * boundary-parity with a `viewportWidth >= breakpointValue` check.
     *
     * Resolution is independent of the order keys appear in `breakpoints`
     * (they are sorted ascending by pixel value first). When the viewport is
     * narrower than every defined breakpoint it falls back to the smallest one,
     * so the result is always a valid breakpoint name.
     */
    current(): ComputedRef<T> {
      const ordered = (Object.entries(breakpoints) as [T, `${number}px`][])
        .map(([name, value]) => ({ name, value: parseInt(value, 10) }))
        .sort((a, b) => a.value - b.value)

      const matchers = ordered.map(({ name, value }) => ({
        name,
        matches: useMediaQuery(`(min-width: ${value}px)`)
      }))

      return computed(() => {
        let result = ordered[0].name
        for (const { name, matches } of matchers) {
          if (matches.value) result = name
        }
        return result
      })
    }
  }
}

export { useBreakpoints }
