<script setup lang="ts">
import { computed, useId } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzContainer } from "@fiscozen/container";
import { FzDivider } from "@fiscozen/divider";
import { FzIcon } from "@fiscozen/icons";
import type { FzCardSingleActionEmits, FzCardSingleActionProps } from "./types";
import FzCardHeader from "./FzCardHeader.vue";
import FzCardFooter from "./FzCardFooter.vue";

const props = defineProps<FzCardSingleActionProps>();

const emit = defineEmits<FzCardSingleActionEmits>();

const hasTitleOnly = computed(() => !props.badge && !props.value);
const noAction = computed(() => !props.action);

const rowTitleId = useId();

function handleRowInteraction(e: MouseEvent | KeyboardEvent) {
  if (noAction.value) return;
  if (e instanceof KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
  }
  e.stopPropagation();
  emit("fzaction:click", props.action!);
}
</script>

<template>
  <FzContainer
    gap="xs"
    role="button"
    tabindex="0"
    :aria-labelledby="rowTitleId"
    class="p-8 hover:bg-semantic-info-50 hover:rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-200 focus-visible:rounded"
    @click="handleRowInteraction"
    @keydown="handleRowInteraction"
  >
    <!--
      Header row layout:
      - badge present → badge + action
      - hasTitleOnly (no badge, no value) → title + action (inline)
      - value present, no badge → action only; title + value are in the second row
    -->
    <FzContainer horizontal alignItems="center">
      <!-- Badge -->
      <FzBadge v-if="badge" :tone="badge.tone" variant="text">
        {{ badge.text }}
      </FzBadge>
      <!-- Title only (inline with action) -->
      <FzCardHeader
        v-else-if="hasTitleOnly"
        has-title-only
        :show-indicator="showIndicator"
        :title="title"
      />
      <!-- Single action arrow -->
      <FzContainer
        v-if="!noAction"
        horizontal
        gap="xs"
        alignItems="center"
        layout="expand-last"
        class="shrink-0 ml-auto"
      >
        <span class="inline-flex shrink-0 text-inherit" aria-hidden="true">
          <FzIcon name="arrow-right" size="md" variant="fas" v-color:grey />
        </span>
      </FzContainer>
    </FzContainer>

    <!-- Title + value row (when badge or value is present) -->
    <FzCardHeader
      v-if="!hasTitleOnly"
      :show-indicator="showIndicator"
      :title="title"
      :value="value"
    />
    <FzCardFooter :descriptions="descriptions" />
  </FzContainer>

  <FzDivider margin="none" />
</template>
