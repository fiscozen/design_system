import { IconVariant } from "@fiscozen/icons";

type FzInputProps = {
  /**
   * The label displayed on top of the input
   */
  label: string;
  /**
   * The size of the input
   */
  size?: "sm" | "md" | "lg";
  /**
   * The placeholder displayed in the input
   */
  placeholder?: string;
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
   * Right icon name
   */
  rightIcon?: string;
  /**
   * Right icon variant
   */
  rightIconVariant?: IconVariant;
  /**
   * The input type
   */
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  /**
   * If set to true, the input is valid
   */
  valid?: boolean;
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
   * Handler of left icon click
   */
  onLeftIconClick?: () => void;
  /**
   * Handler of right icon click
   */
  onRightIconClick?: () => void;
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
}

export { FzInputProps, FzCurrencyInputProps };
