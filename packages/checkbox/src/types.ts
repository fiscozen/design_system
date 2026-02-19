/**
 * Type definitions for the Fiscozen Checkbox component library.
 *
 * Provides TypeScript type definitions for checkbox components including
 * single checkboxes, checkbox groups, and hierarchical checkbox structures.
 *
 * @module @fiscozen/checkbox/types
 */
import { FzTooltipProps } from "@fiscozen/tooltip";
import { FzTooltipStatus } from "@fiscozen/tooltip";

/**
 * Props for the FzCheckbox component.
 *
 * Supports both single-selection (boolean v-model) and multi-selection (array v-model).
 * Can be used standalone or as part of a checkbox group.
 */
export type FzCheckboxProps = {
  /**
   * Text label displayed next to the checkbox.
   * Used for aria-labelledby when not in standalone mode.
   */
  label: string;

  /**
   * Value associated with the checkbox when used in array v-model.
   * Falls back to label if not provided.
   *
   * @default label
   */
  value?: string | number | boolean;

  /**
   * Visual size of the checkbox.
   *
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Checkboxes now have a fixed size equivalent to the former "md" size.
   */
  size?: "sm" | "md";
  /**
   * Displays indeterminate state (partial selection).
   * Used for parent checkboxes when some (but not all) children are selected.
   * Screen readers announce this as "mixed" via aria-checked="mixed".
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Applies emphasis styling with blue icon when checked.
   * Highlights important or primary selection options.
   *
   * @default false
   */
  emphasis?: boolean;

  /**
   * Disables the checkbox, preventing user interaction.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows error state with red styling.
   * Use with error slot to display validation messages.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Marks the checkbox as required for form validation.
   * Adds aria-required attribute for accessibility.
   *
   * @default false
   */
  required?: boolean;
  /**
   * Renders only the checkbox icon without label text.
   * Label is used for aria-label instead of being displayed.
   * Useful for compact UIs or table cells.
   *
   * @default false
   */
  standalone?: boolean;

  /**
   * Configuration for optional tooltip icon.
   * Displays info icon next to checkbox with hover tooltip.
   */
  tooltip?: FzTooltipProps;
  /**
   * Space-separated list of child checkbox IDs for aria-owns.
   * Establishes semantic parent-child relationships for screen readers.
   * Automatically managed by FzCheckboxGroupOption in hierarchical structures.
   *
   * @example "checkbox-child-0 checkbox-child-1 checkbox-child-2"
   */
  ariaOwns?: string;

  /**
   * Custom ID for the checkbox input element.
   * Auto-generated if not provided using timestamp + random suffix.
   * Used by FzCheckboxGroupOption for deterministic ARIA relationships.
   *
   * @example "my-custom-checkbox-id"
   */
  checkboxId?: string;
};

/**
 * Props for the FzCheckboxGroup component.
 *
 * Container component for managing multiple related checkboxes with shared labeling,
 * validation, and accessibility features. Supports both flat lists and hierarchical
 * parent-child checkbox structures with automatic indeterminate state management.
 */
export type FzCheckboxGroupProps = {
  /**
   * Label text for the entire checkbox group.
   * Connected to group via aria-labelledby for screen reader accessibility.
   */
  label: string;

  /**
   * Visual size for all checkboxes in the group.
   *
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Checkboxes now have a fixed size equivalent to the former "md" size.
   */
  size?: "sm" | "md";

  /**
   * Array of checkbox options to render.
   * Supports flat lists and hierarchical parent-child structures.
   * Parent checkboxes automatically show indeterminate state when partially selected.
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
  options?: ParentCheckbox[];

  /**
   * Applies emphasis styling to all checkboxes in the group.
   * Icons turn blue when checked.
   *
   * @default false
   */
  emphasis?: boolean;

  /**
   * Disables all checkboxes in the group.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Shows error state for all checkboxes.
   * Use with error slot to display validation messages.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Marks the group as required for form validation.
   * Adds aria-required to the group container.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Arranges checkboxes horizontally instead of vertically.
   * Useful for compact layouts or inline forms.
   *
   * @default false
   */
  horizontal?: boolean;
};

/**
 * Checkbox option that can optionally have child checkboxes.
 * Used for hierarchical structures with parent-child relationships.
 * Parent checkboxes automatically display indeterminate state when children are partially selected.
 */
export type ParentCheckbox = ChildCheckbox & {
  /**
   * Optional array of child checkboxes for hierarchical structures.
   * Parent shows indeterminate state when some (but not all) children are selected.
   * Parent checkbox controls all children when toggled.
   */
  children?: ChildCheckbox[];
};

/**
 * Individual checkbox option within a group.
 * Inherits all FzCheckboxProps except 'size' which is controlled by the parent group.
 */
export type ChildCheckbox = Omit<FzCheckboxProps, "size">;

/**
 * Shared props for all FzCheckboxCard variants.
 */
type FzCheckboxCardBaseProps = Omit<
  FzCheckboxProps,
  "standalone" | "indeterminate" | "ariaOwns" | "checkboxId" | "value" | "tooltip"
> & {
  /**
   * Value associated with the card when used in array v-model.
   * Falls back to label if not provided.
   */
  value?: string | number;

  /**
   * Primary title text displayed in the card.
   */
  title: string;

  /**
   * Optional secondary description text below the title.
   */
  subtitle?: string;

  /**
   * Alt text for the card image.
   */
  imageAlt?: string;

  /**
   * Text to display in the tooltip.
   */
  tooltip?: string;

  /**
   * Status of the tooltip (determines color and icon).
   */
  tooltipStatus?: FzTooltipStatus;

  /**
   * Controls whether the checkbox icon is shown inside the card.
   *
   * @default true
   */
  hasCheckbox?: boolean;

  /**
   * Group name for the checkbox, used for form submission.
   */
  name?: string;
};

/**
 * Horizontal card layout: image left, text right (compact).
 * Image is optional.
 *
 * @default variant is 'horizontal' when omitted
 */
type FzCheckboxCardHorizontal = FzCheckboxCardBaseProps & {
  variant?: "horizontal";
  imageUrl?: string;
};

/**
 * Vertical card layout: image top, text bottom (full-width image).
 * Image is required — the vertical layout is designed around the image.
 */
type FzCheckboxCardVertical = FzCheckboxCardBaseProps & {
  variant: "vertical";
  imageUrl: string;
};

/**
 * Props for the FzCheckboxCard component.
 *
 * A card-style checkbox with title, subtitle, optional image and tooltip.
 * Uses a discriminated union on `variant` to enforce that the vertical layout
 * always includes an image (since the layout is designed around it).
 *
 * Uses array v-model for multi-select.
 */
export type FzCheckboxCardProps =
  | FzCheckboxCardHorizontal
  | FzCheckboxCardVertical;
