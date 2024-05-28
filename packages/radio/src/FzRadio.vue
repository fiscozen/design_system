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
  "radio--default": !props.emphasis,
  "radio--emphasized": props.emphasis,
  "radio--error": props.error,
  "radio--small": props.size === "sm",
  "radio--medium": props.size === "md",
}));

const computedLabelClass = computed(() => [
  "flex items-start gap-4",
  mapSizeToClasses[props.size],
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

input[type="radio"] + label:before {
  content: " ";
  display: inline-block;
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  margin-left: 4px;
}

input[type="radio"]:checked + label:before {
  background: transparent;
  box-sizing: border-box;
}

input[type="radio"]:focus + label:before {
  outline-width: 1px;
  outline-offset: 1px;
  outline-style: solid;
  @apply outline-blue-600;
}

.radio--small + label:before {
  @apply h-12 w-12 mt-[3px];
}

.radio--small:checked + label:before {
  border-width: 4px;
}

.radio--small + label span {
  width: calc(100% - 20px);
}

.radio--medium + label:before {
  @apply h-16 w-16 mt-4;
}

.radio--medium:checked + label:before {
  border-width: 5px;
}

.radio--medium + label span {
  width: calc(100% - 24px);
}

.radio--default + label:before {
  @apply border-gray-500;
}

.radio--emphasized + label:before {
  @apply border-blue-500;
}

.radio--error + label:before {
  @apply border-semantic-error;
}

.radio--error + label {
  @apply text-semantic-error;
}

input[type="radio"]:disabled + label:before {
  cursor: not-allowed;
  @apply border-grey-200 bg-gray-200;
}

input[type="radio"]:checked:disabled + label:before {
  @apply border-grey-200 bg-transparent;
}

input[type="radio"]:disabled + label {
  @apply text-grey-300;
}
</style>
