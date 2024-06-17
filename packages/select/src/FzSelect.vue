<template>
  <FzFloating
    position="bottom-start"
    :isOpen
    class="flex flex-col gap-8 overflow-visible"
  >
    <template #opener class="flex">
      <div class="w-full flex flex-col gap-8">
        <label :class="['text-sm', computedLabelClass]">
          {{ label }}{{ required ? " *" : "" }}</label
        >
        <button
          @click="handlePickerClick"
          :size="size"
          :class="[staticPickerClass, computedPickerClass, pickerClass]"
          ref="opener"
          :title="selectedOption ? selectedOption.label : placeholder"
        >
          <FzIcon v-if="leftIcon" :name="leftIcon" :size="size" />
          <span :class="[staticSpanClass, computedSpanClass]">
            {{ selectedOption ? selectedOption.label : placeholder }}
          </span>
          <FzIcon v-if="rightIcon" :name="rightIcon" :size="size" />
          <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" :size="size" />
        </button>
      </div>
    </template>
    <template #opener-end>
      <div
        v-if="error && $slots.error"
        class="flex gap-4"
        :style="{ 'max-width': containerWidth }"
      >
        <FzIcon
          name="triangle-exclamation"
          class="text-semantic-error"
          :size="size"
        />
        <div :class="['mt-1', computedErrorClass]">
          <slot name="error"></slot>
        </div>
      </div>
      <span
        v-else-if="$slots.help"
        :class="[computedHelpClass]"
        :style="{ 'max-width': containerWidth }"
      >
        <slot name="help"></slot>
      </span>
    </template>
    <div
      class="flex flex-col p-4 rounded shadow overflow-hidden ml-[-2px] min-w-[120px] w-full"
      :style="{ width: containerWidth ?? 'auto' }"
      ref="containerRef"
    >
      <FzSelectOption
        v-for="option in options"
        :key="option.value"
        @click="() => handleSelect(option.value)"
        :option="option"
        :size="size"
        :selectedValue="model"
      />
    </div>
  </FzFloating>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from "vue";
import { FzSelectProps } from "./types";
import { FzIcon } from "@fiscozen/icons";
import { FzFloating, useClickOutside } from "@fiscozen/composables";
import FzSelectOption from "./components/FzSelectOption.vue";

const props = withDefaults(defineProps<FzSelectProps>(), {
  size: "md",
});
const model = defineModel({
  required: true,
  default: "",
});
const isOpen = ref(false);
const opener = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();
const containerWidth = ref<string>("auto");

useClickOutside(opener, () => {
  isOpen.value = false;
});

const emit = defineEmits(["select"]);

const staticPickerClass =
  "flex justify-between items-center px-10 border-1 w-full rounded gap-8 text-left";
const mapPickerClass = {
  sm: "h-24 text-sm",
  md: "h-32 text-base",
  lg: "h-40 text-lg",
};
const computedPickerClass = computed(() => [
  mapPickerClass[props.size],
  evaluateProps(),
]);

const computedLabelClass = computed(() => [
  props.disabled ? "text-grey-300" : "text-core-black",
]);

const staticSpanClass =
  "overflow-hidden text-ellipsis whitespace-nowrap flex-[1]";
const computedSpanClass = computed(() => [
  selectedOption.value && !props.disabled
    ? "text-core-black font-medium"
    : "text-grey-300",
]);

const computedHelpClass = computed(() => [
  props.size === "sm" ? "text-xs" : "",
  props.size === "md" ? "text-sm" : "",
  props.size === "lg" ? "text-base" : "",
  props.disabled ? "text-grey-300" : "text-grey-500",
]);

const computedErrorClass = computed(() => [
  props.size === "sm" ? "text-xs" : "",
  props.size === "md" ? "text-sm" : "",
  props.size === "lg" ? "text-base" : "",
  props.disabled ? "text-grey-300" : "text-core-black",
]);

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === model.value);
});

watch(() => [props.size, model.value], calculateContainerWidth);

onMounted(() => {
  calculateContainerWidth();
});

const handleSelect = (value: string) => {
  model.value = value;
  emit("select", value);
};

const handlePickerClick = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
};

const evaluateProps = () => {
  switch (true) {
    case props.disabled:
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";
    case props.error:
      return "border-semantic-error bg-white text-core-black cursor-pointer ";
    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer";
  }
};

async function calculateContainerWidth() {
  await nextTick();
  if (!opener.value) containerWidth.value = "auto";
  else containerWidth.value = `${opener.value.clientWidth}px`;
}
</script>
<style scoped></style>
