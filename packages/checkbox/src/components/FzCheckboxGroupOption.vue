<template>
  <FzCheckbox
    v-model="model"
    :value="props.value"
    :label="props.label"
    :disabled="disabled"
    :emphasis="emphasis"
    :error="error"
    :size="size"
    :indeterminate="isIndeterminate"
    @change="onCheckboxParentChange"
  >
    <template #children v-if="children?.length">
      <div :class="[staticChildContainerClass, computedChildContainerClasses]">
        <FzCheckbox
          v-for="child in children"
          :key="child.value ? child.value.toString() : child.label"
          v-model="model"
          :disabled="disabled"
          v-bind="child"
          :emphasis="emphasis"
          :error="error"
          :size="size"
          @change="handleCheckboxParentChange"
        />
      </div>
    </template>
  </FzCheckbox>
</template>
<script setup lang="ts">
import { computed } from "vue";
import FzCheckbox from "../FzCheckbox.vue";
import { ParentCheckbox } from "../types";

FzCheckbox.compatConfig = {
  MODE: 3,
};

const props = defineProps<ParentCheckbox & { size: "sm" | "md" }>();
const currentValue = computed(() => props.value ?? props.label);
const model = defineModel<(string | number | boolean)[]>({
  required: true,
  default: [],
});

const staticChildContainerClass = "flex flex-col justify-center pl-24";

const computedChildContainerClasses = computed(() => [
  props.size === "sm" ? "gap-6 mt-6" : "",
  props.size === "md" ? "gap-8 mt-8" : "",
]);

const isIndeterminate = computed(() => {
  if (!props.children) return false;

  const numChecked = props.children.filter((child) =>
    model.value.includes(child.value ?? child.label),
  ).length;
  return numChecked > 0 && numChecked < props.children.length;
});

function handleCheckboxParentChange() {
  if (!props.children) return;
  const numChecked = props.children.filter((child) =>
    model.value.includes(child.value ?? child.label),
  ).length;

  if (numChecked === props.children.length) {
    // push parent value to model (using concat to force reactivity, push seems to not work)
    model.value = model.value.concat(currentValue.value);
  } else {
    // remove parent value from model if it exists
    if (model.value.includes(currentValue.value))
      model.value = model.value.filter(
        (value) => value !== currentValue.value,
      );
  }
}

function onCheckboxParentChange() {
  if (!props.children) return;
  if (model.value.includes(currentValue.value)) {
    // push all children values to model that are not already in model
    model.value = model.value.concat(
      props.children
        ?.map((child) => child.value ?? child.label)
        .filter((value) => !model.value.includes(value)),
    );
  } else {
    // remove all children values from model
    model.value = model.value.filter(
      (value) =>
        !props.children
          ?.map((child) => child.value ?? child.label)
          .includes(value),
    );
  }
}
</script>
<style scoped></style>
