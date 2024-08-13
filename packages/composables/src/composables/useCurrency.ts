import {Ref, watch, getCurrentInstance, computed, ref} from 'vue' 

export const useCurrency = () => {
    const inputRef: Ref<HTMLInputElement|null> = ref(null)
    const vm = getCurrentInstance()

    const modelValue = computed(() => vm?.props.modelValue)

    const format = (input: number) => {
        return input.toLocaleString('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    const parse = (text: string) => {
        // strip currency, handle edge cases...
        return parseFloat(text)
    }

    const setValue = (val: number) => {
        if (Number.isNaN(val)) {
            return;
        }

        vm && vm.emit('update:modelValue', val)
    }

    const onInput = (el: HTMLInputElement) => (e: Event) => {
        const {value} = el;
        const number = parse(value)
        setValue(number)
    }

    const onBlur = (e: FocusEvent) => {
        if (!inputRef.value || !e.target) {
            return
        }
        const number = parse((e.target as HTMLInputElement).value.replace(/,/g,"."))
        const text = format(number)

        inputRef.value.value = text;
        setValue(modelValue.value as number)
    }

    watch(inputRef, (newVal, oldVal) => {
        if(!newVal) {
            return
        }

        if (oldVal) {
            oldVal?.removeEventListener('input', onInput(newVal))
            oldVal?.removeEventListener('blur', onBlur)
        }
        newVal.addEventListener('input', onInput(newVal))
        newVal.addEventListener('blur', onBlur)

    })


    return {
        inputRef,
        parse,
        format,
        setValue
    }
}