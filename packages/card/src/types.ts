export type FzCardProps = {
  /**
   * The title of the card
   */
  title?: string;
  /**
   * The background color of the card
   */
  color?: FzCardColor;
  /**
   * The primary action button
   */
  primaryAction?: FzCardButton;
  /**
   * The secondary action button
   */
  secondaryAction?: FzCardButton;
  /**
   * The tertiary action button
   */
  tertiaryAction?: FzCardIconButton;
  /**
   * Custom css class to apply to the content
   */
  contentClass?: string;
  /**
   * Whether the card is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether the card is expanded by default (only if collapsible)
   */
  defaultExpanded?: boolean;
  /**
   * Whether the card content is always alive (never destroyed) when collapsed
   */
  alwaysAlive?: boolean;
};

type FzCardButton = {
  label: string;
};

type FzCardIconButton = {
  icon: string;
};

export type FzCardColor = "purple" | "orange" | "blue";

export interface FzCardEvents {
  /**
   * Event emitted when the primary action is clicked
   * @type {() => void}
   */
  (event: "fzprimary:click"): void;
  /**
   * Event emitted when the secondary action is clicked
   * @type {() => void}
   */
  (event: "fzsecondary:click"): void;
  /**
   * Event emitted when the tertiary action is clicked
   * @type {() => void}
   */
  (event: "fztertiary:click"): void;
}

export interface FzCardSlots {
  /**
   * Slot for the content of the card
   */
  default(props: {}): any;
  /**
   * Slot for the header, it will be displayed on the left of the title
   */
  header(props: {}): any;
  /**
   * Slot for the header content, it will be displayed below the title
   */
  "header-content"(props: {}): any;
  /**
   * Slot for the footer of the card
   */
  footer(props: {}): any;
}
