import { IconButtonVariant } from "@fiscozen/button";
import { IconSize , IconVariant } from "@fiscozen/icons";

type FzInputProps = {
  /**
   * Text label displayed above the input field. Overridden by label slot if provided.
   */
  label?: string;
  /**
   * Visual size affecting height, padding, and text size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Placeholder text shown when input is empty. Behavior differs based on variant.
   */
  placeholder?: string;
  /**
   * Secondary placeholder for floating-label variant. Displays as floating text when input has focus or value.
   */
  secondaryPlaceholder?: string;
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
   * Font Awesome icon name displayed on the right side of input
   */
  rightIcon?: string;
  /**
   * Size override for right icon. If not provided, uses input size mapping.
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
   * Additional CSS classes applied to right icon container
   */
  rightIconClass?: string;
  /**
   * Additional CSS classes applied to left icon container
   */
  leftIconClass?: string;
};

interface FzCurrencyInputProps
  extends Omit<FzInputProps, "type" | "modelValue"> {
  /**
   * When true, empty input values are converted to null instead of 0
   * @default false
   */
  nullOnEmpty?: boolean;
  /**
   * Minimum decimal places in formatted output. Used by Intl.NumberFormat.
   * @default 2
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  minimumFractionDigits?: number;
  /**
   * Maximum decimal places in formatted output. Used by Intl.NumberFormat.
   * @default 2
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  maximumFractionDigits?: number;
  /**
   * Minimum allowed numeric value. Values below this are clamped to min
   */
  min?: number;
  /**
   * Maximum allowed numeric value. Values above this are clamped to max
   */
  max?: number;
  /**
   * Step increment for arrow buttons and quantization. When forceStep is true, values are rounded to nearest step
   */
  step?: number;
  /**
   * When true, enforces quantization: values are automatically rounded to nearest step multiple
   * @default false
   */
  forceStep?: boolean;
}

export { FzInputProps, FzCurrencyInputProps };
