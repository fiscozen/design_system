<template>
  <FzInput ref="fzInputRef" v-bind="props" type="text"></FzInput>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";
import { useCurrency } from "@fiscozen/composables";

const fzInputRef = ref();
const props = defineProps<FzCurrencyInputProps>();
const { inputRef } = useCurrency();

defineEmits(["update:amount"]);

onMounted(() => {
  inputRef.value = fzInputRef.value.inputRef;
});
const model = defineModel("amount");

defineExpose({
  inputRef: fzInputRef.value?.inputRef,
  containerRef: fzInputRef.value?.containerRef,
});
</script>
