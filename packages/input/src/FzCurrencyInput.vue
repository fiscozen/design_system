<template>
  <FzInput ref="fzInputRef" v-bind="props" type="text"></FzInput>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import FzInput from "./FzInput.vue";
import { FzInputProps } from "./types";
import { useCurrency } from "@fiscozen/composables";

const fzInputRef = ref();
const props = defineProps<Omit<FzInputProps, "type" | "modelValue">>();
const { inputRef } = useCurrency();

defineEmits(["update:amount"]);

onMounted(() => {
  inputRef.value = fzInputRef.value.inputRef;
});
const model = defineModel("amount");
</script>
