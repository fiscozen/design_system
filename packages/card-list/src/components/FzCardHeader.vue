<script setup lang="ts">
import { FzContainer } from "@fiscozen/container";
import FzCardTitle from "./FzCardTitle.vue";
import { FzCardHeaderProps } from "./types";

const props = defineProps<FzCardHeaderProps>();
</script>

<template>
  <!-- Title Only -->
  <FzContainer
    v-if="hasTitleOnly"
    horizontal
    gap="xs"
    alignItems="center"
    class="min-w-0 flex-1"
  >
    <FzCardTitle :show-indicator="showIndicator" :title="title" :title-id="titleId" />
  </FzContainer>
  <FzContainer
    v-else
    horizontal
    gap="sm"
    alignItems="center"
    layout="space-between"
  >
    <FzCardTitle :show-indicator="showIndicator" :title="title" :title-id="titleId" />
    <!-- Value -->
    <p v-if="value" v-bold v-color:blue class="text-base whitespace-nowrap">
      {{ value }}
    </p>
  </FzContainer>
</template>
