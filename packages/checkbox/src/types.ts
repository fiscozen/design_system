/**
 * Type definitions for the Fiscozen Checkbox component library.
 * 
 * @module @fiscozen/checkbox/types
 */
import { FzTooltipProps } from "@fiscozen/tooltip";

/**
 * Props for the FzCheckbox component.
 * 
 * Supports both single-selection (boolean v-model) and multi-selection (array v-model).
 * Can be used standalone or as part of a checkbox group.
 */
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
   * If true, the checkbox displays an indeterminate state (partial selection).
   * Typically used for parent checkboxes when some (but not all) children are selected.
   * Screen readers announce this as "mixed" state via aria-checked="mixed".
   */
  indeterminate?: boolean;
  /**
   * If true, applies emphasis styling (icon turns blue when checked).
   * Used to highlight important or primary selection options.
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
   * If true, renders only the checkbox icon without label text.
   * Useful for compact UIs or when label is provided externally.
   * Ensure aria-label is provided for accessibility.
   */
  standalone?: boolean;
  /**
   * Tooltip props for the checkbox
   */
  tooltip?: FzTooltipProps;
  /**
   * Space-separated list of child checkbox IDs that this checkbox controls.
   * Used for aria-owns attribute to establish semantic parent-child relationships.
   * Automatically managed by FzCheckboxGroupOption for hierarchical structures.
   * 
   * @example "checkbox-child-0 checkbox-child-1 checkbox-child-2"
   */
  ariaOwns?: string;
  
  /**
   * Custom ID for the checkbox input element.
   * If not provided, a random ID will be auto-generated.
   * Used by FzCheckboxGroupOption to create deterministic IDs for ARIA relationships.
   * 
   * @example "my-custom-checkbox-id"
   */
  checkboxId?: string;
};

/**
 * Props for the FzCheckboxGroup component.
 * 
 * Container component for managing multiple related checkboxes with shared labeling,
 * validation, and accessibility features.
 */
export type FzCheckboxGroupProps = {
  /**
   * Label for the entire checkbox group.
   * Used for aria-labelledby to provide accessible name for the group.
   */
  label: string;
  
  /**
   * Size variant for all checkboxes in the group.
   * @default "md"
   */
  size: "sm" | "md";
  
  /**
   * Array of checkbox options to render.
   * Supports both flat lists and hierarchical parent-child structures.
   * 
   * @example
   * // Flat list
   * [
   *   { label: "Option 1", value: "opt1" },
   *   { label: "Option 2", value: "opt2" }
   * ]
   * 
   * @example
   * // Hierarchical structure
   * [
   *   {
   *     label: "Parent",
   *     value: "parent",
   *     children: [
   *       { label: "Child 1", value: "child1" },
   *       { label: "Child 2", value: "child2" }
   *     ]
   *   }
   * ]
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
   * If true, arranges checkboxes horizontally in a row instead of vertically.
   * @default false (vertical layout)
   */
  horizontal?: boolean;
};

/**
 * Checkbox option type that can optionally have child checkboxes.
 * Used for hierarchical checkbox structures with parent-child relationships.
 */
export type ParentCheckbox = ChildCheckbox & { 
  /**
   * Optional array of child checkboxes.
   * When present, the parent checkbox will display indeterminate state
   * when children are partially selected.
   */
  children?: ChildCheckbox[] 
};

/**
 * Child checkbox props (omits 'size' as it's inherited from group).
 * Used for individual options within a checkbox group.
 */
export type ChildCheckbox = Omit<FzCheckboxProps, "size">;
