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
/**
 * Internal model for FzInput component (string format)
 *
 * FzInput works with strings, so we maintain a string representation
 * that gets formatted/parsed to/from the number model.
 */
const fzInputModel = ref<string | undefined>();
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

defineEmits<{
  "update:amount": [value: number | undefined];
}>();

/**
 * V-model for amount value
 *
 * Accepts number | string | undefined for retrocompatibility,
 * but always emits number | undefined.
 *
 * We use a union type for input compatibility, but internally
 * normalize to number | undefined.
 */
const model = defineModel<number | string | undefined>("amount");

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

  // Validate clipboard data availability
  if (!e.clipboardData || !e.clipboardData.getData) {
    console.warn(
      "[FzCurrencyInput] Paste event missing clipboardData. Paste operation ignored."
    );
    return;
  }

  let rawPastedText: string;
  try {
    rawPastedText = e.clipboardData.getData("text/plain");
  } catch (error) {
    console.warn("[FzCurrencyInput] Failed to read clipboard data:", error);
    return;
  }

  // Handle empty or whitespace-only pasted text
  if (!rawPastedText || !rawPastedText.trim()) {
    return;
  }

  const separatorRegex = /[,.]/g;
  const separators: string[] = [...rawPastedText.matchAll(separatorRegex)].map(
    (regexRes) => regexRes[0]
  );

  // If no separators found, treat as integer and format directly
  if (separators.length === 0) {
    try {
      const safeNum = parse(rawPastedText.trim());
      if (isNaN(safeNum) || !isFinite(safeNum)) {
        console.warn(
          `[FzCurrencyInput] Invalid number parsed from paste: "${rawPastedText.trim()}". Paste operation ignored.`
        );
        return;
      }
      const safeText = format(safeNum);
      setValue(safeText);
      emitAmount(safeNum);
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

  // case 1: there are 2 different separators pasted, therefore we can assume the rightmost is the decimal separator
  if (uniqueSeparators.size > 1) {
    decimalSeparator = separators[separators.length - 1];
    thousandSeparator = separators[0];
  }

  // case 2: there are multiple instances of the same separator, therefore it must be the thousand separator
  if (uniqueSeparators.size === 1) {
    if (separators.length > 1) {
      thousandSeparator = separators[0];
    } else {
      // case 3: there is only one instance of a separator with < 3 digits afterwards (must be decimal separator)
      const unknownSeparator = separators[0];
      const splitted = rawPastedText.split(unknownSeparator);

      // Validate that split produced at least 2 parts before accessing splitted[1]
      if (splitted.length > 1 && splitted[1].length !== 3) {
        decimalSeparator = unknownSeparator;
      }
      // If splitted[1].length === 3, it's ambiguous - use default formatting
    }
  }

  // Normalize separators: remove thousand separator and replace decimal with dot
  // Use RegExp with escaped separator instead of replaceAll() for TypeScript compatibility
  // Escape special regex characters (., *, +, ?, ^, $, {, }, (, ), |, [, ], \) to treat separator as literal string
  // This ensures that separators like "." or "," are matched literally, not as regex metacharacters
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

    // Validate parsed number
    if (isNaN(safeNum) || !isFinite(safeNum)) {
      console.warn(
        `[FzCurrencyInput] Invalid number parsed from paste: "${rawPastedText}". Normalized to "${safeText}". Paste operation ignored.`
      );
      return;
    }

    const formattedText = format(safeNum);
    setValue(formattedText);
    emitAmount(safeNum);
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
    // Initialize fzInputModel from input value or model value
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
 * Increments or decrements value by step amount
 *
 * When forceStep is true, rounds current value to nearest step before applying increment.
 * Formats result using locale settings and updates both display and model value.
 */
const stepUpDown = (amount: number) => {
  if (!props.step || props.disabled || props.readonly) {
    return;
  }
  const currentValue = normalizeModelValue(model.value) || 0;
  let stepVal = props.forceStep
    ? roundTo(props.step, currentValue)
    : currentValue;
  stepVal += amount;
  const safeText = format(stepVal);
  setValue(safeText);
  emitAmount(stepVal);
};

/**
 * Handles keyboard events on step arrows
 *
 * Supports Enter and Space keys following accessibility best practices.
 */
const handleStepKeydown = (e: KeyboardEvent, amount: number) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    stepUpDown(amount);
  }
};

