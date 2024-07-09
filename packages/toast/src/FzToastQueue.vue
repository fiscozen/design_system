<template>
  <div class="flex flex-col" @mouseleave="isExpanded = false">
    <template v-for="(toast, index) in toasts">
      <FzToast
        :type="toast.type"
        :class="getToastClass(index)"
        :style="getToastStyle(index)"
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
const toasts = props.toasts ? toRef(props.toasts) : internalToasts;

watch(
  toasts,
  (value) => {
    if (!value.length) isExpanded.value = false;
  },
  {
    deep: true,
  },
);

function getToastClass(index: number): string[] {
  return [
    "transition-transform origin-bottom",
    { 0: "z-30", 1: "z-20", 2: "z-10" }[index] ?? "",
  ];
}

function getToastStyle(index: number) {
  if (!index) return;

  let translateY: string;
  let scale: number;

  if (isExpanded.value) {
    translateY = `${index * 16}px`;
    scale = 1;
  } else {
    translateY = `calc(-${index * 100}% + ${index < 3 ? index * 8 : 0}px)`;
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
