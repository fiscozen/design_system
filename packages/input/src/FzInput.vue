<template>
  <div class="w-full flex flex-col gap-8" @click="inputRef?.focus()">
    <label :class="['text-sm', computedLabelClass]">
      {{ label }}{{ required ? " *" : "" }}
    </label>
    <div :class="[staticContainerClass, computedContainerClass]">
      <FzIcon v-if="leftIcon" :name="leftIcon" :size="size" />
      <input
        :type="type"
        :required="required"
        :placeholder="placeholder"
        v-model="model"
        ref="inputRef"
        :class="[staticInputClass]"
        :pattern="pattern"
      />
      <FzIcon v-if="valid" name="check" :size="size" />
      <FzIcon v-if="rightIcon" :name="rightIcon" :size="size" />
    </div>
    <div v-if="error && $slots.errorMessage" class="flex gap-4">
      <FzIcon
        name="triangle-exclamation"
        class="text-semantic-error"
        :size="size"
      />
      <div :class="['mt-1', computedErrorClass]">
        <slot name="errorMessage"></slot>
      </div>
    </div>
    <span v-else-if="$slots.helpText" :class="[computedHelpClass]">
      <slot name="helpText"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { FzInputProps } from "./types";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzInputProps>(), {
  size: "md",
  error: false,
  type: "text",
});

const model = defineModel();

watch(model, (value) => {
  console.log(value);
});

const inputRef = ref<HTMLInputElement | null>(null);

const staticContainerClass = `flex justify-between w-fit items-center px-10 border-1 text-core-black rounded gap-8 text-left`;

const mapContainerClass = {
  sm: "h-24 text-sm",
  md: "h-32 text-base",
  lg: "h-40 text-lg",
};

const computedContainerClass = computed(() => [
  mapContainerClass[props.size],
  evaluateProps(),
]);

const computedLabelClass = computed(() => [
  props.disabled ? "text-grey-300" : "text-core-black",
]);

const staticInputClass = `peer w-full bg-transparent border-0
    focus:outline-none focus:ring-0 cursor-pointer`;

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

const evaluateProps = () => {
  switch (true) {
    case props.disabled:
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";
    case props.error:
      return "border-semantic-error bg-white text-core-black cursor-pointer ";
    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer has-[:focus]:border-blue-600";
  }
};

const emit = defineEmits([]);
</script>

<style scoped></style>
