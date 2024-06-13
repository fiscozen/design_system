<template>
  <dialog
    ref="dialog"
    @close="visible = false"
    :class="[dialogStaticClasses, dialogClasses]"
  >
    <div :class="[staticClasses, classes]">
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
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { FzDialogProps } from "./types";

const props = withDefaults(defineProps<FzDialogProps>(), {
  size: "md",
  closeOnBackdrop: true,
});
const emit = defineEmits(["cancel"]);

const dialog = ref<HTMLDialogElement>();
const visible = ref(false);

const showModal = () => {
  dialog.value!.showModal();
  visible.value = true;
};

defineExpose({
  show: showModal,
  close: (returnVal?: string): void => dialog.value!.close(returnVal),
  visible,
});

const handleBackdropClick = (event: MouseEvent) => {
  var rect = dialog.value!.getBoundingClientRect();
  var isInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;
  if (!isInDialog && props.closeOnBackdrop) {
    dialog.value!.close();
    emit('cancel');
  }
};
onMounted(() => {
  dialog.value!.addEventListener("click", handleBackdropClick);
});
onUnmounted(() => {
  dialog.value!.removeEventListener("click", handleBackdropClick);
});

const staticClasses = ["flex", "flex-col", "bg-core-white"];

const dialogStaticClasses = {
  "border-1": true,
  rounded: true,
  "border-grey-100": true,
};

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
        "xs:max-sm:h-screen",
        "xs:max-sm:w-screen",
        "xs:max-sm:max-w-screen-xl",
      ];
      break;
    case "lg":
      res = [
        "xs:max-md:m-0",
        "xs:max-md:max-h-screen",
        "xs:max-md:h-screen",
        "xs:max-md:w-screen",
        "xs:max-md:max-w-screen-xl",
      ];
      break;
    case "xl":
      res = [
        "xs:max-xl:m-0",
        "xs:max-xl:max-h-screen",
        "xs:max-xl:h-screen",
        "xs:max-xl:w-screen",
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
    res = ["w-[480px]", "h-screen"];
    return res;
  }
  switch (props.size) {
    case "sm":
      res = ["w-[320px]", "min-h-[200px]", "max-h-[432px]"];
      break;
    case "md":
      res = [
        "w-screen sm:w-[480px]",
        "min-h-[300px]",
        "sm:max-h-[600px]",
        "h-screen sm:h-auto",
      ];
      break;
    case "lg":
      res = [
        "w-screen md:w-[640px]",
        "min-h-[300px]",
        "md:max-h-[600px]",
        "h-screen md:h-auto",
      ];
      break;
    case "xl":
      res = [
        "w-screen xl:w-[960px]",
        "min-h-[400px]",
        "xl:max-h-[600px]",
        "h-screen xl:h-auto",
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
</style>
