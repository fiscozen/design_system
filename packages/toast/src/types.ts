type ToastType = "success" | "warning" | "error";

type Toast = {
  type: ToastType;
  message: string;
};

type FzToastProps = {
  type: ToastType;
};

type FzToastQueueProps = {
  /**
   * Custom toast queue. Defaults to internal self-managed queue.
   */
  toasts?: Toast[];
};

export { ToastType, Toast, FzToastProps, FzToastQueueProps };
