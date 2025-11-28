import { IconVariant } from "@fiscozen/icons";
import { FzLinkProps } from "@fiscozen/link";
import { RouteLocation, RouteLocationRaw } from "vue-router";

// Environment variants
export type FzActionEnvironment = "backoffice" | "frontoffice";

// Layout variants
export type FzActionVariant = "textLeft" | "textCenter" | "onlyIcon";

// Common props shared by both link and button actions
export type FzActionCommonProps =
  | FzActionOnlyIconProps
  | FzActionStandardIconProps;

export type FzActionOnlyIconProps = FzActionBasicProps & {
  /**
   * Only icon variant
   */
  variant: "onlyIcon";
  /**
   * Name of the fontawesome icon
   */
  iconName: string;
  /**
   * Variant of the fontawesome icon
   */
  iconVariant: IconVariant;
};

export type FzActionStandardIconProps = FzActionBasicProps & {
  /**
   * Text left or text center variant
   */
  variant?: "textLeft" | "textCenter";
  /**
   * Name of the fontawesome icon (left side)
   */
  iconLeftName?: string;
  /**
   * Variant of the fontawesome icon (left side)
   */
  iconLeftVariant?: IconVariant;
  /**
   * Name of the fontawesome icon (right side)
   */
  iconRightName?: string;
  /**
   * Variant of the fontawesome icon (right side)
   */
  iconRightVariant?: IconVariant;
};

type FzActionBasicProps = {
  /**
   * Alternative prop to default label slot
   */
  label?: string;
  /**
   * Sub-label text (smaller text below the main label)
   */
  subLabel?: string;
  /**
   * Disables the action
   */
  disabled?: boolean;
  /**
   * Readonly state (visually identical to disabled but semantically different)
   */
  readonly?: boolean;
  /**
   * Environment variant (backoffice/frontoffice)
   */
  environment?: FzActionEnvironment;
  /**
   * Layout variant (textLeft/textCenter/onlyIcon)
   */
  variant?: FzActionVariant;
  /**
   * Whether text should be truncated
   */
  isTextTruncated?: boolean;
  /**
   * Type of the action (link/action)
   */
  type?: "link" | "action";
  /**
   * Unique ID for the action element (used for ARIA relationships)
   */
  id?: string;
  /**
   * Visual focus state (for keyboard navigation)
   */
  focused?: boolean;
  /**
   * ARIA role for the action element (e.g., "option", "menuitem")
   * @default undefined (no role attribute)
   */
  role?: string;
  /**
   * ARIA selected state (used when role="option")
   * @default undefined
   */
  ariaSelected?: boolean;
};

// Discriminated union for action props
export type FzActionProps = FzActionLinkProps | FzActionButtonProps;

export type FzActionLinkProps = FzActionCommonProps & {
  type: "link";
  meta?: CustomRouteLocation;
  to: RouteLocationRaw;
  replace?: boolean;
  target?: string;
  external?: boolean;
};

export type FzActionButtonProps = FzActionCommonProps & {
  type: "action";
};

export type CustomRouteLocation =
  | { path: string; name?: string }
  | { name: string; path?: string };

// ActionList component props
export interface FzActionListProps {
  /**
   * Additional CSS classes to apply to the action list container
   */
  listClass?: string;
  /**
   * ARIA role for the list container (e.g., 'listbox' for select-like behavior)
   */
  role?: string;
  /**
   * ARIA labelledby attribute (references the ID of the element that labels this list)
   */
  ariaLabelledby?: string;
  /**
   * ARIA activedescendant attribute (indicates which child element is currently focused)
   */
  ariaActivedescendant?: string;
}

// ActionLabel component props
export interface FzActionSectionProps {
  /**
   * Label text content
   */
  label?: string;
}
