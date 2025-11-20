<script setup lang="ts">
/**
 * FzCurrencyInput Component
 *
 * Specialized currency input built on FzInput with number formatting, validation,
 * and step controls. Formats values using Intl.NumberFormat with locale-aware separators.
 * Supports min/max constraints, step quantization, and intelligent paste parsing
 * that detects decimal/thousand separators automatically.
 *
 * @component
 * @example
 * <FzCurrencyInput label="Amount" v-model:amount="value" :min="0" :max="1000" />
 */
import { computed, nextTick, onMounted, ref, watch } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";
import { roundTo, useCurrency } from "@fiscozen/composables";
import { FzIcon } from "@fiscozen/icons";

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
  max: props.max,
  step: props.step,
});

defineEmits(["update:amount"]);

/**
 * Handles paste events with intelligent separator detection
 *
 * Parses pasted text by detecting decimal and thousand separators using heuristics:
 * - Multiple different separators: rightmost is decimal
 * - Multiple same separators: thousand separator
 * - Single separator with <3 digits after: decimal separator
 * - Single separator with 3+ digits after: ambiguous, uses default formatting
 *
 * Normalizes to dot decimal separator before parsing, then formats using locale settings.
 */
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
    (regexRes) => regexRes[0]
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
const model = defineModel<number>("amount");

/**
 * Increments or decrements value by step amount
 *
 * When forceStep is true, rounds current value to nearest step before applying increment.
 * Formats result using locale settings and updates both display and model value.
 */
const stepUpDown = (amount: number) => {
  if (!props.step) {
    return;
  }
  const value = model.value || 0;
  let stepVal = props.forceStep ? roundTo(props.step, value) : value;
  stepVal += amount;
  const safeText = format(stepVal);
  setValue(safeText);
  emitAmount(stepVal);
};

watch(model, (newVal) => {
  fzInputModel.value = newVal;
});

defineExpose({
  inputRef,
  containerRef,
});
</script>

<template>
  <FzInput
    ref="fzInputRef"
    v-bind="props"
    :modelValue="fzInputModel"
    type="text"
    @paste="onPaste"
  >
    <template #right-icon v-if="step">
      <div class="flex flex-col justify-between items-center">
        <FzIcon
          name="angle-up"
          size="xs"
          class="fz__currencyinput__arrowup cursor-pointer"
          @click="stepUpDown(step)"
        ></FzIcon>
        <FzIcon
          name="angle-down"
          size="xs"
          class="fz__currencyinput__arrowdown cursor-pointer"
          @click="stepUpDown(-step)"
        ></FzIcon>
      </div>
    </template>
    <template #label>
      <slot name="label"></slot>
    </template>
  </FzInput>
</template>
