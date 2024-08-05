import { onBeforeUnmount, onMounted, Ref } from 'vue'

function useKeyUp(callback: (event: KeyboardEvent) => void, component?: Ref<HTMLElement | undefined>) {

  if (!callback || typeof callback !== 'function') {
    throw new Error('A callback has to be provided.')
  }

  const listener = (event: KeyboardEvent) => {
    callback(event)
  }

  onMounted(() => {
    if (!component) {
      document.addEventListener('keyup', listener)
      return;
    }
    component.value!.addEventListener('keyup', listener)
  })

  onBeforeUnmount(() => {
    if (!component) {
      document.removeEventListener('keyup', listener)
      return;
    }
    component.value!.removeEventListener('keyup', listener)
  })
}

export { useKeyUp }
