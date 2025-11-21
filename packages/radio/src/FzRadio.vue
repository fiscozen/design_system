<template>
  <div class="flex justify-center flex-col w-fit">
    <input
      type="radio"
      :id="computedId"
      :value="computedValue"
      :disabled="disabled"
      :checked="computedChecked"
      :class="[staticInputClass, computedInputClass]"
      :name="name"
      :required="required"
      :aria-checked="ariaChecked"
      :aria-disabled="disabled ? 'true' : 'false'"
      :aria-required="required ? 'true' : 'false'"
      :aria-invalid="computedTone === 'error' ? 'true' : 'false'"
      :aria-label="shouldShowText ? undefined : label"
      :aria-labelledby="shouldShowText ? `${radioId}-label` : undefined"
      @change="emits('update:modelValue', computedValue)"
      ref="radioContainer"
    />
    <label 
      :id="shouldShowText ? `${radioId}-label` : undefined"
      :for="computedId" 
      :class="[staticLabelClass, computedLabelClass]"
      >
      <span class="w-fit" v-if="shouldShowText">{{ label }}</span>
      <FzTooltip
        v-if="tooltip"
        :text="tooltip"
        :status="tooltipStatus || 'neutral'"
        withIcon
      >
        <FzIcon
          name="circle-info"
          variant="far"
          size="md"
          class="text-semantic-info"
        />
      </FzTooltip>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FzRadioProps } from "./types";
import {
  mapSizeToClasses,
  computedLabelObject,
  staticInputClass,
  staticLabelClass,
} from "./common";
import { FzIcon } from "@fiscozen/icons";
import { FzTooltip } from "@fiscozen/tooltip";
import { generateRadioId } from "./utils";
import "./fz-radio.css";

const props = withDefaults(defineProps<FzRadioProps>(), {
  size: "md",
  hasText: undefined,
  checked: undefined,
});

const computedValue = computed(() => {
  if (props.value == null && props.label == null) {
    console.error(
      "[FzRadio] You must provide a value or label prop to the radio button",
    );
    return "";
  }
  return props.value ?? props.label;
});

const computedChecked = computed(() => {
  if (props.checked != null) return props.checked;
  return props.modelValue === computedValue.value;
});

const emits = defineEmits(["update:modelValue"]);

// Compute tone from props (with fallback to deprecated emphasis/error)
const computedTone = computed<"neutral" | "emphasis" | "error">(() => {
  if (props.tone) return props.tone;
  if (props.error) return "error";
  if (props.emphasis) return "emphasis";
  return "neutral";
});

// Compute hasText from props (with fallback to deprecated standalone)
const shouldShowText = computed(() => {
  if (props.hasText !== undefined) return props.hasText;
  return !props.standalone;
});

const computedId = computed(() =>
  props.name ? `${props.name}-${props.label}` : props.label,
);

// Generate unique ID for ARIA relationships
const radioId = generateRadioId();

const radioContainer = ref<HTMLInputElement | null>(null);

// Compute ARIA attributes for accessibility
const ariaChecked = computed(() => {
  return props.modelValue === computedValue.value ? "true" : "false";
});

const computedInputClass = computed(() => ({
  "radio--medium": true,
}));

const computedLabelClass = computed(() => [
  mapSizeToClasses["md"],
  computedLabelObject["md"],
  getBorderAndTextColorForLabel(),
]);

const getBorderAndTextColorForLabel = () => {
  const tone = computedTone.value;

  switch (true) {
    case props.disabled:
      return "text-grey-300 before:border-grey-200 before:bg-grey-200 peer-checked:before:bg-transparent";
    case tone === "error":
      return "before:border-semantic-error text-semantic-error";
    case tone === "emphasis":
      return "before:border-grey-500 peer-checked:before:border-blue-500";
    default:
      return "before:border-grey-500";
  }
};

onMounted(() => {
  if (props.checked) {
    radioContainer.value?.click();
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
