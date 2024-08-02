import { DeepReadonly, readonly, Ref, ref } from "vue";
import { NewToast, Toast } from "./types";

const counter = ref(0);
const toasts = ref<Toast[]>([]);

function enqueueToast(newToast: NewToast, customQueue?: Ref<Toast[]>) {
  counter.value++;
  const toast: Toast = {
    ...newToast,
    createdAt: new Date(),
    id: counter.value,
  };
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
