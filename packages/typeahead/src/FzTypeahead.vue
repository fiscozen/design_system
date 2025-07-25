<script setup lang="ts">
import { computed, onMounted, ref, watch, reactive, nextTick } from "vue";
import { FzTypeaheadProps } from "./types";
import { debounce } from "./utils";
import {
  FzSelect,
  FzSelectOptionsProps,
  FzSelectProps,
} from "@fiscozen/select";
import { FzInput, FzInputProps } from "@fiscozen/input";
import { FzIcon } from "@fiscozen/icons";
import { useClickOutside } from "@fiscozen/composables";
import Fuse from "fuse.js";

const props = withDefaults(defineProps<FzTypeaheadProps>(), {
  size: "md",
  delayTime: 500,
  filtrable: true,
  disableFreeInput: false,
});
const emit = defineEmits(["fztypeahead:input", "fztypeahead:select"]);

const [model, modelModifiers] = defineModel<string, "object">({
  set(value) {
    if (modelModifiers.object) {
      const selected = internalOptions.value?.find(
        (opt) => opt.value === value,
      );
      return selected;
    }
    return value;
  },
  get(value) {
    return value;
  },
});

const opener = ref<any>();
const openerContainer = ref<any>();
const fzselect = ref<any>();

const overrideOpener = computed(() => {
  return (props.helpText || props.errorMessage) && opener.value
    ? ref(opener.value.containerRef)
    : ref(undefined);
});

const inputValue = ref<string>("");
const fuseOptions = {
  keys: ["label"],
};

const dirtyInput = ref(false);

useClickOutside(openerContainer, () => {
  const valid = internalOptions.value?.find(
    (opt) => opt.label === inputValue.value,
  );
  if (
    !props.disableFreeInput ||
    (props.disableFreeInput && !valid && !model.value)
  ) {
    return;
  }
  if (!valid) {
    const oldChoice = modelModifiers.object
      ? model.value
      : internalOptions.value?.find((opt) => opt.value === model.value);
    // internal options might have changed and old choice might not be available anymore
    if (!oldChoice) {
      inputValue.value = undefined;
      model.value = undefined;
    } else {
      inputValue.value = modelModifiers.object ? oldChoice : oldChoice.label;
      dirtyInput.value = false;
    }
  } else {
    model.value = modelModifiers.object ? valid : valid.value;
  }
});

const dynFuse = computed(() => {
  const res = props.selectProps ? props.selectProps?.options : props.options;
  return new Fuse(res || [], fuseOptions);
});

const safeInputContainer = computed(() => {
  return opener.value?.containerRef;
});

const handleInputFocus = (isOpen: boolean, handlePickerClick: () => void) => {
  if (!isOpen) handlePickerClick();
  handleInput(inputValue.value, isOpen);
};

onMounted(() => {
  updateModelDependencies(model.value);
  if (props.filteredOptions) {
    console.warn(
      "filteredOptions prop is deprecated, use selectProps.options instead",
    );
  }
});

watch(model, (value) => {
  updateModelDependencies(value);
});

function updateModelDependencies(value?: string) {
  if (value === "") {
    inputValue.value = "";
  }
  if (!value) {
    return;
  }

  const safeVal = modelModifiers.object ? value.value : value;
  const options = props.selectProps?.options || internalOptions.value;
  const selected = options?.find((opt) => opt.value === safeVal);

  if (!selected) {
    console.warn(`Could not find option with value: ${value}`);
    return;
  }

  if (!dirtyInput.value) {
    inputValue.value = selected.label;
  }
}

const debounceHandleInput = debounce(
  (val: string) => emit("fztypeahead:input", val),
  props.delayTime,
);

function handleInput(val: string, isOpen: boolean) {
  dirtyInput.value = true;
  const selected = internalOptions.value?.find((opt) => opt.label === val);
  inputValue.value = val;
  if (!selected && !props.disableFreeInput) model.value = undefined;
  debounceHandleInput(val);
  if (!isOpen) {
    fzselect.value.forceOpen();
  }
}

function handleSelection(val: string) {
  dirtyInput.value = false;
  emit("fztypeahead:select", val);
}

const internalOptions = computed<FzSelectOptionsProps[] | undefined>(() => {
  let res = props.selectProps?.options;

  if (props.filteredOptions) {
    res = props.filteredOptions;
  } else if (!props.filtrable) {
    res = props.selectProps?.options;
  } else if (props.filterFn) {
    res = props.filterFn(inputValue.value);
  } else if (inputValue.value) {
    res = dynFuse.value
      .search(inputValue.value)
      .map((searchRes) => searchRes.item);
  }

  nextTick(() => {
    updateModelDependencies(model.value);
  });

  return res;
});

const safeSelectOpts = computed<FzSelectProps>(() =>
  reactive({
    position: "bottom",
    ...props.selectProps,
    options: internalOptions.value || [],
    extOpener: safeInputContainer.value,
  }),
);

const safeInputProps = computed<FzInputProps>(() => ({
  placeholder: props.placeholder,
  label: props.label,
  required: props.required,
  error: !!props.errorMessage,
  disabled: props.disabled,
  size: props.size,
  ...props.inputProps,
}));

const handleSelectUpdate = (val: string) => {
  model.value = val;
};
</script>

<template>
  <FzSelect
    ref="fzselect"
    @select="handleSelection"
    :disabled
    v-bind="safeSelectOpts"
    :modelValue="modelModifiers.object ? model.value : model"
    @update:modelValue="handleSelectUpdate"
    :overrideOpener
  >
    <template #opener="{ handlePickerClick, isOpen }">
      <div class="w-full flex gap-8" ref="openerContainer">
        <FzInput
          ref="opener"
          v-bind="safeInputProps"
          :modelValue="inputValue"
          @update:modelValue="(e: string) => handleInput(e, isOpen)"
          @focus="handleInputFocus(isOpen, handlePickerClick)"
          :rightIcon="isOpen ? 'chevron-up' : 'chevron-down'"
        >
          <template #label>
            <slot name="label"></slot>
          </template>
          <template #left-icon>
            <FzIcon
              v-if="leftIcon"
              :name="leftIcon"
              :size
              :variant="leftIconVariant"
            />
          </template>
          <template #right-icon>
            <FzIcon
              v-if="rightIcon"
              :name="rightIcon"
              :size
              :variant="rightIconVariant"
            />
            <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" :size />
          </template>
          <template #errorMessage>
            <slot name="errorMessage">{{ errorMessage }}</slot>
          </template>
          <template #helpText>
            <slot name="helpText">{{ helpText }}</slot>
          </template>
        </FzInput>
      </div>
    </template>
  </FzSelect>
</template>

<style scoped></style>
