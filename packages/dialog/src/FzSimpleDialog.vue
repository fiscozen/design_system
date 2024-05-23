<template>
  <FzDialog v-bind="props" ref="dialog">
    <template #header>
      <div :class="[titleStaticClasses, titleClasses]">
        <div class="grow h-28 font-medium">{{ title }}</div>
        <FzIconButton
          @click="cancel"
          class="ml-12"
          iconName="xmark"
          size="sm"
          variant="invisible"
        ></FzIconButton>
      </div>
    </template>
    <template #footer>
      <form method="dialog" class="w-full h-full">
        <div :class="[footerStaticClasses, footerClasses]">
          <FzButton variant="invisible" @click.prevent="cancel" value="false">{{
            cancelLabel
          }}</FzButton>
          <FzButton class="ml-12" @click.prevent="confirm" value="true">{{
            confirmLabel
          }}</FzButton>
        </div>
      </form>
    </template>
  </FzDialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzIconButton, FzButton } from "@fiscozen/button";
import { FzDialogProps } from "./types";
import FzDialog from "./FzDialog.vue";

const props = withDefaults(defineProps<FzDialogProps>(), {
  size: "md",
});
const emit = defineEmits(["fzmodal:confirm", "fzmodal:cancel"]);

const dialog = ref<InstanceType<typeof FzDialog>>();
const visible = ref(false);

const titleStaticClasses = ["flex flex-row items-center text-xl grow"];
const titleClasses = computed(() => {
  return {
    "h-32": props.isDrawer,
    "h-28": !props.isDrawer,
  };
});

const footerStaticClasses = [
  "flex flex-row items-center h-32 grow justify-end",
];
const footerClasses = {
  "h-32": !props.isDrawer,
  "h-40": props.isDrawer,
};

const show = () => {
  dialog.value?.show();
  visible.value = true;
};

const cancel = () => {
  dialog.value?.close();
  visible.value = false;
  emit("fzmodal:cancel");
};

const confirm = () => {
  dialog.value?.close();
  visible.value = false;
  emit("fzmodal:confirm");
};

defineExpose({
  cancel,
  confirm,
  visible,
  show,
});
</script>
