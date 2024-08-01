type ToastType = "success" | "warning" | "error";

type Toast = {
  type: ToastType;
  message: string;
  createdAt: Date;
  id: number;
};

type NewToast = Pick<Toast, "type" | "message">;

type FzToastProps = {
  /**
   * Choose type of Toast based on purpose
   */
  type: ToastType;
  /**
   * Whether to show box shadow
   */
  showShadow?: boolean;
};

type FzToastQueueProps = {
  /**
   * Custom toast queue. Defaults to internal self-managed queue.
   */
  toasts?: Toast[];
  /**
   * Whether to align to the left or right
   */
  align?: "left" | "right";
  /**
   * Whether to briefly (2s) open the stack when a new toast is added
   */
  openOnNewToast?: boolean;
};

export { ToastType, Toast, NewToast, FzToastProps, FzToastQueueProps };
