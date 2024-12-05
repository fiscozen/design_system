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
    <FzRadioErrorText :size="size" v-if="error && $slots.error">
      <slot name="error" />
    </FzRadioErrorText>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzRadioGroupProps } from "./types";
import FzRadioErrorText from "./components/FzRadioErrorText.vue";
import { mapSizeToClasses } from "./common";

const props = withDefaults(defineProps<FzRadioGroupProps>(), {
  name: `radio-group-${Math.random().toString(36).slice(2, 9)}`,
  size: "md",
});

const controlledProps = computed(() => ({
  disabled: props.disabled,
  error: props.error,
  size: props.size,
  emphasis: props.emphasis,
  required: props.required,
  name: props.name,
}));

const staticLabelClass = "flex flex-col";
const staticContainerClass = "flex flex-col";
const staticSlotContainerClass = "flex flex-col";

const computedHelpTextClass = computed(() => [
  props.size === "sm" ? "text-xs" : "",
  props.size === "md" ? "text-sm" : "",
  props.disabled ? "text-grey-400" : "text-grey-500",
]);

const computedLabelClass = computed(() => [
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-4" : "",
  props.size === "md" ? "gap-6" : "",
  props.disabled ? "text-grey-400" : "text-core-black",
]);

const computedContainerClass = computed(() => [
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-10" : "",
  props.size === "md" ? "gap-12" : "",
]);

const computedSlotContainerClass = computed(() => [
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-6" : "",
  props.size === "md" ? "gap-8" : "",
]);
</script>
