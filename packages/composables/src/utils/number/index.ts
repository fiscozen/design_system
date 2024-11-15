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

export const parse = (text: string) => {
  // strip currency, handle edge cases...
  return parseFloat(text.replace(/,/g, '.'))
}
