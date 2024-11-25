<template>
  <FzInput
    ref="fzInputRef"
    v-bind="props"
    :modelValue="fzInputModel"
    type="text"
    @paste="onPaste"
  ></FzInput>
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
const props = withDefaults(defineProps<FzCurrencyInputProps>(), {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const {
  inputRef: currencyInputRef,
  setValue,
  emitAmount,
  parse,
  format,
} = useCurrency({
  minimumFractionDigits: props.minimumFractionDigits,
  maximumFractionDigits: props.maximumFractionDigits,
  min: props.min,
  max: props.max
});

defineEmits(["update:amount"]);

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault();

  if (props.readonly) {
    return;
  }

  let rawPastedText;
  if (e.clipboardData && e.clipboardData.getData) {
    rawPastedText = e.clipboardData.getData("text/plain");
  } else {
    throw "invalid paste value";
  }

  // Fix for firefox paste handling on `contenteditable` elements where `e.target` is the text node, not the element
  let eventTarget;
  if ((!e.target as any)?.tagName) {
    eventTarget = (e as any).explicitOriginalTarget;
  } else {
    eventTarget = e.target;
  }

  let isNegative = rawPastedText.slice(0, 1) === "-";
  const separatorRegex = /[,.]/g;
  const separators: string[] = [...rawPastedText.matchAll(separatorRegex)].map(
    (regexRes) => regexRes[0],
  );

  const uniqueSeparators = new Set(separators);
  let decimalSeparator = ".";
  let thousandSeparator = "";
  let unknownSeparator;

  // case 1: there are 2 different separators pasted, therefore we can assume the rightmost is the decimal separator
  if (uniqueSeparators.size > 1) {
    decimalSeparator = separators[separators.length - 1];
    thousandSeparator = separators[0];
  }

  // case 2: there are multiple instances of the same separator, therefore it must be the thousand separator
  if (uniqueSeparators.size === 1) {
    if (separators.length > 1) {
      thousandSeparator = separators[0];
    }

    // case 3: there is only one instance of a separator  with < 3 digits afterwards (must be decimal separator)
    unknownSeparator = separators[0];
    const splitted = rawPastedText.split(unknownSeparator);

    if (splitted[1].length !== 3) {
      decimalSeparator = unknownSeparator;
    }
  }

  // case 3: there is only one instance of a separator with 3 digits afterwards. Here we cannot make assumptions
  //         we will format based on settings
  //@ts-ignore
  let safeText = rawPastedText.replaceAll(thousandSeparator, "").trim();
  safeText = safeText.replaceAll(decimalSeparator, ".").trim();

  const safeNum = parse(safeText);
  safeText = format(safeNum);
  setValue(safeText);
  emitAmount(safeNum);
};

onMounted(() => {
  currencyInputRef.value = inputRef.value;
  nextTick(() => {
    fzInputModel.value = inputRef.value?.value;
  });
});
const model = defineModel("amount");

watch(model, (newVal) => {
  fzInputModel.value = newVal as string;
});

defineExpose({
  inputRef,
  containerRef,
});
</script>
