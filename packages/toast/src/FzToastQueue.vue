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
  const classes: string[] = ["transition-transform"];

  if (isExpanded.value && index !== 0) {
    classes.push("mt-12");
    return classes;
  }

  if (index === 0) {
    classes.push("z-30");
  } else if (index === 1) {
    classes.push("origin-bottom z-20 mt-8");
  } else if (index === 2) {
    classes.push("origin-bottom z-10 mt-8");
  } else {
    classes.push("origin-bottom");
  }

  return classes;
}

function getToastStyle(index: number) {
  if (!index || isExpanded.value) return;

  const translateY = `-${index * 100}%`;
  const scale = index === 1 ? 0.9375 : 0.875;
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
