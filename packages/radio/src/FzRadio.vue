<template>
  <div class="flex justify-center flex-col w-fit">
    <input
      type="radio"
      :id="computedId"
      :value="value"
      :disabled="disabled"
      :checked="checked"
      :class="[staticInputClass, computedInputClass]"
      :name="name"
      :required="required"
      v-model="model"
      @change="onChange"
      tabindex="0"
      ref="radioContainer"
    />
    <label :for="computedId" :class="[staticLabelClass, computedLabelClass]">
      <span class="w-fit">{{ standalone ? "" : label }}</span>
    </label>
    <FzRadioErrorText :size="size" v-if="error && $slots.error">
      <slot name="error" />
    </FzRadioErrorText>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FzRadioProps } from "./types";
import { mapSizeToClasses } from "./common";
import FzRadioErrorText from "./components/FzRadioErrorText.vue";

const props = withDefaults(defineProps<FzRadioProps>(), {
  size: "md",
});

const model = defineModel();
const value = props.value ?? props.label;
const checked = ref(props.checked)
const computedId = computed(() =>
  props.name ? `${props.name}-${props.label}` : props.label,
);

const radioContainer = ref<HTMLInputElement | null>(null);
const staticLabelClass = `
  flex items-start gap-4 
  text-core-black
  before:content-[''] 
  before:inline-block 
  before:border-solid 
  before:border-1 
  before:rounded-full 
  before:m-2
  peer-checked:before:bg-transparent 
  peer-focus:before:outline 
  peer-focus:before:outline-offset-1 
  peer-focus:before:outline-1 
  peer-focus:before:outline-blue-600
`;
const staticInputClass = "peer h-0 w-0 absolute";

const computedInputClass = computed(() => ({
  "radio--small": props.size === "sm",
  "radio--medium": props.size === "md",
}));

const computedLabelObject = {
  sm: "before:h-12 before:w-12 before:mt-[3px] peer-checked:before:border-4",
  md: "before:h-16 before:w-16 peer-checked:before:border-[5px]",
};

const computedLabelClass = computed(() => [
  mapSizeToClasses[props.size],
  computedLabelObject[props.size],
  getBorderAndTextColorForLabel(),
]);

const onChange = () => {
  model.value = value;
};

const getBorderAndTextColorForLabel = () => {
  switch (true) {
    case props.disabled:
      return "text-grey-300 before:border-grey-200 before:bg-grey-200 peer-checked:before:bg-transparent";
    case props.error:
      return "before:border-semantic-error text-semantic-error";
    case props.emphasis:
      return "before:border-grey-500 peer-checked:before:border-blue-500";
    default:
      return "before:border-grey-500";
  }
};

onMounted(() => {
  if (props.checked) onChange();
  if (model.value === value) {
    checked.value = true;
  }
});
</script>
<style scoped></style>
