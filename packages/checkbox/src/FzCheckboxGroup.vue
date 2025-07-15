<template>
  <div :class="[staticContainerClass, computedContainerClass]">
    <label
      :id="id + '-label'"
      :for="id"
      :class="[staticLabeldClass, computedLabelClass]"
    >
      <span>{{ label }}<span v-if="required"> *</span></span>
      <p :class="computedHelpTextClass" v-if="$slots.help">
        <slot name="help" />
      </p>
    </label>
    <div
      :class="[staticSlotContainerClass, computedSlotContainerClass]"
      :id="id"
      role="group"
      :aria-labelledby="id + '-label'"
      :aria-describedby="error && $slots.error ? id + '-error' : undefined"
    >
      <FzCheckboxGroupOption
        v-for="option in options"
        :key="option.value ? option.value.toString() : option.label"
        v-model="model"
        :disabled="disabled"
        v-bind="option"
        :emphasis="emphasis"
        :size="size"
      />
    </div>
    <FzCheckboxErrorText
      :id="id + '-error'"
      :size="size"
      v-if="error && $slots.error"
    >
      <slot name="error" />
    </FzCheckboxErrorText>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzCheckboxGroupProps } from "./types";
import FzCheckboxErrorText from "./components/FzCheckboxErrorText.vue";
import { mapSizeToClasses } from "./common";
import FzCheckboxGroupOption from "./components/FzCheckboxGroupOption.vue";

FzCheckboxGroupOption.compatConfig = {
  MODE: 3,
};

const props = defineProps<FzCheckboxGroupProps>();
const id = `fz-checkbox-group-${generateRandomId()}`;

const computedHelpTextClass = computed(() => [
  props.size === "sm" ? "text-xs" : "text-sm",
  props.disabled ? "text-grey-400" : "text-grey-500",
]);

const model = defineModel<string[]>({
  required: true,
  default: [],
});

const staticLabeldClass = "flex flex-col";
const staticContainerClass = "flex flex-col";
const staticSlotContainerClass = "flex flex-col";

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

function generateRandomId() {
  return Math.random().toString(36).slice(2, 9);
}
</script>
