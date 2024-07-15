type ToastType = "success" | "warning" | "error";

type Toast = {
  type: ToastType;
  message: string;
  createdAt: Date;
};

type NewToast = Omit<Toast, "createdAt">;

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
};

export { ToastType, Toast, NewToast, FzToastProps, FzToastQueueProps };
