import { ButtonVariant } from "@fiscozen/button";

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
  /**
   * Whether to close the dialog on backdrop click
   */
  closeOnBackdrop?: boolean;
  /**
   * classes to apply to body
   */
  bodyClasses?:
    | string
    | string[]
    | Record<string, boolean | undefined>
    | Array<string | Record<string, boolean | undefined>>;
};

export type FzConfirmDialogProps = FzDialogProps & {
  /**
   * Whether to show or not the footer
   */
  footerEnabled?: boolean;
  /**
   * Whether to show the cancel button
   */
  cancelButtonEnabled?: boolean;
  /**
   * Whether to enable the confirm button
   */
  disableConfirm?: boolean;
  /**
   * Whether to show the confirm button
   */
  confirmButtonEnabled?: boolean;
  /**
   * Custom variant of the confirm button
   */
  confirmButtonVariant?: ButtonVariant;
  /**
   * classes to apply to footer
   */
  footerClasses?:
    | string
    | string[]
    | Record<string, boolean | undefined>
    | Array<string | Record<string, boolean | undefined>>;
};
