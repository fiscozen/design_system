<template>
  <p :class="[staticErrorTextClass, computedErrorTextClass]">
    <FzIcon
      class="text-semantic-error"
      name="triangle-exclamation"
      :size="size"
    />
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { mapSizeToClasses } from "../common";
import { FzIcon } from "@fiscozen/icons";

const props = defineProps<{ errorText?: string; size: "sm" | "md" }>();
const staticErrorTextClass = "flex w-full gap-4 items-center text-core-black";
const computedErrorTextClass = computed(() => [mapSizeToClasses[props.size]]);
</script>
