import { Ref, watch, getCurrentInstance, computed, ref, onMounted } from 'vue'

export const useCurrency = () => {
  const inputRef: Ref<HTMLInputElement | null> = ref(null)
  const vm = getCurrentInstance()

  const modelValue = computed<number | undefined>(
    () => vm?.props.modelValue as unknown as number | undefined
  )

  const format = (input: number | null) => {
    if (input === null) {
      return '';
    }
    return input.toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const parse = (text: string) => {
    // strip currency, handle edge cases...
    return parseFloat(text)
  }

  const setValue = (val: number | null) => {
    if (Number.isNaN(val)) {
      return
    }

    vm && vm.emit('update:modelValue', val)
  }

  const onInput = (el: HTMLInputElement) => (e: Event) => {
    if (!inputRef.value || !e.target) {
      return
    }
    let { value } = el
    value = value.replace(/[^0-9,.]/g, '')
    inputRef.value.value = value
    const numberValue = (vm?.props.nullOnEmpty && value === '') ? null : parse(value)
    setValue(Number.isNaN(numberValue) ? 0 : numberValue)
  }

  const onBlur = (e: FocusEvent) => {
    if (!inputRef.value || !e.target) {
      return
    }
    let rawValue = (e.target as HTMLInputElement).value.replace(/,/g, '.');
    let number: number | null;

    if (rawValue === '' && vm?.props.nullOnEmpty) {
      number = null
    }
    else {
      number = parse(rawValue)
      if (Number.isNaN(number)) {
        number = 0
      }
    }
    const text = format(number)

    inputRef.value.value = text
    setValue(number)
  }

  watch(inputRef, (newVal, oldVal) => {
    if (!newVal) {
      return
    }

    if (oldVal) {
      oldVal?.removeEventListener('input', onInput(newVal))
      oldVal?.removeEventListener('blur', onBlur)
    }
    newVal.addEventListener('input', onInput(newVal))
    newVal.addEventListener('blur', onBlur)

    if (modelValue.value) {
      newVal.value = format(modelValue.value)
    }
  })

  return {
    inputRef,
    parse,
    format,
    setValue
  }
}
