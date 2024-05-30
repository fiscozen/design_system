<template>
  <div class="flex justify-center flex-col w-fit">
    <input
      type="radio"
      :id="label"
      :value="value || label"
      :disabled="disabled"
      :checked="checked"
      :class="computedClass"
      :name="name"
      :required="required"
      @change="onChange"
      tabindex="0"
      ref="radioContainer"
    />
    <label :for="label" :class="computedLabelClass">
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

const radioContainer = ref<HTMLInputElement | null>(null);

const computedClass = computed(() => ({
  "radio--small": props.size === "sm",
  "radio--medium": props.size === "md",
  peer: true,
}));

const computedLabelClass = computed(() => [
  `flex items-start gap-4 h-16 
  before:content-[''] before:inline-block before:border-solid before:border-1 before:rounded-full before:ml-4
  peer-checked:before:bg-transparent peer-focus:before:outline peer-checked:before:outline-offset-1 peer-checked:before:outline-1 peer-checked:before:outline-blue-600
  peer-disabled:text-grey-300
  peer-disabled:before:border-grey-200 peer-disabled:before:bg-grey-200
  peer-checked:peer-disabled:before:border-grey-200`,
  mapSizeToClasses[props.size],
  props.size === "sm"
    ? "before:h-12 before:w-12 before:mt-[3px] peer-checked:before:border-4"
    : "",
  props.size === "md"
    ? "before:h-16 before:w-16 before:mt-4 peer-checked:before:border-[5px]"
    : "",
  props.error
    ? "before:border-semantic-error text-semantic-error"
    : props.emphasis
      ? "before:border-blue-500"
      : "before:border-grey-500",
]);

const model = defineModel();

const onChange = () => {
  model.value = props.value || props.label;
};

onMounted(() => {
  if (props.checked) onChange();
  if (model.value === props.value || model.value === props.label) {
    radioContainer.value?.click();
  }
});
</script>
<style scoped>
input[type="radio"] {
  height: 0;
  width: 0;
  position: absolute;
}

.radio--small + label span {
  width: calc(100% - 20px);
}

.radio--medium + label span {
  width: calc(100% - 24px);
}
</style>
