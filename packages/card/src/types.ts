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
  /**
   * Whether to show an info icon in the header
   * @default false
   */
  hasInfoIcon?: boolean;
  /**
   * The environment context for the card buttons
   * @default 'frontoffice'
   */
  environment?: FzCardEnvironment;
};

type FzCardButton = {
  label: string;
};

type FzCardIconButton = {
  icon: string;
};

/**
 * Card background color variants.
 * 
 * @remarks
 * - 'default' renders a white background
 * - 'blue' renders an alice-blue background
 * - 'orange' renders a seashell background
 * - 'purple' renders a pale-purple background
 * - 'grey' renders a white-smoke background
 * 
 * @deprecated 'aliceblue' is deprecated and will be removed in a future version. Use 'blue' instead.
 */
export type FzCardColor = "default" | "blue" | "orange" | "purple" | "grey" | "aliceblue";

/**
 * Card environment context for buttons
 * 
 * @remarks
 * Determines the visual style context for all buttons within the card
 * - 'backoffice' for internal/admin interfaces
 * - 'frontoffice' for public-facing interfaces
 */
export type FzCardEnvironment = "backoffice" | "frontoffice";

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
  /**
   * Event emitted when the info icon is clicked
   * @type {() => void}
   */
  (event: "fzcard:click-info"): void;
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
