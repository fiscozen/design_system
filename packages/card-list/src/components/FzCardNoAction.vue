<script setup lang="ts">
import { computed } from "vue";
import { FzBadge } from "@fiscozen/badge";
import { FzContainer } from "@fiscozen/container";
import { FzDivider } from "@fiscozen/divider";
import type { FzCardNoActionProps } from "./types";
import FzCardHeader from "./FzCardHeader.vue";
import FzCardFooter from "./FzCardFooter.vue";

const props = defineProps<FzCardNoActionProps>();
</script>

<template>
  <FzContainer gap="xs" class="p-8">
    <FzContainer v-if="badge" horizontal alignItems="center">
      <!-- Badge -->
      <FzBadge :tone="badge.tone" variant="text">
        {{ badge.text }}
      </FzBadge>
    </FzContainer>
    <!-- Title + value row (when badge or value is present) -->
    <FzCardHeader
      :show-indicator="showIndicator"
      :title="title"
      :value="value"
    />
    <FzCardFooter :descriptions="descriptions" />
  </FzContainer>
  <FzDivider margin="none" />
</template>
