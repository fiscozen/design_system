export type FzTabStyle = "scroll" | "picker" | "fullWidth";

export type FzTabsProps = {
  /**
   * Size variant
   * @deprecated Use the 'environment' prop instead. This prop will be removed in a future version.
   */
  size?: "sm" | "md";
  /**
   * Enable horizontal overflow
   * @deprecated Use the 'overflowMode' prop instead. This prop will be removed in a future version.
   */
  horizontalOverflow?: boolean;
  /**
   * Enable vertical direction
   */
  vertical?: boolean;
  /**
   * Controls tab style and overflow behavior
   * - 'scroll': Shows horizontal scroll when tabs overflow (default)
   * - 'picker': Shows picker dropdown
   * - 'full-width': Shows full width tabs
   */
  tabStyle?: FzTabStyle;
  /**
   * Environment variant for sizing
   * - 'backoffice': Backoffice environment sizing
   * - 'frontoffice': Frontoffice environment sizing
   */
  environment?: "backoffice" | "frontoffice";
  /**
   * Enable debug mode
   */
  isDebug?: boolean;
};

export type FzTabProps = {
  /**
   * Title of the tab
   */
  title: string;
  /**
   * Icon to display on the tab
   */
  icon?: string;
  /**
   * Badge text to display on the tab
   */
  badgeContent?: string;
  /**
   * Disable the tab
   */
  disabled?: boolean;
  /**
   * Show the tab content
   */
  initialSelected?: boolean;
  /**
   * Max width of the tab
   */
  maxWidth?: string;
  /**
   * Tone variant for styling
   * - 'neutral': Default neutral styling
   * - 'alert': Alert/error styling (red variant)
   */
  tone?: "neutral" | "alert";
};
