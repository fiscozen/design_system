<template>
  <div
    :class="[
      'flex group',
      toolbarPosition === 'top' ? 'flex-col-reverse gap-0' : 'flex-col gap-12',
      containerClass,
    ]"
    :style="{ height, width }"
  >
    <div :class="[staticPdfContainerClass, pdfContainerClass]">
      <div :class="[staticVuePDFClass]" ref="overflowContainer">
        <VuePDF :pdf :page :scale :class="['shadow-md', computedCursorClass]" />
      </div>
    </div>

    <!-- Basic toolbar -->
    <div
      v-if="toolbarVariant === 'basic'"
      :class="[
        'flex justify-between',
        toolbarPosition === 'top' && 'bg-grey-100 group-hover:bg-white transition-colors px-16 py-12',
      ]"
    >
      <div
        :class="[
          'flex items-center gap-8',
          toolbarPosition === 'top' && 'opacity-0 group-hover:opacity-100 transition-opacity',
        ]"
      >
        <FzIconButton
          iconName="minus"
          iconVariant="fas"
          :environment="props.environment"
          variant="secondary"
          :disabled="scale <= minScale"
          aria-label="Zoom out"
          @click="handleScaleChange(-scaleStep)"
        />
        <span
          :class="[staticTextClass, computedTextClass]"
          data-testid="pdf-scale"
          >{{ Math.round(scale * 100) }} %</span
        >
        <FzIconButton
          iconName="plus"
          iconVariant="fas"
          :environment="props.environment"
          variant="secondary"
          :disabled="scale >= maxScale"
          aria-label="Zoom in"
          @click="handleScaleChange(scaleStep)"
        />
      </div>
      <div
        v-if="pages > 1"
        :class="[
          'flex items-center gap-8',
          toolbarPosition === 'top' && 'opacity-0 group-hover:opacity-100 transition-opacity',
        ]"
      >
        <FzIconButton
          iconName="arrow-left"
          iconVariant="fas"
          :environment="props.environment"
          variant="secondary"
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="handlePageChange(page - 1)"
        />
        <span
          :class="[staticTextClass, computedTextClass]"
          data-testid="pdf-page"
          >{{ page }} / {{ pages }}</span
        >
        <FzIconButton
          iconName="arrow-right"
          iconVariant="fas"
          :environment="props.environment"
          variant="secondary"
          :disabled="page >= pages"
          aria-label="Next page"
          @click="handlePageChange(page + 1)"
        />
      </div>
    </div>

    <!-- Advanced toolbar -->
    <div
      v-else
      :class="[
        'flex items-center',
        toolbarPosition === 'top' && 'bg-grey-100 group-hover:bg-white transition-colors px-16 py-12',
      ]"
    >
      <div
        :class="[
          'flex flex-1 justify-start',
          toolbarPosition === 'top' && 'opacity-0 group-hover:opacity-100 transition-opacity',
        ]"
      >
        <FzTabs
          class="view-mode-tabs"
          :environment="props.environment"
          @change="handleViewModeChange"
        >
          <FzTab title="pdf" icon="file" :initialSelected="viewMode === 'pdf'" />
          <FzTab title="xml" icon="code" :initialSelected="viewMode === 'xml'" />
        </FzTabs>
      </div>
      <!-- Center: page nav + zoom together -->
      <div
        :class="[
          'flex items-center gap-24',
          toolbarPosition === 'top' && 'opacity-0 group-hover:opacity-100 transition-opacity',
        ]"
      >
        <div v-if="pages > 1" class="flex items-center gap-8">
          <FzIconButton
            iconName="arrow-left"
            iconVariant="fas"
            :environment="props.environment"
            variant="secondary"
            :disabled="page <= 1"
            aria-label="Previous page"
            @click="handlePageChange(page - 1)"
          />
          <span
            :class="[staticTextClass, computedTextClass]"
            data-testid="pdf-page"
            >{{ page }} / {{ pages }}</span
          >
          <FzIconButton
            iconName="arrow-right"
            iconVariant="fas"
            :environment="props.environment"
            variant="secondary"
            :disabled="page >= pages"
            aria-label="Next page"
            @click="handlePageChange(page + 1)"
          />
        </div>
        <div class="flex items-center gap-8">
          <FzIconButton
            iconName="minus"
            iconVariant="fas"
            :environment="props.environment"
            variant="secondary"
            :disabled="scale <= minScale"
            aria-label="Zoom out"
            @click="handleScaleChange(-scaleStep)"
          />
          <span
            :class="[staticTextClass, computedTextClass]"
            data-testid="pdf-scale"
            >{{ Math.round(scale * 100) }} %</span
          >
          <FzIconButton
            iconName="plus"
            iconVariant="fas"
            :environment="props.environment"
            variant="secondary"
            :disabled="scale >= maxScale"
            aria-label="Zoom in"
            @click="handleScaleChange(scaleStep)"
          />
        </div>
      </div>
      <!-- Right: download + reset -->
      <div
        :class="[
          'flex flex-1 justify-end items-center gap-8',
          toolbarPosition === 'top' && 'opacity-0 group-hover:opacity-100 transition-opacity',
        ]"
      >
        <FzIconButton
          iconName="arrow-down-to-line"
          iconVariant="fas"
          :environment="props.environment"
          variant="invisible"
          aria-label="Download"
          @click="emit('download')"
        />
        <FzIconButton
          iconName="clock-rotate-left"
          iconVariant="fas"
          :environment="props.environment"
          variant="invisible"
          aria-label="Reset zoom"
          @click="resetScale"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { FzPdfViewerProps } from "./types";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { FzIconButton } from "@fiscozen/button";
