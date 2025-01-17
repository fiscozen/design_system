export type FzRadioProps = {
  /**
   * The label of the radio button
   */
  label: string;
  /**
   * The value of the radio button. Defaults to the label if not provided
   */
  value?: string;
  /**
   * Value of the currently selected value
   */
  modelValue?: string;
  /**
   * Whether the radio button is checked
   */
  checked?: boolean;
  /**
   * If true, no label will be rendered
   */
  standalone?: boolean;
  /**
   * The size of the radio button
   */
  size: "sm" | "md";
  /**
   * If true, the radio button will be emphasized
   */
  emphasis?: boolean;
  /**
   * If true, the radio button will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the radio button will be in an error state
   */
  error?: boolean;
  /**
   * the name of the radio button group to which the radio button belongs
   */
  name?: string;
  /**
   * If the radio button is required
   */
  required?: boolean;
};

export type FzRadioGroupProps = {
  /**
   * The label of the radio button group
   */
  label: string;
  /**
   * The size of the radio button
   */
  size?: "sm" | "md";
  /**
   * If true, the radio button will be emphasized
   */
  emphasis?: boolean;
  /**
   * If true, the radio button will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the radio button will be in an error state
   */
  error?: boolean;
  /**
   * the name of the radio button group to which the radio button belongs
   */
  name?: string;
  /**
   * If the radio button is required
   */
  required?: boolean;
};

export type FzRadioSharedProps = {};

export type FzRadioCardProps = FzRadioProps & {
  orientation?: "horizontal" | "vertical";
  title: string;
  subtitle?: string;
  imageUrl?: string;
  tooltip?: string;
};
