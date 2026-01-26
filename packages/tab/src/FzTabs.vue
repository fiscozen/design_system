<template>
  <div :class="computedClassWrapper">
    <div :class="['flex', computedClass]">
      <div
        :class="[
          staticTabContainerClass,
          computedClass,
          overflowContainerClass,
        ]"
        ref="tabContainer"
      >
        <FzTabPicker
          v-if="effectiveTabStyle === 'picker'"
          :tabs="tabs"
          :environment="effectiveSize"
        />
        <template v-else>
          <FzTabButton
            v-for="tab in tabs"
            :tab="tab"
            :key="tab.title"
            :environment="effectiveSize"
            :maxWidth="tab.maxWidth"
            :tone="tab.tone"
            type="tab"
            :readonly="false"
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
import { computed, ref, onMounted, provide, useSlots, watch, VNode } from "vue";
import { FzTabsProps, FzTabProps } from "./types";
import FzTabPicker from "./components/FzTabPicker.vue";
import FzTabButton from "./components/FzTabButton.vue";
import FzTab from "./FzTab.vue";
import { debugWarn, mapSizeToEnvironment } from "./common";

const props = withDefaults(defineProps<FzTabsProps>(), {
  vertical: false,
  horizontalOverflow: undefined,
  tabStyle: "scroll",
  isDebug: false,
});

const emit = defineEmits(["change"]);

const slots = useSlots();

const tabContainer = ref<HTMLElement>();
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
  "tab-container flex rounded-lg p-2 bg-grey-100 w-fit max-w-full w-full sm:w-auto";

const computedClass = computed(() => [
  props.vertical ? "flex-col" : "flex-row",
]);

const computedClassWrapper = computed(() => [
  "flex",
  !props.vertical ? "flex-col" : "flex-row",
]);

const overflowContainerClass = computed(() => {
  if (effectiveTabStyle.value === "scroll") {
    return "overflow-x-auto";
  }
  return "";
});

/**
 * Determines the effective size based on environment or deprecated size prop
 * Priority: environment prop > size prop (deprecated) > default 'sm'
 */
const effectiveSize = computed<"frontoffice" | "backoffice">(() => {
  if (props.environment) {
    return props.environment;
  }
  if (props.size) {
    return mapSizeToEnvironment[props.size];
  }
  return "backoffice";
});

/**
 * Determines the effective overflow mode
 * Priority: overflowMode prop > horizontalOverflow prop (deprecated) > default 'scroll'
 */
const effectiveTabStyle = computed<"scroll" | "picker">(() => {
  if (
    props.horizontalOverflow !== undefined &&
    props.horizontalOverflow === false
  )
    return "picker";

  return props.tabStyle;
});

/**
 * Deprecation warning for size prop
 */
watch(
  () => props.size,
  (size) => {
    if (size !== undefined) {
      debugWarn(
        `[FzTabs] The "size" prop is deprecated and will be removed in a future version. ` +
          `Please use environment="backoffice" instead of size="${size}".`,
        props.isDebug,
      );
    }
  },
  { immediate: true },
);

/**
 * Deprecation warning for horizontalOverflow prop
 */
watch(
  () => props.horizontalOverflow,
  (horizontalOverflow) => {
    // Only warn if horizontalOverflow is explicitly set to true
    // (false is treated as not set, since the default behavior is no overflow)
    if (horizontalOverflow !== undefined) {
      debugWarn(
        `[FzTabs] The "horizontalOverflow" prop is deprecated and will be removed in a future version. ` +
          `Please use tabStyle="scroll" instead.`,
        props.isDebug,
      );
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (tabs.value.length === 0) {
    debugWarn(
      "[Fiscozen Design System]: FzTabs must have at least one FzTab child",
      props.isDebug,
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
      debugWarn(
        `[Fiscozen Design System]: FzTabs has duplicate titles: ${duplicateTitles.join(", ")}, this may cause unexpected behavior.`,
        props.isDebug,
      );
    }
  }
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

    const selectedTabElement = tabContainer.value?.querySelector(
      `button[title="${selectedTab.value}"]`,
    );

    emit("change", selectedTab.value, selectedTabElement);
  },
);
</script>
