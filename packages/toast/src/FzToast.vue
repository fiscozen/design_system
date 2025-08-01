<template>
  <div :class="containerClass" ref="containerRef">
    <FzIcon :name="iconName" />
    <slot></slot>
    <FzIconButton v-if="type !== 'success'" icon-name="xmark" variant="invisible" class="ml-auto" size="sm"
      @click="emit('close')" :iconClass="closeButtonClass"></FzIconButton>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { FzToastProps } from "./types";
  import { FzIcon } from "@fiscozen/icons";
  import { FzIconButton } from "@fiscozen/button";

  const props = withDefaults(defineProps<FzToastProps>(), {
    showShadow: true,
  });
  const emit = defineEmits(["close"]);
  const containerRef = ref(null);

  defineExpose({ containerRef });

  const containerClass = computed(() => [
    "w-[320px] min-h-[54px] p-12 flex gap-8 text-sm items-center rounded border-1 border-grey-100",
    {
      success: "bg-semantic-success text-core-white",
      warning: "bg-semantic-warning text-core-black",
      error: "bg-semantic-error text-core-white",
    }[props.type],
    {
      "shadow-xl": props.showShadow,
    },
  ]);

  const iconName = computed(
    () =>
      ({
        success: "circle-check",
        warning: "triangle-exclamation",
        error: "circle-xmark",
      })[props.type],
  );

  const closeButtonClass = computed(() => {
    switch (props.type) {
      case "warning":
        return "text-core-black";
      case "success":
      case "error":
        return "text-core-white";
    }
  });
</script>
