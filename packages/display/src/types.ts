export type FzDisplayFieldProps = {
  /**
   * Label text displayed above the value
   */
  label: string;
  /**
   * Value text displayed below the label
   */
  value: string;
  /**
   * Controls the label font size
   * - 'small': 12px (text-xs)
   * - 'normal': 14px (text-sm)
   */
  size?: 'small' | 'normal';
  /**
   * When true, the value text is rendered in bold
   */
  isEmphasized?: boolean;
  /**
   * Spacing between label and value
   * - 'none': no gap
   * - 'small': 8px gap
   * - 'medium': 12px gap
   */
  gap?: 'none' | 'small' | 'medium';
};
