import { onMounted, ref, watch, type ComputedRef, type Ref } from "vue";
import {
  clamp,
  format as formatValue,
  parse,
  roundTo,
  truncateDecimals,
} from "@fiscozen/composables";
import { parseClipboardNumber } from "./utils";

/**
 * Subset of FzInput props the currency behavior depends on.
 * Matches the prop names/semantics of the former FzCurrencyInput component.
 */
export interface UseCurrencyInputProps {
  /** Minimum allowed value. Values below this are clamped to min */
  min?: number;
  /** Maximum allowed value. Values above this are clamped to max */
  max?: number;
  /** Step increment for arrow buttons. When forceStep is true, values are rounded to nearest step multiple */
  step?: number;
  /** Enforces quantization: values are automatically rounded to nearest step multiple */
  forceStep?: boolean;
  /** Minimum decimal places in formatted output */
  minimumFractionDigits?: number;
  /** Maximum decimal places in formatted output */
  maximumFractionDigits?: number;
  /** Converts empty input to null instead of undefined */
  nullOnEmpty?: boolean;
  /** Converts empty input to 0 instead of undefined */
  zeroOnEmpty?: boolean;
  /** Native readonly attribute */
  readonly?: boolean;
  /** Disables input interaction */
  disabled?: boolean;
}

export interface UseCurrencyInputOptions {
  /** Reactive props object (the component's props proxy) */
  props: UseCurrencyInputProps;
  /**
   * The numeric v-model ref. Accepts `number | string | null | undefined` for
   * retrocompatibility, but the composable always writes `number | null | undefined`.
   */
  model: Ref<number | string | null | undefined>;
  /** Whether currency behavior is active (i.e. FzInput type === "currency") */
  enabled: ComputedRef<boolean>;
}

/**
 * Currency input behavior for FzInput with `type="currency"`.
 *
 * Manages a display string (`displayValue`) bound to the native input and keeps it
 * in sync with the numeric v-model: number formatting via Intl.NumberFormat with
 * Italian locale separators, input normalization/filtering, min/max clamping and
 * step quantization. Formatting and quantization happen on blur; while focused the
 * raw value is shown for editing.
 *
 * Ported from the FzCurrencyInput component, which is now a thin deprecated
 * wrapper around `<FzInput type="currency">`.
 */
