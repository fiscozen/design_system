<template>
  <div class="w-full flex flex-col gap-8">
    <label :class="['text-sm', computedLabelClass]" :for="uniqueId">
      {{ label }}{{ required ? " *" : "" }}
    </label>
    <div
      :class="[staticContainerClass, computedContainerClass]"
      ref="containerRef"
      @click="inputRef?.focus()"
    >
      <FzIcon
        v-if="leftIcon"
        :name="leftIcon"
        :size="size"
        :variant="leftIconVariant"
      />
      <input
        :type="type"
        :required="required ? required : false"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        v-model="model"
        :id="uniqueId"
        ref="inputRef"
        :class="[staticInputClass]"
        :pattern="pattern"
        :name
        @focus="(e) => $emit('focus', e)"
      />
      <FzIcon
        v-if="valid"
        name="check"
        :size="size"
        class="text-semantic-success"
      />
      <FzIcon
        v-if="rightIcon"
        :name="rightIcon"
        :size="size"
        :variant="rightIconVariant"
      />
    </div>
    <div
      v-if="error && $slots.errorMessage"
      class="flex gap-4"
      :style="{ width: containerWidth }"
    >
      <FzIcon
        name="triangle-exclamation"
        class="text-semantic-error"
        :size="size"
      />
      <div :class="['mt-1', computedErrorClass]">
        <slot name="errorMessage"></slot>
      </div>
    </div>
    <span
      v-else-if="$slots.helpText"
      :class="[computedHelpClass]"
      :style="{ width: containerWidth }"
    >
      <slot name="helpText"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { FzInputProps } from "./types";
import { FzIcon } from "@fiscozen/icons";
import useInputStyle from "./useInputStyle";

const props = withDefaults(defineProps<FzInputProps>(), {
  size: "md",
  error: false,
  type: "text",
});

const model = defineModel();
const containerRef: Ref<HTMLElement | null> = ref(null);
const inputRef: Ref<HTMLInputElement | null> = ref(null);
const uniqueId = `fz-input-${Math.random().toString(36).slice(2, 9)}`;

const {
  staticContainerClass,
  computedContainerClass,
  computedLabelClass,
  staticInputClass,
  computedHelpClass,
  computedErrorClass,
  containerWidth,
} = useInputStyle(props, containerRef);

const emit = defineEmits(['input', 'focus']);
defineExpose({
  inputRef,
  containerRef
})
</script>

<style scoped></style>
