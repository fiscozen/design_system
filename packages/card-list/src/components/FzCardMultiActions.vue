<script setup lang="ts">
import { computed } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzContainer } from "@fiscozen/container";
import { FzDivider } from "@fiscozen/divider";
import { FzIconDropdown } from "@fiscozen/dropdown";
import type { FzCardMultiActionsProps, FzCardMultiActionsEmits } from "./types";
import type { FzActionProps } from "@fiscozen/action";
import FzCardHeader from "./FzCardHeader.vue";
import FzCardFooter from "./FzCardFooter.vue";

const props = defineProps<FzCardMultiActionsProps>();

const emit = defineEmits<FzCardMultiActionsEmits>();

const hasTitleOnly = computed(() => !props.badge && !props.value);

function emitActionClick(actionIndex: number, action: FzActionProps) {
  emit("fzaction:click", actionIndex, action);
}
</script>

<template>
  <FzContainer gap="xs" class="p-8 hover:bg-semantic-info-50 hover:rounded">
    <!--
      Header row layout:
      - badge present → badge + actions
      - hasTitleOnly (no badge, no value) → title + actions (inline)
      - value present, no badge → actions only; title + value are in the second row
    -->
    <FzContainer horizontal alignItems="center">
      <!-- Badge -->
      <FzBadge v-if="badge" :left-icon="badge.icon" :tone="badge.tone" variant="text">
        {{ badge.text }}
      </FzBadge>
      <!-- Title only (inline with actions) -->
      <FzCardHeader
        v-else-if="hasTitleOnly"
        has-title-only
        :show-indicator="showIndicator"
        :title="title"
      />
      <!-- Multiple actions dropdown -->
      <FzContainer
        horizontal
        gap="xs"
        alignItems="center"
        layout="expand-last"
        class="shrink-0 ml-auto"
      >
        <FzIconDropdown
          :actions="actions!"
          iconName="ellipsis-vertical"
          variant="invisible"
          aria-label="Mostra azioni"
          @fzaction:click="emitActionClick"
        />
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
