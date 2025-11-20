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
import { generateInputId } from "./utils";

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
const uniqueId = generateInputId();

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

const emit = defineEmits<{
  focus: [event: FocusEvent];
  paste: [event: ClipboardEvent];
  blur: [event: FocusEvent];
  "fzinput:left-icon-click": [];
  "fzinput:right-icon-click": [];
}>();

/**
 * Handles container interaction (click or keyboard) to focus the input
 *
 * Makes the entire container area clickable and keyboard-accessible for better UX,
 * especially useful for floating-label variant and mobile devices.
 */
const handleContainerInteraction = () => {
  if (!props.disabled && inputRef.value) {
    inputRef.value.focus();
  }
};

/**
 * Handles keyboard events on container to focus input
 *
 * Supports Enter and Space keys following accessibility best practices.
 */
const handleContainerKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleContainerInteraction();
  }
};

/**
 * Handles keyboard events on clickable icons
 *
 * Supports Enter and Space keys following accessibility best practices.
 */
const handleIconKeydown = (
  e: KeyboardEvent,
  emitEvent: "fzinput:left-icon-click" | "fzinput:right-icon-click"
) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (emitEvent === "fzinput:left-icon-click") {
      emit("fzinput:left-icon-click");
    } else {
      emit("fzinput:right-icon-click");
    }
  }
};

/**
 * Determines if left icon is clickable (has click handler)
 */
const isLeftIconClickable = computed(() => !!props.leftIcon);

/**
 * Determines if left icon is keyboard-accessible (has aria-label)
 *
 * Icons are only accessible via keyboard when aria-label is provided.
 */
const isLeftIconAccessible = computed(
  () => isLeftIconClickable.value && !!props.leftIconAriaLabel
);

/**
 * Determines if right icon is clickable (not rendered as button)
 */
const isRightIconClickable = computed(
  () => !!props.rightIcon && !props.rightIconButton
);

/**
 * Determines if right icon is keyboard-accessible (has aria-label)
 *
 * Icons are only accessible via keyboard when aria-label is provided.
 */
const isRightIconAccessible = computed(
  () => isRightIconClickable.value && !!props.rightIconAriaLabel
);

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
      :tabindex="disabled ? undefined : 0"
      @click="handleContainerInteraction"
      @keydown="handleContainerKeydown"
    >
      <slot name="left-icon">
        <FzIcon
          v-if="leftIcon"
          :name="leftIcon"
          :size="size"
          :variant="leftIconVariant"
          :role="isLeftIconAccessible ? 'button' : undefined"
          :aria-label="isLeftIconAccessible ? leftIconAriaLabel : undefined"
          :aria-disabled="isLeftIconAccessible && disabled ? 'true' : undefined"
          :tabindex="isLeftIconAccessible && !disabled ? 0 : undefined"
          :class="leftIconClass"
          @click.stop="emit('fzinput:left-icon-click')"
          @keydown="
            isLeftIconAccessible
              ? (e: KeyboardEvent) =>
                  handleIconKeydown(e, 'fzinput:left-icon-click')
              : undefined
          "
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
          :required="required"
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
          aria-hidden="true"
        />
        <FzIcon
          v-if="rightIcon && !rightIconButton"
          :name="rightIcon"
          :size="size"
          :variant="rightIconVariant"
          :role="isRightIconAccessible ? 'button' : undefined"
          :aria-label="isRightIconAccessible ? rightIconAriaLabel : undefined"
          :aria-disabled="
            isRightIconAccessible && disabled ? 'true' : undefined
          "
          :tabindex="isRightIconAccessible && !disabled ? 0 : undefined"
          :class="rightIconClass"
          @click.stop="emit('fzinput:right-icon-click')"
          @keydown="
            isRightIconAccessible
              ? (e: KeyboardEvent) =>
                  handleIconKeydown(e, 'fzinput:right-icon-click')
              : undefined
          "
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
