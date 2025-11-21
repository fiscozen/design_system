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
import { computed, toRefs, Ref, ref, watch } from "vue";
import { FzInputProps, type InputEnvironment } from "./types";
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import useInputStyle from "./useInputStyle";
import { generateInputId, sizeToEnvironmentMapping } from "./utils";

const props = withDefaults(defineProps<FzInputProps>(), {
  error: false,
  type: "text",
  rightIconButtonVariant: "invisible",
  variant: "normal",
  environment: "frontoffice",
});

/**
 * Deprecation warning and normalization for size prop.
 * Watches the size prop and warns once on mount if it's provided.
 * Normalizes size values to environment for backward compatibility.
 */
watch(
  () => props.size,
  (size) => {
    if (size !== undefined) {
      const mappedEnvironment = sizeToEnvironmentMapping[size];

      // Check if both environment and size are provided and conflict
      if (props.environment && props.environment !== mappedEnvironment) {
        console.warn(
          `[FzInput] Both "size" and "environment" props are provided. ` +
            `"environment=${props.environment}" will be used and "size=${size}" will be ignored. ` +
            `Please remove the deprecated "size" prop.`
        );
      } else {
        console.warn(
          `[FzInput] The "size" prop is deprecated and will be removed in a future version. ` +
            `Please use environment="${mappedEnvironment}" instead of size="${size}".`
        );
      }
    }
  },
  { immediate: true }
);

/**
 * Deprecation warning for rightIconSize prop.
 * Icons now have a fixed size of "md" and this prop is ignored.
 */
watch(
  () => props.rightIconSize,
  (rightIconSize) => {
    if (rightIconSize !== undefined) {
      console.warn(
        `[FzInput] The "rightIconSize" prop is deprecated and will be removed in a future version. ` +
          `Icons now have a fixed size of "md". The provided value "${rightIconSize}" will be ignored.`
      );
    }
  },
  { immediate: true }
);

/**
 * Determines the effective environment based on environment or size prop
 *
 * Priority: environment prop > size prop mapped to environment > default 'frontoffice'.
 * The size prop is deprecated and only used for backward compatibility.
 */
const effectiveEnvironment = computed((): InputEnvironment => {
  if (props.environment) {
    return props.environment;
  }
  if (props.size) {
    return sizeToEnvironmentMapping[props.size];
  }
  return "frontoffice";
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
} = useInputStyle(toRefs(props), containerRef, model, effectiveEnvironment);

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
  "fzinput:second-right-icon-click": [];
}>();

/**
 * Handles container interaction (click or keyboard) to focus the input
 *
 * Makes the entire container area clickable and keyboard-accessible for better UX,
 * especially useful for floating-label variant and mobile devices.
 */
