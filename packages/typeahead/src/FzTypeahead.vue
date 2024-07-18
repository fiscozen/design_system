<template>
  <FzSelect
    position="bottom"
    :options="internalOptions"
    :ext-opener="opener"
    @select="handleSelect"
  >
    <template #opener="{ handlePickerClick, isOpen }">
      <label :for="id" class="text-core-black mb-8">
        {{ label }}
      </label>
      <input
        ref="opener"
        :id="id"
        v-model="modelValue"
        type="text"
        @focus="() => !isOpen && handlePickerClick()"
        @input="handleInput"
        class="w-[176px] border-1 border-gray-300 h-32 px-10"
      />
    </template>
  </FzSelect>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FzTypeaheadProps } from "./types";
import { FzSelect, FzSelectOptionsProps } from "@fiscozen/select";
import Fuse from "fuse.js";

const props = withDefaults(defineProps<FzTypeaheadProps>(), {});
const emit = defineEmits(["update:modelValue"]);

const modelValue = ref<string | undefined>();
const fuseOptions = {
  keys: ["label"],
};
const opener = ref<HTMLElement>();

const getId = () => Math.floor(Math.random() * 1000).toString();
const id = getId();

const dynFuse = computed(() => {
  return new Fuse(props.options, fuseOptions);
});

const handleInput = (e: InputEvent) => {
  emit("update:modelValue", e.target?.value);
};

const handleSelect = (val: string) => {
  modelValue.value = props.options.find((opt) => opt.value === val)?.label;
};

const internalOptions = computed<FzSelectOptionsProps[]>(() => {
  let res = props.options;

  if (props.filteredOptions) {
    res = props.filteredOptions;
  } else if (props.filterFn) {
    res = props.filterFn(modelValue.value);
  } else if (modelValue.value) {
    res = dynFuse.value
      .search(modelValue.value)
      .map((searchRes) => searchRes.item);
  }

  return res;
});
</script>

<style scoped></style>
