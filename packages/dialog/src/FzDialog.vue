<template>
  <dialog ref="dialog" @close="visible = false" :class="[dialogStaticClasses, dialogClasses]">
    <div :class="[staticClasses, classes]">
      <div class="flex items-center p-12 w-full border-b-1 border-grey-100">
        <slot name="header"></slot>
      </div>
      <div class="grow">
        <slot name="body"></slot>
      </div>
      <div class="flex flex-row p-12 border-t-1 border-grey-100 items-center">
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
});
const emit = defineEmits(["confirm", "cancel"]);

const dialog = ref<HTMLDialogElement>();
const visible = ref(false);

const showModal = () => {
  dialog.value?.showModal();
  visible.value = true;
};

defineExpose({
  show: showModal,
  close: (returnVal?: string): void => dialog.value?.close(returnVal),
  visible,
});

const handleBackdropClick = (event: MouseEvent) => {
  if (!dialog.value) {
    return;
  }
  var rect = dialog.value.getBoundingClientRect();
  var isInDialog =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;
  if (!isInDialog) {
    dialog.value.close();
  }
};
onMounted(() => {
  dialog.value?.addEventListener("click", handleBackdropClick);
});
onUnmounted(() => {
  dialog.value?.removeEventListener("click", handleBackdropClick);
});

const staticClasses = [
  "flex",
  "flex-col",
  "bg-core-white",
];

const dialogStaticClasses = {
  "border-1": true,
  'rounded': true,
  'border-grey-100': true
}

const dialogClasses = computed(() => {
  let res: Record<string, boolean> = {};
  if (props.isDrawer) {
    res = {
      "m-0": true,
      fixed: true,
      "top-0": true,
      "ml-auto": true,
      "max-h-screen": true,
    };
    return res;
  }
  switch (props.size) {
    case "sm":
      res = {};
      break;
    case "md":
      res = {
        "xs:max-sm:m-0": true,
        "xs:max-sm:max-h-screen": true,
        "xs:max-sm:h-screen": true,
        "xs:max-sm:w-screen": true,
        "xs:max-sm:max-w-screen-xl": true,
      };
    case "lg":
      res = {
        "xs:max-md:m-0": true,
        "xs:max-md:max-h-screen": true,
        "xs:max-md:h-screen": true,
        "xs:max-md:w-screen": true,
        "xs:max-md:max-w-screen-xl": true,
      };
    case "xl":
      res = {
        "xs:max-xl:m-0": true,
        "xs:max-xl:max-h-screen": true,
        "xs:max-xl:h-screen": true,
        "xs:max-xl:w-screen": true,
        "xs:max-xl:max-w-screen-xl": true,
      };
      break;
      break;
    default:
      res = {};
      break;
  }
  return res;
});

const classes = computed(() => {
  let res: Record<string, boolean> = {};
  if (props.isDrawer) {
    res["w-[480px]"] = true;
    res["h-screen"] = true;

    return res;
  }
  switch (props.size) {
    case "sm":
      res = {
        "w-[320px]": true,
        "min-h-[200px]": true,
        "max-h-[432px]": true,
      };
      break;
    case "md":
      res = {
        "w-screen sm:w-[480px]": true,
        "min-h-[300px]": true,
        "sm:max-h-[600px]": true,
        "h-screen sm:h-auto": true,
      };
      break;
    case "lg":
      res = {
        "w-screen md:w-[640px]": true,
        "min-h-[300px]": true,
        "md:max-h-[600px]": true,
        "h-screen md:h-auto": true,
      };
      break;
    case "xl":
      res = {
        "w-screen xl:w-[960px]": true,
        "min-h-[400px]": true,
        "xl:max-h-[600px]": true,
        "h-screen xl:h-auto": true,
      };
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