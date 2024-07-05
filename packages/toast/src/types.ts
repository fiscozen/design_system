type ToastType = "success" | "warning" | "error";

type Toast = {
  type: ToastType;
  message: string;
};

type FzToastProps = {
  type: ToastType;
};

export { ToastType, Toast, FzToastProps };
