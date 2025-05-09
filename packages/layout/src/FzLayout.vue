<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { FzLayoutProps } from "./types";
import { breakpoints } from "@fiscozen/style";
import { useBreakpoints } from "@fiscozen/composables";

const props = withDefaults(defineProps<FzLayoutProps>(), {});

const emit = defineEmits([]);

const currentBreakpoint = ref('');
const getCurrentBreakpoint = () => {
  const activeBreakpoints = Object.entries(breakpoints).filter(([key, value]) => window.innerWidth >= parseInt(value));
  currentBreakpoint.value = activeBreakpoints[activeBreakpoints.length - 1][0];
}
const {isGreater} = useBreakpoints(breakpoints);

onMounted(() => {
  getCurrentBreakpoint();
  window.addEventListener('resize', getCurrentBreakpoint)
})
onUnmounted(() => {
  window.removeEventListener('resize', getCurrentBreakpoint)
})

const visibleTrigger = ref(true);

const layoutClass = computed(() => {
  let res = undefined;
  switch (props.layout) {
    case "oneColumn":
      res =
        "grid-rows-1 grid-cols-1";
      break;
    case "oneColumnHeader":
      res =
        "grid-rows-[56px_1fr] grid-cols-1";
      break;
    case "twoColumns":
      res =
        "grid-rows-[56px_100vh_100vh] sm:grid-rows-[56px_1fr_1fr] lg:grid-rows-[56px_1fr] grid-cols-1 lg:grid-cols-2 fz-layout__overflow";
      break;
    case "rightShoulder":
      res =
        "grid-cols-1 lg:grid-cols-[1fr_340px] grid-rows-[100vh_100vh] lg:grid-rows-1 fz-layout__overflow";
      break;
    case "leftShoulder":
      res =
        "grid-cols-1 lg:grid-cols-[340px_1fr] grid-rows-[100vh_100vh] lg:grid-rows-1 fz-layout__overflow";
      break;
    case "multipleAreas":
      res = visibleTrigger.value ?
        "grid-cols-1 sm:grid-cols-[64px_1fr] lg:grid-cols-[280px_1fr] grid-rows-[56px_80px_1fr] sm:grid-rows-[56px_1fr]" :
        "fz-layout--open grid-cols-1 sm:grid-cols-[280px_1fr] grid-rows-1 sm:grid-rows-[56px_1fr]"
      break;
    default:
      break;
  }
  let widthClass = props.disableViewport ? 'w-full' : 'w-dvw';
  let heightClass = props.disableViewport ? 'h-full' : 'h-dvh';
  return [res, `fz-layout__${props.layout}--${currentBreakpoint.value}`, widthClass, heightClass];
});

const sidebarToggle = () => {
  visibleTrigger.value = !visibleTrigger.value;
}

</script>

<template>
  <div class="fz-layout grid" :class="layoutClass">
    <template v-if="props.layout === 'oneColumn'">
      <div class="fz-layout__main p-12 fz-layout__overflow">
        <slot></slot>
      </div>
    </template>
    <template v-if="props.layout === 'oneColumnHeader'">
      <div class="fz-layout__header p-12">
        <slot name="header"></slot>
      </div>
      <div class="fz-layout__main p-12 fz-layout__overflow">
        <slot></slot>
      </div>
    </template>
    <template v-if="props.layout === 'twoColumns'">
      <div class="fz-layout__header p-12">
        <slot name="header"></slot>
      </div>
      <div class="fz-layout__left p-12">
        <slot name="left"></slot>
      </div>
      <div class="fz-layout__right p-12">
        <slot name="right"></slot>
      </div>
    </template>
    <template v-if="['leftShoulder', 'rightShoulder'].includes(props.layout)">
      <div class="fz-layout__sidebar p-12">
        <slot name="sidebar" :sidebarToggle></slot>
      </div>
      <div class="fz-layout__main p-12">
        <slot :sidebarToggle></slot>
      </div>
    </template>
    <template v-if="props.layout === 'multipleAreas'">
      <div v-if="visibleTrigger || isGreater('sm').value" class="fz-layout__header p-12">
        <slot name="header" :sidebarToggle></slot>
      </div>
      <div v-if="visibleTrigger && ['xs', 'sm', 'md'].includes(currentBreakpoint)" class="fz-layout__sidebarTrigger p-12">
        <slot name="sidebarTrigger" :sidebarToggle></slot>
      </div>
      <div v-if="!visibleTrigger || ['lg', 'xl', '2xl', '3xl'].includes(currentBreakpoint)" class="fz-layout__sidebar p-12">
        <slot name="sidebar" :sidebarToggle></slot>
      </div>
      <div v-if="visibleTrigger || isGreater('sm').value" class="fz-layout__main p-12 fz-layout__overflow">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
