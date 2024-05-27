export type FzDialogSizes = "sm" | "md" | "lg" | "xl";

export type FzDialogProps = {
  /**
   * The general size of the dialog
   */
  size?: FzDialogSizes;
  /**
   * Text content in the header
   */
  title?: string;
  /**
   * Text content in the confirm button
   */
  confirmLabel?: string;
  /**
   * Text content in the cancel button
   */
  cancelLabel?: string;
  /**
   * Text content in the body slot
   */
  text?: string;
  /**
   * Whether to show the modal as a drawer
   */
  isDrawer?: boolean;
};
