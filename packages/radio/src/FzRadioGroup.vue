<template>
  <div :class="[staticContainerClass, computedContainerClass]">
    <label :for="name" :class="[staticLabelClass, computedLabelClass]">
      <span>{{ label }}<span v-if="required"> *</span></span>
      <p :class="computedHelpTextClass" v-if="$slots.help">
        <slot name="help" />
      </p>
    </label>
    <div
      :class="[staticSlotContainerClass, computedSlotContainerClass]"
      test-id="slot-container"
    >
      <slot :radioGroupProps="controlledProps" />
    </div>
    <FzAlert
      v-if="isError && $slots.error"
      type="error"
      alertStyle="simple"
      size="md"
    >
      <slot name="error" />
    </FzAlert>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzRadioGroupProps } from "./types";
import { FzAlert } from "@fiscozen/alert";
import { mapSizeToClasses } from "./common";

const props = withDefaults(defineProps<FzRadioGroupProps>(), {
  name: `radio-group-${Math.random().toString(36).slice(2, 9)}`,
  size: "md",
  variant: "vertical",
});

// Compute tone from props (with fallback to deprecated emphasis/error)
const computedTone = computed<"neutral" | "emphasis" | "error">(() => {
  if (props.tone) return props.tone;
  if (props.error) return "error";
  if (props.emphasis) return "emphasis";
  return "neutral";
});

// Compute error state
const isError = computed(() => {
  return computedTone.value === "error" || props.error === true;
});

const controlledProps = computed(() => ({
  disabled: props.disabled,
  error: props.error,
  size: "md",
  emphasis: props.emphasis,
  tone: computedTone.value,
  required: props.required,
  name: props.name,
}));

const staticLabelClass = "flex flex-col";
const staticContainerClass = "flex flex-col";
const staticSlotContainerClass = computed(() => [
  "flex self-stretch",
  props.variant === "horizontal" ? "flex-row" : "flex-col",
]);

const computedHelpTextClass = computed(() => [
  "text-base",
  props.disabled ? "text-grey-400" : "text-grey-500",
]);

const computedLabelClass = computed(() => [
  mapSizeToClasses["md"],
  "gap-6",
  props.disabled ? "text-grey-400" : "text-core-black",
]);

const computedContainerClass = computed(() => [
  mapSizeToClasses["md"],
  "gap-10"
]);

const computedSlotContainerClass = computed(() => [
  mapSizeToClasses["md"],
  "gap-8"
]);
</script>
