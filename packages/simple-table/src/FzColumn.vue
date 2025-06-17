<template></template>

<script setup lang="ts">
import { FzColumnProps, FzColumnSlots } from "./types";

const props = withDefaults(defineProps<FzColumnProps>(), {
    headerTextJustify: "left",
});

const emit = defineEmits([]);

defineSlots<FzColumnSlots>();
</script>

<style scoped></style>
