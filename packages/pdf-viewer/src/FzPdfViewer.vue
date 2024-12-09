<template>
  <div
    :class="[staticContainerClass, containerClass]"
    :style="{ height, width }"
  >
    <div :class="[staticPdfContainerClass, pdfContainerClass]">
      <div :class="[staticVuePDFClass]" ref="overflowContainer">
        <VuePDF :pdf :page :scale :class="['shadow-md', computedCursorClass]" />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center gap-8">
        <FzIconButton
          iconName="minus"
          iconVariant="fas"
          :size
          variant="secondary"
          :disabled="scale <= 0.25"
          @click="handleSizeChange(-0.25)"
        />
        <span
          :class="[staticTextClass, computedTextClass]"
          data-testid="pdf-scale"
          >{{ scale * 100 }} %</span
        >
        <FzIconButton
          iconName="plus"
          iconVariant="fas"
          :size
          variant="secondary"
          :disabled="scale >= 2"
          @click.prevent="handleSizeChange(0.25)"
        />
      </div>
      <div class="flex items-center gap-8">
        <FzIconButton
          iconName="arrow-left"
          iconVariant="fas"
          :size
          variant="secondary"
          :disabled="page <= 1"
          @click.prevent="handlePageChange(page - 1)"
        />
        <span
          :class="[staticTextClass, computedTextClass]"
          data-testid="pdf-page"
          >{{ page }} / {{ pages }}</span
        >
        <FzIconButton
          iconName="arrow-right"
          iconVariant="fas"
          :size
          variant="secondary"
          :disabled="page >= pages"
          @click.prevent="handlePageChange(page + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { FzPdfViewerProps } from "./types";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { FzIconButton } from "@fiscozen/button";

const props = withDefaults(defineProps<FzPdfViewerProps>(), {
  size: "md",
  height: "768px",
  width: "512px",
  initialPage: 1,
  initialScale: 1,
});
const { pdf, pages } = usePDF(props.src);

const staticContainerClass = "flex flex-col gap-12";
const staticPdfContainerClass =
  "bg-grey-100 p-24 flex overflow-hidden h-full w-full rounded justify-center items-center";
const staticTextClass = "text-grey-500 font-medium";
const staticVuePDFClass = "overflow-auto h-full ";

const mapSizeToText = {
  sm: "text-sm",
  md: "text-base",
};

const page = ref(props.initialPage);
const scale = ref(props.initialScale);
const mouseDown = ref(false);
const overflowContainer = ref<HTMLElement>();

const isOverflowing = ref(false);

const computedCursorClass = computed(() => {
  if (!isOverflowing.value) return "";
  return mouseDown.value ? "cursor-grabbing" : "cursor-grab";
});

const computedTextClass = computed(() => mapSizeToText[props.size]);

function handlePageChange(newPage: number) {
  if (newPage > 0 && newPage <= pages.value) {
    page.value = newPage;
  }
}

function handleSizeChange(value: number) {
  const newScale = scale.value + value;
  if (newScale >= 0.25 && newScale <= 2) {
    scale.value = newScale;
  }
}

const checkOverflow = () => {
  if (overflowContainer.value) {
    isOverflowing.value =
      overflowContainer.value.scrollHeight >
        overflowContainer.value.clientHeight ||
      overflowContainer.value.scrollWidth > overflowContainer.value.clientWidth;
  }
};

function handleOverflowDrag() {
  let startX = 0,
    scrollLeft = 0,
    startY = 0,
    scrollTop = 0;
  const slider = overflowContainer.value;
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

let resizeObserver: ResizeObserver | null;

onMounted(() => {
  handleOverflowDrag();
  resizeObserver = new ResizeObserver(checkOverflow);
  if (overflowContainer.value) {
    resizeObserver.observe(overflowContainer.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && overflowContainer.value) {
    resizeObserver.unobserve(overflowContainer.value);
  }
});
</script>

<style scoped></style>
