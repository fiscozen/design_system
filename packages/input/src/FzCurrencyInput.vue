<script setup lang="ts">
/**
 * FzCurrencyInput Component
 *
 * Specialized currency input built on FzInput with number formatting, validation,
 * and step controls. Formats values using Intl.NumberFormat with locale-aware separators.
 * Supports min/max constraints and step quantization
 * that detects decimal/thousand separators automatically.
 *
 * @component
 * @example
 * <FzCurrencyInput label="Amount" v-model="value" :min="0" :max="1000" />
 */
import { computed, nextTick, onMounted, ref, watch } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";
import {
  clamp,
  format as formatValue,
  parse,
  roundTo,
  truncateDecimals,
} from "@fiscozen/composables";
import { FzIcon } from "@fiscozen/icons";

const fzInputRef = ref<InstanceType<typeof FzInput>>();

const fzInputModel = ref<string | undefined>();

const containerRef = computed(() => fzInputRef.value?.containerRef);

const inputRef = computed(() => fzInputRef.value?.inputRef);

const isFocused = ref(false);

const props = withDefaults(defineProps<FzCurrencyInputProps>(), {
  min: -Infinity,
  minimumFractionDigits: 2,
  max: Infinity,
  maximumFractionDigits: 2,
  step: 1,
});

const model = defineModel<FzCurrencyInputProps["modelValue"]>();

let isInternalUpdate = false;

/**
 * Determines the value to emit when input is empty based on nullOnEmpty and zeroOnEmpty props
 *
 * Priority: nullOnEmpty > zeroOnEmpty > undefined
 *
 * @returns null if nullOnEmpty is true, 0 if zeroOnEmpty is true, undefined otherwise
 */
const getEmptyValue = (): number | null | undefined => {
  if (props.nullOnEmpty) {
    return null;
  }
  if (props.zeroOnEmpty) {
    return 0;
  }
  return undefined;
};

/**
 * Computed aria-label for step up button
 *
 * Uses custom stepUpAriaLabel if provided, otherwise generates default label based on step value.
 */
const stepUpAriaLabel = computed(() => {
  if (props.stepUpAriaLabel) {
    return props.stepUpAriaLabel;
  }
  return `Incrementa di ${props.step}`;
});

/**
 * Computed aria-label for step down button
 *
 * Uses custom stepDownAriaLabel if provided, otherwise generates default label based on step value.
 */
const stepDownAriaLabel = computed(() => {
  if (props.stepDownAriaLabel) {
    return props.stepDownAriaLabel;
  }
  return `Decrementa di ${props.step}`;
});

/**
 * Computed disabled state for step controls
 *
 * Step controls are disabled when input is readonly or disabled.
 */
const isStepDisabled = computed(() => {
  return props.readonly || props.disabled;
});

/**
 * Validates and normalizes user input
 *
 * Allows only digits, "." and ",". Converts "." to ",".
 * Allows minus sign only at the beginning for negative values.
 * Handles double comma case: "123,45" -> "12,3,45" -> "12,34"
 * (keeps only the first comma, everything after becomes decimal part)
 *
 * @param inputValue - Raw input value from user
 * @returns Normalized value with only one comma and optional leading minus sign
 */
const normalizeInput = (inputValue: string): string => {
  // Allow only digits, "." "," and "-"
  let filtered = inputValue.replace(/[^0-9.,-]/g, "");

  // Check if minus sign is at the beginning (after removing invalid chars)
  const hasLeadingMinus = filtered.startsWith("-");

  // Remove all minus signs (we'll reattach only one at the beginning if needed)
  filtered = filtered.replace(/-/g, "");

  // Convert "." to ","
  filtered = filtered.replace(/\./g, ",");

  // Handle multiple commas: keep only the first one
  const firstCommaIndex = filtered.indexOf(",");
  if (firstCommaIndex !== -1) {
    // Keep everything before first comma + first comma + everything after first comma (remove other commas)
    const beforeComma = filtered.substring(0, firstCommaIndex);
    const afterComma = filtered
      .substring(firstCommaIndex + 1)
      .replace(/,/g, "");
    filtered = beforeComma + "," + afterComma;
  }

  // Reattach minus sign at the beginning if it was present at the start
  return hasLeadingMinus ? "-" + filtered : filtered;
};

