<template>
  <div class="flex justify-center flex-col w-fit">
    <input
      type="checkbox"
      :id="id"
      :disabled="disabled"
      :checked="checked"
      :class="staticInputClass"
      :required="required"
      :value="value"
      @change="emit('change', $event)"
      v-model="model"
      :indeterminate="indeterminate"
      ref="refCheckbox"
    />
    <label :for="id" :class="[staticLabelClass, computedLabelClass]">
      <FzIcon
        :name="computedName"
        :size="size"
        :class="[staticIconClass, computedIconClasses]"
        :variant="computedVariant"
      />
      <span class="w-fit">{{ standalone ? "" : label }}</span>
    </label>
    <FzRadioErrorText :size="size" v-if="error && $slots.error">
      <slot name="error" />
    </FzRadioErrorText>
    <slot name="children" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FzCheckboxProps } from "./types";
import { mapSizeToClasses } from "./common";
import FzRadioErrorText from "./components/FzCheckboxErrorText.vue";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzCheckboxProps>(), {
  size: "md",
  indeterminate: false,
});

const currentValue = computed(() => props.value ?? props.label);

const id = computed(
  () => `fz-checkbox-${Math.random().toString(36).slice(2, 9)}`,
);

const model = defineModel<boolean | (string | number | boolean)[]>({
  required: true,
});

const emit = defineEmits(["change"]);
const refCheckbox = ref<HTMLInputElement | null>(null);

const staticInputClass = "w-0 h-0 peer fz-hidden-input";
const staticLabelClass = `
  flex items-start gap-4 hover:cursor-pointer
  peer-focus:[&_div]:after:border-1
  peer-focus:[&_div]:after:border-solid
  peer-focus:[&_div]:after:rounded-[3px]
  peer-focus:[&_div]:after:border-blue-500
  peer-focus:[&_div]:after:content-['']
  peer-focus:[&_div]:after:top-0
  peer-focus:[&_div]:after:left-0
  peer-focus:[&_div]:after:right-0
  peer-focus:[&_div]:after:bottom-0
  peer-focus:[&_div]:after:absolute
`;
const staticIconClass = "relative";

const computedLabelClass = computed(() => [
  mapSizeToClasses[props.size],
  getTextClassForLabel(),
]);

const computedIconClasses = computed(() => [
  props.size === "sm" ? "mt-1" : "",
  props.size === "md" ? "mt-2" : "",
  getTextClassForIcon(),
]);

const computedName = computed(() => {
  if (props.indeterminate) {
    return "square-minus";
  }

  return checkValueIsInModel() ? "square-check" : "square";
});

const computedVariant = computed(() => {
  return !props.indeterminate && !checkValueIsInModel() ? "far" : "fas";
});

const checkValueIsInModel = () => {
  if (typeof model.value === "boolean") {
    return model.value;
  } else {
    return model.value.includes(currentValue.value);
  }
};

const getTextClassForLabel = () => {
  switch (true) {
    case props.disabled:
      return "text-grey-300";
    case props.error:
      return "text-semantic-error";
    case props.emphasis:
      return "text-grey-500 peer-checked:[&_div]:text-blue-500 peer-indeterminate:[&_div]:text-blue-500";
    default:
      return "text-grey-500";
  }
};

const getTextClassForIcon = () => {
  switch (true) {
    case props.disabled:
      return "text-grey-300";
    case props.error:
      return "text-semantic-error";
    case props.emphasis:
    default:
      return "text-grey-500";
  }
};

onMounted(() => {
  if (typeof model.value === "boolean") {
    if (model.value) refCheckbox.value?.dispatchEvent(new Event("change"));
    else if (props.checked !== undefined) model.value = props.checked;
  } else {
    if (model.value.includes(currentValue.value))
      refCheckbox.value?.dispatchEvent(new Event("change"));
    else if (props.checked) model.value.push(currentValue.value);
  }
});
</script>
<style scoped>
.fz-hidden-input {
  opacity: 0;
  margin:0;
  height:0;
  border:0 none;
  appearance: none;
}
</style>
