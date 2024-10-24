<template>
  <div
    v-if="shouldRender || shouldAlwaysRender"
    ref="backdrop"
    v-show="visible"
    class="fz-dialog__backdrop w-screen h-screen fixed flex flex-col items-center justify-start sm:justify-center z-30">
    <dialog
      ref="dialog"
      @close="handleModalClose"
      :class="[dialogStaticClasses, dialogClasses]"
    >
      <div ref="innerDialog" :class="[staticClasses, classes]">
        <div
          class="flex items-center p-12 w-full border-b-1 border-grey-100 border-solid"
        >
          <slot name="header"></slot>
        </div>
        <div :class="['grow', 'p-12', bodyClasses]">
          <slot name="body"></slot>
        </div>
        <div
          v-if="$slots.footer"
          class="flex flex-row p-12 border-t-1 border-grey-100 items-center border-solid"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { FzDialogProps } from "./types";
import { useKeyUp } from "@fiscozen/composables";
import { useClickOutside } from "@fiscozen/composables";
import dialogPolyfill from 'dialog-polyfill';
import 'dialog-polyfill/dist/dialog-polyfill.css';

const props = withDefaults(defineProps<FzDialogProps>(), {
  size: "md",
  closeOnBackdrop: true
});
const emit = defineEmits(["fzmodal:cancel"]);

const dialog = ref<HTMLDialogElement>();
const backdrop = ref<HTMLDialogElement>();
const innerDialog = ref<HTMLDivElement>();
const visible = ref(false);
const shouldRender = ref(false);

let backdropClickTimeout = false;

const showModal = () => {
  backdropClickTimeout = true;
  setTimeout(() => {
    backdropClickTimeout = false;
  }, 100);
  
  if (props.shouldAlwaysRender) {
    dialogPolyfill.registerDialog(dialog.value!);
    dialog.value!.show();
    visible.value = true;
  } else {
    shouldRender.value = true;
  }
};

const closeModal = (returnVal?: string) => {
  dialog.value?.close(returnVal);
};

function handleModalClose() {
  visible.value = false;
  if (!props.shouldAlwaysRender) {
    shouldRender.value = false;
  }
}

watch(dialog, (dialog) => {
  if (dialog && shouldRender.value) {
    dialogPolyfill.registerDialog(dialog);
    dialog.show();
    visible.value = true;
  }
});

defineExpose({
  show: showModal,
  close: closeModal,
  visible,
});

useClickOutside(
  innerDialog,
  () => {
    if (!props.closeOnBackdrop) return;
    dialog.value!.close();
    emit("fzmodal:cancel");
  },
  backdrop,
);

const handleKeyUp = (e: KeyboardEvent) => {
  if (!visible.value || e.key !== "Escape") {
    return;
  }
  dialog.value!.close();
  emit("fzmodal:cancel");
};

useKeyUp(handleKeyUp);

const staticClasses = "flex flex-col bg-core-white";
const dialogStaticClasses = "border-1 rounded border-grey-100 p-0";

const dialogClasses = computed(() => {
  let res: string[] = [];
  if (props.isDrawer) {
    res = ["m-0", "fixed", "top-0", "ml-auto", "max-h-screen"];
    return res;
  }
  switch (props.size) {
    case "sm":
      res = [];
      break;
    case "md":
      res = [
        "xs:max-sm:m-0",
        "xs:max-sm:max-h-screen",
        "xs:max-sm:h-dvh",
        "xs:max-sm:w-dvw",
        "xs:max-sm:max-w-screen-xl",
      ];
      break;
    case "lg":
      res = [
        "xs:max-md:m-0",
        "xs:max-md:max-h-screen",
        "xs:max-md:h-dvh",
        "xs:max-md:w-dvw",
        "xs:max-md:max-w-screen-xl",
      ];
      break;
    case "xl":
      res = [
        "xs:max-xl:m-0",
        "xs:max-xl:max-h-screen",
        "xs:max-xl:h-dvh",
        "xs:max-xl:w-dvw",
        "xs:max-xl:max-w-screen-xl",
      ];
      break;
    default:
      res = [];
      break;
  }
  return res;
});

const classes = computed(() => {
  let res: string[] = [];
  if (props.isDrawer) {
    res = ["w-[480px]", "h-dvh"];
    return res;
  }
  switch (props.size) {
    case "sm":
      res = ["w-[320px]", "min-h-[200px]", "max-h-[432px]"];
      break;
    case "md":
      res = [
        "w-dvw sm:w-[480px]",
        "min-h-[300px]",
        "sm:max-h-[600px]",
        "h-dvh sm:h-auto",
      ];
      break;
    case "lg":
      res = [
        "w-dvw md:w-[640px]",
        "min-h-[300px]",
        "md:max-h-[600px]",
        "h-dvh md:h-auto",
      ];
      break;
    case "xl":
      res = [
        "w-dvw xl:w-[960px]",
        "min-h-[400px]",
        "xl:max-h-[600px]",
        "h-dvh xl:h-auto",
      ];
      break;
    default:
      break;
  }
  return res;
});
</script>

<style>
dialog::backdrop {
  background: var(--core-black, #2c282f);
  opacity: 0.8;
}
.fz-dialog__backdrop {
  background-color: rgba(44, 40, 47, 0.8);
  top: 0;
  left: 0;
}
</style>
