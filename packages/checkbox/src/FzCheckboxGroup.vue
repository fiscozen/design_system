<template>
  <div :class="computedContainerClass" :id="id">
    <label :for="id" :class="computedLabelClass">
      <span>{{ label }}<span v-if="required"> *</span></span>
      <p :class="computedHelpTextClass" v-if="$slots.help">
        <slot name="help" />
      </p>
    </label>
    <div :class="computedSlotContainerClass">
      <FzCheckboxGroupOption
        v-for="option in options"
        :key="option.value"
        v-model="model"
        v-bind="option"
        :disabled="disabled"
        :emphasis="emphasis"
        :error="error"
        :size="size"
      />
    </div>
    <FzCheckboxErrorText :size="size" v-if="error && $slots.error">
      <slot name="error" />
    </FzCheckboxErrorText>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzCheckboxGroupProps, ParentCheckbox } from "./types";
import FzCheckboxErrorText from "./components/FzCheckboxErrorText.vue";
import { mapSizeToClasses } from "./common";
import FzCheckboxGroupOption from "./components/FzCheckboxGroupOption.vue";

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

const options = ref(createOptionsRef(props.options));

const computedLabelClass = computed(() => [
  "flex flex-col",
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-4" : "gap-6",
  props.disabled ? "text-grey-400" : "text-core-black",
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

function generateRandomId() {
  return Math.random().toString(36).slice(2, 9);
}

function createOptionsRef(options: ParentCheckbox[]) {
  return options.map((option) => {
    return {
      ...option,
      checked: option.checked || false,
      children: option.children?.map((child) => {
        return {
          ...child,
          checked: child.checked || false,
        };
      }),
    };
  });
}
</script>