:deep(.fz-layout__shoulder > *) {
  @apply h-[216px] w-[260px] shrink-0;
}
.fz-layout__shoulder::-webkit-scrollbar {
  display: none;
}
.fz-layout__shoulder {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fz-layout__leftShoulder--xs,
.fz-layout__leftShoulder--sm,
.fz-layout__leftShoulder--md,
.fz-layout__rightShoulder--xs,
.fz-layout__rightShoulder--sm,
.fz-layout__rightShoulder--md {
  grid-template-areas:
    "sidebar"
    "main"
}

.fz-layout__leftShoulder--lg,
.fz-layout__leftShoulder--xl,
.fz-layout__leftShoulder--2xl,
.fz-layout__leftShoulder--3xl {
  grid-template-areas:
    "sidebar main"
}

.fz-layout__rightShoulder--lg,
.fz-layout__rightShoulder--xl,
.fz-layout__rightShoulder--2xl,
.fz-layout__rightShoulder--3xl {
  grid-template-areas:
    "main sidebar"
}

.fz-layout__multipleAreas--xs {
  grid-template-areas:
    "header"
    "sidebarTrigger"
    "main"
}
.fz-layout__multipleAreas--xs.fz-layout--open {
  grid-template-areas:
    "sidebar"
}
.fz-layout__multipleAreas--md.fz-layout--open,
.fz-layout__multipleAreas--sm.fz-layout--open {
  grid-template-areas:
    "header header"
    "sidebar main"
}
.fz-layout__multipleAreas--sm,
.fz-layout__multipleAreas--md {
  grid-template-areas:
    "header header"
    "sidebarTrigger main"
}
.fz-layout__multipleAreas--lg,
.fz-layout__multipleAreas--xl,
.fz-layout__multipleAreas--2xl,
.fz-layout__multipleAreas--3xl {
  grid-template-areas:
    "header header"
    "sidebar main"
}

.fz-layout__oneColumn--xs,
.fz-layout__oneColumn--sm,
.fz-layout__oneColumn--md,
.fz-layout__oneColumn--lg,
.fz-layout__oneColumn--xl,
.fz-layout__oneColumn--2xl,
.fz-layout__oneColumn--3xl {
  grid-template-areas:
    "main"
}

.fz-layout__oneColumnHeader--xs,
.fz-layout__oneColumnHeader--sm,
.fz-layout__oneColumnHeader--md,
.fz-layout__oneColumnHeader--lg,
.fz-layout__oneColumnHeader--xl,
.fz-layout__oneColumnHeader--2xl,
.fz-layout__oneColumnHeader--3xl {
  grid-template-areas:
    "header"
    "main"
}
.fz-layout__oneColumnHeader--xs,
.fz-layout__oneColumnHeader--sm,
.fz-layout__oneColumnHeader--md,
.fz-layout__oneColumnHeader--lg,
.fz-layout__oneColumnHeader--xl,
.fz-layout__oneColumnHeader--2xl,
.fz-layout__oneColumnHeader--3xl {
  grid-template-areas:
    "header"
    "main"
}
.fz-layout__twoColumns--lg,
.fz-layout__twoColumns--xl,
.fz-layout__twoColumns--2xl,
.fz-layout__twoColumns--3xl {
  grid-template-areas:
    "header header"
    "left right"
}
.fz-layout__twoColumns--xs {
  grid-template-areas:
    "header"
    "left"
    "right";
}
.fz-layout__twoColumns--sm,
.fz-layout__twoColumns--md {
  grid-template-areas:
    "header header"
    "left left"
    "right right";
}

.fz-layout__sidebarTrigger {
  grid-area: sidebarTrigger;
}
.fz-layout__sidebar {
  grid-area: sidebar;
}
.fz-layout__header {
  grid-area: header;
}
.fz-layout__main {
  grid-area: main;
}
.fz-layout__left {
  grid-area: left;
}
.fz-layout__right {
  grid-area: right;
}
.fz-layout__overflow {
  @apply overflow-auto pr-0;
  scrollbar-gutter: stable;
}

.fz-layout__overflow .fz-layout__main,
.fz-layout__overflow .fz-layout__left,
.fz-layout__overflow .fz-layout__right,
.fz-layout__overflow .fz-layout__header,
.fz-layout__overflow .fz-layout__sidebar {
  @apply pr-0;
}
</style>
