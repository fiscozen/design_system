import type { FzActionProps, FzActionSectionProps } from "@fiscozen/action";
import type { FzBadgeTone } from "@fiscozen/badge";

export type ActionsMode = "none" | "link" | "actions";

/**
 * A row action, or a section separator that groups the following actions
 * under a labeled header inside the kebab dropdown (mirrors `FzActionSection`).
 * Section markers are not interactive — they only render as group headers
 * and are skipped by click events.
 */
export type FzCardListItemAction =
  | FzActionProps
  | (FzActionSectionProps & { type: "section" });

export interface FzCardListItemProps {
  /**
   * Badge displayed inside the card at the top-left.
   * When omitted, no badge is displayed.
   */
  badge?: {
    /**
     * Text of the badge.
     */
    text: string;
    /**
     * Tone of the badge.
     */
    tone: FzBadgeTone;
  };
  /**
   * Main title of the item, displayed in bold.
   */
  title: string;
  /**
   * Value displayed on the right side of the title row (e.g. "0,00 €").
   */
  value?: string;
  /**
   * Description lines rendered below the title row.
   */
  descriptions?: string[];
  /**
   * Whether to show the indicator icon before the title.
   */
  showIndicator?: boolean;
  /**
   * Row actions. When omitted or `[]`, no trailing control is shown. With one
   * non-section action, an arrow button is shown; with more, an ellipsis opens
   * a dropdown. Pass a `{ type: 'section', label }` marker to start a labeled
   * group inside the dropdown (subsequent actions go into that section until
   * the next marker).
   */
  actions?: FzCardListItemAction[];
}

export interface FzCardListItemEmits {
  /**
   * Emitted when a row action is chosen: single-arrow click, or an item from the overflow dropdown.
   */
  (event: "fzaction:click", actionIndex: number, action: FzActionProps): void;
}

/**
 * A single item in the card list when using data-driven rendering.
 * Maps directly to FzCardListItemProps.
 */
export type FzCardListItem = FzCardListItemProps;

export type FzCardListProps = {
  /**
   * Array of card item data for data-driven rendering.
   * Each item is rendered as an FzCardListItem.
   */
  items: FzCardListItem[];
};

export interface FzCardListEmits {
  /**
   * Emitted when a row action is triggered for an item built from `items`.
   */
  (
    event: "fzaction:click",
    itemIndex: number,
    actionIndex: number,
    action: FzActionProps,
  ): void;
}
