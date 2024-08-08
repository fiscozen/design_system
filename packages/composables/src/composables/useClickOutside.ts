import { onBeforeUnmount, onMounted, Ref, watch } from 'vue'

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

  if (elementToListenClicksOn) {
    watch(elementToListenClicksOn, (newVal: HTMLElement | undefined, oldVal: HTMLElement | undefined) => {
      if (oldVal) {
        oldVal.removeEventListener('click', listener)
      }
      newVal?.addEventListener('click', listener)
    });
  }

  onMounted(() => {
    if (!elementToListenClicksOn) {
      document.addEventListener('click', listener)
    }
  })

  onBeforeUnmount(() => {
    if (elementToListenClicksOn) {
      elementToListenClicksOn.value!.removeEventListener('click', listener)
      return;
    }
    document.removeEventListener('click', listener)
  })
}

export { useClickOutside }
