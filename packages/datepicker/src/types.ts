import type {
  RootProps,
  FlowConfig,
  TimeConfig,
  FormatsConfig,
  InputAttributesConfig,
  FloatingConfig
} from '@vuepic/vue-datepicker'
import type { FzInputProps } from '@fiscozen/input'
import type { Locale } from 'date-fns'

/**
 * Floating-UI placement strings derived from the VueDatePicker FloatingConfig.
 * @see https://floating-ui.com/docs/tutorial#placements
 */
type FloatingPlacement = NonNullable<FloatingConfig['placement']>

/**
 * FzDatepickerProps extends the new v12 RootProps and adds:
 *  - our custom props (inputProps, valueFormat)
 *  - legacy/deprecated props for backward compatibility with code written
 *    against @vuepic/vue-datepicker v8. These are transparently remapped
 *    to the v12 API inside FzDatepicker.vue.
 */
interface FzDatepickerProps extends Omit<RootProps, 'flow' | 'locale'> {
  /** Custom FzInput props forwarded to the inner input element */
  inputProps: FzInputProps
  /**
   * HTML attributes forwarded to the visible `<input>`.
   *
   * `inputAttrs.name` is the recommended way to set the input's `name`
   * attribute (the legacy top-level `name` prop is deprecated and will be
   * removed in a future version). The DS wrapper renders `<FzInput>` in VueDatePicker's
   * `#dp-input` slot and propagates `inputAttrs.name` to it, so form helpers
   * (`FormData`, native form submission, jQuery `[name]` selectors) pick the
   * field up.
   *
   * @example
   * <FzDatepicker :inputAttrs="{ name: 'business_start' }" v-model="..." />
   */
  inputAttrs?: Partial<InputAttributesConfig>
  /** Optional date-fns format string to format the emitted value */
  valueFormat?: string
  /**
   * Shows a clear (×) button when the input has a value.
   * Forwarded to the inner FzInput component.
   * @default false
   */
  clearable?: boolean
  /**
   * Accessible label for the clear button.
   * Forwarded to the inner FzInput component.
   * @default 'Cancella'
   */
  clearAriaLabel?: string

  /**
   * Floating-UI placement for the datepicker menu.
   * Convenience shorthand for `floating.placement`.
   * @see https://floating-ui.com/docs/tutorial#placements
   */
  placement?: FloatingPlacement

  // ──────────────────────────────────────────────────
  //  Legacy / backward-compat props (from v8)
  //  These are mapped to their v12 equivalents inside
  //  the component so consumers don't need to change.
  // ──────────────────────────────────────────────────

  /** @deprecated Use `formats.input` instead */
  format?: string | ((date: Date) => string) | ((dates: Date[]) => string)
  /** @deprecated Use `locale` instead */
  formatLocale?: Locale
  /** @deprecated Use `floating` prop instead */
  autoPosition?: boolean
  /** @deprecated Use `inputAttrs.state` instead */
  state?: boolean
  /** @deprecated Use `inputAttrs.name` instead */
  name?: string
  /** @deprecated Use `timeConfig.enableTimePicker` instead */
  enableTimePicker?: boolean
  /** @deprecated Use `timeConfig.enableMinutes` instead */
  enableMinutes?: boolean
  /** @deprecated Use `timeConfig.is24` instead */
  is24?: boolean
  /** @deprecated Use `timeConfig.timePickerInline` instead */
  timePickerInline?: boolean
  /** @deprecated Use `timeConfig.enableSeconds` instead */
  enableSeconds?: boolean
  /** @deprecated Use `timeConfig.noHoursOverlay` instead */
  noHoursOverlay?: boolean
  /** @deprecated Use `timeConfig.noMinutesOverlay` instead */
  noMinutesOverlay?: boolean
  /** @deprecated Use `timeConfig.noSecondsOverlay` instead */
  noSecondsOverlay?: boolean

  /**
   * Controls the step-by-step workflow when picking a date (and optionally a
   * time). On each completed step the picker emits `flow-step` and advances
   * to the next one; once the last step is reached the menu auto-closes.
   *
   * Accepts both forms:
   *  - **v8 array shorthand**: `['calendar', 'hours', 'minutes']` — mapped
   *    internally to `{ steps: [...] }`.
   *  - **v12 object form**: `{ steps: PickerSection[], partial?: boolean }`.
   *
   * Valid step values (`PickerSection`):
   * `'month' | 'year' | 'calendar' | 'time' | 'hours' | 'minutes' | 'seconds'`.
   *
   * Typical pairing: set `enableTimePicker: true`, `timePickerInline: true`
   * and `autoApply: false` so the user can move calendar → hours → minutes
   * without an early commit.
   *
   * @see https://vue3datepicker.com/props/flow/
   *
   * @example
   * <FzDatepicker
   *   v-model="value"
   *   :flow="['calendar', 'hours', 'minutes']"
   *   enableTimePicker
   *   timePickerInline
   *   :autoApply="false"
   * />
   */
  flow?: string[] | Partial<FlowConfig>

  /**
   * Calendar locale. Accepts both forms:
   *  - **`date-fns` Locale object** (v12, recommended) — e.g. `import { it } from 'date-fns/locale'`.
   *  - **Legacy string** (v8) — kept for backward compatibility, but **any string
   *    is silently coerced to the Italian locale** because VueDatePicker won't
   *    load locales by name. Consumers needing a different language must pass
   *    the Locale object directly.
   */
  locale?: string | Locale
}

export type {
  FzDatepickerProps,
  FloatingPlacement,
  FlowConfig,
  TimeConfig,
  FormatsConfig,
  InputAttributesConfig
}
