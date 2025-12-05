import { FzFloatingProps } from "@fiscozen/composables";
import { IconVariant } from "@fiscozen/icons";
import { FzSelectProps, FzSelectOptionsProps } from "@fiscozen/select";

export interface FzTypeaheadProps extends FzFloatingProps {
  /**
   * The list of options displayed in the floating panel.
   * If undefined, shows a loading indicator (FzProgress).
   */
  options?: FzTypeaheadOptionsProps[];
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
   * @deprecated Size prop is deprecated. The typeahead component now uses a fixed 'lg' size. This prop will be removed in a future version.
   */
  size?: "sm" | "md" | "lg";
  /**
   * FontAwesome icon name displayed on the left side of the typeahead
   */
  leftIcon?: string;
  /**
   * Visual style variant for left icon
   */
  leftIconVariant?: IconVariant;
  /**
   * FontAwesome icon name displayed on the right side of the typeahead (before chevron)
   */
  rightIcon?: string;
  /**
   * Visual style variant for right icon
   */
  rightIconVariant?: IconVariant;
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
   * Environment context that determines sizing and spacing (backoffice: compact, frontoffice: spacious)
   * @default 'frontoffice'
   */
  environment?: 'backoffice' | 'frontoffice';
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
  /**
   * Deprecated: Use the 'options' prop instead.
   * @deprecated This prop is deprecated and will be removed in a future version. Please use the 'options' prop instead.
   */
  selectProps?: FzSelectProps;
  /**
   * Deprecated: Use the 'options' prop instead.
   * @deprecated This prop is deprecated and will be removed in a future version. Please use the 'options' prop instead.
   */
  inputProps?: FzSelectProps;
  /**
   * Deprecated: Use the 'options' prop instead.
   * @deprecated This prop is deprecated and will be removed in a future version. Please use the 'options' prop instead.
   */
  filteredOptions?: FzSelectOptionsProps[];
  /**
   * If true, writing in the input will filter the options
   * @default true
   */
  filtrable?: boolean;
  /**
   * Async function to filter the options
   * Can be used for server-side filtering
   */
  filterFn?: (text?: string) => Promise<FzTypeaheadOptionsProps[]> | FzTypeaheadOptionsProps[];
  /**
   * Delay in milliseconds before applying filter after user stops typing
   * @default 500
   */
  delayTime?: number;
  /**
   * Deprecated: This prop is no longer used and has no effect.
   * @deprecated This prop is deprecated and will be removed in a future version. The component no longer emits input events on focus.
   */
  disableEmitOnFocus?: boolean;
  /**
   * Deprecated: This prop is no longer used and has no effect.
   * @deprecated This prop is deprecated and will be removed in a future version. The component now always shows all options when the input is empty.
   */
  emptySearchNoFilter?: boolean;
}

export type FzTypeaheadOptionsProps = FzTypeaheadOptionProps | FzTypeaheadLabelProps;

export type FzTypeaheadOptionProps = {
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

export type FzTypeaheadLabelProps = {
  /**
   * Display text for the section separator
   */
  label: string;
  /**
   * Type discriminator for label separators
   */
  kind: "label";
};
