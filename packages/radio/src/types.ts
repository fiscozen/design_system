import { FzTooltipStatus } from "@fiscozen/tooltip";

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
   * @deprecated Use hasText instead (hasText={false} is equivalent to standalone={true})
   */
  standalone?: boolean;
  /**
   * The size of the radio button
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Radio buttons now have a fixed size equivalent to the former "md" size.
   */
  size: "sm" | "md";
  /**
   * The tone/variant of the radio button
   */
  tone?: "neutral" | "emphasis" | "error";
  /**
   * If true, the radio button will be emphasized
   * @deprecated Use tone="emphasis" instead
   */
  emphasis?: boolean;
  /**
   * If true, the radio button will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the radio button will be in an error state
   * @deprecated Use tone="error" instead
   */
  error?: boolean;
  /**
   * Text to display in the tooltip when hasIconRight is true
   */
  tooltip?: string;
  /**
   * Status of the tooltip (determines color and icon)
   */
  tooltipStatus?: FzTooltipStatus;
  /**
   * Controls visibility of the label text. If false, only the radio icon is shown.
   * Note: standalone={true} is equivalent to hasText={false}
   */
  hasText?: boolean;
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
   * Layout variant: vertical stacks radio buttons, horizontal arranges them in a row
   */
  variant?: "vertical" | "horizontal";
  /**
   * The tone/variant of the radio buttons
   */
  tone?: "neutral" | "emphasis" | "error";
  /**
   * If true, the radio button will be emphasized
   * @deprecated Use tone="emphasis" instead
   */
  emphasis?: boolean;
  /**
   * If true, the radio button will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the radio button will be in an error state
   * @deprecated Use tone="error" instead
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
  imageAlt?: string;
  tooltip?: string;
  /**
   * Controls whether the radio icon is shown
   * @deprecated Use hasRadio instead
   */
  radioIcon?: boolean | ((props: FzRadioCardProps) => boolean);
  /**
   * Controls whether the radio icon is shown
   */
  hasRadio?: boolean;
};
