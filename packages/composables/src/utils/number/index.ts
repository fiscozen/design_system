/**
 * Truncates a number to the specified maximum decimal places (without rounding)
 *
 * Uses `String(value)` — the shortest decimal that uniquely identifies the
 * IEEE 754 double — then slices the string to `maxDecimals` places.
 * This sidesteps both IEEE 754 drift (e.g. `40.3 * 100 → 4029.999…`) and the
 * significant-digit ceiling that `toPrecision(n)` imposes on large products
 * (e.g. `10 000 000 000.01 * 100` has 13 significant digits, which
 * `toPrecision(12)` silently rounds away).
 *
 * For values where `String()` emits scientific notation (|value| >= 1e21 or
 * < 1e-7), plain `Math.trunc(value * factor)` is used — drift is irrelevant
 * at those magnitudes.
 *
 * @param value - Number to truncate
 * @param maxDecimals - Maximum number of decimal places
 * @returns Truncated number
 */
export const truncateDecimals = (value: number, maxDecimals: number): number => {
  if (!isFinite(value) || maxDecimals < 0) return value;
  if (maxDecimals === 0) return Math.trunc(value);

  const str = String(value);

  if (str.includes('e') || str.includes('E')) {
    const factor = Math.pow(10, maxDecimals);
    return Math.trunc(value * factor) / factor;
  }

  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) return value;
  if (str.length - dotIndex - 1 <= maxDecimals) return value;

  return Number(str.slice(0, dotIndex + maxDecimals + 1));
};

/**
 * Formats a number value using provided options
 *
 * Uses Italian locale format (comma as decimal separator, point as thousand separator).
 * Can truncate (not round) decimal places to maximumFractionDigits before formatting
 * based on roundDecimals option.
 *
 * @param value - Number value to format
 * @param options - Formatting options
 * @param options.minimumFractionDigits - Minimum decimal places (default: 0)
 * @param options.maximumFractionDigits - Maximum decimal places (default: 2)
 * @param options.roundDecimals - If true, rounds decimals; if false, truncates (default: true)
 * @param options.useGrouping - Whether to use thousand separators (default: true)
 * @returns Formatted string (e.g., "1.234,56")
 */
export const format = (
  value: number | null | undefined,
  {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    roundDecimals = true,
    useGrouping = true,
  } = {}
): string => {
  if (
    value === undefined ||
    value === null ||
    isNaN(value) ||
    !isFinite(value)
  ) {
    return "";
  }

  // Truncate decimals if roundDecimals is false, otherwise use value as-is (toLocaleString will round)
  const processedValue = roundDecimals
    ? value
    : truncateDecimals(value, maximumFractionDigits);

  return processedValue.toLocaleString("it-IT", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    useGrouping: useGrouping,
  });
};

export const parse = (text: string): number => {
  if (!text || typeof text !== 'string') {
    return NaN
  }

  let normalized = text.trim()

  // Handle Italian format: "1.234,56" (points = thousands, comma = decimal)
  if (normalized.includes(',')) {
    normalized = normalized.replace(/\./g, '')
    normalized = normalized.replace(',', '.')
  }

  return parseFloat(normalized)
}

export const roundTo = (step: number, val: number) => {
  let result = val;
  const remainder = val % step
  const safeStep = val >= 0 ? step : -step
  if (remainder !== 0) {
    result = Math.abs(remainder) >= step / 2 ? val + safeStep - remainder : val - remainder
  }
  return result
}

export const clamp = (min: number, value: number, max: number): number => {
  return Math.max(min, Math.min(value, max))
}