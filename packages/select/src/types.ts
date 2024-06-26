export type FzSelectProps = {
  /**
   * The list of options displayer in the floating panel
   */
  options: FzSelectOptionsProps[];
  /**
   * The label displayed on top of the input
   */
  label: string;
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
   * The size of the input
   */
  size?: "sm" | "md" | "lg";
  /**
   * Left icon name
   */
  leftIcon?: string;
  /**
   * Right icon name
   */
  rightIcon?: string;
  /**
   * The class applied to the input
   */
  pickerClass?: string;
};

export type FzSelectOptionsProps = {
  /**
   * the option value
   */
  value: string;
  /**
   * the option label
   */
  label: string;
};
