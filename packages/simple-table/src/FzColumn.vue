<template></template>

<script setup lang="ts">
import { FzColumnProps, FzColumnSlots } from "./types";

defineOptions({ __fzKind: "@fiscozen/simple-table/FzColumn" });

const props = withDefaults(defineProps<FzColumnProps>(), {
    headerTextJustify: "left",
});

const emit = defineEmits([]);

defineSlots<FzColumnSlots>();
</script>

<style scoped></style>
