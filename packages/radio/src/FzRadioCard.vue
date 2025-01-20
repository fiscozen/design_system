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
});
const emits = defineEmits(["update:modelValue"]);

const labelClass = computed(() => ({
  "flex-col": props.orientation === "vertical",
  "flex-row": props.orientation === "horizontal",
  "pb-20": props.orientation === "vertical",
  "pb-12": props.orientation === "horizontal",
  "gap-12": props.orientation === "horizontal",
  "border-2 border-blue-500": props.modelValue === props.value,
  "border-1 border-grey-300": props.modelValue !== props.value,
  "before:absolute": props.orientation === "vertical",
  "before:top-24": props.orientation === "vertical",
  "before:left-24": props.orientation === "vertical",
  "before:self-start": props.orientation === "horizontal",
  "before:shrink-0": props.orientation === "horizontal",
}));

const inputClass = computed(() => ({}));

const { computedLabelClass, computedId } = useRadio(toRefs(props));
</script>

<template>
  <div>
    <input
      type="radio"
      :id="computedId"
      :class="[inputClass, staticInputClass]"
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
        'relative flex fz-radio__label block w-[360px] rounded-lg border-solid pt-12 px-12',
        labelClass,
        computedLabelClass,
      ]"
      :for="computedId"
    >
      <img
        :src="imageUrl"
        alt=""
        :width="orientation === 'horizontal' ? 58 : 336"
        :height="orientation === 'horizontal' ? 58 : 252"
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
  </div>
</template>

<style></style>
