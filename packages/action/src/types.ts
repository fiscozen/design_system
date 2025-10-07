import { IconVariant } from "@fiscozen/icons";
import { FzLinkProps } from "@fiscozen/link";
import { RouteLocation } from "vue-router";

// Environment variants
export type FzActionEnvironment = "backoffice" | "frontoffice";

// Layout variants
export type FzActionVariant = "textLeft" | "textCenter" | "onlyIcon";

// Common props shared by both link and button actions
export interface FzActionCommonProps {
  /**
   * Name of the fontawesome icon
   */
  iconName?: string;
  /**
   * Variant of the fontawesome icon
   */
  iconVariant?: IconVariant;
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
}

// Props specific to link actions (from FzLink)

// Discriminated union for action props
export type FzActionProps =
  | (FzActionCommonProps &
      FzLinkProps & {
        type: "link";
        meta: CustomRouteLocation;
      })
  | (FzActionCommonProps & {
      type: "action";
    });

// Helper type for Vue Router route locations
type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>;

export type CustomRouteLocation = PartialExcept<RouteLocation, "path" | "name">;
