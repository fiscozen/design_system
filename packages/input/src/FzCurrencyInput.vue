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
 * <FzCurrencyInput label="Amount" v-model="value" :min="0" :max="1000" />
 */
import { computed, nextTick, onMounted, ref, watch } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";
import { roundTo, useCurrency } from "@fiscozen/composables";
import { FzIcon } from "@fiscozen/icons";

const fzInputRef = ref<InstanceType<typeof FzInput>>();
const fzInputModel = ref<string | undefined>();
const containerRef = computed(() => fzInputRef.value?.containerRef);
const inputRef = computed(() => fzInputRef.value?.inputRef);
const props = withDefaults(defineProps<FzCurrencyInputProps>(), {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  step: 1,
});
const {
  inputRef: currencyInputRef,
  setValue,
  parse,
  format,
} = useCurrency({
  minimumFractionDigits: props.minimumFractionDigits,
  maximumFractionDigits: props.maximumFractionDigits,
  min: props.min,
  max: props.max,
  step: props.step,
});

const model = defineModel<FzCurrencyInputProps["modelValue"]>();

let isInternalUpdate = false;
let pendingInternalUpdateReset = false;

/**
 * Safely resets the internal update flag after all queued watch callbacks complete.
 *
 * Uses nextTick to ensure all watch callbacks queued in the current tick can see
 * the flag as true before it's reset, preventing race conditions with rapid updates.
 */
const resetInternalUpdateFlag = () => {
  if (pendingInternalUpdateReset) {
    return; // Already scheduled
  }
  pendingInternalUpdateReset = true;
  nextTick(() => {
    isInternalUpdate = false;
    pendingInternalUpdateReset = false;
  });
};

/**
 * Parses pasted text with automatic separator detection
 *
 * Only prevents default paste behavior if we can handle it.
 * If clipboardData is unavailable, allows default browser paste to proceed.
 */
