<template>
  <button
    :class="[staticClass, computedClass]"
    test-id="fzselect-option"
    type="button"
    :title="option.label"
    :disabled="option.disabled || option.readonly"
    @click="
      () => {
        $emit('click');
      }
    "
  >
    <span :class="computedValueClass">{{
      option.label
    }}</span>
    <span v-if="option.subtitle" :class="computedSubtitleClass">
      {{ option.subtitle }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzSelectOptionProps } from "../types";

const props = defineProps<{
  option: FzSelectOptionProps;
  size: "sm" | "md" | "lg";
  selectedValue: string;
  disableTruncate?: boolean;
}>();

const staticClass =
  "group flex flex-col justify-center text-left min-h-40 font-normal cursor-pointer rounded";

const mappedClass = {
  sm: "text-sm px-14 py-4",
  md: "text-base px-16 py-6",
  lg: "text-lg px-20 py-8",
};

const mappedSubtitleClass = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}

const computedClass = computed(() => {
  const { disabled, readonly, value } = props.option;
  const isSelected = props.selectedValue === value;
  return [
    {
      "text-grey-200": disabled,
      "text-core-black": readonly,
      "bg-background-alice-blue text-blue-500":
        !disabled && !readonly && isSelected,
      "bg-white hover:!bg-background-alice-blue text-core-black hover:text-blue-500":
        !disabled && !readonly && !isSelected
    },
    mappedClass[props.size],
  ];
});

const computedValueClass = computed(() => ({
  "w-full overflow-hidden text-ellipsis whitespace-nowrap": !props.disableTruncate,
}))

const computedSubtitleClass = computed(() => {
  const { disabled, value } = props.option;
  const isSelected = props.selectedValue === value;
  return [
    {
      "w-full overflow-hidden text-ellipsis whitespace-nowrap": !props.disableTruncate,
      "text-grey-500 group-hover:text-blue-500":
      !disabled && !isSelected,
    },
    mappedSubtitleClass[props.size]
  ]
})
</script>
