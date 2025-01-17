<script setup lang="ts">
import "./fz-radio.css";
import { FzRadioCardProps } from "./types";
import { computed } from "vue";
import { FzTooltip } from "@fiscozen/tooltip";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzRadioCardProps>(), {});
const emits = defineEmits(["update:modelValue"]);

const labelClass = computed(() => ({
  "flex-col": props.orientation === "vertical",
  "flex-row": props.orientation === "horizontal",
  "pb-20": props.orientation === "vertical",
  "pb-12": props.orientation === "horizontal",
  "border-2 border-blue-500": props.modelValue === props.value,
  "border-1 border-grey-300": props.modelValue !== props.value,
}));

const inputClass = computed(() => ({
  absolute: props.orientation === "vertical",
  "top-24": props.orientation === "vertical",
  "left-24": props.orientation === "vertical",
  "mr-12": props.orientation === "horizontal",
  "self-start": props.orientation === "horizontal",
}));

const computedInputClass = computed(() => ({
  "radio--small": props.size === "sm",
  "radio--medium": props.size === "md",
}));

const computedLabelObject = {
  sm: "before:h-12 before:w-12 before:mt-[3px] peer-checked:before:border-4",
  md: "before:h-16 before:w-16 peer-checked:before:border-[5px]",
};
</script>

<template>
  <label
    :class="[
      'relative flex fz-card__label block w-[360px] rounded-lg border-solid pt-12 px-12',
      labelClass,
    ]"
  >
    <input
      type="radio"
      :class="inputClass"
      :value="value"
      :disabled="disabled"
      :checked="modelValue === value"
      tabindex="0"
      @change="emits('update:modelValue', value)"
    />
    <img
      :src="imageUrl"
      alt=""
      :width="orientation === 'horizontal' ? 58 : 336"
      :height="orientation === 'horizontal' ? 58 : 252"
      :class="{ 'mr-12': orientation === 'horizontal' }"
    />
    <div
      :class="[
        'flex flex-row w-full justify-between',
        { 'mt-20': orientation === 'vertical' },
      ]"
    >
      <div class="fz-input flex flex-col">
        <p :class="['font-medium', { 'text-sm': size === 'sm' }]">
          {{ title }}
        </p>
        <p
          v-if="subtitle"
          :class="['font-normal', { 'text-sm': size === 'sm' }]"
        >
          {{ subtitle }}
        </p>
      </div>
      <FzTooltip class="self-center">
        <FzIcon
          name="circle-info"
          variant="far"
          :size="size"
          class="text-semantic-info"
        ></FzIcon>
      </FzTooltip>
    </div>
  </label>
</template>

<style></style>
