<template>
  <FzInput ref="fzInputRef" v-bind="props" :modelValue="fzInputModel" type="text"></FzInput>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";
import { useCurrency } from "@fiscozen/composables";

const fzInputRef = ref<InstanceType<typeof FzInput>>();
const fzInputModel = ref();
const containerRef = computed(() => fzInputRef.value?.containerRef);
const inputRef = computed(() => fzInputRef.value?.inputRef);
const props = defineProps<FzCurrencyInputProps>();
const { inputRef: currencyInputRef } = useCurrency();

defineEmits(["update:amount"]);

onMounted(() => {
  currencyInputRef.value = inputRef.value;
  nextTick(() => {
    fzInputModel.value = inputRef.value?.value;
  })
});
const model = defineModel("amount");

watch(model, (newVal) => {
  fzInputModel.value = newVal as string
})

defineExpose({
  inputRef,
  containerRef,
});
</script>