const handleContainerInteraction = () => {
  if (!props.disabled && !props.readonly && inputRef.value) {
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
  emitEvent:
    | "fzinput:left-icon-click"
    | "fzinput:right-icon-click"
    | "fzinput:second-right-icon-click"
) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (emitEvent === "fzinput:left-icon-click") {
      emit("fzinput:left-icon-click");
    } else if (emitEvent === "fzinput:right-icon-click") {
      emit("fzinput:right-icon-click");
    } else {
      emit("fzinput:second-right-icon-click");
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
 * Determines if input is disabled or readonly
 *
 * Readonly inputs have the same visual styling and behavior as disabled inputs.
 */
const isReadonlyOrDisabled = computed(
  () => !!props.disabled || !!props.readonly
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

/**
 * Determines if second right icon is clickable (not rendered as button)
 */
const isSecondRightIconClickable = computed(
  () => !!props.secondRightIcon && !props.secondRightIconButton
);

/**
 * Determines if second right icon is keyboard-accessible (has aria-label)
 *
 * Icons are only accessible via keyboard when aria-label is provided.
 */
const isSecondRightIconAccessible = computed(
  () => isSecondRightIconClickable.value && !!props.secondRightIconAriaLabel
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
        :class="computedLabelClass"
        :for="uniqueId"
      >
        {{ label }}{{ required ? " *" : "" }}
      </label>
    </slot>
    <div
      :class="[staticContainerClass, computedContainerClass]"
      ref="containerRef"
      :tabindex="isReadonlyOrDisabled ? undefined : 0"
      @click="handleContainerInteraction"
      @keydown="handleContainerKeydown"
    >
      <slot name="left-icon">
        <FzIcon
          v-if="leftIcon"
          :name="leftIcon"
          size="md"
          :variant="leftIconVariant"
          :role="isLeftIconAccessible ? 'button' : undefined"
          :aria-label="isLeftIconAccessible ? leftIconAriaLabel : undefined"
          :aria-disabled="
            isLeftIconAccessible && isReadonlyOrDisabled ? 'true' : undefined
          "
          :tabindex="
            isLeftIconAccessible && !isReadonlyOrDisabled ? 0 : undefined
          "
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
          :aria-disabled="isReadonlyOrDisabled ? 'true' : 'false'"
          :aria-labelledby="label ? `${uniqueId}-label` : undefined"
          :aria-describedby="ariaDescribedBy"
          @blur="(e) => $emit('blur', e)"
          @focus="(e) => $emit('focus', e)"
          @paste="(e) => $emit('paste', e)"
        />
      </div>
      <slot name="right-icon">
        <div class="flex items-center gap-1">
          <FzIcon
            v-if="secondRightIcon && !secondRightIconButton"
            :name="secondRightIcon"
            size="md"
            :variant="secondRightIconVariant"
            :role="isSecondRightIconAccessible ? 'button' : undefined"
            :aria-label="
              isSecondRightIconAccessible ? secondRightIconAriaLabel : undefined
            "
            :aria-disabled="
              isSecondRightIconAccessible && isReadonlyOrDisabled
                ? 'true'
                : undefined
            "
            :tabindex="
              isSecondRightIconAccessible && !isReadonlyOrDisabled
                ? 0
                : undefined
            "
            :class="secondRightIconClass"
            @click.stop="emit('fzinput:second-right-icon-click')"
            @keydown="
              isSecondRightIconAccessible
                ? (e: KeyboardEvent) =>
                    handleIconKeydown(e, 'fzinput:second-right-icon-click')
                : undefined
            "
          />
          <FzIconButton
            v-if="secondRightIcon && secondRightIconButton"
            :iconName="secondRightIcon"
            size="md"
            :iconVariant="secondRightIconVariant"
            :variant="
              isReadonlyOrDisabled ? 'invisible' : secondRightIconButtonVariant
            "
            @click.stop="emit('fzinput:second-right-icon-click')"
            :class="[
              { 'bg-grey-100 !text-gray-300': isReadonlyOrDisabled },
              secondRightIconClass,
            ]"
          />
          <FzIcon
            v-if="rightIcon && !rightIconButton"
            :name="rightIcon"
            size="md"
            :variant="rightIconVariant"
            :role="isRightIconAccessible ? 'button' : undefined"
            :aria-label="isRightIconAccessible ? rightIconAriaLabel : undefined"
            :aria-disabled="
              isRightIconAccessible && isReadonlyOrDisabled ? 'true' : undefined
            "
            :tabindex="
              isRightIconAccessible && !isReadonlyOrDisabled ? 0 : undefined
            "
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
            size="md"
            :iconVariant="rightIconVariant"
            :variant="
              isReadonlyOrDisabled ? 'invisible' : rightIconButtonVariant
            "
            @click.stop="emit('fzinput:right-icon-click')"
            :class="[
              { 'bg-grey-100 !text-gray-300': isReadonlyOrDisabled },
              rightIconClass,
            ]"
          />
          <FzIcon
            v-if="valid"
            name="check"
            size="md"
            class="text-semantic-success"
            aria-hidden="true"
          />
        </div>
      </slot>
    </div>
    <div
      v-if="error && $slots.errorMessage"
      :id="`${uniqueId}-error`"
      role="alert"
      class="flex items-start gap-[6px]"
      :style="{ width: containerWidth }"
    >
      <FzIcon
        name="circle-xmark"
        class="text-semantic-error-200"
        size="md"
        aria-hidden="true"
      />
      <div :class="computedErrorClass">
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
