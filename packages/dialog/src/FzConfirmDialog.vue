<template>
  <FzDialog v-bind="props" ref="dialog">
    <template #header>
      <slot name="header">
        <div :class="[titleStaticClasses, titleClasses]">
          <div class="grow h-28 font-medium">{{ title }}</div>
          <FzIconButton
            @click="handleCancel"
            class="ml-12"
            iconName="xmark"
            size="sm"
            variant="invisible"
          ></FzIconButton>
        </div>
      </slot>
    </template>
    <template #body>
      <slot name="body"></slot>
    </template>
    <template #footer v-if="footerEnabled">
      <slot name="footer">
        <form method="dialog" class="w-full h-full">
          <div
            :class="[footerStaticClasses, footerDynamicClasses, footerClasses]"
          >
            <FzButton
              v-if="cancelButtonEnabled"
              variant="invisible"
              @click.prevent="handleCancel"
              value="false"
            >
              {{ cancelLabel }}
            </FzButton>
            <FzButton
              v-if="confirmButtonEnabled"
              class="ml-12"
              @click.prevent="handleConfirm"
              :disabled="disableConfirm"
              value="true"
            >
              {{ confirmLabel }}
            </FzButton>
          </div>
        </form>
      </slot>
    </template>
  </FzDialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzIconButton, FzButton } from "@fiscozen/button";
import { FzConfirmDialogProps } from "./types";
import FzDialog from "./FzDialog.vue";

const props = withDefaults(defineProps<FzConfirmDialogProps>(), {
  size: "md",
  footerEnabled: true,
  cancelButtonEnabled: true,
  disableConfirm: false,
  confirmButtonEnabled: true,
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
const footerDynamicClasses = {
  "h-32": !props.isDrawer,
  "h-40": props.isDrawer,
};

const show = () => {
  dialog.value?.show();
  visible.value = true;
};
const close = () => {
  dialog.value?.close();
  visible.value = false;
};

const handleCancel = () => {
  dialog.value?.close();
  visible.value = false;
  emit("fzmodal:cancel");
};

const handleConfirm = () => {
  dialog.value?.close();
  visible.value = false;
  emit("fzmodal:confirm");
};

defineExpose({
  handleCancel,
  handleConfirm,
  visible,
  show,
  close,
});
</script>
