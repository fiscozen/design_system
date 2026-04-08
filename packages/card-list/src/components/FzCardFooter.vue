<script setup lang="ts">
import { FzContainer } from "@fiscozen/container";
import { FzCardListFooterProps } from "./types";
const props = defineProps<FzCardListFooterProps>();
</script>

<template>
  <FzContainer v-if="descriptions?.length" gap="none">
    <p v-for="(desc, i) in descriptions" :key="i" v-small v-color:grey>
      {{ desc }}
    </p>
  </FzContainer>
</template>