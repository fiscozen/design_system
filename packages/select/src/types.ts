import { FzFloatingProps } from "@fiscozen/composables";
import { IconButtonVariant } from '@fiscozen/button';
import { Ref } from "vue";

export interface FzSelectProps extends FzFloatingProps {
  /**
   * The list of options displayed in the floating panel
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
   * @default false
   */
  required?: boolean;
  /**
   * If set to true, the input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If set to true, the input is readonly
   * @default false
   */
  readonly?: boolean;
  /**
   * If set to true, the input is in error state
   * @default false
   */
  error?: boolean;
  /**
   * The size of the input
   * @default 'md'
   * @deprecated Size prop is deprecated. The select component now uses a fixed 'lg' size. This prop will be removed in a future version.
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
   * Right icon variant
   */
  rightIconButtonVariant?: IconButtonVariant;
  /**
   * Right icon button vs simple icon
   * @default false
   */
  rightIconButton?: boolean;
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
   * @default 25
   */
  optionsToShow?: number;
  /**
   * will be used in the floating composable overriding other values
   */
  overrideOpener?: Ref<HTMLElement>;
  /**
   * Disable the truncation of any text in the options
   * @default false
   */
  disableTruncate?: boolean;
  /**
   * Select variant
   * @default 'normal'
   */
  variant?: 'normal' | 'floating-label';
  /**
   * Environment context for styling
   * @default 'frontoffice'
   */
  environment?: 'backoffice' | 'frontoffice';
  /**
   * Whether to position right icon before or after chevron
   * @default false
   * @deprecated rightIconLast prop is deprecated. The right icon is now always positioned before the chevron. This prop will be removed in a future version.
   */
  rightIconLast?: boolean;
  /**
   * The Select can be cleared
   * @default true
   */
  clearable?: boolean;
}

export type FzSelectOptionsProps = FzSelectOptionProps | FzSelectLabelProps;

export type FzSelectOptionProps = {
  /**
   * the option value
   */
  value: string;
  /**
   * the option label
   */
  label: string;
  /**
   * the subtitle of the option
   */
  subtitle?: string;
  /**
   * if true the option will not be selectable
   * @default false
   */
  disabled?: boolean;
  /**
   * same as disabled, but without grey text
   * @default false
   */
  readonly?: boolean;
  /**
   * the type of option
   * @default 'option'
   */
  kind?: "option";
};

export type FzSelectLabelProps = {
  /**
   * the text of the label
   */
  label: string;
  /**
   * the type of option
   */
  kind: "label";
};
