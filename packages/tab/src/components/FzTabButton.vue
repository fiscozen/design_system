<template>
  <button :class="classes" @click="onClickTab" v-bind="tab">
    <FzIcon v-if="tab.icon" :name="tab.icon" :size="size" />
    <span class="text-ellipsis flex-1 whitespace-nowrap overflow-hidden">{{
      tab.title
    }}</span>
    <FzBadge
      v-if="tab.badgeContent != null"
      :color="selectedTab === tab.title ? 'blue' : 'black'"
      :size="size"
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
import { FzTabProps } from "../types";
import {
  mapSelectedTabToClasses,
  mapSizeToClasses,
  mapUnselectedTabToClasses,
} from "../common";

const props = withDefaults(
  defineProps<{
    tab: FzTabProps;
    size: "sm" | "md";
    type: "picker" | "tab";
    readonly: boolean;
  }>(),
  {
    type: "tab",
    readonly: false,
  },
);

const selectedTab = inject<Ref<string>>("selectedTab");
const emit = defineEmits(["click"]);

const classes = computed(() => [
  "w-auto flex font-medium items-center max-w-[136px] rounded-md",
  mapSizeToClasses[props.size],
  props.type === "picker" ? "text-left" : "",
  selectedTab?.value === props.tab.title
    ? mapSelectedTabToClasses[props.type]
    : mapUnselectedTabToClasses[props.type],
  props.tab.disabled ? "cursor-not-allowed" : "cursor-pointer",
]);

const onClickTab = () => {
  if (!props.tab.disabled) {
    if (!props.readonly) selectedTab!.value = props.tab.title;
    emit("click");
  }
};
</script>
