<script setup lang="ts">
import "./fz-radio.css";
import { FzRadioCardProps } from "./types";
import { computed, toRefs } from "vue";
import { FzTooltip } from "@fiscozen/tooltip";
import { FzIcon } from "@fiscozen/icons";
import { useRadio } from "../composables/index";
import { staticInputClass } from "./common";

const props = withDefaults(defineProps<FzRadioCardProps>(), {
  emphasis: true,
  radioIcon: (props) => props.orientation === "horizontal",
});
const emits = defineEmits(["update:modelValue"]);

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
  "border-2 px-[11px] border-blue-500 ": props.modelValue === props.value,
  "border-1 border-grey-300": props.modelValue !== props.value,
  "before:absolute": props.orientation === "vertical",
  "before:top-24": props.orientation === "vertical",
  "before:left-24": props.orientation === "vertical",
  "before:self-start": props.orientation === "horizontal",
  "before:shrink-0": props.orientation === "horizontal",
  "bg-grey-hover": !props.disabled,
  "before:!hidden": !props.radioIcon,
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
        'relative flex fz-radio__label block w-[360px] rounded-lg border-solid pt-12 px-12 cursor-pointer',
        labelClass,
        computedLabelClass,
      ]"
      :for="computedId"
    >
      <img
        v-if="imageUrl"
        class="object-contain"
        :src="imageUrl"
        :alt="imageAlt || ''"
        :width="orientation === 'horizontal' ? 58 : 336"
        :height="orientation === 'horizontal' ? 58 : 252"
        :class="[
          'rounded',
          {
            'size-[58px]': orientation === 'horizontal',
            'h-[252px] w-[336px]': orientation === 'vertical',
          },
        ]"
      />

      <div
        :class="[
          'flex flex-row w-full justify-between min-w-0',
          { 'mt-20': orientation === 'vertical' },
        ]"
      >
        <div class="fz-input flex flex-col w-full grow-0 min-w-0">
          <p :class="['font-medium break-words', { 'text-sm': size === 'sm' }]">
            {{ title }}
          </p>
          <p
            v-if="subtitle"
            :class="[
              'font-normal text-sm text-grey-500 mt-4 break-words',
              { 'text-xs': size === 'sm' },
            ]"
          >
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
          :text="tooltip"
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

<style>
.bg-grey-hover:hover {
  background-color: #f9faff;
}
</style>
