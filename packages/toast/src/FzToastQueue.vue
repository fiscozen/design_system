<template>
  <div
    class="hoverable group"
    :class="{ hovering: isHovering }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="flex flex-col relative">
      <TransitionGroup name="list">
        <FzToast
          v-for="(toast, index) in toasts"
          :key="toast.id"
          :ref="(el: any) => handleToastRef(el, index, isHovering)"
          :type="toast.type"
          class="toast absolute origin-bottom transition-all duration-300"
          :class="toastClass"
          :style="getToastStyle(index)"
          @close="handleToastClose(toast)"
        >
          <span
            :class="{
              'truncated-toast-message truncate group-hover:whitespace-normal':
                index,
            }"
            >{{ toast.message }}</span
          >
        </FzToast>
      </TransitionGroup>
    </div>

    <div class="flex flex-col">
      <template v-for="toast in toasts" :key="toast.id">
        <FzToast
          :type="toast.type"
          class="[&:nth-child(n+2)]:mt-12 invisible hidden group-hover:flex"
        >
          {{ toast.message }}
        </FzToast>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { FzToast, FzToastQueueProps, Toast } from "./index";
import { toasts as internalToasts, removeToast } from "./queue";

const props = withDefaults(defineProps<FzToastQueueProps>(), {
  align: "right",
  openOnNewToast: true,
});

const toasts = computed(() => props.toasts ?? internalToasts.value);
const toastsHeight = ref<number[]>([]);
const isHovering = ref(false);
const toastsLength = computed(() => toasts.value.length);
let currentTimeoutId: number | undefined = undefined;

watch(toastsLength, (newValue, oldValue) => {
  if (!props.openOnNewToast) return;
  if (newValue <= oldValue) return;
  if (currentTimeoutId != null) window.clearTimeout(currentTimeoutId);
  
  isHovering.value = true;
  currentTimeoutId = window.setTimeout(() => (isHovering.value = false), 2000);
});

const toastClass = computed(() => [
  {
    left: "left-0",
    right: "right-0",
  }[props.align],
]);

/*
 * While not used, passing isHovering is needed to recalculate toasts' height
 */
function handleToastRef(el: any, index: number, isHovering: boolean) {
  toastsHeight.value[index] = el?.containerRef?.clientHeight;
}

function getAllPreviousToastsHeight(index: number) {
  return toastsHeight.value
    .slice(0, index)
    .reduce((prev, current) => prev + current + 2, 0);
}

function getToastHeight(index: number) {
  return (toastsHeight.value[index] ?? 0) + 2;
}

function getToastStyle(index: number) {
  if (!index) return;

  const margin = 8 * index;
  const marginHover = 12 * index;

  return {
    "--fz-translate-y": `${getToastHeight(0) - getToastHeight(index) + margin}px`,
    "--fz-translate-y-hover": `${getAllPreviousToastsHeight(index) + marginHover}px`,
  };
}

function handleToastClose(toast: Toast) {
  removeToast(toast, toasts);
}
</script>

<style>
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

.toast:first-child {
  z-index: 3;
}

.toast:nth-child(2) {
  z-index: 2;
  transform: translateY(var(--fz-translate-y)) scale(0.9375);
}

.toast:nth-child(3) {
  z-index: 1;
}

.toast:nth-child(n + 3) {
  transform: translateY(var(--fz-translate-y)) scale(0.875);
}

.toast:nth-child(n + 4) {
  opacity: 0;
}

.hoverable:hover .toast:nth-child(n + 2),
.hoverable.hovering .toast:nth-child(n + 2) {
  transform: translateY(var(--fz-translate-y-hover));
}

.hoverable:hover .toast:nth-child(n + 2):not(.list-leave-to),
.hoverable.hovering .toast:nth-child(n + 2):not(.list-leave-to) {
  opacity: 1;
}

.hoverable.hovering .truncated-toast-message {
  @apply whitespace-normal;
}
</style>
