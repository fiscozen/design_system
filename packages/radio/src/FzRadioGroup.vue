<template>
  <div :class="computedContainerClass">
    <label :for="name" :class="computedLabelClass">
      <span>{{ label }}<span v-if="required"> *</span></span>
      <p v-if="helpText" :class="computedHelpTextClass">{{ helpText }}</p>
    </label>
    <div :class="computedSlotContainerClass">
      <slot :radioGroupProps="controlledProps" />
    </div>
    <FzRadioErrorText :errorText="errorText" :size="size" v-if="error" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzRadioGroupProps } from "./types";
import FzRadioErrorText from "./components/FzRadioErrorText.vue";
import { mapSizeToClasses } from "./common";

const props = withDefaults(defineProps<FzRadioGroupProps>(), {
  name: `radio-group-${Math.random().toString(36).slice(2, 9)}`,
});

const controlledProps = computed(() => ({
  disabled: props.disabled,
  error: props.error,
  size: props.size,
  emphasis: props.emphasis,
  required: props.required,
  name: props.name,
}));

const computedHelpTextClass = computed(() => [
  props.size === "sm" ? "text-xs" : "text-sm",
  props.disabled ? "text-grey-400" : "text-grey-500",
]);

const computedLabelClass = computed(() => [
  "flex flex-col",
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-4" : "gap-6",
  props.disabled ? "text-grey-400" : "text-grey-800",
]);

const computedContainerClass = computed(() => [
  "flex flex-col",
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-10" : "gap-12",
]);

const computedSlotContainerClass = computed(() => [
  "flex flex-col",
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-6" : "gap-8",
]);
</script>
