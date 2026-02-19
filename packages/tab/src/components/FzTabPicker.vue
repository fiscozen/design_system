<template>
  <FzFloating
    position="bottom"
    :isOpen
    class="w-full overflow-hidden"
    contentClass="bg-transparent z-70"
  >
    <template #opener>
      <FzTabButton
        v-if="selectedTabProps"
        :tab="selectedTabProps"
        :environment="environment"
        :tone="props.tone"
        class="w-full sm:w-auto"
        type="tab"
        readonly
        @click="isOpen = !isOpen"
        data-testid="fz-tab-picker-opener"
      >
        <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" size="md" />
      </FzTabButton>
    </template>
    <FzActionList>
      <FzActionSection>
        <FzAction
          v-for="tab in tabs"
          :key="tab.title"
          type="action"
          variant="textLeft"
          :label="tab.title"
          :iconLeftName="tab.icon"
          :disabled="tab.disabled"
          :environment="environment"
          :tone="tab.tone"
          @click="selectTab(tab)"
        />
      </FzActionSection>
    </FzActionList>
  </FzFloating>
</template>

<script setup lang="ts">
import { ref, inject, computed, Ref } from "vue";
import { FzFloating } from "@fiscozen/composables";
import { FzIcon } from "@fiscozen/icons";
import { FzAction, FzActionList, FzActionSection } from "@fiscozen/action";
import { FzTabProps } from "../types";
import FzTabButton from "./FzTabButton.vue";

const isOpen = ref(false);
const props = defineProps<{
  tabs: FzTabProps[];
  tone?: "neutral" | "alert";
  environment: "frontoffice" | "backoffice";
}>();

const selectedTab = inject<Ref<string>>("selectedTab");
const selectedTabProps = computed(() => {
  return props.tabs.find((tab) => tab.title === selectedTab?.value);
});

const selectTab = (tab: FzTabProps) => {
  if (!tab.disabled && selectedTab) {
    selectedTab.value = tab.title;
    isOpen.value = false;
  }
};

</script>
