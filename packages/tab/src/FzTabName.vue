<template>
  <button :class="classes" @click="onClickTab" v-bind="tab">
    <FzIcon v-if="tab.icon" :name="tab.icon" :size="size" />
    <span class="text-ellipsis whitespace-nowrap overflow-hidden">{{ tab.title }}</span>
    <FzBadge
      v-if="tab.badgeContent"
      :color="selectedTab === tab.title ? 'blue' : 'black'"
      :size="size"
    >
      {{ tab.badgeContent }}
    </FzBadge>
  </button>
</template>
<script setup lang="ts">
import { inject, computed, Ref } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzIcon } from "@fiscozen/icons";
import { FzTabProps } from "./types";
import { mapSizeToClasses } from "./common";

const props = defineProps<{
  tab: FzTabProps;
  size: "sm" | "md";
}>();

const selectedTab = inject<Ref<string>>("selectedTab");

const classes = computed(() => [
  "w-auto flex font-medium items-center max-w-[136px]",
  mapSizeToClasses[props.size],
  selectedTab?.value === props.tab.title
    ? "bg-white text-blue-500"
    : "text-grey-500 bg-grey-100 hover:bg-background-alice-blue active:bg-white active:text-blue-500",
  props.tab.disabled ? "cursor-not-allowed" : "cursor-pointer",
]);

const onClickTab = () => {
  if (!props.tab.disabled) {
    selectedTab!.value = props.tab.title;
  }
};
</script>
