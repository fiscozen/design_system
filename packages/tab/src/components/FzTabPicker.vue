<template>
  <FzFloating position="bottom" :isOpen class="w-full overflow-hidden">
    <template #opener>
      <button
        @click="isOpen = !isOpen"
        :size="size"
        :class="computedClasses"
        ref="opener"
      >
        <span class="overflow-hidden text-ellipsis whitespace-nowrap">
          {{ selectedTab }}
        </span>
        <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" :size="size" />
      </button>
    </template>
    <div
      class="flex flex-col p-4 rounded-[4px] shadow overflow-hidden"
      :style="{ width: containerWidth }"
    >
      <FzTabPickerValue
        v-for="tab in tabs"
        :tab="tab"
        :size="size"
        @click="closePicker"
      />
    </div>
  </FzFloating>
</template>

<script setup lang="ts">
import { ref, inject, computed } from "vue";
import { FzFloating } from "@fiscozen/composables";
import { FzIcon } from "@fiscozen/icons";
import { FzTabProps } from "../types";
import { mapSizeToClasses } from "../common";
import FzTabPickerValue from "./FzTabPickerValue.vue";

const isOpen = ref(false);
const props = defineProps<{
  tabs: FzTabProps[];
  size: "sm" | "md";
}>();
const opener = ref<HTMLElement>();

const selectedTab = inject("selectedTab");

const computedClasses = computed(() => [
  "flex items-center text-left max-w-[136px] h-auto bg-white text-blue-500 font-medium cursor-pointer capitalize ",
  mapSizeToClasses[props.size],
]);

const containerWidth = computed(() => {
  if (!opener.value) return "auto";
  return `${opener.value.offsetWidth}px`;
});

const closePicker = () => {
  isOpen.value = false;
};
</script>
