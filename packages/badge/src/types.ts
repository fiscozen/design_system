import type { IconVariant } from "@fiscozen/icons";

export type FzBadgeVariant = "text" | "number";
export type FzBadgeTone =
  | "dark"
  | "light"
  | "info"
  | "blue"
  | "success"
  | "warning"
  | "error";

export interface FzBadgeProps {
  /**
   * Variant of the badge - text or number
   */
  variant?: FzBadgeVariant;
  /**
   * Color tone of the badge
   */
  tone?: FzBadgeTone;
  /**
   * Name of the icon to display on the left (if provided, icon will be rendered)
   */
  leftIcon?: string;
  /**
   * Name of the icon to display on the right (if provided, icon will be rendered)
   */
  rightIcon?: string;
  /**
   * Variant of the left icon
   */
  leftIconVariant?: IconVariant;
  /**
   * Variant of the right icon
   */
  rightIconVariant?: IconVariant;
  /**
   * @deprecated Use `tone` instead. Will be removed in future versions
   */
  color?:
    | "black"
    | "blue"
    | "error"
    | "warning"
    | "success"
    | "info"
    | "light"
    | "dark";
  /**
   * @deprecated Size is fixed at 24px. Will be removed in future versions
   */
  size?: "sm" | "md" | "lg";
}
