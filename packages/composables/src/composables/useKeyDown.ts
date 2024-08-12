import { onBeforeUnmount, onMounted, Ref } from 'vue'

function useKeyDown(
  component: Ref<HTMLElement | undefined>,
  callback: (event: KeyboardEvent) => void
) {
  // fail early if any of the required params is missing
  if (!component) {
    throw new Error('A target component has to be provided.')
  }

  if (!callback || typeof callback !== 'function') {
    throw new Error('A callback has to be provided.')
  }

  const listener = (event: KeyboardEvent) => {
    callback(event)
  }

  onMounted(() => {
    component.value!.addEventListener('keydown', listener)
  })

  onBeforeUnmount(() => {
    component.value!.removeEventListener('keydown', listener)
  })
}

export { useKeyDown }
