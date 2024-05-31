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
          :key="child.value"
          v-model="model"
          v-bind="child"
          :disabled="disabled"
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

const props = defineProps<ParentCheckbox & { size: "sm" | "md" }>();

const model = defineModel<string[]>({
  required: true,
  default: [],
});

const staticChildContainerClass = "flex flex-col justify-center pl-24";

const computedChildContainerClasses = computed(() => [
  props.size === "sm" ? "gap-6 mt-[5px]" : "",
  props.size === "md" ? "gap-8 mt-[6px]" : "",
]);

const isIndeterminate = computed(() => {
  if (!props.children) return false;

  const numChecked = props.children.filter((child) =>
    model.value.includes(child.value || child.label),
  ).length;
  return numChecked > 0 && numChecked < props.children.length;
});

function handleCheckboxParentChange() {
  if (!props.children) return;
  const numChecked = props.children.filter((child) =>
    model.value.includes(child.value || child.label),
  ).length;

  if (numChecked === props.children.length) {
    // push parent value to model (using concat to force reactivity, push seems to not work)
    model.value = model.value.concat(props.value || props.label);
  } else {
    // remove parent value from model if it exists
    if (model.value.includes(props.value || props.label))
      model.value = model.value.filter(
        (value) => value !== (props.value || props.label),
      );
  }
}

function onCheckboxParentChange() {
  if (!props.children) return;
  if (model.value.includes(props.value || props.label)) {
    // push all children values to model that are not already in model
    model.value = model.value.concat(
      props.children
        ?.map((child) => child.value || child.label)
        .filter((value) => !model.value.includes(value)),
    );
  } else {
    // remove all children values from model
    model.value = model.value.filter(
      (value) =>
        !props.children
          ?.map((child) => child.value || child.label)
          .includes(value),
    );
  }
}
</script>
<style scoped></style>
