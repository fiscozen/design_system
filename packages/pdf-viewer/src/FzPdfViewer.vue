<template>
  <div
    :class="[
      'flex group',
      toolbarPosition === 'top' ? 'flex-col-reverse' : 'flex-col',
      containerClass,
    ]"
    :style="{ height, width }"
  >
    <div :class="[staticPdfContainerClass, pdfContainerClass]">
      <iframe
        v-if="viewMode === 'xml' && props.xmlSrc"
        :src="props.xmlSrc"
        class="w-full h-full border-none"
      />
      <div v-else :class="[staticVuePDFClass]" ref="overflowContainer">
        <VuePDF
          :pdf
          :page
          :scale
          :rotation
          :textLayer="props.selectable"
          :class="['shadow-md', cursorClass]"
        />
      </div>
    </div>

    <!-- Basic toolbar -->
    <div
      v-if="toolbarVariant === 'basic'"
      :class="[
        'flex px-16 py-12',
        pages > 1 ? 'justify-between' : 'justify-center',
        toolbarPosition === 'top' &&
          'bg-grey-100 group-hover:bg-white transition-colors',
      ]"
    >
      <div :class="['flex items-center gap-8', toolbarInnerClass]">
        <PdfZoomControls
          :environment="props.environment"
          :scale="scale"
          :minScale="props.minScale"
          :maxScale="props.maxScale"
          :scaleStep="props.scaleStep"
          :zoomInLabel="props.zoomInLabel"
          :zoomOutLabel="props.zoomOutLabel"
          @change="handleScaleChange"
        />
      </div>
      <div :class="['flex items-center gap-8', toolbarInnerClass]">
        <PdfPageNav
          :environment="props.environment"
          :page="page"
          :pages="pages"
          :prevPageLabel="props.prevPageLabel"
          :nextPageLabel="props.nextPageLabel"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- Advanced toolbar -->
    <div
      v-else
      :class="[
        'flex items-center px-16 py-12',
        toolbarPosition === 'top' &&
          'bg-grey-100 group-hover:bg-white transition-colors',
      ]"
    >
      <div :class="['flex flex-1 justify-start', toolbarInnerClass]">
        <FzTabs
          v-if="props.xmlSrc"
          class="view-mode-tabs"
          :environment="props.environment"
          @change="handleViewModeChange"
        >
          <FzTab
            title="pdf"
            icon="file"
            :initialSelected="viewMode === 'pdf'"
          />
          <FzTab
            title="xml"
            icon="code"
            :initialSelected="viewMode === 'xml'"
          />
        </FzTabs>
      </div>
      <!-- Center: page nav + zoom together -->
      <div :class="['flex items-center gap-24', toolbarInnerClass]">
        <template v-if="viewMode === 'pdf'">
          <PdfPageNav
            :environment="props.environment"
            :page="page"
            :pages="pages"
            :prevPageLabel="props.prevPageLabel"
            :nextPageLabel="props.nextPageLabel"
            @change="handlePageChange"
          />
          <PdfZoomControls
            :environment="props.environment"
            :scale="scale"
            :minScale="props.minScale"
            :maxScale="props.maxScale"
            :scaleStep="props.scaleStep"
            :zoomInLabel="props.zoomInLabel"
            :zoomOutLabel="props.zoomOutLabel"
            @change="handleScaleChange"
          />
        </template>
      </div>
      <!-- Right: download + rotate -->
      <div
        :class="[
          'flex flex-1 justify-end items-center gap-8',
          toolbarInnerClass,
        ]"
      >
        <FzIconButton
          iconName="arrow-down-to-bracket"
          iconVariant="far"
          :environment="props.environment"
          variant="invisible"
          aria-label="Download"
          @click="emit('download')"
        />
        <FzIconButton
          v-if="props.rotatable"
          iconName="arrow-rotate-left"
          iconVariant="far"
          :environment="props.environment"
          variant="invisible"
          aria-label="Rotate"
          @click="handleRotate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { FzPdfViewerProps } from "./types";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
// @ts-ignore — CSS side-effect import, no type declarations needed
import "@tato30/vue-pdf/style.css";
import { FzIconButton } from "@fiscozen/button";
import { FzTabs, FzTab } from "@fiscozen/tab";
import { useOverflowDrag } from "./composables/useOverflowDrag";
import PdfZoomControls from "./components/PdfZoomControls.vue";
import PdfPageNav from "./components/PdfPageNav.vue";

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
  selectable: false,
  rotatable: false,
});

const emit = defineEmits<{
  download: [];
}>();

const viewMode = defineModel<"pdf" | "xml">("viewMode", { default: "pdf" });

const { pdf, pages } = usePDF(toRef(props, "src"));

const staticPdfContainerClass =
  "bg-grey-100 p-24 flex overflow-hidden h-full w-full rounded justify-center items-center";
const staticVuePDFClass = "overflow-auto h-full";

const page = ref(props.initialPage);
const scale = ref(props.initialScale);
const rotation = ref<0 | 90 | 180 | 270>(0);
const overflowContainer = ref<HTMLElement>();

const toolbarInnerClass = computed(() =>
  props.toolbarPosition === "top"
    ? "opacity-0 group-hover:opacity-100 transition-opacity"
    : "",
);

const { cursorClass } = useOverflowDrag(overflowContainer, {
  textLayerAware: toRef(props, "selectable"),
});

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

function handleRotate() {
  rotation.value = ((rotation.value + 90) % 360) as 0 | 90 | 180 | 270;
}

function handleViewModeChange(title: string) {
  if (title === "pdf" || title === "xml") {
    viewMode.value = title;
  }
}
</script>

<style scoped>
/* Hide the text label inside FzTab buttons — icon-only appearance */
/* FzIcon renders as <span role="presentation">, so exclude it */
.view-mode-tabs :deep(.tab-container button span:not([role="presentation"])) {
  display: none;
}
</style>
