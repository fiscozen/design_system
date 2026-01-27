import { IconButtonVariant } from "@fiscozen/button";
import { IconSize , IconVariant } from "@fiscozen/icons";

export type InputEnvironment = "backoffice" | "frontoffice";

type FzInputProps = {
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
   * Native HTML input type. Determines keyboard layout and validation behavior
   * @default 'text'
   */
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  /**
   * Shows success checkmark icon on the right when true. Takes precedence over rightIcon
   * @default false
   */
  valid?: boolean;
  /**
   * Visual presentation style. 'floating-label' moves placeholder above input when focused/filled
   * @default 'normal'
   */
  variant?: 'normal' | 'floating-label';
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
   * Additional CSS classes applied to left icon container
   */
  leftIconClass?: string;
};

interface FzCurrencyInputProps
  extends Omit<
    FzInputProps,
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
  /**
   * Converts empty input to null instead of undefined.
   * When true, empty input (v-model undefined) will emit null instead of undefined.
   * @default false
   */
  nullOnEmpty?: boolean;
  /**
   * Converts empty input to 0 instead of undefined.
   * When true, empty input (v-model undefined) will emit 0 instead of undefined.
   * @default false
   */
  zeroOnEmpty?: boolean;
  /**
   * Minimum decimal places in formatted output
   * @default 2
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  minimumFractionDigits?: number;
  /**
   * Maximum decimal places in formatted output
   * @default 2
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  maximumFractionDigits?: number;
  /**
   * Minimum allowed value. Values below this are clamped to min
   */
  min?: number;
  /**
   * Maximum allowed value. Values above this are clamped to max
   */
  max?: number;
  /**
   * Step increment for arrow buttons. When forceStep is true, values are rounded to nearest step multiple
   * @default 1
   */
  step?: number;
  /**
   * Enforces quantization: values are automatically rounded to nearest step multiple
   * @default false
   */
  forceStep?: boolean;
  /**
   * Custom accessible label for step up button. If not provided, uses default label.
   */
  stepUpAriaLabel?: string;
  /**
   * Custom accessible label for step down button. If not provided, uses default label.
   */
  stepDownAriaLabel?: string;
}

export { FzInputProps, FzCurrencyInputProps };
