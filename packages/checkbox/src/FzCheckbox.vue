<template>
  <div class="flex justify-center flex-col w-fit gap-4">
    <input
      type="checkbox"
      :id="id"
      :disabled="disabled"
      :class="staticInputClass"
      :required="required"
      :value="value"
      @change="emit('change', $event)"
      v-model="model"
      :indeterminate="indeterminate"
      :aria-checked="indeterminate ? 'mixed' : isChecked"
      :aria-label="label"
      :aria-required="required"
      :aria-invalid="error"
      :aria-describedby="error ? `${id}-error` : undefined"
      :aria-labelledby="standalone ? undefined : `${id}-label`"
      ref="refCheckbox"
    />
    <div class="flex gap-4">
      <label
        :id="`${id}-label`"
        :for="id"
        :class="[staticLabelClass, computedLabelClass]"
      >
        <FzIcon
          :name="computedName"
          :size="size"
          :class="[staticIconClass, computedIconClasses]"
          :variant="computedVariant"
        />
        {{ standalone ? "" : label }}
      </label>
      <FzTooltip v-if="tooltip" v-bind="tooltip">
        <FzIcon name="info-circle" :size="size" class="text-semantic-info" />
      </FzTooltip>
    </div>
    <FzAlert
      v-if="error && $slots.error"
      :id="`${id}-error`"
      :size="size"
      type="error"
      alertStyle="simple"
    >
      <slot name="error" />
    </FzAlert>
    <slot name="children" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FzCheckboxProps } from "./types";
import { mapSizeToClasses } from "./common";
import { FzIcon } from "@fiscozen/icons";
import { FzTooltip } from "@fiscozen/tooltip";
import { FzAlert } from "@fiscozen/alert";

const props = withDefaults(defineProps<FzCheckboxProps>(), {
  size: "md",
  indeterminate: false,
});

const currentValue = computed(() => props.value ?? props.label);

const id = `fz-checkbox-${Math.random().toString(36).slice(2, 9)}`;

const model = defineModel<
  null | undefined | boolean | (string | number | boolean)[]
>({
  required: true,
});

const emit = defineEmits(["change"]);
const refCheckbox = ref<HTMLInputElement | null>(null);

const staticInputClass = "w-0 h-0 peer fz-hidden-input";
const staticLabelClass = `
  flex gap-4 hover:cursor-pointer text-core-black
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

const isChecked = computed(() => {
  if (model.value == null) return false;

  if (typeof model.value === "boolean") {
    return model.value;
  } else {
    return model.value.includes(currentValue.value);
  }
});

const computedLabelClass = computed(() => [
  mapSizeToClasses[props.size],
  getTextClassForLabel(),
]);

const computedIconClasses = computed(() => [
  props.size === "sm" ? "mt-1" : "",
  getTextClassForIcon(),
]);

const computedName = computed(() => {
  if (props.indeterminate) {
    return "square-minus";
  }

  return isChecked.value ? "square-check" : "square";
});

const computedVariant = computed(() => {
  if (props.disabled) return "fas";

  return !props.indeterminate && !isChecked.value ? "far" : "fas";
});

const computedMarginSize = computed(() => ({
  "mt-4": props.size === "sm",
  "mt-6": props.size === "md",
}));

const getTextClassForLabel = () => {
  switch (true) {
    case props.disabled:
      return "text-grey-300";
    case props.error:
      return "text-semantic-error";
    case props.emphasis:
      return "text-core-black peer-checked:[&_div]:text-blue-500 peer-indeterminate:[&_div]:text-blue-500";
    default:
      return "text-core-black";
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
  if (model.value == null) return;
  if (typeof model.value === "boolean") {
    if (model.value) refCheckbox.value?.dispatchEvent(new Event("change"));
  } else {
    if (model.value.includes(currentValue.value))
      refCheckbox.value?.dispatchEvent(new Event("change"));
  }
});
</script>
<style scoped>
.fz-hidden-input {
  opacity: 0;
  margin: 0;
  height: 0;
  border: 0 none;
  appearance: none;
}
</style>
