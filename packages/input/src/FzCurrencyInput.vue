<template>
    <FzInput
        :props
    ></FzInput>
</template>

<script>
import FzInput from './FzInput.vue'
import {FzCurrencyInputProps} from './types'

const props = withDefaults(defineProps<FzCurrencyInputProps>(), {
    decimalSeparator: ','
})
const emit = defineEmits(['input', 'focus']);
</script>