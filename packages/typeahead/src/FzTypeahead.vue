<template>
  <FzSelect
    @select="(val) => emit('fztypeahead:select', val)"
    v-bind="safeSelectOpts"
    v-model="model"
  >
    <template #opener="{ handlePickerClick, isOpen }">
      <FzInput
        ref="opener"
        v-bind="inputProps"
        :modelValue="inputValue"
        @update:modelValue="handleInput"
        @focus="() => !isOpen && handlePickerClick()"
      ></FzInput>
    </template>
  </FzSelect>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { FzTypeaheadProps } from "./types";
import { debounce } from "./utils";
import {
  FzSelect,
  FzSelectOptionsProps,
  FzSelectProps,
} from "@fiscozen/select";
import { FzInput } from "@fiscozen/input";
import Fuse from "fuse.js";

const props = withDefaults(defineProps<FzTypeaheadProps>(), { delayTime: 500 });
const emit = defineEmits(["fztypeahead:input", "fztypeahead:select"]);

const [model, modelModifiers] = defineModel<string, "object">({
  set(value) {
    if (modelModifiers.object) {
      const selected = internalOptions.value.find((opt) => opt.value === value);
      return selected;
    }
    return value;
  },
  get(value) {
    if (modelModifiers.object) {
      return (value as unknown as FzSelectOptionsProps)?.value;
    }
    return value;
  },
});
const inputValue = ref<string>("");
const fuseOptions = {
  keys: ["label"],
};
const opener = ref<any>();

const dynFuse = computed(() => {
  return new Fuse(props.selectProps.options, fuseOptions);
});

const safeInputContainer = computed(() => {
  return opener.value?.containerRef;
});

onMounted(() => {
  updateModelDependencies(model.value);
});

watch(model, (value) => {
  updateModelDependencies(value);
});

function updateModelDependencies(value?: string) {
  if (!value) {
    return;
  }

  const selected = internalOptions.value.find((opt) => opt.value === value);

  if (!selected) {
    console.warn(`Could not find option with value: ${value}`);
    return;
  }

  inputValue.value = selected.label;
}

function handleInput(val: string) {
  inputValue.value = val;
  const selected = internalOptions.value.find((opt) => opt.value === val);
  if (!selected) model.value = undefined;
  debounce(
    (val: string) => emit("fztypeahead:input", val),
    props.delayTime,
  )(val);
}

const internalOptions = computed<FzSelectOptionsProps[]>(() => {
  let res = props.selectProps.options;

  if (props.filteredOptions) {
    res = props.filteredOptions;
  } else if (props.filterFn) {
    res = props.filterFn(inputValue.value);
  } else if (inputValue.value) {
    res = dynFuse.value
      .search(inputValue.value)
      .map((searchRes) => searchRes.item);
  }

  return res;
});

watch(internalOptions, () => {
  updateModelDependencies(model.value);
});

const safeSelectOpts = computed<FzSelectProps>(() => ({
  position: "bottom",
  ...props.selectProps,
  options: internalOptions.value,
  extOpener: safeInputContainer.value,
}));
</script>

<style scoped></style>
