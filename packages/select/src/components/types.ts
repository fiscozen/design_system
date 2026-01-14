/**
 * Type definitions for FzSelect internal components.
 *
 * @module @fiscozen/typeahead/components/types
 */

import { IconVariant } from "@fiscozen/icons";
import { IconButtonVariant } from "@fiscozen/button";
import { FzSelectOptionProps, FzSelectOptionsProps } from "../types";

/**
 * Props for FzSelectLabel component
 *
 * Presentational component that renders the label with required indicator.
 */
export interface FzSelectLabelProps {
  /**
   * Unique ID for the label element
   */
  labelId: string;
  /**
   * ID of the opener button (for htmlFor attribute)
   */
  openerId: string;
  /**
   * Label text
   */
  label: string;
  /**
   * Whether the typeahead is required
   */
  required?: boolean;
  /**
   * Whether the typeahead is disabled
   */
  disabled?: boolean;
  /**
   * Whether the typeahead is readonly
   */
  readonly?: boolean;
}

/**
 * Props for FzSelectButton component
 *
 * Presentational component that renders the opener button with icons and selected value.
 */
export interface FzSelectButtonProps {
  /**
   * Unique ID for the button
   */
  openerId: string;
  /**
   * Label ID for aria-labelledby
   */
  labelId?: string;
  /**
   * Label text (for aria-label when labelId is not provided)
   */
  label?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Selected option object
   */
  selectedOption?: FzSelectOptionProps;
  /**
   * Whether dropdown is open
   */
  isOpen: boolean;
  /**
   * Whether typeahead is required
   */
  required?: boolean;
  /**
   * Whether typeahead is disabled
   */
  disabled?: boolean;
  /**
   * Whether typeahead is readonly
   */
  readonly?: boolean;
  /**
   * Whether typeahead is in error state
   */
  error?: boolean;
  /**
   * Left icon name
   */
  leftIcon?: string;
  /**
   * Visual style variant for left icon (solid, regular, light, etc.)
   */
  leftIconVariant?: IconVariant;
  /**
   * Right icon name
   */
  rightIcon?: string;
  /**
   * Visual style variant for right icon (solid, regular, light, etc.)
   */
  rightIconVariant?: IconVariant;
  /**
   * Environment (backoffice or frontoffice)
   */
  environment?: "backoffice" | "frontoffice";
  /**
   * Additional CSS classes
   */
  pickerClass?: string;
  /**
   * If true, writing in the input will filter the options
   * @default true
   */
  filterable?: boolean;
  /**
   * Visual variant (normal or floating-label)
   * Only applicable when filterable is false.
   * @default 'normal'
   */
  variant?: "normal" | "floating-label";
  /**
   * Whether right icon is a button.
   * @default false
   */
  rightIconButton?: boolean;
  /**
   * Right icon button variant.
   * Only applicable when rightIconButton is true.
   * @default 'invisible'
   */
  rightIconButtonVariant?: IconButtonVariant;
  /**
   * If true, shows a clear icon when a value is selected.
   * @default false
   */
  clearable?: boolean;
}

/**
 * Props for FzSelectHelpError component
 *
 * Presentational component that renders help text or error message.
 */
export interface FzSelectHelpErrorProps {
  /**
   * Whether typeahead is in error state
   */
  error?: boolean;
  /**
   * Whether typeahead is disabled
   */
  disabled?: boolean;
  /**
   * Whether typeahead is readonly
   */
  readonly?: boolean;
}

/**
 * Props for FzSelectOptionsList component
 *
 * Presentational component that renders the list of options with lazy loading support.
 */
export interface FzSelectOptionsListProps {
  /**
   * Unique ID for the opener button (for ARIA labelledby)
   */
  openerId: string;
  /**
   * List of visible options to render.
   * If undefined, shows a loading indicator (FzProgress).
   */
  visibleOptions: FzSelectOptionsProps[] | undefined;
  /**
   * Value of the currently focused option (for keyboard navigation)
   */
  focusedOptionValue: string | null;
  /**
   * Currently selected value
   */
  selectedValue?: string;
  /**
   * Whether to disable text truncation in options
   * @default false
   */
  disableTruncate?: boolean;
  /**
   * Message to display when no options are available
   * @default 'Nessun risultato trovato'
   */
  noResultsMessage?: string;
  /**
   * Minimum width for the options container (CSS value)
   */
  containerWidth: string;
  /**
   * Maximum width for the options container (CSS value)
   */
  openerMaxWidth: string;
  /**
   * Maximum height for the options container (CSS value)
   */
  maxHeight: string;
  /**
   * ID of the currently active descendant (for ARIA)
   */
  activeDescendantId?: string;
}
