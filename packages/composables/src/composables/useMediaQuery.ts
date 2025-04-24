import { Ref, onMounted, onUnmounted, ref, computed } from 'vue'

function useMediaQuery(mediaQuery: string): Ref<boolean> {
  const mediaQueryList = window.matchMedia(mediaQuery)
  const matches = ref(mediaQueryList.matches)

  function handleChange(event: MediaQueryListEvent) {
    matches.value = event.matches
  }

  onMounted(() => {
    mediaQueryList.addEventListener('change', handleChange)
  })

  onUnmounted(() => {
    mediaQueryList.removeEventListener('change', handleChange)
  })

  return computed(() => matches.value)
}

export { useMediaQuery }