/**
 * Prevents invalid characters from being typed
 *
 * Allows only digits, "." and ",". Allows minus sign only at the beginning.
 * Blocks all other characters.
 * Also allows control keys (Backspace, Delete, Arrow keys, Tab, etc.)
 * Multiple commas are handled by normalizeInput.
 *
 * @param e - Keyboard event
 */
const handleKeydown = (e: KeyboardEvent) => {
  // Allow control keys (Backspace, Delete, Arrow keys, Tab, etc.)
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Enter",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    return;
  }

  // Allow minus sign only at the beginning (position 0) or when entire value is selected
  if (e.key === "-") {
    const target = e.target as HTMLInputElement;
    const cursorPosition = target.selectionStart ?? 0;
    const selectionLength = (target.selectionEnd ?? 0) - cursorPosition;
    const valueLength = target.value.length;

    // Allow minus if:
    // 1. Cursor is at position 0 (beginning)
    // 2. Entire value is selected (user can replace with negative)
    if (cursorPosition !== 0 && selectionLength !== valueLength) {
      e.preventDefault();
    }
    return;
  }

  // Allow only digits, "." and ","
  if (!/^[0-9.,]$/.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Handles paste event to replace entire input value
 *
 * Prevents default paste behavior and replaces the entire input value with the pasted content.
 * Uses parse() to handle Italian format (e.g., "1.234,56"). If the pasted text is not a valid number,
 * the paste is ignored.
 */
const handlePaste = (e: ClipboardEvent) => {
  if (props.readonly || props.disabled) {
    return;
  }

  e.preventDefault();

  const pastedText = e.clipboardData?.getData("text") || "";
  if (!pastedText) {
    return;
  }

  // Use parse() to convert Italian format to number
  const parsed = parse(pastedText);

  if (!isNaN(parsed) && isFinite(parsed)) {
    // Truncate decimals to maximumFractionDigits
    const processed = truncateDecimals(parsed, props.maximumFractionDigits);

    // Update v-model
    isInternalUpdate = true;
    model.value = processed;
    isInternalUpdate = false;

    // Convert number to normalized string format for display (e.g., 1234.56 -> "1234,56")
    const numberString = String(processed);
    const normalized = normalizeInput(numberString);
    fzInputModel.value = normalized;
  }
  // If invalid, ignore paste (do nothing)
};

/**
 * Handles input updates from FzInput
 *
 * Validates and normalizes input, updates v-model with parsed number.
 * Does NOT format the display value - shows raw input (e.g., "123" stays "123", not "123,00").
 * Does NOT apply step quantization - quantization happens only on blur.
 * Formatting and quantization happen only on blur.
 */
const handleInputUpdate = (newValue: string | undefined) => {
  if (!newValue) {
    fzInputModel.value = "";
    isInternalUpdate = true;
    model.value = getEmptyValue();
    isInternalUpdate = false;
    return;
  }

  const normalized = normalizeInput(newValue);
  fzInputModel.value = normalized;

  // Parse to number and update v-model (but don't format display - keep raw)
  const parsed = parse(normalized);
  if (!isNaN(parsed) && isFinite(parsed)) {
    // Truncate decimals to maximumFractionDigits before updating v-model
    const processed = truncateDecimals(parsed, props.maximumFractionDigits);

    isInternalUpdate = true;
    model.value = processed;
    isInternalUpdate = false;
  } else {
    // If invalid, keep the normalized string but don't update v-model
    isInternalUpdate = true;
    model.value = getEmptyValue();
    isInternalUpdate = false;
  }
};

/**
 * Handles blur event to format the value
 *
 * Formats the value to Italian format (e.g., "123" -> "123,00", "123,4" -> "123,40").
 * Applies step quantization if forceStep is enabled (quantization happens only on blur, not during typing).
 */
const handleBlur = () => {
  if (props.readonly || props.disabled) {
    return;
  }

  isFocused.value = false;

  const currentValue = normalizeModelValue(model.value);
  if (currentValue === undefined || currentValue === null) {
    fzInputModel.value = "";
    // Ensure v-model matches the expected empty value based on nullOnEmpty/zeroOnEmpty
    const expectedEmptyValue = getEmptyValue();
    if (model.value !== expectedEmptyValue) {
      isInternalUpdate = true;
      model.value = expectedEmptyValue;
      isInternalUpdate = false;
    }
    return;
  }

  // Apply step quantization if forceStep is enabled
  let processed = currentValue;
  if (props.forceStep) {
    processed = roundTo(props.step, processed);
  }

  // Apply min/max constraints
  processed = clamp(props.min, processed, props.max);

  // Update v-model if processed value differs
  if (processed !== currentValue) {
    isInternalUpdate = true;
    model.value = processed;
    isInternalUpdate = false;
  }

  // Format the value for display
  const formatted = formatValue(processed, {
    minimumFractionDigits: props.minimumFractionDigits,
    maximumFractionDigits: props.maximumFractionDigits,
    roundDecimals: false,
    useGrouping: true,
  });
  fzInputModel.value = formatted;
};

/**
 * Handles focus event
 *
 * When input gains focus, shows raw value (without formatting)
 */
const handleFocus = () => {
  if (props.readonly || props.disabled) {
    return;
  }

  isFocused.value = true;

  // Convert formatted value back to raw for editing
  const currentValue = normalizeModelValue(model.value);
  if (currentValue !== undefined) {
    // Get raw value from formatted: remove thousand separators, keep decimal separator
    const formatted = formatValue(currentValue, {
      minimumFractionDigits: props.minimumFractionDigits,
      maximumFractionDigits: props.maximumFractionDigits,
      roundDecimals: false,
      useGrouping: true,
    });
    const rawValue = formatted.replace(/\./g, ""); // Remove thousand separators
    fzInputModel.value = rawValue;
  }
};

/**
 * Normalizes model value to number | undefined | null
 *
 * Converts string values to numbers (with deprecation warning) and handles
 * null/undefined/empty string cases.
 *
 * @param value - Input value (number, string, undefined, or null)
 * @returns Normalized number value, undefined, or null
 */
const normalizeModelValue = (
  value: number | string | undefined | null
): number | undefined | null => {
  if (value === undefined || value === null || value === "") {
    return value === null ? null : undefined;
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
 * Handles step up button click
 *
 * Increments the current value by step amount, applying truncation and clamping.
 */
const handleStepUp = () => {
  if (props.readonly || props.disabled) {
    return;
  }

  const currentValue = normalizeModelValue(model.value);
  // If value is undefined/null, start from 0 or empty value based on props
  const baseValue =
    currentValue === undefined || currentValue === null ? 0 : currentValue;

  // Add step
  const newValue = baseValue + props.step;

  // Truncate decimals
  const truncated = truncateDecimals(newValue, props.maximumFractionDigits);

  // Apply min/max constraints
  const clamped = clamp(props.min, truncated, props.max);

  // Update v-model
  isInternalUpdate = true;
  model.value = clamped;
  isInternalUpdate = false;

  // Format and update display
  const formatted = formatValue(clamped, {
    minimumFractionDigits: props.minimumFractionDigits,
    maximumFractionDigits: props.maximumFractionDigits,
    roundDecimals: false,
    useGrouping: true,
  });
  fzInputModel.value = formatted;
};

/**
 * Handles step down button click
 *
 * Decrements the current value by step amount, applying truncation and clamping.
 */
const handleStepDown = () => {
  if (props.readonly || props.disabled) {
    return;
  }

  const currentValue = normalizeModelValue(model.value);
  // If value is undefined/null, start from 0 or empty value based on props
  const baseValue =
    currentValue === undefined || currentValue === null ? 0 : currentValue;

  // Subtract step
  const newValue = baseValue - props.step;

  // Truncate decimals
  const truncated = truncateDecimals(newValue, props.maximumFractionDigits);

  // Apply min/max constraints
  const clamped = clamp(props.min, truncated, props.max);

  // Update v-model
  isInternalUpdate = true;
  model.value = clamped;
  isInternalUpdate = false;

  // Format and update display
  const formatted = formatValue(clamped, {
    minimumFractionDigits: props.minimumFractionDigits,
    maximumFractionDigits: props.maximumFractionDigits,
    roundDecimals: false,
    useGrouping: true,
  });
  fzInputModel.value = formatted;
};

/**
 * Initializes fzInputModel with the value from v-model on mount
 *
 * Formats the value only if not focused (formatted display).
 */
onMounted(() => {
  const initialValue = model.value;

  if (initialValue === undefined || initialValue === null) {
    fzInputModel.value = "";
    // Ensure v-model matches the expected empty value based on nullOnEmpty/zeroOnEmpty
    const expectedEmptyValue = getEmptyValue();
    if (initialValue !== expectedEmptyValue) {
      isInternalUpdate = true;
      model.value = expectedEmptyValue;
      isInternalUpdate = false;
    }
    return;
  }

  if (typeof initialValue === "number") {
    // Truncate decimals to maximumFractionDigits before updating v-model
    let processed = truncateDecimals(initialValue, props.maximumFractionDigits);

    // Apply step quantization if forceStep is enabled
    if (props.forceStep) {
      processed = roundTo(props.step, processed);
    }

    // Apply min/max constraints
    processed = clamp(props.min, processed, props.max);

    // Update v-model if processed value differs (to ensure v-model always respects max decimals and step quantization)
    if (processed !== initialValue) {
      isInternalUpdate = true;
      model.value = processed;
      isInternalUpdate = false;
    }

    // Format number to Italian format (comma as decimal separator)
    const formatted = formatValue(processed, {
      minimumFractionDigits: props.minimumFractionDigits,
      maximumFractionDigits: props.maximumFractionDigits,
      roundDecimals: false,
      useGrouping: true,
    });
    fzInputModel.value = formatted;
    return;
  }

  if (typeof initialValue === "string") {
    // Normalize string value (handles Italian format: "1.234,56" and shows deprecation warning)
    const normalized = normalizeModelValue(initialValue);
    if (normalized !== undefined && normalized !== null) {
      const parsed = normalized;
      // Truncate decimals to maximumFractionDigits before updating v-model
      let processed = truncateDecimals(parsed, props.maximumFractionDigits);

      // Apply step quantization if forceStep is enabled
      if (props.forceStep) {
        processed = roundTo(props.step, processed);
      }

      // Apply min/max constraints
      processed = clamp(props.min, processed, props.max);

      // Update v-model to number (this will trigger watch, but will be handled as number)
      isInternalUpdate = true;
      model.value = processed;
      isInternalUpdate = false;
      // Format and display
      const formatted = formatValue(processed, {
        minimumFractionDigits: props.minimumFractionDigits,
        maximumFractionDigits: props.maximumFractionDigits,
        roundDecimals: false,
        useGrouping: true,
      });
      fzInputModel.value = formatted;
    } else {
      // Invalid string, clear input
      fzInputModel.value = "";
      isInternalUpdate = true;
      model.value = getEmptyValue();
      isInternalUpdate = false;
    }
    return;
  }
});

/**
 * Syncs external v-model changes to fzInputModel
 *
 * Point 1: v-model undefined -> fzInputModel = "" (empty string), v-model stays undefined
 * Point 2: v-model number 1234.56 -> fzInputModel = "1234,56" (formatted), v-model stays 1234.56
 * Point 3: v-model string "1.234,56" -> fzInputModel = "1234,56" (formatted), v-model will be 1234.56
 *
 * Formats only when not focused (when focused, shows raw value for editing).
 */
watch(
  () => model.value,
  (newVal) => {
    // Skip if this is an internal update (from handleInputUpdate)
    if (isInternalUpdate) {
      return;
    }

    if (newVal === undefined || newVal === null) {
      fzInputModel.value = "";
      // Ensure v-model matches the expected empty value based on nullOnEmpty/zeroOnEmpty
      const expectedEmptyValue = getEmptyValue();
      if (newVal !== expectedEmptyValue) {
        isInternalUpdate = true;
        model.value = expectedEmptyValue;
        isInternalUpdate = false;
      }
      return;
    }

    if (typeof newVal === "number") {
      // Truncate decimals to maximumFractionDigits before updating v-model
      let processed = truncateDecimals(newVal, props.maximumFractionDigits);

      // Apply step quantization if forceStep is enabled
      if (props.forceStep) {
        processed = roundTo(props.step, processed);
      }

      // Apply min/max constraints only when input is not focused
      // When focused, allow values outside range temporarily (clamping happens on blur)
      if (!isFocused.value) {
        processed = clamp(props.min, processed, props.max);
      }

      // Update v-model if processed value differs (to ensure v-model always respects max decimals and step quantization)
      if (processed !== newVal) {
        isInternalUpdate = true;
        model.value = processed;
        isInternalUpdate = false;
      }

      // Format number to Italian format (comma as decimal separator)
      // But only if not focused (when focused, show raw value)
      if (!isFocused.value) {
        const formatted = formatValue(processed, {
          minimumFractionDigits: props.minimumFractionDigits,
          maximumFractionDigits: props.maximumFractionDigits,
          roundDecimals: false,
          useGrouping: true,
        });
        fzInputModel.value = formatted;
      }
      return;
    }

    if (typeof newVal === "string") {
      // Normalize string value (handles Italian format: "1.234,56" and shows deprecation warning)
      const normalized = normalizeModelValue(newVal);
      if (normalized !== undefined && normalized !== null) {
        const parsed = normalized;
        // Truncate decimals to maximumFractionDigits before updating v-model
        let processed = truncateDecimals(parsed, props.maximumFractionDigits);

        // Apply step quantization if forceStep is enabled
        if (props.forceStep) {
          processed = roundTo(props.step, processed);
        }

        // Apply min/max constraints only when input is not focused
        // When focused, allow values outside range temporarily (clamping happens on blur)
        if (!isFocused.value) {
          processed = clamp(props.min, processed, props.max);
        }

        // Update v-model to number (this will trigger watch again, but will be handled as number)
        isInternalUpdate = true;
        model.value = processed;
        isInternalUpdate = false;
        // Format and display (only if not focused)
        if (!isFocused.value) {
          const formatted = formatValue(processed, {
            minimumFractionDigits: props.minimumFractionDigits,
            maximumFractionDigits: props.maximumFractionDigits,
            roundDecimals: false,
            useGrouping: true,
          });
          fzInputModel.value = formatted;
        }
      } else {
        // Invalid string, clear input
        fzInputModel.value = "";
        isInternalUpdate = true;
        model.value = getEmptyValue();
        isInternalUpdate = false;
      }
      return;
    }
  }
);

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
    @update:modelValue="handleInputUpdate"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
    @paste="handlePaste"
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
            :aria-disabled="isStepDisabled ? 'true' : undefined"
            :tabindex="isStepDisabled ? undefined : '0'"
            class="fz__currencyinput__arrowup cursor-pointer"
            @click="handleStepUp"
            @keydown="
              (e: KeyboardEvent) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isStepDisabled) {
                  e.preventDefault();
                  handleStepUp();
                }
              }
            "
          ></FzIcon>
          <FzIcon
            name="angle-down"
            size="xs"
            role="button"
            :aria-label="stepDownAriaLabel"
            :aria-disabled="isStepDisabled ? 'true' : undefined"
            :tabindex="isStepDisabled ? undefined : '0'"
            class="fz__currencyinput__arrowdown cursor-pointer"
            @click="handleStepDown"
            @keydown="
              (e: KeyboardEvent) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isStepDisabled) {
                  e.preventDefault();
                  handleStepDown();
                }
              }
            "
          ></FzIcon>
        </div>
      </div>
    </template>
    <template #label>
      <slot name="label"></slot>
    </template>
    <template #errorMessage>
      <slot name="errorMessage"></slot>
    </template>
    <template #helpText>
      <slot name="helpText"></slot>
    </template>
  </FzInput>
</template>
