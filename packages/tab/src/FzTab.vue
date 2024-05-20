<template>
  <slot v-if="isActive"></slot>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref, computed } from "vue";
import { FzTabProps } from "./types";

const props = defineProps<FzTabProps>();

const selectedTab = inject<Ref<string>>("selectedTab");
const isActive = computed(() => selectedTab?.value === props.title);

onMounted(() => {
  if (selectedTab === undefined) {
    console.error(
      "[Fiscozen Design System]: FzTab must be used inside a FzTabs component",
    );
  } else if (props.initialSelected) {
    selectedTab.value = props.title;
  }
});
</script>
