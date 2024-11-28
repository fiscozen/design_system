<template>
  <FzIcon
    v-bind="props"
    name="spinner-third"
    variant="fas"
    spin
    style="
      --fa-animation-duration: 0.86s;
      --fa-animation-timing: cubic-bezier(0.4, 0.15, 0.6, 0.85);
    "
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzProgressProps } from "./types";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzProgressProps>(), {});

const emit = defineEmits([]);
</script>

<style scoped></style>