const onPaste = (e: ClipboardEvent) => {
  if (props.readonly) {
    return;
  }

  if (!e.clipboardData?.getData) {
    // Allow default paste behavior if clipboardData is unavailable
    // This prevents blocking legitimate paste operations in edge cases
    return;
  }

  // Only prevent default if we can handle the paste
  e.preventDefault();

  let rawPastedText: string;
  try {
    rawPastedText = e.clipboardData.getData("text/plain");
  } catch (error) {
    console.warn("[FzCurrencyInput] Failed to read clipboard data:", error);
    return;
  }

  if (!rawPastedText?.trim()) {
    return;
  }

  const separatorRegex = /[,.]/g;
  const separators: string[] = [...rawPastedText.matchAll(separatorRegex)].map(
    (regexRes) => regexRes[0]
  );

  if (separators.length === 0) {
    try {
      const safeText = rawPastedText.trim();
      const safeNum = parse(safeText);
      if (isNaN(safeNum) || !isFinite(safeNum)) {
        console.warn(
          `[FzCurrencyInput] Invalid number parsed from paste: "${safeText}". Paste operation ignored.`
        );
        return;
      }
      const formattedText = format(safeNum);
      setValue(formattedText);
      isInternalUpdate = true;
      const finalValue = props.nullOnEmpty && !safeText ? undefined : safeNum;
      model.value = finalValue;
      fzInputModel.value = formattedText;
      resetInternalUpdateFlag();
    } catch (error) {
      console.warn(
        `[FzCurrencyInput] Error parsing pasted value "${rawPastedText.trim()}":`,
        error
      );
    }
    return;
  }

  const uniqueSeparators = new Set(separators);
  let decimalSeparator = ".";
  let thousandSeparator = "";

  if (uniqueSeparators.size > 1) {
    decimalSeparator = separators[separators.length - 1];
    thousandSeparator = separators[0];
  }

  if (uniqueSeparators.size === 1) {
    if (separators.length > 1) {
      thousandSeparator = separators[0];
    } else {
      const unknownSeparator = separators[0];
      const splitted = rawPastedText.split(unknownSeparator);
      if (splitted.length > 1 && splitted[1].length !== 3) {
        decimalSeparator = unknownSeparator;
      }
    }
  }
  let safeText = rawPastedText
    .replace(
      new RegExp(thousandSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      ""
    )
    .trim();
  safeText = safeText
    .replace(
      new RegExp(decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      "."
    )
    .trim();

  try {
    const safeNum = parse(safeText);
    if (isNaN(safeNum) || !isFinite(safeNum)) {
      console.warn(
        `[FzCurrencyInput] Invalid number parsed from paste: "${rawPastedText}". Normalized to "${safeText}". Paste operation ignored.`
      );
      return;
    }

    const formattedText = format(safeNum);
    setValue(formattedText);
    isInternalUpdate = true;
    const finalValue = props.nullOnEmpty && !safeText ? undefined : safeNum;
    model.value = finalValue;
    fzInputModel.value = formattedText;
    resetInternalUpdateFlag();
  } catch (error) {
    console.warn(
      `[FzCurrencyInput] Error processing pasted value "${rawPastedText}":`,
      error
    );
  }
};

onMounted(() => {
  currencyInputRef.value = inputRef.value;
  nextTick(() => {
    if (inputRef.value?.value) {
      fzInputModel.value = inputRef.value.value;
    } else if (model.value !== undefined) {
      const numValue = normalizeModelValue(model.value);
      fzInputModel.value =
        numValue !== undefined ? format(numValue) : undefined;
    }
  });
});

/**
 * Adjusts value by step amount
 *
 * When forceStep is true, adds the step amount first, then rounds to nearest step multiple.
 * This ensures the result is always a valid step multiple.
 */
const stepUpDown = (amount: number) => {
  if (props.disabled || props.readonly) {
    return;
  }
  const currentValue = normalizeModelValue(model.value) || 0;
  let stepVal = currentValue + amount;

  // If forceStep is true, round to nearest step multiple after adding the step
  if (props.forceStep && props.step) {
    stepVal = roundTo(props.step, stepVal);
  }

  // Apply min/max constraints
  if (props.min !== undefined && props.min > stepVal) {
    stepVal = props.min;
  }
  if (props.max !== undefined && props.max < stepVal) {
    stepVal = props.max;
  }

  const safeText = format(stepVal);
  setValue(safeText);
  isInternalUpdate = true;
  model.value = stepVal;
  fzInputModel.value = safeText;
  resetInternalUpdateFlag();
};

/**
 * Handles step button click events
 *
 * Prevents event propagation and default behavior when disabled/readonly
 * to avoid interfering with parent component event handlers.
 */
const handleStepClick = (e: MouseEvent, amount: number) => {
  if (props.disabled || props.readonly) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  stepUpDown(amount);
};

const handleStepKeydown = (e: KeyboardEvent, amount: number) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    stepUpDown(amount);
  }
};

const isStepDisabled = computed(() => props.disabled || props.readonly);

const stepUpAriaLabel = computed(() => {
  return props.stepUpAriaLabel || `Incrementa di ${props.step}`;
});

const stepDownAriaLabel = computed(() => {
  return props.stepDownAriaLabel || `Decrementa di ${props.step}`;
});

