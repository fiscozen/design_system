import { FzFloatingPosition } from '@fiscozen/composables'

export type FzTooltipStatus = 'neutral' | 'informative' | 'positive' | 'alert' | 'error'

/**
 * Props for the FzTooltip component.
 */
export interface FzTooltipProps {
  /**
   * The position of the tooltip relative to the target element.
   * Defaults to 'auto'.
   */
  position?: FzFloatingPosition;

  /**
   * The status of the tooltip, which determines its color and icon.
   * Can be 'neutral', 'informative', 'positive', 'alert', or 'error'.
   * Defaults to 'neutral'.
   */
  status?: FzTooltipStatus;

  /**
   * The text content to display inside the tooltip.
   */
  text?: string;

  /**
   * Whether to display an icon in the tooltip.
   * Defaults to false.
   */
  withIcon?: boolean;

  /**
   * Accessible label for the tooltip trigger element.
   * Used by screen readers to describe the trigger's purpose.
   */
  ariaLabel?: string;
}
