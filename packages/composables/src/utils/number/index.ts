import { FzUseCurrencyOptions } from '../../types'

export const format = (options: FzUseCurrencyOptions) => (input: number | null) => {
  if (input === null) {
    return ''
  }
  const safeOptions: FzUseCurrencyOptions = {
    maximumFractionDigits: options.maximumFractionDigits || 2,
    minimumFractionDigits: options.minimumFractionDigits,
    useGrouping: options.useGrouping || false
  }

  return input.toLocaleString('it-IT', safeOptions)
}

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