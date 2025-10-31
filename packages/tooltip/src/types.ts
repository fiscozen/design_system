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

  /**
   * Controls interactive behavior and keyboard accessibility.
   * 
   * **Auto-detection support:** FzButton, FzIconButton, FzLink
   * 
   * - `undefined` or `'auto'` (default): Auto-detects supported components
   * - `true`: Forces interactive behavior (removes wrapper tabindex)
   * - `false`: Forces non-interactive behavior (adds wrapper tabindex="0")
   * 
   * Auto-detection handles nested structures (v-if, v-else, templates).
   * Use explicit true/false only to override auto-detection in edge cases.
   * 
   * @default undefined (auto-detection)
   * 
   * @example
   * // Auto-detection (recommended)
   * <FzTooltip text="Save changes">
   *   <FzButton>Save</FzButton> // Auto-detected as interactive
   * </FzTooltip>
   * 
   * @example
   * // Explicit auto-detection
   * <FzTooltip text="Save changes" interactive="auto">
   *   <FzButton>Save</FzButton>
   * </FzTooltip>
   * 
   * @example
   * // Force interactive (override auto-detection)
   * <FzTooltip text="Info" :interactive="true">
   *   <span @click="handleClick">Info</span> // Treated as interactive
   * </FzTooltip>
   * 
   * @example
   * // Force non-interactive (override auto-detection)
   * <FzTooltip text="Disabled action" :interactive="false">
   *   <FzButton disabled>Save</FzButton> // Adds extra tab stop
   * </FzTooltip>
   */
  interactive?: boolean | 'auto';

  /**
   * **FOR DESIGN REVIEW ONLY - DO NOT USE IN PRODUCTION**
   * 
   * Forces the tooltip to remain visible regardless of hover/focus state.
   * Intended exclusively for design review in Storybook and debugging purposes.
   * 
   * This prop bypasses all normal tooltip visibility logic (hover, focus, keyboard)
   * and should never be used in production code. It exists solely to allow designers
   * to inspect tooltip styling, positioning, and content in Storybook.
   * 
   * @default false
   * 
   * @example Storybook usage only
   * <FzTooltip text="Review this design" _forceOpenForDesignReview>
   *   <span>Element</span>
   * </FzTooltip>
   */
  _forceOpenForDesignReview?: boolean;
}
