import { FzFloatingProps } from "@fiscozen/composables";
import { IconButtonVariant } from '@fiscozen/button';

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
   * FontAwesome icon name displayed on the left side of the select
   */
  leftIcon?: string;
  /**
   * FontAwesome icon name displayed on the right side of the select (before chevron)
   */
  rightIcon?: string;
  /**
   * Visual variant for the right icon button
   * @default 'invisible'
   */
  rightIconButtonVariant?: IconButtonVariant;
  /**
   * If true, right icon is rendered as an interactive button instead of a static icon
   * @default false
   */
  rightIconButton?: boolean;
  /**
   * Additional CSS classes applied to the opener button
   */
  pickerClass?: string;
  /**
   * External HTML element to use as the opener instead of the default button
   */
  extOpener?: HTMLElement;
  /**
   * Maximum height constraint for the dropdown panel (CSS value, e.g., '300px')
   */
  floatingPanelMaxHeight?: string;
  /**
   * Number of options to render at once for virtual scrolling performance
   * @default 25
   */
  optionsToShow?: number;
  /**
   * If true, disables text truncation with ellipsis in option labels
   * @default false
   */
  disableTruncate?: boolean;
  /**
   * Visual variant of the select component
   * @default 'normal'
   */
  variant?: 'normal' | 'floating-label';
  /**
   * Environment context that determines sizing and spacing (backoffice: compact, frontoffice: spacious)
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
   * If true, allows clearing the selected value by clicking the selected option again
   * @default true
   */
  clearable?: boolean;
  /**
   * Message displayed when no options are available
   * @default 'Nessun risultato trovato'
   */
  noResultsMessage?: string;
}

export type FzSelectOptionsProps = FzSelectOptionProps | FzSelectLabelProps;

export type FzSelectOptionProps = {
  /**
   * Unique identifier for the option (used as the selected value)
   */
  value: string;
  /**
   * Display text shown in the option
   */
  label: string;
  /**
   * Optional secondary text displayed below the label
   */
  subtitle?: string;
  /**
   * If true, the option is not selectable and appears greyed out
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the option is not selectable but maintains normal text color
   * @default false
   */
  readonly?: boolean;
  /**
   * Type discriminator for option items
   * @default 'option'
   */
  kind?: "option";
};

export type FzSelectLabelProps = {
  /**
   * Display text for the section separator
   */
  label: string;
  /**
   * Type discriminator for label separators
   */
  kind: "label";
};
