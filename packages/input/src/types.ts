import { IconButtonVariant } from "@fiscozen/button";
import { IconSize, IconVariant } from "@fiscozen/icons";

export type InputEnvironment = "backoffice" | "frontoffice";

/**
 * Input type. Native HTML types render the corresponding `<input type>`;
 * `currency` renders a text input with locale-aware currency formatting,
 * validation and step controls (see FzInput docs).
 */
export type FzInputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "file"
  | "currency";

/**
 * Exposed instance shape of FzInput (template ref type).
 * Use this instead of `InstanceType<typeof FzInput>`: FzInput is a generic
 * component, so its type is a call signature and InstanceType does not apply.
 */
export interface FzInputInstance {
  inputRef: HTMLInputElement | null;
  containerRef: HTMLElement | null;
}

/**
 * Maps the input `type` to the v-model value type.
 *
 * - `type="currency"` → `number | null | undefined` (numbers in, numbers out)
 * - any other type → `string | undefined`
 *
 * The conditional is deliberately non-distributive (`[TType] extends ["currency"]`):
 * when `type` is bound dynamically the inferred type parameter is the whole
 * `FzInputType` union and the model falls back to `string` — only a literal
 * `type="currency"` switches the v-model to numbers. At runtime a dynamic
 * "currency" type still behaves numerically.
 */
export type FzInputModelValue<TType extends FzInputType = FzInputType> = [
  TType,
] extends ["currency"]
  ? number | null | undefined
  : string | undefined;

