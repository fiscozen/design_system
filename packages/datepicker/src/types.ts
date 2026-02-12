import type { RootProps, FlowConfig, TimeConfig, FormatsConfig, InputAttributesConfig, FloatingConfig } from "@vuepic/vue-datepicker";
import type { FzInputProps } from "@fiscozen/input";
import type { Locale } from "date-fns";

/**
 * Floating-UI placement strings derived from the VueDatePicker FloatingConfig.
 * @see https://floating-ui.com/docs/tutorial#placements
 */
type FloatingPlacement = NonNullable<FloatingConfig['placement']>;

/**
 * FzDatepickerProps extends the new v12 RootProps and adds:
 *  - our custom props (inputProps, valueFormat)
 *  - legacy/deprecated props for backward compatibility with code written
 *    against @vuepic/vue-datepicker v8. These are transparently remapped
 *    to the v12 API inside FzDatepicker.vue.
 */
interface FzDatepickerProps
  extends Omit<RootProps, "flow" | "locale"> {
  /** Custom FzInput props forwarded to the inner input element */
  inputProps: FzInputProps;
  /** Optional date-fns format string to format the emitted value */
  valueFormat?: string;

  /**
   * Floating-UI placement for the datepicker menu.
   * Convenience shorthand for `floating.placement`.
   * @see https://floating-ui.com/docs/tutorial#placements
   */
  placement?: FloatingPlacement;

  // ──────────────────────────────────────────────────
  //  Legacy / backward-compat props (from v8)
  //  These are mapped to their v12 equivalents inside
  //  the component so consumers don't need to change.
  // ──────────────────────────────────────────────────

  /** @deprecated Use `formats.input` instead */
  format?: string | ((date: Date) => string) | ((dates: Date[]) => string);
  /** @deprecated Use `locale` instead */
  formatLocale?: Locale;
  /** @deprecated Use `floating` prop instead */
  autoPosition?: boolean;
  /** @deprecated Use `inputAttrs.state` instead */
  state?: boolean;
  /** @deprecated Use `inputAttrs.name` instead */
  name?: string;
  /** @deprecated Use `timeConfig.enableTimePicker` instead */
  enableTimePicker?: boolean;
  /** @deprecated Use `timeConfig.enableMinutes` instead */
  enableMinutes?: boolean;
  /** @deprecated Use `timeConfig.is24` instead */
  is24?: boolean;
  /** @deprecated Use `timeConfig.timePickerInline` instead */
  timePickerInline?: boolean;
  /** @deprecated Use `timeConfig.enableSeconds` instead */
  enableSeconds?: boolean;
  /** @deprecated Use `timeConfig.noHoursOverlay` instead */
  noHoursOverlay?: boolean;
  /** @deprecated Use `timeConfig.noMinutesOverlay` instead */
  noMinutesOverlay?: boolean;
  /** @deprecated Use `timeConfig.noSecondsOverlay` instead */
  noSecondsOverlay?: boolean;

  /** Accepts both old array form (v8) and new object form (v12) */
  flow?: string[] | Partial<FlowConfig>;

  /** Accepts both old string form (v8) and new Locale object form (v12) */
  locale?: string | Locale;
}

export type {
  FzDatepickerProps,
  FloatingPlacement,
  FlowConfig,
  TimeConfig,
  FormatsConfig,
  InputAttributesConfig,
};
