import {Ref, watch, getCurrentInstance, computed, ref, nextTick} from 'vue' 

export const useCurrency = () => {
    const inputRef: Ref<HTMLInputElement|null> = ref(null)
    const vm = getCurrentInstance()

    const computedModel = computed<number|string|undefined>(() => vm?.props.amount as unknown as number|undefined)
    const internalVal = ref<number|string>()

    const format = (input: number|string) => {
        return input.toLocaleString('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: false
        })
    }

    const parse = (text: string) => {
        // strip currency, handle edge cases...
        return parseFloat(text.replace(/,/g,"."))
    }

    const emitAmount = (val: number) => {
        if (Number.isNaN(val)) {
            return;
        }
        if (vm) {
            internalVal.value = val
            vm.emit('update:amount', typeof computedModel.value === 'number' ? val : val.toString()) 
        }
    }

    const setValue = (val: string) => {
        // nextTick doesn't seem to work
        setTimeout(() => {
            if (!inputRef.value) {
                return
            }
            inputRef.value.value = val;
        }, 0)
    }

    const onInput = (el: HTMLInputElement) => (e: Event) => {
        if (!inputRef.value || !e.target) {
            return
        }
        let {value} = el;
        value = value.replace(/[^0-9,.]/g, '')
        setValue(value)
        const number = parse(value)
        emitAmount(Number.isNaN(number) ? 0 : number)
    }

    const onBlur = (e: FocusEvent) => {
        if (!inputRef.value || !e.target) {
            return
        }
        let number = parse((e.target as HTMLInputElement).value)
        if (Number.isNaN(number)) {
            number = 0;
        } 
        const text = format(number)
        setValue(text)
        emitAmount(parse(text))
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

    watch(computedModel, (newVal) => {
        nextTick(() => {
            if (!inputRef.value || !newVal) {
                return
            }
            // we need to format here only if someone externally set the
            // value of the amount model
            if (internalVal.value !== newVal) {
                const formatted = format(newVal)
                inputRef.value.value = formatted
                internalVal.value = newVal
            }
        })
    })


    return {
        inputRef,
        parse,
        format,
        emitAmount,
        setValue
    }
}