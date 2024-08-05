import { onBeforeUnmount, onMounted, Ref } from 'vue'

function useClickOutside(
  component: Ref<HTMLElement | undefined>, 
  callback: () => void,
  elementToListenClicksOn?: Ref<HTMLElement | undefined>,
) {
  // fail early if any of the required params is missing
  if (!component) {
    throw new Error('A target component has to be provided.')
  }

  if (!callback) {
    throw new Error('A callback has to be provided.')
  }

  const listener = (event: MouseEvent) => {
    if (
      !component.value ||
      event.target === component.value ||
      event.composedPath().includes(component.value)
    ) {
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  }

  onMounted(() => {
    (elementToListenClicksOn ?? component).value!.addEventListener('click', listener)
  })

  onBeforeUnmount(() => {
    (elementToListenClicksOn ?? component).value!.removeEventListener('click', listener)
  })
}

export { useClickOutside }