export default function useCurrencyInput(options: UseCurrencyInputOptions) {
  const { props, model, enabled } = options;

  /** Display string bound to the native input element */
  const displayValue = ref<string | undefined>();

  /**
   * Focus state tracked independently from FzInput's own focus flag: it is only
   * set when the input is interactive (not readonly/disabled), mirroring the
   * former FzCurrencyInput semantics used by the formatting logic.
   */
  const isFocused = ref(false);

  let isInternalUpdate = false;

  const minValue = () => props.min ?? -Infinity;
  const maxValue = () => props.max ?? Infinity;
  const stepValue = () => props.step ?? 1;
  const minFractionDigits = () => props.minimumFractionDigits ?? 2;
  const maxFractionDigits = () => props.maximumFractionDigits ?? 2;

  /** Writes the model flagging the update as internal so the model watcher can skip it */
  const setModel = (value: number | null | undefined) => {
    isInternalUpdate = true;
    model.value = value;
    isInternalUpdate = false;
  };

  /** Formats a number to Italian format (comma decimal separator, point thousand separator) */
  const formatForDisplay = (value: number | null | undefined): string =>
    formatValue(value, {
      minimumFractionDigits: minFractionDigits(),
      maximumFractionDigits: maxFractionDigits(),
      roundDecimals: false,
      useGrouping: true,
    });

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
   * Determines the display value when input is empty
   *
   * When zeroOnEmpty is true and the empty value is 0:
   * - During typing (focused): returns empty string (formatting happens on blur)
   * - On blur (not focused): returns formatted "0,00"
   *
   * Otherwise returns empty string.
   *
   * @param isEmptyValueZero - Whether the empty value is 0 (from getEmptyValue())
   * @param isCurrentlyFocused - Whether the input is currently focused
   * @returns Display string to show in the input field
   */
  const getEmptyDisplayValue = (
    isEmptyValueZero: boolean,
    isCurrentlyFocused: boolean,
  ): string => {
    if (isEmptyValueZero) {
      // During typing, show empty string. Formatting happens on blur
      if (isCurrentlyFocused) {
        return "";
      }
      // On blur or when not focused, show formatted zero
      return formatForDisplay(0);
    }
    return "";
  };

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
   * Normalizes model value to number | undefined | null
   *
   * Converts string values to numbers (with deprecation warning) and handles
   * null/undefined/empty string cases.
   *
   * @param value - Input value (number, string, undefined, or null)
   * @returns Normalized number value, undefined, or null
   */
  const normalizeModelValue = (
    value: number | string | undefined | null,
  ): number | undefined | null => {
    if (value === undefined || value === null || value === "") {
      return value === null ? null : undefined;
    }
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      // The "[FzCurrencyInput]" tag is kept on purpose: existing consumers and
      // tests assert on it. It will switch to "[FzInput]" once FzCurrencyInput
      // is removed at the end of the migration.
      console.warn(
        "[FzCurrencyInput] String values in v-model are deprecated. Please use number instead. " +
          `Received: "${value}". This will be parsed to a number for retrocompatibility, but string support may be removed in a future version.`,
      );
      const parsed = parse(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
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

    // Shared clipboard parser (handles Italian format, returns null if invalid)
    const parsed = parseClipboardNumber(pastedText);

    if (parsed !== null) {
      // Truncate decimals to maximumFractionDigits
      const processed = truncateDecimals(parsed, maxFractionDigits());

      setModel(processed);

      // Convert number to normalized string format for display (e.g., 1234.56 -> "1234,56")
      displayValue.value = normalizeInput(String(processed));
    }
    // If invalid, ignore paste (do nothing)
  };

  /**
   * Handles display string updates coming from the native input
   *
   * Validates and normalizes input, updates v-model with parsed number.
   * Does NOT format the display value - shows raw input (e.g., "123" stays "123", not "123,00").
   * Does NOT apply step quantization - quantization happens only on blur.
   * Formatting and quantization happen only on blur.
   */
  const handleDisplayUpdate = (newValue: string | undefined) => {
    if (!newValue) {
      setModel(getEmptyValue());

      // During typing, always show empty string. Formatting to "0,00" happens only on blur
      displayValue.value = "";
      return;
    }

    const normalized = normalizeInput(newValue);
    displayValue.value = normalized;

    // Parse to number and update v-model (but don't format display - keep raw)
    const parsed = parse(normalized);
    if (!isNaN(parsed) && isFinite(parsed)) {
      // Truncate decimals to maximumFractionDigits before updating v-model
      setModel(truncateDecimals(parsed, maxFractionDigits()));
    } else {
      // If invalid, keep the normalized string but don't update v-model
      setModel(getEmptyValue());
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
      // Ensure v-model matches the expected empty value based on nullOnEmpty/zeroOnEmpty
      const expectedEmptyValue = getEmptyValue();
      if (model.value !== expectedEmptyValue) {
        setModel(expectedEmptyValue);
      }

      // Display empty value (formatted zero if zeroOnEmpty is true, empty string otherwise)
      displayValue.value = getEmptyDisplayValue(
        expectedEmptyValue === 0,
        false, // Not focused during blur
      );
      return;
    }

    // Apply step quantization if forceStep is enabled
    let processed = currentValue;
    if (props.forceStep) {
      processed = roundTo(stepValue(), processed);
    }

    // Apply min/max constraints
    processed = clamp(minValue(), processed, maxValue());

    // Update v-model if processed value differs
    if (processed !== currentValue) {
      setModel(processed);
    }

    // Format the value for display
    displayValue.value = formatForDisplay(processed);
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
      const formatted = formatForDisplay(currentValue);
      displayValue.value = formatted.replace(/\./g, ""); // Remove thousand separators
    }
  };

  /**
   * Steps the value up or down by the step amount, applying truncation and clamping.
   * If value is undefined/null, starts from 0.
   */
  const stepBy = (direction: 1 | -1) => {
    if (props.readonly || props.disabled) {
      return;
    }

    const currentValue = normalizeModelValue(model.value);
    const baseValue =
      currentValue === undefined || currentValue === null ? 0 : currentValue;

    const newValue = baseValue + direction * stepValue();

    // Truncate decimals
    const truncated = truncateDecimals(newValue, maxFractionDigits());

    // Apply min/max constraints
    const clamped = clamp(minValue(), truncated, maxValue());

    setModel(clamped);

    // Format and update display
    displayValue.value = formatForDisplay(clamped);
  };

  /**
   * Syncs the display string (and re-processes the model) from a model value.
   *
   * Used both on mount and when the v-model changes externally:
   * - undefined/null -> normalized to the expected empty value, display empty (or "0,00" with zeroOnEmpty)
   * - number -> truncated to max decimals, step-quantized (forceStep), clamped (only when not
   *   focused) and formatted to Italian format (only when not focused: when focused the raw
   *   value stays in place for editing)
   * - string -> parsed with deprecation warning, then handled as number; invalid strings clear the input
   *
   * @param newVal - The model value to sync from
   * @param focused - Whether the input is currently focused
   */
  const syncFromModel = (
    newVal: number | string | null | undefined,
    focused: boolean,
  ) => {
    if (newVal === undefined || newVal === null) {
      // Ensure v-model matches the expected empty value based on nullOnEmpty/zeroOnEmpty
      const expectedEmptyValue = getEmptyValue();
      if (newVal !== expectedEmptyValue) {
        setModel(expectedEmptyValue);
      }

      // Display empty value (formatted zero if zeroOnEmpty is true, empty string otherwise)
      displayValue.value = getEmptyDisplayValue(
        expectedEmptyValue === 0,
        focused,
      );
      return;
    }

    // Normalize string values (handles Italian format "1.234,56" and shows deprecation warning)
    const normalized = normalizeModelValue(newVal);
    if (normalized === undefined || normalized === null) {
      // Invalid string, clear input
      const emptyValue = getEmptyValue();
      setModel(emptyValue);

      displayValue.value = getEmptyDisplayValue(emptyValue === 0, focused);
      return;
    }

    // Truncate decimals to maximumFractionDigits before updating v-model
    let processed = truncateDecimals(normalized, maxFractionDigits());

    // Apply step quantization if forceStep is enabled
    if (props.forceStep) {
      processed = roundTo(stepValue(), processed);
    }

    // Apply min/max constraints only when input is not focused
    // When focused, allow values outside range temporarily (clamping happens on blur)
    if (!focused) {
      processed = clamp(minValue(), processed, maxValue());
    }

    // Update v-model if processed value differs (to ensure v-model always respects
    // max decimals and step quantization)
    if (processed !== newVal) {
      setModel(processed);
    }

    // Format for display, but only if not focused (when focused, show raw value)
    if (!focused) {
      displayValue.value = formatForDisplay(processed);
    }
  };

  /**
   * Initializes the display value from the v-model on mount (and when currency
   * mode is enabled dynamically by switching the input type).
   */
  onMounted(() => {
    if (enabled.value) {
      syncFromModel(model.value, false);
    }
  });

  watch(enabled, (isEnabled) => {
    if (isEnabled) {
      syncFromModel(model.value, false);
    }
  });

  /**
   * Syncs external v-model changes to the display value.
   * Skips updates flagged as internal (originated from this composable).
   */
  watch(
    () => model.value,
    (newVal) => {
      if (!enabled.value || isInternalUpdate) {
        return;
      }
      syncFromModel(newVal, isFocused.value);
    },
  );

  return {
    displayValue,
    handleDisplayUpdate,
    handleKeydown,
    handlePaste,
    handleFocus,
    handleBlur,
    stepBy,
  };
}
