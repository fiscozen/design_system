<template>
  <div class="flex flex-col" @mouseleave="isExpanded = false">
    <template v-for="(toast, index) in toasts" :key="toast.createdAt">
      <FzToast
        :type="toast.type"
        :class="getToastClass(index)"
        :style="getToastStyle(index)"
        :showShadow="isExpanded || index < 3"
        @mouseenter="handleMouseEnter(index)"
        @close="handleToastClose(toast)"
      >
        {{ toast.message }}
      </FzToast>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import { FzToast, FzToastQueueProps, Toast } from "./index";
import { toasts as internalToasts, removeToast } from "./queue";

const props = defineProps<FzToastQueueProps>();
const isExpanded = ref(false);
const shouldAnimate = ref(false);
const toasts = props.toasts ? toRef(props.toasts) : internalToasts;
let shouldAnimateTimeout: number | undefined;

watch(
  toasts,
  (value) => {
    if (!value.length) isExpanded.value = false;

    if (shouldAnimateTimeout) window.clearTimeout(shouldAnimateTimeout);
    shouldAnimate.value = false;
    shouldAnimateTimeout = window.setTimeout(() => {
      shouldAnimate.value = true;
      shouldAnimateTimeout = undefined;
    }, 0);
  },
  {
    deep: true,
  },
);

function getToastClass(index: number) {
  return [
    "origin-bottom",
    { 0: "z-30", 1: "z-20", 2: "z-10" }[index] ?? "",
    {
      "mt-12": index > 0 && isExpanded.value,
      "mt-8": index > 0 && index < 3 && !isExpanded.value,
      "transition-all": shouldAnimate.value,
    },
  ];
}

function getToastStyle(index: number) {
  if (!index) return;

  let translateY: string | number = 0;
  let scale: string | number = 1;

  if (!isExpanded.value) {
    translateY = `-${index * 100}%`;
    scale = index === 1 ? 0.9375 : 0.875;
  }

  return { transform: `translateY(${translateY}) scale(${scale})` };
}

function handleMouseEnter(index: number) {
  if (!index) {
    isExpanded.value = true;
  }
}

function handleToastClose(toast: Toast) {
  removeToast(toast, toasts);
}
</script>
