<template>
  <FzFloating
    position="bottom"
    :isOpen
    class="w-full overflow-hidden"
    contentClass="bg-transparent z-70"
  >
    <template #opener>
      <FzTabButton
        :tab="selectedTabProps!"
        :size="size"
        type="tab"
        readonly
        @click="isOpen = !isOpen"
      >
        <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" :size="size" />
      </FzTabButton>
    </template>
    <div
      class="flex flex-col p-4 rounded shadow overflow-hidden bg-core-white z-10"
      :style="{ width: containerWidth }"
    >
      <FzTabButton
        v-for="tab in tabs"
        :tab="tab"
        :size="size"
        type="picker"
        @click="closePicker"
      />
    </div>
  </FzFloating>
</template>

<script setup lang="ts">
import { ref, inject, computed, Ref } from "vue";
import { FzFloating } from "@fiscozen/composables";
import { FzIcon } from "@fiscozen/icons";
import { FzBadge } from "@fiscozen/badge";
import { FzTabProps } from "../types";
import { mapSizeToClasses } from "../common";
import FzTabButton from "./FzTabButton.vue";

const isOpen = ref(false);
const props = defineProps<{
  tabs: FzTabProps[];
  size: "sm" | "md";
}>();
const opener = ref<HTMLElement>();

const selectedTab = inject<Ref<string>>("selectedTab");
const selectedTabProps = computed(() => {
  return props.tabs.find((tab) => tab.title === selectedTab?.value);
});

const computedClasses = computed(() => [
  "flex items-center text-left max-w-[136px] rounded-md h-auto bg-white text-blue-500 font-medium cursor-pointer capitalize ",
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