const normalizeModelValue = (
  value: number | string | undefined
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    console.warn(
      "[FzCurrencyInput] String values in v-model are deprecated. Please use number instead. " +
        `Received: "${value}". This will be parsed to a number for retrocompatibility, but string support may be removed in a future version.`
    );
    const parsed = parse(value);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

/**
 * Syncs external model changes to FzInput string format
 *
 * Skips internal updates to avoid loops. Uses nextTick to reset the flag
 * after all queued watch callbacks complete, preventing race conditions
 * with rapid external updates.
 */
watch(
  () => model.value,
  (newVal, oldVal) => {
    if (isInternalUpdate) {
      resetInternalUpdateFlag();
      return;
    }

    const numValue = normalizeModelValue(newVal);
    const oldNumValue = normalizeModelValue(oldVal);
    if (numValue === oldNumValue) {
      return;
    }
    if (numValue === undefined) {
      fzInputModel.value = undefined;
      if (inputRef.value) {
        inputRef.value.value = "";
      }
    } else {
      const formatted = format(numValue);
      fzInputModel.value = formatted;
      if (inputRef.value) {
        inputRef.value.value = formatted;
      }
    }
  }
);

/**
 * Syncs FzInput string updates to number model
 *
 * Sets isInternalUpdate flag to prevent watch loop.
 * Applies min/max constraints during input, but not forceStep (applied on blur).
 */
const handleFzInputUpdate = (newVal: string | undefined) => {
  fzInputModel.value = newVal;

  if (!newVal?.trim()) {
    const currentNormalized = normalizeModelValue(model.value);
    if (currentNormalized !== undefined) {
      isInternalUpdate = true;
      // Respect nullOnEmpty prop: emit undefined if true, 0 if false
      model.value = props.nullOnEmpty ? undefined : 0;
      resetInternalUpdateFlag();
    }
    return;
  }

  const parsed = parse(newVal);
  let normalized = isNaN(parsed) ? undefined : parsed;

  // Apply min/max constraints during input (but not forceStep - that's applied on blur)
  if (normalized !== undefined) {
    if (props.min !== undefined && props.min > normalized) {
      normalized = props.min;
    }
    if (props.max !== undefined && props.max < normalized) {
      normalized = props.max;
    }
  }

  const currentNormalized = normalizeModelValue(model.value);

  if (currentNormalized !== normalized) {
    isInternalUpdate = true;
    model.value = normalized;
    resetInternalUpdateFlag();
  }
};

/**
 * Handles blur event to apply forceStep rounding and final validation
 *
 * When forceStep is true, rounds the value to the nearest step multiple.
 * Also applies min/max constraints if needed.
 */
const handleBlur = () => {
  if (props.readonly || props.disabled) {
    return;
  }

  const currentValue = normalizeModelValue(model.value);
  if (currentValue === undefined) {
    return;
  }

  let finalValue = currentValue;

  // Apply forceStep rounding on blur
  if (props.forceStep && props.step) {
    finalValue = roundTo(props.step, finalValue);
  }

  // Apply min/max constraints
  if (props.min !== undefined && props.min > finalValue) {
    finalValue = props.min;
  }
  if (props.max !== undefined && props.max < finalValue) {
    finalValue = props.max;
  }

  // Only update if value changed
  if (finalValue !== currentValue) {
    const formatted = format(finalValue);
    isInternalUpdate = true;
    model.value = finalValue;
    fzInputModel.value = formatted;
    if (inputRef.value) {
      inputRef.value.value = formatted;
    }
    resetInternalUpdateFlag();
  }
};

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
    @update:modelValue="handleFzInputUpdate"
    @paste="onPaste"
    @blur="handleBlur"
  >
    <template #right-icon>
      <div class="flex items-center gap-4">
        <FzIcon
          v-if="props.valid"
          name="check"
          size="md"
          class="text-semantic-success"
          aria-hidden="true"
        />
        <div class="flex flex-col justify-between items-center">
          <FzIcon
            name="angle-up"
            size="xs"
            role="button"
            :aria-label="stepUpAriaLabel"
            :aria-disabled="isStepDisabled ? 'true' : 'false'"
            :tabindex="isStepDisabled ? undefined : 0"
            class="fz__currencyinput__arrowup cursor-pointer"
            @click="(e: MouseEvent) => handleStepClick(e, props.step)"
            @keydown="(e: KeyboardEvent) => handleStepKeydown(e, props.step)"
          ></FzIcon>
          <FzIcon
            name="angle-down"
            size="xs"
            role="button"
            :aria-label="stepDownAriaLabel"
            :aria-disabled="isStepDisabled ? 'true' : 'false'"
            :tabindex="isStepDisabled ? undefined : 0"
            class="fz__currencyinput__arrowdown cursor-pointer"
            @click="(e: MouseEvent) => handleStepClick(e, -props.step)"
            @keydown="(e: KeyboardEvent) => handleStepKeydown(e, -props.step)"
          ></FzIcon>
        </div>
      </div>
    </template>
    <template #label>
      <slot name="label"></slot>
    </template>
  </FzInput>
</template>
