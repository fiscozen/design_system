<template>
     <FzFloating position="bottom" :isOpen class="w-full overflow-hidden">
      <template #opener>
          <button 
            @click="isOpen = !isOpen" 
            :size="size" 
            :class="computedClasses"
            ref="opener"
            > 
            <span class="overflow-hidden text-ellipsis whitespace-nowrap"> {{ selectedTab }}  </span>
            <FzIcon :name="isOpen ? 'chevron-up':'chevron-down'" :size="size"/>
          </button>
      </template> 
      <div class="flex flex-col p-4 rounded-[4px] shadow overflow-hidden" :style="{ width: containerWidth }">
        <button 
          v-for="tab in tabs" 
          :key="tab.title" 
          :size="size"
          @click="() => {isOpen = false; selectedTab = tab.title}" 
          :class="[
            computedClasses,
            selectedTab === tab.title ? '!bg-background-alice-blue' : 'hover:!bg-background-alice-blue !text-black hover:!text-blue-500',
            tab.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          ]"
          :disabled="tab.disabled"
          > 
          {{ tab.title }} 
        </button> 
      </div>
    </FzFloating>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { FzFloating } from '@fiscozen/composables';
import { FzIcon } from '@fiscozen/icons';
import { FzTabProps } from './types';
import { mapSizeToClasses } from './common';

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
</script>
