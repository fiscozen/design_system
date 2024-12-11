export type FzTabsProps = {
  /**
   * Size variant
   */
  size: "sm" | "md";
  /**
   * Enable horizontal overflow
   */
  horizontalOverflow?: boolean;
  /**
   * Enable vertical direction
   */
  vertical?: boolean;
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
};
