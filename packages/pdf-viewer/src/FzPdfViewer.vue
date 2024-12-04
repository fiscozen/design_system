<template>
  <div :class="[staticContainerClass, containerClass]">
    <div
      :class="[staticPdfContainerClass, pdfContainerClass]"
      ref="overflowContainer"
    >
      <VuePDF
        :pdf
        :page
        :scale
        :class="[
          staticVuePDFClass,
          computedCursorClass,
        ]"
      />
    </div>
    <div class="flex justify-between">
      <div class="flex items-center gap-8">
        <FzIconButton
          iconName="minus"
          iconVariant="fas"
          variant="secondary"
          :disabled="scale <= 0.25"
          @click="handleDecreaseSize"
        />
        <span :class="staticTextClass" data-testid="pdf-scale"
          >{{ scale * 100 }} %</span
        >
        <FzIconButton
          iconName="plus"
          iconVariant="fas"
          variant="secondary"
          :disabled="scale >= 2"
          @click.prevent="handleIncreaseSize"
        />
      </div>
      <div class="flex items-center gap-8">
        <FzIconButton
          iconName="arrow-left"
          iconVariant="fas"
          variant="secondary"
          :disabled="page <= 1"
          @click.prevent="handlePageChange(page - 1)"
        />
        <span :class="staticTextClass" data-testid="pdf-page"
          >{{ page }} / {{ pages }}</span
        >
        <FzIconButton
          iconName="arrow-right"
          iconVariant="fas"
          variant="secondary"
          :disabled="page >= pages"
          @click.prevent="handlePageChange(page + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FzPdfViewerProps } from "./types";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { FzIconButton } from "@fiscozen/button";

const props = defineProps<FzPdfViewerProps>();
const { pdf, pages } = usePDF(props.src);

const staticContainerClass = "flex flex-col gap-12";
const staticPdfContainerClass =
  "bg-grey-100 p-24 flex overflow-hidden max-h-full max-w-full rounded";
const staticTextClass = "text-grey-500 font-medium text-sm";
const staticVuePDFClass = 'overflow-auto shadow-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';

const page = ref(1);
const scale = ref(1);
const mouseDown = ref(false);
const overflowContainer = ref<HTMLElement>();

const computedCursorClass = computed(() => {
  return mouseDown.value ? "cursor-grabbing" : "cursor-grab";
});

function handlePageChange(newPage: number) {
  if (newPage > 0 && newPage <= pages.value) {
    page.value = newPage;
  }
}

function handleDecreaseSize() {
  if (scale.value > 0.25) scale.value -= 0.25;
}

function handleIncreaseSize() {
  if (scale.value < 2) scale.value += 0.25;
}

function handleOverflowDrag() {
  let startX = 0,
    scrollLeft = 0,
    startY = 0,
    scrollTop = 0;
  const slider =
    overflowContainer.value?.querySelector<HTMLElement>(".overflow-auto");
  if (!slider) return;

  const startDragging = (e: MouseEvent) => {
    mouseDown.value = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    startY = e.pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  };

  const stopDragging = (e: MouseEvent) => {
    mouseDown.value = false;
  };

  const move = (e: MouseEvent) => {
    e.preventDefault();
    if (!mouseDown.value) return;
    const x = e.pageX - slider.offsetLeft;
    const scroll = x - startX;
    const y = e.pageY - slider.offsetTop;
    const scrollY = y - startY;
    slider.scrollLeft = scrollLeft - scroll;
    slider.scrollTop = scrollTop - scrollY;
  };

  // Add the event listeners
  slider.addEventListener("mousemove", move, false);
  slider.addEventListener("mousedown", startDragging, false);
  slider.addEventListener("mouseup", stopDragging, false);
  slider.addEventListener("mouseleave", stopDragging, false);
}

onMounted(() => {
  handleOverflowDrag();
});
</script>

<style scoped></style>
