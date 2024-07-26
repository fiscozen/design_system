<template></template>

<script setup lang="ts">
import { FzColumnProps, FzColumnSlots } from "./types";

const props = withDefaults(defineProps<FzColumnProps>(), {});

const emit = defineEmits([]);

defineSlots<FzColumnSlots>();
</script>

<style scoped></style>
