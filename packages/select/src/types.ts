import { FzFloatingProps } from "@fiscozen/composables";
import { IconVariant } from "@fiscozen/icons";
import { IconButtonVariant } from "@fiscozen/button";

/**
 * Base props common to both filterable and non-filterable variants
 */
interface FzSelectBaseProps extends FzFloatingProps {
  /**
   * The list of options displayed in the floating panel.
   * If undefined, shows a loading indicator (FzProgress).
   */
  options?: FzSelectOptionsProps[];
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
   * If true, right icon is rendered as an interactive button instead of a static icon.
   * @default false
   */
  rightIconButton?: boolean;
  /**
   * Visual variant for the right icon button.
   * Only applicable when rightIconButton is true.
   * @default 'invisible'
   */
  rightIconButtonVariant?: IconButtonVariant;
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
  environment?: "backoffice" | "frontoffice";
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
   * If true, writing in the input will filter the options
   * @default false
   */
  filterable?: boolean;
}

/**
 * Props when filterable is true
 *
 * When filterable is true, the component shows an input field when open.
 * The variant prop is not available in this mode as it only applies to the button display.
 */
interface FzSelectFilterableProps extends FzSelectBaseProps {
  /**
   * If true, writing in the input will filter the options.
   * Must be explicitly set to true to enable filtering.
   */
  filterable: true;
  /**
   * Async function to filter the options
   * Can be used for server-side filtering
   */
  filterFn?: (
    text?: string,
  ) => Promise<FzSelectOptionsProps[]> | FzSelectOptionsProps[];
  /**
   * Delay in milliseconds before applying filter after user stops typing
   * @default 500
   */
  delayTime?: number;
  /**
   * If true, the component will use fuzzy search to filter the options
   * @default true
   */
  fuzzySearch?: boolean;
}

/**
 * Props when filterable is false or undefined
 *
 * When filterable is false, the component behaves like a standard select dropdown.
 * The variant prop is available in this mode to customize the button appearance.
 */
interface FzSelectNonFilterableProps extends FzSelectBaseProps {
  /**
   * If true, writing in the input will filter the options
   * @default false
   */
  filterable?: false;
  /**
   * Visual variant of the typeahead component.
   * Only applicable when filterable is false.
   * @default 'normal'
   */
  variant?: "normal" | "floating-label";
}

interface FzSelectDeprecatedProps {
  /**
   * The size of the input
   * @default 'md'
   * @deprecated Size prop is deprecated. The typeahead component now uses a fixed 'lg' size. This prop will be removed in a future version.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to position right icon before or after chevron
   * @default false
   * @deprecated rightIconLast prop is deprecated. The right icon is now always positioned before the chevron. This prop will be removed in a future version.
   */
  rightIconLast?: boolean;
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

/**
 * FzSelect component props
 *
 * Discriminated union type that ensures type safety based on filterable value:
 * - When filterable={true}: variant is not available
 * - When filterable={false} or undefined: variant is available
 *
 * Note: rightIconButton and rightIconButtonVariant are available in both modes,
 * but are only rendered when filterable is false (button mode).
 *
 * This provides compile-time type checking to guide developers on which props
 * can be used in each mode.
 */
export type FzSelectProps = FzSelectDeprecatedProps & (
  FzSelectFilterableProps
  | FzSelectNonFilterableProps
);

export type FzSelectOptionsProps =
  | FzSelectOptionProps
  | FzSelectLabelProps;

export type FzSelectOptionProps = {
  /**
   * Unique identifier for the option (used as the selected value)
   */
  value: string | number;
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
