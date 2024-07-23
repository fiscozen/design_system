<template>
  <div class="w-full flex flex-col gap-8" @click="inputRef?.focus()">
    <label :class="['text-sm', computedLabelClass]">
      {{ label }}{{ required ? " *" : "" }}
    </label>
    <div :class="[staticContainerClass, computedContainerClass]" ref="containerRef">
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
    <div v-if="error && $slots.errorMessage" class="flex gap-4" :style="{width: containerWidth}">
      <FzIcon
        name="triangle-exclamation"
        class="text-semantic-error"
        :size="size"
      />
      <div :class="['mt-1', computedErrorClass]">
        <slot name="errorMessage"></slot>
      </div>
    </div>
    <span v-else-if="$slots.helpText" :class="[computedHelpClass]" :style="{width: containerWidth}">
      <slot name="helpText"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick,computed } from "vue";
import { FzInputProps } from "./types";
import { FzIcon } from "@fiscozen/icons";
import useInputStyle from "./useInputStyle";

const props = withDefaults(defineProps<FzInputProps>(), {
  size: "md",
  error: false,
  type: "text",
});
const model = defineModel();
const containerRef = ref<HTMLDivElement | null>(null);


watch(model, (value) => {
  console.log(value);
});

const inputRef = ref<HTMLInputElement | null>(null);

const {
  staticContainerClass,
  computedContainerClass,
  computedLabelClass,
  staticInputClass,
  computedHelpClass,
  computedErrorClass,
  containerWidth
} = useInputStyle(props, containerRef);

const emit = defineEmits([]);
</script>

<style scoped></style>
