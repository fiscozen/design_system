<template>
    <FzInput
        ref="fzInputRef"
        v-bind="props"
        :model-value="model"
    ></FzInput>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import FzInput from './FzInput.vue'
import {FzInputProps} from './types'
import {useCurrency} from '@fiscozen/composables'

const fzInputRef = ref();
const props = defineProps<Omit<FzInputProps, 'type'>>();
const {inputRef} = useCurrency();

onMounted(() => {
    inputRef.value = fzInputRef.value.inputRef
})
const model = defineModel()

</script>