import { FzTabs, FzTab } from "@fiscozen/tab";

const props = withDefaults(defineProps<FzPdfViewerProps>(), {
  environment: "frontoffice",
  height: "768px",
  width: "512px",
  initialPage: 1,
  initialScale: 1,
  minScale: 0.25,
  maxScale: 2,
  scaleStep: 0.25,
  toolbarVariant: "basic",
  toolbarPosition: "bottom",
});

const emit = defineEmits<{
  download: [];
}>();

const viewMode = defineModel<"pdf" | "xml">("viewMode", { default: "pdf" });

const { pdf, pages } = usePDF(props.src);

const staticPdfContainerClass =
  "bg-grey-100 p-24 flex overflow-hidden h-full w-full rounded justify-center items-center";
const staticTextClass = "text-grey-500 font-medium";
const staticVuePDFClass = "overflow-auto h-full";

const mapEnvironmentToText = {
  frontoffice: "text-sm",
  backoffice: "text-base",
} as const;

const page = ref(props.initialPage);
const scale = ref(props.initialScale);
const mouseDown = ref(false);
const overflowContainer = ref<HTMLElement>();
const isOverflowing = ref(false);

const computedCursorClass = computed(() => {
  if (!isOverflowing.value) return "";
  return mouseDown.value ? "cursor-grabbing" : "cursor-grab";
});

const computedTextClass = computed(
  () => mapEnvironmentToText[props.environment],
);

function handlePageChange(newPage: number) {
  if (newPage > 0 && newPage <= pages.value) {
    page.value = newPage;
  }
}

function handleScaleChange(delta: number) {
  const newScale = Math.round((scale.value + delta) * 100) / 100;
  if (newScale >= props.minScale && newScale <= props.maxScale) {
    scale.value = newScale;
  }
}

function resetScale() {
  scale.value = props.initialScale;
}

function handleViewModeChange(title: string) {
  viewMode.value = title as "pdf" | "xml";
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

  const stopDragging = (_e: MouseEvent) => {
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

<style scoped>
/* Hide the text label inside FzTab buttons — icon-only appearance */
/* FzIcon renders as <span role="presentation">, so exclude it */
.view-mode-tabs :deep(.tab-container button span:not([role="presentation"])) {
  display: none;
}
</style>