/**
 * Computed property to determine if step controls are disabled
 */
const isStepDisabled = computed(() => props.disabled || props.readonly);

/**
 * Computed property for step up aria-label
 */
const stepUpAriaLabel = computed(() => {
  const stepValue = props.step || 1;
  return `Incrementa di ${stepValue}`;
});

/**
 * Computed property for step down aria-label
 */
const stepDownAriaLabel = computed(() => {
  const stepValue = props.step || 1;
  return `Decrementa di ${stepValue}`;
});

/**
 * Converts model value (number | string | undefined) to number | undefined
 *
 * Handles retrocompatibility by parsing strings to numbers.
 * Warns developers when string is provided (deprecated behavior).
 */
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
 * Watches external model changes and syncs to FzInput string format
 *
 * Converts number | string | undefined to formatted string for FzInput display.
 * Only syncs when value changes externally (not from user input via useCurrency).
 * useCurrency handles input filtering directly on the input element, so we
 * only need to sync when the model changes from outside.
 */
let isInternalUpdate = false;
watch(
  () => model.value,
  (newVal, oldVal) => {
    // Skip if this is an internal update from handleFzInputUpdate
    if (isInternalUpdate) {
      isInternalUpdate = false;
      return;
    }

    // Only sync if value changed externally
    const numValue = normalizeModelValue(newVal);
    const oldNumValue = normalizeModelValue(oldVal);

    // Skip if values are effectively the same
    if (numValue === oldNumValue) {
      return;
    }

    // Update fzInputModel and input element value
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
 * Handles FzInput model value updates
 *
 * Parses string input and syncs to number model.
 * Note: useCurrency handles input filtering directly on the input element,
 * so this mainly handles the v-model synchronization when useCurrency emits.
 */
const handleFzInputUpdate = (newVal: string | undefined) => {
  // Update fzInputModel to reflect the change
  fzInputModel.value = newVal;

  // Parse and update model only if value is meaningful
  if (newVal === undefined || newVal === null || newVal === "") {
    const currentNormalized = normalizeModelValue(model.value);
    if (currentNormalized !== undefined) {
      isInternalUpdate = true;
      model.value = undefined;
    }
    return;
  }

  const parsed = parse(newVal);
  const normalized = isNaN(parsed) ? undefined : parsed;
  const currentNormalized = normalizeModelValue(model.value);

  // Only update if value actually changed to avoid infinite loops
  if (currentNormalized !== normalized) {
    isInternalUpdate = true;
    model.value = normalized;
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
  >
    <template #right-icon v-if="step">
      <div class="flex flex-col justify-between items-center">
        <FzIcon
          name="angle-up"
          size="xs"
          role="button"
          :aria-label="stepUpAriaLabel"
          :aria-disabled="isStepDisabled ? 'true' : 'false'"
          :tabindex="isStepDisabled ? undefined : 0"
          class="fz__currencyinput__arrowup cursor-pointer"
          @click="stepUpDown(step!)"
          @keydown="(e: KeyboardEvent) => handleStepKeydown(e, step!)"
        ></FzIcon>
        <FzIcon
          name="angle-down"
          size="xs"
          role="button"
          :aria-label="stepDownAriaLabel"
          :aria-disabled="isStepDisabled ? 'true' : 'false'"
          :tabindex="isStepDisabled ? undefined : 0"
          class="fz__currencyinput__arrowdown cursor-pointer"
          @click="stepUpDown(-step!)"
          @keydown="(e: KeyboardEvent) => handleStepKeydown(e, -step!)"
        ></FzIcon>
      </div>
    </template>
    <template #label>
      <slot name="label"></slot>
    </template>
  </FzInput>
</template>