type FzInputProps<TType extends FzInputType = FzInputType> = {
  /**
   * Custom DOM id for the underlying `<input>`. When provided, the same value is
   * used for the `<label>`'s `for` attribute so the label-input binding stays
   * intact. When omitted, the component generates a stable unique id.
   */
  id?: string;
  /**
   * Text label displayed above the input field. Overridden by label slot if provided.
   */
  label?: string;
  /**
   * Environment determining input size and styling
   * @default 'frontoffice'
   */
  environment?: InputEnvironment;
  /**
   * Visual size affecting height, padding, and text size
   *
   * @deprecated Use the 'environment' prop instead. This prop will be removed in a future version.
   * Size values map to environments: sm/md → backoffice, lg → frontoffice
   */
  size?: "sm" | "md" | "lg";
  /**
   * Placeholder text shown when input is empty. Behavior differs based on variant.
   */
  placeholder?: string;
  /**
   * Marks input as required. Adds asterisk to label and sets native required attribute.
   * @default false
   */
  required?: boolean;
  /**
   * Disables input interaction and applies disabled styling
   * @default false
   */
  disabled?: boolean;
  /**
   * Shows error state with red border and enables errorMessage slot display
   * @default false
   */
  error?: boolean;
  /**
   * Font Awesome icon name displayed on the left side of input
   */
  leftIcon?: string;
  /**
   * Visual style variant for left icon (solid, regular, light, etc.)
   */
  leftIconVariant?: IconVariant;
  /**
   * Button variant for left icon when rendered as clickable button
   */
  leftIconButtonVariant?: IconButtonVariant;
  /**
   * Accessible label for left icon when clickable. Required for screen reader accessibility.
   */
  leftIconAriaLabel?: string;
  /**
   * Font Awesome icon name displayed on the right side of input
   */
  rightIcon?: string;
  /**
   * Additional CSS classes applied to right icon container
   */
  rightIconClass?: string;
  /**
   * Size override for right icon. If not provided, uses input size mapping.
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Icons now have a fixed size of "md". This prop will be ignored.
   */
  rightIconSize?: IconSize;
  /**
   * Visual style variant for right icon (solid, regular, light, etc.)
   */
  rightIconVariant?: IconVariant;
  /**
   * Renders right icon as clickable button instead of static icon
   * @default false
   */
  rightIconButton?: boolean;
  /**
   * Button variant for right icon when rightIconButton is true
   * @default 'invisible'
   */
  rightIconButtonVariant?: IconButtonVariant;
  /**
   * Accessible label for right icon when clickable. Required for screen reader accessibility.
   */
  rightIconAriaLabel?: string;
  /**
   * Font Awesome icon name displayed as second icon on the right side of input.
   * Priority order: secondRightIcon > rightIcon > valid
   */
  secondRightIcon?: string;
  /**
   * Additional CSS classes applied to second right icon container
   */
  secondRightIconClass?: string;
  /**
   * Visual style variant for second right icon (solid, regular, light, etc.)
   */
  secondRightIconVariant?: IconVariant;
  /**
   * Renders second right icon as clickable button instead of static icon
   * @default false
   */
  secondRightIconButton?: boolean;
  /**
   * Button variant for second right icon when secondRightIconButton is true
   * @default 'invisible'
   */
  secondRightIconButtonVariant?: IconButtonVariant;
  /**
   * Accessible label for second right icon when clickable. Required for screen reader accessibility.
   */
  secondRightIconAriaLabel?: string;
  /**
   * Input type. Native HTML types determine keyboard layout and validation behavior.
   * `currency` enables locale-aware currency formatting with step controls;
   * with `type="currency"` the v-model is `number | null | undefined` instead of `string`.
   * @default 'text'
   */
  type?: TType;
  /**
   * Shows success checkmark icon on the right when true. Takes precedence over rightIcon
   * @default false
   */
  valid?: boolean;
  /**
   * Visual presentation style. 'floating-label' moves placeholder above input when focused/filled
   * @default 'normal'
   */
  variant?: "normal" | "floating-label";
  /**
   * HTML5 pattern attribute for native browser validation
   */
  pattern?: string;
  /**
   * Native name attribute for form submission and identification
   */
  name?: string;
  /**
   * Native readonly attribute. Prevents user input while keeping field focusable
   * @default false
   */
  readonly?: boolean;
  /**
   * Shows highlighted state with warning colors (orange border, warm background, glow ring).
   * Overridden by error, disabled, and readonly states.
   * If both highlighted and aiReasoning are true, highlighted takes priority.
   * @default false
   */
  highlighted?: boolean;
  /**
   * Accessible description announced by screen readers when highlighted is active.
   * @default 'Campo in evidenza'
   */
  highlightedDescription?: string;
  /**
   * Shows AI reasoning state with purple colors (purple border, light purple background, glow ring).
   * Auto-renders a sparkles icon unless leftIcon prop or left-icon slot is provided.
   * Overridden by error, disabled, readonly, and highlighted states.
   * @note When both aiReasoning and leftIcon are provided, leftIcon takes visual precedence
   * and no sparkles icon is rendered.
   * @default false
   */
  aiReasoning?: boolean;
  /**
   * Accessible description announced by screen readers when aiReasoning is active.
   * @default 'Suggerito dall\'intelligenza artificiale'
   */
  aiReasoningDescription?: string;
  /**
   * When true, prevents emphasis (highlighted/aiReasoning) from being reset on user input.
   * Used by FzSelect to prevent emphasis reset when typing in the filter input,
   * since FzSelect resets emphasis on option selection instead.
   * @default false
   */
  disableEmphasisReset?: boolean;
  /**
   * Native maxlength attribute. Limits maximum number of characters
   */
  maxlength?: number;
  /**
   * Native autocomplete attribute. Controls browser autocomplete and suggestions.
   * When false, sets autocomplete="off" to disable browser autocomplete.
   * @default false
   */
  autocomplete?: boolean;
  /**
   * Shows a clear (×) button when the input has a value.
   * Clicking it clears the model and emits `fzinput:clear`.
   * @default false
   */
  clearable?: boolean;
  /**
   * Accessible label for the clear button.
   * @default 'Cancella'
   */
  clearAriaLabel?: string;
  /**
   * Additional CSS classes applied to left icon container
   */
  leftIconClass?: string;
  /**
   * Minimum allowed value. For `type="currency"` values below this are clamped to min;
   * for `type="number"` it is forwarded to the native `min` attribute.
   */
  min?: number;
  /**
   * Maximum allowed value. For `type="currency"` values above this are clamped to max;
   * for `type="number"` it is forwarded to the native `max` attribute.
   */
  max?: number;
  /**
   * Step increment for the up/down arrow controls shown with `type="currency"` and
   * `type="number"`. For `type="number"` it is also forwarded to the native `step` attribute.
   * When forceStep is true (currency only), values are rounded to the nearest step multiple.
   * @default 1
   */
  step?: number;
  /**
   * Enforces quantization for `type="currency"`: values are automatically rounded
   * to the nearest step multiple
   * @default false
   */
  forceStep?: boolean;
  /**
   * Minimum decimal places in formatted output (`type="currency"` only)
   * @default 2
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  minimumFractionDigits?: number;
  /**
   * Maximum decimal places in formatted output (`type="currency"` only)
   * @default 2
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  maximumFractionDigits?: number;
  /**
   * Converts empty input to null instead of undefined (`type="currency"` only).
   * When true, empty input will emit null instead of undefined.
   * @default false
   */
  nullOnEmpty?: boolean;
  /**
   * Converts empty input to 0 instead of undefined (`type="currency"` only).
   * When true, empty input will emit 0 instead of undefined.
   * @default false
   */
  zeroOnEmpty?: boolean;
  /**
   * Custom accessible label for the step up button shown with `type="currency"`
   * and `type="number"`. If not provided, uses a default label based on step.
   */
  stepUpAriaLabel?: string;
  /**
   * Custom accessible label for the step down button shown with `type="currency"`
   * and `type="number"`. If not provided, uses a default label based on step.
   */
  stepDownAriaLabel?: string;
};

