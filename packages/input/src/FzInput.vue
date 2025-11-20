<script setup lang="ts">
/**
 * FzInput Component
 *
 * Flexible input component with icon support, validation states, and multiple variants.
 * Supports left/right icons (static or clickable buttons), floating label variant,
 * error/valid states, and full accessibility features.
 *
 * @component
 * @example
 * <FzInput label="Email" type="email" v-model="email" />
 * <FzInput label="Password" type="password" rightIcon="eye" @fzinput:right-icon-click="toggleVisibility" />
 */
import { computed, toRefs, Ref, ref } from "vue";
import { FzInputProps } from "./types";
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import useInputStyle from "./useInputStyle";

const props = withDefaults(defineProps<FzInputProps>(), {
  size: "md",
  error: false,
  type: "text",
  rightIconButtonVariant: "invisible",
  variant: "normal",
});

const model = defineModel<string>();
const containerRef: Ref<HTMLElement | null> = ref(null);
const inputRef: Ref<HTMLInputElement | null> = ref(null);
const uniqueId = `fz-input-${Math.random().toString(36).slice(2, 9)}`;

const {
  staticContainerClass,
  computedContainerClass,
  computedLabelClass,
  staticInputClass,
  computedInputClass,
  computedHelpClass,
  computedErrorClass,
  containerWidth,
  showNormalPlaceholder,
} = useInputStyle(toRefs(props), containerRef, model);

/**
 * Maps input size to icon button size
 *
 * Icon buttons use a smaller size scale than inputs to maintain visual balance.
 */
const sizeMap: Record<"sm" | "md" | "lg", "xs" | "sm" | "md" | "lg"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const mappedSize = computed<"xs" | "sm" | "md" | "lg">(() => {
  return sizeMap[props.size];
});

const slots = defineSlots<{
  label?: () => unknown;
  "left-icon"?: () => unknown;
  "right-icon"?: () => unknown;
  errorMessage?: () => unknown;
  helpText?: () => unknown;
}>();

/**
 * Computes aria-describedby value linking input to help text or error message
 *
 * Creates space-separated list of IDs for screen readers to announce contextual information.
 */
const ariaDescribedBy = computed(() => {
  const ids: string[] = [];
  if (props.error && slots.errorMessage) {
    ids.push(`${uniqueId}-error`);
  }
  if (!props.error && slots.helpText) {
    ids.push(`${uniqueId}-help`);
  }
  return ids.length > 0 ? ids.join(" ") : undefined;
});

const emit = defineEmits([
  "input",
  "focus",
  "paste",
  "blur",
  "fzinput:left-icon-click",
  "fzinput:right-icon-click",
]);
defineExpose({
  inputRef,
  containerRef,
});
</script>

<template>
  <div class="fz-input w-full flex flex-col gap-8">
    <slot name="label">
      <label
        v-if="label"
        :id="`${uniqueId}-label`"
        :class="['text-sm', computedLabelClass]"
        :for="uniqueId"
      >
        {{ label }}{{ required ? " *" : "" }}
      </label>
    </slot>
    <div
      :class="[staticContainerClass, computedContainerClass]"
      ref="containerRef"
      @click="inputRef?.focus()"
    >
      <slot name="left-icon">
        <FzIcon
          v-if="leftIcon"
          :name="leftIcon"
          :size="size"
          :variant="leftIconVariant"
          @click.stop="emit('fzinput:left-icon-click')"
          :class="leftIconClass"
        />
      </slot>
      <div class="flex flex-col space-around min-w-0 grow">
        <span
          v-if="!showNormalPlaceholder"
          class="text-xs text-gray-300 grow-0 overflow-hidden text-ellipsis whitespace-nowrap"
          >{{ placeholder }}</span
        >
        <input
          :type="type"
          :required="required ? required : false"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="showNormalPlaceholder ? placeholder : ''"
          v-model="model"
          :id="uniqueId"
          ref="inputRef"
          :class="[staticInputClass, computedInputClass]"
          :pattern="pattern"
          :name
          :maxlength
          :aria-required="required ? 'true' : 'false'"
          :aria-invalid="error ? 'true' : 'false'"
          :aria-disabled="disabled ? 'true' : 'false'"
          :aria-labelledby="label ? `${uniqueId}-label` : undefined"
          :aria-describedby="ariaDescribedBy"
          @blur="(e) => $emit('blur', e)"
          @focus="(e) => $emit('focus', e)"
          @paste="(e) => $emit('paste', e)"
        />
      </div>
      <slot name="right-icon">
        <FzIcon
          v-if="valid"
          name="check"
          :size="size"
          class="text-semantic-success"
        />
        <FzIcon
          v-if="rightIcon && !rightIconButton"
          :name="rightIcon"
          :size="size"
          :variant="rightIconVariant"
          @click.stop="emit('fzinput:right-icon-click')"
          :class="rightIconClass"
        />
        <FzIconButton
          v-if="rightIcon && rightIconButton"
          :iconName="rightIcon"
          :size="mappedSize"
          :iconVariant="rightIconVariant"
          :variant="disabled ? 'invisible' : rightIconButtonVariant"
          @click.stop="emit('fzinput:right-icon-click')"
          :class="[{ 'bg-grey-100 !text-gray-300': disabled }, rightIconClass]"
        />
      </slot>
    </div>
    <div
      v-if="error && $slots.errorMessage"
      :id="`${uniqueId}-error`"
      role="alert"
      class="flex gap-4"
      :style="{ width: containerWidth }"
    >
      <FzIcon
        name="triangle-exclamation"
        class="text-semantic-error"
        :size="size"
        aria-hidden="true"
      />
      <div :class="['mt-1', computedErrorClass]">
        <slot name="errorMessage"></slot>
      </div>
    </div>
    <span
      v-else-if="$slots.helpText"
      :id="`${uniqueId}-help`"
      :class="[computedHelpClass]"
      :style="{ width: containerWidth }"
    >
      <slot name="helpText"></slot>
    </span>
  </div>
</template>

<style scoped></style>
