<template>
  <button
    :key="tab.title"
    @click="onPickerValueClick"
    :class="computedClasses"
    :disabled="tab.disabled"
  >
    {{ tab.title }}
  </button>
</template>

<script setup lang="ts">
import { Ref, inject, computed } from "vue";
import { FzTabProps } from "../types";
import { mapSizeToClasses } from "../common";

const props = defineProps<{
  tab: FzTabProps;
  size: "sm" | "md";
}>();

const emit = defineEmits(["click"]);

const selectedTab = inject<Ref<string>>("selectedTab");
const computedClasses = computed(() => [
  mapSizeToClasses[props.size],
  "flex items-center text-left max-w-[136px] h-auto bg-white text-blue-500 font-medium cursor-pointer capitalize rounded",
  selectedTab?.value === props.tab.title
    ? "!bg-background-alice-blue"
    : "hover:!bg-background-alice-blue !text-black hover:!text-blue-500",
  props.tab.disabled ? "cursor-not-allowed" : "cursor-pointer",
]);

const onPickerValueClick = () => {
  if (!props.tab.disabled) {
    selectedTab!.value = props.tab.title;
    emit("click");
  }
};
</script>
