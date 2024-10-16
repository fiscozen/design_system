import { FzFloatingProps } from "@fiscozen/composables";

export interface FzSelectProps extends FzFloatingProps {
  /**
   * The list of options displayer in the floating panel
   */
  options: FzSelectOptionsProps[];
  /**
   * The label displayed on top of the input
   */
  label?: string;
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
  /**
   * Ref to the element that opens the selection
   */
  extOpener?: HTMLElement;
  /**
   * Set the max height of the floating panel
   */
  floatingPanelMaxHeight?: string;
  /**
   * Size of the options to render each time in the floating panel
   */
  optionsToShow?: number;
}

export type FzSelectOptionsProps = {
  /**
   * the option value
   */
  value: string;
  /**
   * the option label
   */
  label: string;
  /**
   * if true the option will not be selectable
   */
  disabled?: boolean;
  /**
   * same as disabled, but without grey text
   */
  readonly?: boolean;
};
