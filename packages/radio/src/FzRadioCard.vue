<script setup lang="ts">
import "./fz-radio.css";
import { FzRadioCardProps } from "./types";
import { computed, toRefs } from "vue";
import { FzTooltip } from "@fiscozen/tooltip";
import { FzIcon } from "@fiscozen/icons";
import { useRadio } from "../composables/index";
import { staticInputClass } from "./common";

const props = withDefaults(defineProps<FzRadioCardProps>(), {
  size: "md",
  tone: "emphasis",
  emphasis: true, // deprecated, kept for backward compatibility
  radioIcon: (props: FzRadioCardProps) => props.orientation === "horizontal",
  hasRadio: undefined,
});
const emits = defineEmits(["update:modelValue"]);

// Compute hasRadio from props (with fallback to deprecated radioIcon)
const computedHasRadio = computed(() => {
  if (props.hasRadio !== undefined) return props.hasRadio;
  if (typeof props.radioIcon === "function") {
    return props.radioIcon(props);
  }
  return props.radioIcon ?? true;
});

const labelClass = computed(() => ({
  "flex-col": props.orientation === "vertical",
  "flex-row": props.orientation === "horizontal",
  "pb-20": props.orientation === "vertical" && props.modelValue !== props.value,
  "pb-12":
    props.orientation === "horizontal" && props.modelValue !== props.value,
  "pb-[19px]":
    props.orientation === "vertical" && props.modelValue === props.value,
  "pb-[11px]":
    props.orientation === "horizontal" && props.modelValue === props.value,
  "pt-[11px]": props.modelValue === props.value,
  "gap-12": props.orientation === "horizontal",
  "border-2 px-[11px] border-blue-500 ": props.modelValue === props.value && !props.disabled,
  "border-1 border-grey-300": (props.modelValue !== props.value || props.disabled),
  "before:absolute": props.orientation === "vertical",
  "before:top-24": props.orientation === "vertical",
  "before:left-24": props.orientation === "vertical",
  "before:self-center": props.orientation === "horizontal",
  "before:shrink-0": props.orientation === "horizontal",
  "hover:bg-[#f9faff] peer-focus:outline peer-focus:bg-[#f9faff] peer-focus:outline-blue-200 peer-focus:outline-2 peer-checked:bg-[#f9faff]": !props.disabled,
  "before:!hidden": !computedHasRadio.value,
}));

const { computedLabelClass, computedId } = useRadio(toRefs(props));
</script>

<template>
  <div>
    <input
      type="radio"
      :id="computedId"
      :class="[staticInputClass]"
      :value="value"
      :disabled="disabled"
      :checked="modelValue === value"
      :name="name"
      :required="required"
      tabindex="0"
      @change="emits('update:modelValue', value)"
    />
    <label
      :class="[
        'relative flex fz-radio__label block rounded-lg border-solid pt-12 px-12 cursor-pointer w-[336px]',
        labelClass,
        computedLabelClass,
      ]"
      :for="computedId"
    >
      <picture
        v-if="imageUrl"
        :class="[
          'rounded overflow-hidden',
          {
            'shrink-0 size-[58px]': orientation === 'horizontal',
            'w-full h-[252px]': orientation === 'vertical',
            'opacity-30': props.disabled,
          },
        ]"
        :title="imageAlt || ''"
      >
        <img
          :src="imageUrl"
          :alt="imageAlt || ''"
          class="object-cover h-full w-full"
        />
      </picture>

      <div
        :class="[
          'flex flex-row w-full justify-between min-w-0',
          { 'mt-20': orientation === 'vertical' },
        ]"
      >
        <div class="justify-center flex flex-col w-full grow-0 min-w-0" >
          <p :class="['font-medium break-words !m-0 !leading-[20px]', { 'text-grey-300': props.disabled }]">
            {{ title }}
          </p>
          <p
            v-if="subtitle"
            :class="['font-normal text-sm mt-4 break-words !m-0 !leading-[16px]', { 'text-grey-300': props.disabled, 'text-grey-500': !props.disabled }]">
            {{ subtitle }}
          </p>
        </div>
        <FzTooltip
          v-if="tooltip"
          :class="{
            'self-center': props.orientation === 'horizontal',
            'self-start': props.orientation === 'vertical',
            'ml-8': props.orientation === 'vertical',
            'ml-12': props.orientation === 'horizontal',
          }"
          :disabled="props.disabled"
          :text="tooltip"
          :status="tooltipStatus || 'neutral'"
        >
          <FzIcon
            name="circle-info"
            variant="far"
            :size="size"
            class="text-semantic-info"
          ></FzIcon>
        </FzTooltip>
      </div>
    </label>
  </div>
</template>
