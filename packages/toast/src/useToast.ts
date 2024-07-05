import { ref } from "vue";
import { Toast } from "./types";

const toasts = ref<Toast[]>([]);

function enqueueToast(toast: Toast) {
  toasts.value.unshift(toast);

  if (toast.type === "success") {
    window.setTimeout(() => {
      dequeueToast(toast);
    }, 5000);
  }
}

function dequeueToast(toast: Toast) {
  toasts.value.splice(toasts.value.indexOf(toast), 1);
}

function removeToast(toast: Toast) {
  toasts.value.splice(toasts.value.indexOf(toast), 1);
}

function useToast() {
  return {
    toasts,
  };
}

export { useToast, enqueueToast, removeToast };
