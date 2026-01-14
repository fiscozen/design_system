<template>
  <button :class="classes" @click="onClickTab" v-bind="tab" :title="tab.title">
    <FzIcon v-if="tab.icon" :name="tab.icon" size="md" />
    <span class="text-ellipsis flex-1 whitespace-nowrap overflow-hidden">{{
      tab.title
    }}</span>
    <FzBadge
      v-if="tab.badgeContent != null"
      :color="
        selectedTab === tab.title
          ? props.tone === 'alert'
            ? 'error'
            : 'blue'
          : 'black'
      "
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
  }>(),
  {
    type: "tab",
    readonly: false,
    tone: "neutral",
  },
);

const selectedTab = inject<Ref<string>>("selectedTab");
const emit = defineEmits(["click"]);

const classes = computed(() => {
  const tone = props.tone || "neutral";
  const isSelected = selectedTab?.value === props.tab.title;

  const toneClasses = isSelected
    ? mapSelectedTabToClassesWithTone[tone][props.type]
    : mapUnselectedTabToClassesWithTone[tone][props.type];

  return [
    "w-auto flex font-medium items-center  rounded-md",
    mapEnvironmentToClasses[props.environment],
    props.type === "picker" ? "text-left" : "",
    toneClasses,
    props.tab.disabled ? "cursor-not-allowed" : "cursor-pointer",
    props.maxWidth && !xs.value ? `max-w-[${props.maxWidth}]` : "",
    xs.value ? "!max-w-full !w-full" : "",
  ];
});

const onClickTab = () => {
  if (!props.tab.disabled) {
    if (!props.readonly) selectedTab!.value = props.tab.title;
    emit("click");
  }
};
</script>
