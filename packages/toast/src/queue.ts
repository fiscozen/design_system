import { DeepReadonly, readonly, Ref, ref } from "vue";
import { Toast } from "./types";

const toasts = ref<Toast[]>([]);

function enqueueToast(toast: Toast, customQueue?: Ref<Toast[]>) {
  const queue = customQueue ?? toasts;
  queue.value.unshift(toast);

  if (toast.type === "success") {
    window.setTimeout(() => {
      removeToast(toast, queue);
    }, 5000);
  }
}

function removeToast(toast: Toast, customQueue?: Ref<Toast[]>) {
  const queue = customQueue ?? toasts;
  queue.value.splice(queue.value.indexOf(toast), 1);
}

const useToasts = (): { toasts: DeepReadonly<typeof toasts> } => ({
  toasts: readonly(toasts),
});

export { toasts, enqueueToast, removeToast, useToasts };
