import { FzUseCurrencyOptions } from '../types'
import { format, parse } from '../utils'

/**
 * @deprecated This composable is deprecated.
 * You can use `format` and `parse` directly from `composables/utils`.
 */
export const useCurrency = (_options: FzUseCurrencyOptions) => {
  return {
    format,
    parse
  }
}
