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
      <div :class="[staticVuePDFClass]" ref="overflowContainer">
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
      <div
        :class="[
          'flex items-center gap-8',
          toolbarPosition === 'top' &&
            'opacity-0 group-hover:opacity-100 transition-opacity',
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
        <span :class="staticTextClass" data-testid="pdf-scale"
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
          toolbarPosition === 'top' &&
            'opacity-0 group-hover:opacity-100 transition-opacity',
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
        <span :class="staticTextClass" data-testid="pdf-page"
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
        'flex items-center px-16 py-12',
        toolbarPosition === 'top' &&
          'bg-grey-100 group-hover:bg-white transition-colors',
      ]"
    >
      <div
        :class="[
          'flex flex-1 justify-start',
          toolbarPosition === 'top' &&
            'opacity-0 group-hover:opacity-100 transition-opacity',
        ]"
      >
        <FzTabs
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
      <div
        :class="[
          'flex items-center gap-24',
          toolbarPosition === 'top' &&
            'opacity-0 group-hover:opacity-100 transition-opacity',
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
          <span :class="staticTextClass" data-testid="pdf-page"
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
          <span :class="staticTextClass" data-testid="pdf-scale"
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
          toolbarPosition === 'top' &&
            'opacity-0 group-hover:opacity-100 transition-opacity',
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
import { computed, ref } from "vue";
import { FzPdfViewerProps } from "./types";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
// @ts-ignore — CSS side-effect import, no type declarations needed
import "@tato30/vue-pdf/style.css";
import { FzIconButton } from "@fiscozen/button";
import { FzTabs, FzTab } from "@fiscozen/tab";
import { useOverflowDrag } from "./composables/useOverflowDrag";

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

const { pdf, pages } = usePDF(props.src);

const staticPdfContainerClass =
  "bg-grey-100 p-24 flex overflow-hidden h-full w-full rounded justify-center items-center";
const staticTextClass =
  "text-grey-500 font-normal text-base leading-5 lining-nums tabular-nums";
const staticVuePDFClass = "overflow-auto h-full";

const page = ref(props.initialPage);
const scale = ref(props.initialScale);
const rotation = ref<0 | 90 | 180 | 270>(0);
const overflowContainer = ref<HTMLElement>();

const textLayerEnabled = computed(() => !!props.selectable);
const { cursorClass } = useOverflowDrag(overflowContainer, {
  textLayerAware: textLayerEnabled,
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
  viewMode.value = title as "pdf" | "xml";
}
</script>

<style scoped>
/* Hide the text label inside FzTab buttons — icon-only appearance */
/* FzIcon renders as <span role="presentation">, so exclude it */
.view-mode-tabs :deep(.tab-container button span:not([role="presentation"])) {
  display: none;
}
</style>
