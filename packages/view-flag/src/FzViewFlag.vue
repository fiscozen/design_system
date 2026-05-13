<template>
  <div
    class="border-8 border-semantic-warning fixed inset-0 pointer-events-none z-50"
  >
    <div
      class="bg-semantic-warning rounded-t-base text-sm p-8 bottom-0 left-0 fixed empty:hidden w-full sm:w-fit pointer-events-auto"
    >
      <slot />
      <div v-if="open" class="w-full relative">
        <div
          class="bg-semantic-warning w-dvw left-0 top-0 bottom-0 absolute"
        ></div>
        <div class="isolate">
          <slot name="banner" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open?: boolean;
}>();
</script>
