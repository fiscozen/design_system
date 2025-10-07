<template>
  <div :class="computedClassWrapper">
    <div :class="['flex', computedClass]">
      <div
        :class="[staticTabContainerClass, computedClass]"
        ref="tabContainer"
        @wheel="onWheel"
      >
        <template v-if="!horizontalOverflow && isOverflowing">
          <FzTabPicker :tabs="tabs" :size="size" />
        </template>
        <template v-else>
          <FzTabButton
            v-for="tab in tabs"
            :tab="tab"
            :key="tab.title"
            :size="size"
          />
        </template>
        <slot name="tabs-container-end" />
      </div>
      <slot name="tabs-end" />
    </div>
    <slot :selected="selectedTab"></slot>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  provide,
  useSlots,
  watch,
  VNode,
  onBeforeUnmount,
} from "vue";
import { FzTabsProps, FzTabProps } from "./types";
import FzTabPicker from "./components/FzTabPicker.vue";
import FzTabButton from "./components/FzTabButton.vue";
import FzTab from "./FzTab.vue";

const props = withDefaults(defineProps<FzTabsProps>(), {
  size: "sm",
  vertical: false,
});

const emit = defineEmits(["change"]);

const slots = useSlots();

const tabContainer = ref<HTMLElement>();
const isOverflowing = ref(false);
const selectedTab = ref("");
provide("selectedTab", selectedTab);

const tabs = computed(() => {
  if (!slots.default) return [];

  return slots
    .default()
    .filter((tab) => {
      return tab.type === FzTab || typeof tab.type === "symbol";
    })
    .map((tab) => {
      if (tab.type === FzTab) return tab.props as FzTabProps;

      if (typeof tab.type === "symbol") {
        const children = tab.children as VNode[] | "v-if";
        if (!children || children === "v-if") return null;

        return children
          .filter((child) => child.type === FzTab)
          .map((child) => child.props as FzTabProps);
      }
    })
    .flat()
    .filter((el): el is FzTabProps => el != null);
});

const staticTabContainerClass =
  "tab-container flex rounded-lg gap-8 p-2 bg-grey-100 w-fit max-w-full overflow-x-auto";

const computedClass = computed(() => [
  props.vertical ? "flex-col" : "flex-row",
]);

const computedClassWrapper = computed(() => [
  "flex",
  !props.vertical ? "flex-col" : "flex-row",
]);

function onWheel(e: WheelEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (e.deltaY > 0) tabContainer.value!.scrollLeft += 100;
  else tabContainer.value!.scrollLeft -= 100;
}

function updateIsOverflowing() {
  if (!tabContainer.value) return false;

  const parent = tabContainer.value.parentElement ?? document.body;
  isOverflowing.value = tabContainer.value.scrollWidth > parent.clientWidth;
}

onMounted(() => {
  if (tabs.value.length === 0) {
    console.warn(
      "[Fiscozen Design System]: FzTabs must have at least one FzTab child",
    );
  } else {
    const findSelected = tabs.value.find((tab) => tab.initialSelected);
    if (findSelected) {
      selectedTab.value = findSelected.title;
    } else {
      selectedTab.value = tabs.value[0].title;
    }

    const duplicateTitles = tabs.value
      .map((tab) => tab.title)
      .filter((title, index, self) => self.indexOf(title) !== index);

    if (duplicateTitles.length) {
      console.warn(
        `[Fiscozen Design System]: FzTabs has duplicate titles: ${duplicateTitles.join(", ")}, this may cause unexpected behavior.`,
      );
    }
  }

  updateIsOverflowing();
  window.addEventListener("resize", updateIsOverflowing);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsOverflowing);
});

watch(
  () => selectedTab.value,
  () => {
    if (selectedTab.value === "") {
      if (tabs.value.length > 0)
        selectedTab.value =
          tabs.value.find((tab) => tab.initialSelected)?.title ??
          tabs.value[0].title;
    }

    const selectedTabElement = tabContainer.value!.querySelector(
      `button[title="${selectedTab.value}"]`,
    );

    if (selectedTabElement && isOverflowing.value) {
      selectedTabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    emit("change", selectedTab.value);
  },
);
</script>
<style scoped>
.tab-container::-webkit-scrollbar {
  width: 0em;
  height: 0em;
}
</style>
