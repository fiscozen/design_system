<template>
  <button :class="classes" @click="onClickTab" v-bind="tab" :title="tab.title">
    <FzIcon v-if="tab.icon" :name="tab.icon" size="md" />
    <span class="text-ellipsis flex-1 whitespace-nowrap overflow-hidden">{{
      tab.title
    }}</span>
    <FzBadge
      v-if="tab.badgeContent != null"
      :color="badgeColor"
      :environment="environment"
      size="md"
    >
      {{ tab.badgeContent }}
    </FzBadge>
    <slot />
  </button>
</template>
<script setup lang="ts">
import { inject, computed, Ref } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzIcon } from "@fiscozen/icons";
import { useMediaQuery } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { FzTabProps } from "../types";
import {
  mapEnvironmentToClasses,
  mapSelectedTabToClassesWithTone,
  mapUnselectedTabToClassesWithTone,
} from "../common";

const xs = useMediaQuery(`(max-width: ${breakpoints.xs})`);

const props = withDefaults(
  defineProps<{
    tab: FzTabProps;
    environment: "frontoffice" | "backoffice";
    type: "picker" | "tab";
    readonly?: boolean;
    maxWidth?: string;
    tone?: "neutral" | "alert";
    fullWidth?: boolean;
  }>(),
  {
    type: "tab",
    readonly: false,
    tone: "neutral",
    fullWidth: false,
  },
);

const selectedTab = inject<Ref<string>>("selectedTab");
const emit = defineEmits(["click"]);

const badgeColor = computed(() => {
  if (selectedTab?.value !== props.tab.title) return "black";
  return props.tone === "alert" ? "error" : "blue";
});

/**
 * Builds the CSS classes array for a tab button based on its state and configuration.
 * @param tone - The tone of the tab (neutral or alert)
 * @param isSelected - Whether the tab is currently selected
 * @param type - The type of tab (picker or tab)
 * @param environment - The environment (frontoffice or backoffice)
 * @param isDisabled - Whether the tab is disabled
 * @param maxWidth - Optional max width value
 * @param isXsBreakpoint - Whether the current viewport is at xs breakpoint (defaults to false)
 * @returns Array of CSS class strings
 */
function getTabButtonClasses(
  tone: "neutral" | "alert",
  isSelected: boolean,
  type: "picker" | "tab",
  environment: "frontoffice" | "backoffice",
  isDisabled: boolean,
  maxWidth?: string,
  isXsBreakpoint: boolean = false,
  fullWidth: boolean = false,
): string[] {
  const toneClasses = isSelected
    ? mapSelectedTabToClassesWithTone[tone][type]
    : mapUnselectedTabToClassesWithTone[tone][type];

  return [
    "flex items-center rounded-md",
    fullWidth ? "flex-1 justify-center" : "w-auto",
    mapEnvironmentToClasses[environment],
    type === "picker" ? "text-left" : "",
    toneClasses,
    isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    maxWidth && !isXsBreakpoint ? `max-w-[${maxWidth}]` : "",
    isXsBreakpoint ? "!max-w-full !w-full" : "",
  ];
}

const classes = computed(() => {
  const tone = props.tone || "neutral";
  const isSelected = selectedTab?.value === props.tab.title;

  return getTabButtonClasses(
    tone,
    isSelected,
    props.type,
    props.environment,
    props.tab.disabled ?? false,
    props.maxWidth,
    xs.value ?? false,
    props.fullWidth,
  );
});

const onClickTab = () => {
  if (!props.tab.disabled) {
    if (!props.readonly) selectedTab!.value = props.tab.title;
    emit("click");
  }
};
</script>
