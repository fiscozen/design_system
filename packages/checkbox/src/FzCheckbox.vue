<template>
  <div class="flex justify-center flex-col w-fit">
    <input
      type="checkbox"
      :id="value.replace(/ /g, '-').toLowerCase()"
      :disabled="disabled"
      :checked="checked"
      :class="computedClass"
      :required="required"
      :value="value"
      @change="onChange"
      v-model="model"
      :indeterminate="indeterminate"
      ref="refCheckbox"
    />
    <label
      :for="value.replace(/ /g, '-').toLowerCase()"
      :class="computedLabelClass"
    >
      <FzIcon
        :name="computedName"
        :size="size"
        :class="computedIconClasses"
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

const value = props.value || props.label;

const model = defineModel<boolean | string[]>({
  required: true,
});

const emit = defineEmits(["change"]);

const refCheckbox = ref<HTMLInputElement | null>(null);

const computedClass = computed(() => ({
  "checkbox--small": props.size === "sm",
  "checkbox--medium": props.size === "md",
}));

const computedLabelClass = computed(() => [
  "flex items-start gap-4",
  mapSizeToClasses[props.size],
  props.disabled
    ? "text-grey-300"
    : props.error
      ? "text-semantic-error"
      : "text-grey-500",
]);

const computedIconClasses = computed(() => [
  props.size === "sm" ? "mt-1" : "mt-2",
  props.disabled
    ? "text-grey-300"
    : props.error
      ? "text-semantic-error"
      : props.emphasis
        ? "text-blue-500"
        : "text-grey-500",
  "relative",
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
    return model.value.includes(value);
  }
};

const onChange = (e: any) => {
  emit("change", e);
};

onMounted(() => {
  if (typeof model.value === "boolean") {
    if (model.value) refCheckbox.value?.dispatchEvent(new Event("change"));
    else if (props.checked !== undefined) model.value = props.checked;
  } else {
    if (model.value.includes(value))
      refCheckbox.value?.dispatchEvent(new Event("change"));
    else if (props.checked) model.value.push(value);
  }
});
</script>
<style scoped>
input[type="checkbox"] {
  width: 0;
  height: 0;
}

input[type="checkbox"] + label {
  cursor: pointer;
}

input[type="checkbox"] + label:hover {
  cursor: pointer;
}

input[type="checkbox"]:focus + label div:after {
  border-radius: 3px;
  content: "";
  border-style: solid;
  border-width: 1px;
  @apply border-blue-500;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  position: absolute;
}

.checkbox--small:focus + label div:after {
  /* correction in order to get the icon centered around focus ring */
  transform: translate(-0.2px, 0.4px);
}
</style>