/**
 * @deprecated FzCurrencyInput is deprecated: use `FzInput` with `type="currency"` instead.
 * This interface is kept for backwards compatibility until the migration is complete.
 */
interface FzCurrencyInputProps extends Omit<
  FzInputProps<"currency">,
  | "type"
  | "modelValue"
  | "rightIcon"
  | "rightIconSize"
  | "rightIconVariant"
  | "rightIconButton"
  | "rightIconButtonVariant"
  | "rightIconAriaLabel"
  | "rightIconClass"
  | "secondRightIcon"
  | "secondRightIconClass"
  | "secondRightIconVariant"
  | "secondRightIconButton"
  | "secondRightIconButtonVariant"
  | "secondRightIconAriaLabel"
> {
  /**
   * The v-model value.
   *
   * **Type assertion**: This prop accepts `number | string | undefined | null` as input,
   * but the component **always emits** `number | undefined | null` (never `string`).
   * Strings are automatically parsed (Italian format: "1.234,56" → 1234.56) and converted
   * to numbers internally.
   *
   * **nullOnEmpty**: When `nullOnEmpty` is `true`, empty input emits `null` instead of `undefined`.
   *
   * **Deprecation**: String values are deprecated and will be removed in a future version.
   * A console warning is shown when strings are used. Please use `number | undefined | null` instead
   * for type safety and future compatibility.
   *
   * @example
   * ```vue
   * <!-- ✅ Recommended: number | undefined | null -->
   * <script setup>
   * const amount = ref<number | undefined>(undefined);
   * </script>
   * <template>
   *   <FzCurrencyInput v-model="amount" />
   * </template>
   *
   * <!-- ✅ With nullOnEmpty: number | null -->
   * <script setup>
   * const amount = ref<number | null>(null);
   * </script>
   * <template>
   *   <FzCurrencyInput v-model="amount" :nullOnEmpty="true" />
   * </template>
   *
   * <!-- ⚠️ Deprecated: string (still works but shows warning) -->
   * <script setup>
   * const amount = ref<string>("1234,56");
   * </script>
   * <template>
   *   <FzCurrencyInput v-model="amount" />
   * </template>
   * ```
   */
  modelValue?: number | string | undefined | null;
}

export { FzInputProps, FzCurrencyInputProps };
