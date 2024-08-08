<template>
  <FzSelect v-bind="safeSelectOpts" v-model="modelValue" @select="handleSelect">
    <template #opener="{ handlePickerClick, isOpen }">
      <FzInput
        ref="opener"
        v-bind="inputProps"
        :modelValue="inputValue"
        @focus="() => !isOpen && handlePickerClick()"
        @update:modelValue="handleInput"
      ></FzInput>
    </template>
  </FzSelect>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzTypeaheadProps } from "./types";
import {
  FzSelect,
  FzSelectOptionsProps,
  FzSelectProps,
} from "@fiscozen/select";
import { FzInput } from "@fiscozen/input";
import Fuse from "fuse.js";

FzInput.compatConfig = {
  MODE: 3,
};

const props = withDefaults(defineProps<FzTypeaheadProps>(), {});
const emit = defineEmits(["update:modelValue"]);

const modelValue = ref<FzSelectOptionsProps>();
const inputValue = ref<string | undefined>();
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

const handleInput = (val: string) => {
  inputValue.value = val;
};

const handleSelect = (val: string) => {
  const selected = props.selectProps.options.find((opt) => opt.value === val);
  inputValue.value = selected?.label;
  emit("update:modelValue", selected);
};

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

const computedModel = computed(() => {
  return modelValue.value;
});

const safeSelectOpts = computed<FzSelectProps>(() => ({
  position: "bottom",
  ...props.selectProps,
  options: internalOptions.value,
  extOpener: safeInputContainer.value,
}));
</script>

<style scoped></style>
