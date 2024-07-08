import { Ref, ref } from "vue";
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

function removeToast(toast: Toast, queue: Ref<Toast[]>) {
  queue.value.splice(queue.value.indexOf(toast), 1);
}

export { toasts, enqueueToast, removeToast };
