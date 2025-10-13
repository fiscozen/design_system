<template>
  <div
    :class="[
      'fz__actionlist bg-core-white rounded flex flex-col gap-20 p-4 min-w-[240px]',
      listClass,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { FzActionListProps } from "./types";

withDefaults(defineProps<FzActionListProps>(), {
  listClass: "",
});
</script>

<style scoped>
.fz__actionlist {
  box-shadow:
    0 1px 2px 0 rgba(0, 0, 0, 0.06),
    0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>
