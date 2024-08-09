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

};

export { FzInputProps };
