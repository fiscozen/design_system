import { FzSelectProps, FzSelectOptionsProps } from "@fiscozen/select";
import { FzInputProps } from "@fiscozen/input";
import { IconVariant } from "@fiscozen/icons";

interface FzTypeaheadProps {
  /**
   * @deprecated
   */
  selectProps?: FzSelectProps;
  /**
   * @deprecated
   */
  inputProps?: FzInputProps;
  /**
   * If true, writing in the input will filter the options
   */
  filtrable?: boolean;
  /**
   * @deprecated use `selectProps.options` instead
   */
  filteredOptions?: FzSelectOptionsProps[];
  options?: FzSelectOptionsProps[];
  filterFn?: (text?: string) => FzSelectOptionsProps[];
  delayTime?: number;
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
   * The size of the typeahead
   */
  size?: "sm" | "md" | "lg";
  /**
   * The label displayed on top of the input
   */
  label: string;
  /**
   * The placeholder displayed in the input
   */
  placeholder?: string;
  /**
   * If set to true, the input is valid
   */
  valid?: boolean;
  /**
   * sets input state to error and shows the message
   */
  errorMessage?: string;
  /**
   * marked as read only (no input allowed)
   */
  readonly?: boolean;
  /**
   * If set to true, the input is disabled
   */
  disabled?: boolean;
  /**
   * If set to true, the input is required
   */
  required?: boolean;
  /**
   * This text will be displayed at the bottom of the input
   * to give a description or context.
   */
  helpText?: string;
  /**
   * Default empty search behavior
   */
  emptySearchNoFilter?: boolean;
  /**
   * Disable free input (not selection)
   */
  disableFreeInput?: boolean;
}

export { FzTypeaheadProps };
