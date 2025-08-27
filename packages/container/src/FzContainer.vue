<script setup lang="ts">
import { computed, ref } from "vue";
import { FzContainerProps } from "./types";

const props = withDefaults(defineProps<FzContainerProps>(), {});

const emit = defineEmits([]);
</script>

<style scoped></style>

<template>CONTAINER</template>
