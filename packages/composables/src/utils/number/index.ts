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
  // strip currency, handle edge cases...
  return parseFloat(text.replace(/,/g, '.'))
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