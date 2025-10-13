import { FzTooltipProps } from "@fiscozen/tooltip";

export type FzCheckboxProps = {
  /**
   * The label of the checkbox
   */
  label: string;
  /**
   * The value of the checkbox. If not provided, the value will be the label
   */
  value?: string | number | boolean;
  /**
   * The size of the checkbox
   */
  size?: "sm" | "md";
  /**
   * if the checkbox is indeterminate
   */
  indeterminate?: boolean;
  /**
   * If true, the checkbox will be emphasized
   */
  emphasis?: boolean;
  /**
   * If true, the checkbox will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the checkbox will be in an error state
   */
  error?: boolean;
  /**
   * If the checkbox is required
   */
  required?: boolean;
  /**
   * If the checkbox is standalone
   */
  standalone?: boolean;
  /**
   * Tooltip props for the checkbox
   */
  tooltip?: FzTooltipProps;
  /**
   * ARIA owns attribute for hierarchical checkboxes
   */
  ariaOwns?: string;
  /**
   * Custom ID for the checkbox (if not provided, a random ID will be generated)
   */
  checkboxId?: string;
};

export type FzCheckboxGroupProps = {
  /**
   * The label of the checkbox group
   */
  label: string;
  /**
   * The size of the checkbox
   */
  size: "sm" | "md";
  /**
   * The checkbox to render
   */
  options: ParentCheckbox[];
  /**
   * If true, the checkbox will be emphasized
   */
  emphasis?: boolean;
  /**
   * If true, the checkbox will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the checkbox will be in an error state
   */
  error?: boolean;
  /**
   * If the checkbox group is required
   */
  required?: boolean;
  /**
   * If true, the checkbox group will be horizontal
   */
  horizontal?: boolean;
};
export type ParentCheckbox = ChildCheckbox & { children?: ChildCheckbox[] };
export type ChildCheckbox = Omit<FzCheckboxProps, "size">;
