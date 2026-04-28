<template>
  <div v-if="pages > 1" class="flex items-center gap-8">
    <FzIconButton
      iconName="arrow-left"
      iconVariant="fas"
      :environment="environment"
      variant="secondary"
      :disabled="page <= 1"
      :aria-label="prevPageLabel"
      @click="emit('change', page - 1)"
    />
    <span :class="staticTextClass" data-testid="pdf-page"
      >{{ page }} / {{ pages }}</span
    >
    <FzIconButton
      iconName="arrow-right"
      iconVariant="fas"
      :environment="environment"
      variant="secondary"
      :disabled="page >= pages"
      :aria-label="nextPageLabel"
      @click="emit('change', page + 1)"
    />
  </div>
</template>

<script setup lang="ts">
import { FzIconButton } from "@fiscozen/button";

withDefaults(
  defineProps<{
    environment: "frontoffice" | "backoffice";
    page: number;
    pages: number;
    prevPageLabel?: string;
    nextPageLabel?: string;
  }>(),
  {
    prevPageLabel: "Pagina precedente",
    nextPageLabel: "Pagina successiva",
  },
);

const emit = defineEmits<{
  change: [page: number];
}>();

const staticTextClass =
  "text-grey-500 font-normal text-base leading-5 lining-nums tabular-nums";
</script>
