import { IconButtonVariant } from "@fiscozen/button";
import { IconSize , IconVariant } from "@fiscozen/icons";

type FzInputProps = {
  /**
   * The label displayed on top of the input
   */
  label?: string;
  /**
   * The size of the input
   */
  size?: "sm" | "md" | "lg";
  /**
   * The placeholder displayed in the input
   */
  placeholder?: string;
  /**
   * Secondary - floating like placeholder
   */
  secondaryPlaceholder?: string;
  /**
   * If set to true, the input is required
   */
  required?: boolean;
  /**
   * If set to true, the input is disabled
   */
  disabled?: boolean;
  /**
   * If set to true, the input is in error state
   */
  error?: boolean;
  /**
   * Left icon name
   */
  leftIcon?: string;
  /**
   * Left icon variant
   */
  leftIconVariant?: IconVariant;
  /**
   * Left icon button variant
   */
  leftIconButtonVariant?: IconButtonVariant;
  /**
   * Right icon name
   */
  rightIcon?: string;
  /**
   * Right icon name
   */
  rightIconSize?: IconSize;
  /**
   * Right icon variant
   */
  rightIconVariant?: IconVariant;
  /**
   * Right icon button vs normal icon
   */
  rightIconButton?: boolean;
  /**
   * Right icon button variant
   */
  rightIconButtonVariant?: IconButtonVariant;
  /**
   * The input type
   */
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  /**
   * If set to true, the input is valid
   */
  valid?: boolean;
  /**
   * Input variant
   */
  variant?: 'normal' | 'floating-label';
  /**
   * Pattern to validate the input
   */
  pattern?: string;
  /**
   * Defines the textarea key in a form
   */
  name?: string;

  /**
   * native readonly input value
   */
  readonly?: boolean;

  /**
   * native maxlength input value
   */
  maxlength?: number;

  /**
   * right icon class
   */
  rightIconClass?: string;

  /**
   * left icon class
   */
  leftIconClass?: string;
};

interface FzCurrencyInputProps
  extends Omit<FzInputProps, "type" | "modelValue"> {
  /**
   * Is set to true, an empty string will be casted to null
   */
  nullOnEmpty?: boolean;
  /**
   * Minimum number of decimal places allowed, set null to allow arbitrary decimal values length
   * note that limits from Intl.NumberFormat still apply
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  minimumFractionDigits?: number;
  /**
   * Maximum number of decimal places allowed, set null to allow arbitrary decimal values length
   * note that limits from Intl.NumberFormat still apply
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#digit_options
   */
  maximumFractionDigits?: number;
  /**
   * Minimum number value
   */
  min?: number;
  /**
   * Maximum number value
   */
  max?: number;
  /**
   * Quantized step
   */
  step?: number;
  /**
   * Allow only mutiples of step
   */
  forceStep?: boolean;
}

export { FzInputProps, FzCurrencyInputProps };
