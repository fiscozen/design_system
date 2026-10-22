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

  /**
   * Shows the content on one line, cut with an ellipsis when it is wider than the
   * room it is given, and opens the tooltip only while the content is cut.
   *
   * Like any truncated text, it can only be cut where its container stops growing:
   * in a flex layout, every flex ancestor up to the one that sets the width needs
   * `min-width: 0` (`min-w-0`).
   *
   * The content stays in the DOM in full, so the trigger takes no tab stop and the
   * tooltip is not announced as its description: it only repeats what is cut.
   * Style the visible text (color, size) on the tooltip itself, so the ellipsis
   * matches it.
   *
   * @default false
   *
   * @example
   * <FzTooltip truncate :text="fileName">{{ fileName }}</FzTooltip>
   */
  truncate?: boolean;

  /**
   * Whether focus sits on an element the trigger stands for but does not contain,
   * such as the control a label names. While true, the tooltip behaves as if the
   * trigger had focus: it opens (with `truncate`, only while the content is cut),
   * stays open when the pointer leaves, and closes on Escape.
   *
   * @default false
   *
   * @example
   * <FzTooltip truncate :text="label" :externalFocus="isInputFocused">{{ label }}</FzTooltip>
   */
  externalFocus?: boolean;
}

/**
 * Props for the FzTruncatedLabel component.
 */
export interface FzTruncatedLabelProps {
  /**
   * Text of the label, cut with an ellipsis when it is wider than the field.
   */
  label: string;

  /**
   * `id` of the `<label>` element, for the control's `aria-labelledby`.
   */
  labelId: string;

  /**
   * `id` of the control the label names: rendered as the label's `for`. The full
   * label opens in a tooltip while this control has focus and the label is cut.
   */
  controlId: string;

  /**
   * Appends a visual asterisk outside the cut, so it stays visible. It is hidden from
   * assistive technology: mark the control itself as required.
   *
   * @default false
   */
  required?: boolean;
}
