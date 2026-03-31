import type { FzActionLinkProps, FzActionProps } from "@fiscozen/action";
import type { FzBadgeTone } from "@fiscozen/badge";

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
   * Row actions. When omitted, the legacy overflow control (ellipsis) is shown and emits `fzmenu:click`.
   * When `[]`, no trailing control is shown. With one item, an arrow button is shown; with more than one, an ellipsis opens a dropdown.
   */
  actions?: [FzActionLinkProps] | FzActionProps[];
}

export interface FzCardListItemEmits {
  /**
   * Declared for `FzCardList` forwarding compatibility (overflow menu is `fzaction:click` / dropdown).
   */
  (event: "fzmenu:click"): void;
  /**
   * Emitted when a row action is chosen: single-arrow click, or an item from the overflow dropdown.
   */
  (event: "fzaction:click", actionIndex: number, action: FzActionProps): void;
  /**
   * Emitted when the actions dropdown open state changes (forwarded from the icon dropdown).
   */
  (event: "update:isOpen", value: boolean): void;
}

/**
 * A single item in the card list when using data-driven rendering.
 * Maps directly to FzCardListItemProps.
 */
export type FzCardListItem = FzCardListItemProps;

export type FzCardListProps = {
  /**
   * Array of card item data for data-driven rendering.
   * When provided and non-empty, each item is rendered as an FzCard.
   * When absent or empty, the default slot is used instead.
   */
  items: FzCardListItem[];
};

export interface FzCardListEmits {
  /**
   * Emitted when the legacy three-dot menu icon of an item is clicked.
   * Carries the index of the item in the `items` array.
   */
  (event: "fzmenu:click", index: number): void;
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
