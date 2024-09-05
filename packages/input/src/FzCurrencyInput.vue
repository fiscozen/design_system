<template>
  <FzInput ref="fzInputRef" v-bind="props" type="text"></FzInput>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";
import { useCurrency } from "@fiscozen/composables";

const fzInputRef = ref<InstanceType<typeof FzInput>>();
const containerRef = computed(() => fzInputRef.value?.containerRef);
const inputRef = computed(() => fzInputRef.value?.inputRef);
const props = defineProps<FzCurrencyInputProps>();
const { inputRef: currencyInputRef } = useCurrency();

defineEmits(["update:amount"]);

onMounted(() => {
  currencyInputRef.value = inputRef.value;
});
const model = defineModel("amount");

defineExpose({
  inputRef,
  containerRef,
});
</script>
