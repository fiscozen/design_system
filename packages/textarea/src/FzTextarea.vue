<script setup lang="ts">
/**
 * FzTextarea Component
 *
 * Multi-line text input with label, validation states, and resize control.
 * Supports error/help messages, required/disabled/readonly states,
 * and full WCAG 2.1 AA accessibility.
 *
 * @component
 * @example
 * <FzTextarea label="Description" v-model="text" />
 */
import { computed } from "vue";
import { FzTextareaProps, FzTextareaEvents } from "./types";
import { FzIcon } from "@fiscozen/icons";
import { generateTextareaId } from "./utils";

const props = withDefaults(defineProps<FzTextareaProps>(), {
  size: "md",
  resize: "all",
});

const emit = defineEmits<FzTextareaEvents>();

const model = defineModel<string>();

const uniqueId = generateTextareaId();

/**
 * Falls back to auto-generated ID when no explicit id prop is provided,
 * ensuring label-textarea association always works via for/id binding.
 */
const effectiveId = computed(() => props.id || uniqueId);

/**
 * Links textarea to its error or help message for screen readers.
 * Error message takes precedence over help message.
 */
const ariaDescribedBy = computed(() => {
  if (shouldShowError.value) {
    return `${effectiveId.value}-error`;
  }
  if (shouldShowHelp.value) {
    return `${effectiveId.value}-help`;
  }
  return undefined;
});

const containerClasses = computed(() => [
  "flex flex-col gap-8 items-start w-full",
  {
    "cursor-not-allowed": props.disabled,
  },
]);

const labelClasses = computed(() => [
  "text-sm",
  {
    "text-grey-300": props.disabled,
    "cursor-not-allowed": props.disabled,
  },
]);

const mapSizeToClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

const mapResizeToClass = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  all: "resize",
} as const;

const classes = computed(() => [
  "border-1 rounded p-10 placeholder:text-gray-300 disabled:bg-grey-100 disabled:border-grey-100 block invalid:border-semantic-error w-full",
  mapSizeToClass[props.size],
  props.error ? "border-semantic-error" : "border-grey-300",
  mapResizeToClass[props.resize],
  {
    "cursor-not-allowed": props.disabled,
    "pr-[38px]": props.valid,
  },
]);

const shouldShowError = computed(() => {
  return props.error && props.errorMessage;
});

const shouldShowHelp = computed(() => {
  return !!props.helpMessage;
});

const shouldShowMessage = computed(() => {
  return shouldShowError.value || shouldShowHelp.value;
});
</script>

<template>
  <div :class="containerClasses">
    <label :class="labelClasses" :for="effectiveId"
      >{{ label }}{{ required ? " *" : "" }}</label
    >
    <div class="relative w-full">
      <textarea
        :id="effectiveId"
        :name
        :class="classes"
        :placeholder
        :disabled
        :required
        :rows
        :cols
        :minlength
        :maxlength
        :readonly
        :aria-required="required ? 'true' : 'false'"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :aria-describedby="ariaDescribedBy"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @paste="emit('paste', $event)"
        v-model="model"
        v-bind="$attrs"
      ></textarea>
      <FzIcon
        v-if="valid"
        name="check"
        :size="size"
        class="text-semantic-success absolute top-10 right-10"
        aria-hidden="true"
      />
    </div>
    <div
      v-if="shouldShowError"
      :id="`${effectiveId}-error`"
      role="alert"
      class="text-sm flex items-center gap-6 h-20"
    >
      <FzIcon
        name="triangle-exclamation"
        size="md"
        class="text-semantic-error"
        aria-hidden="true"
      />
      {{ errorMessage }}
    </div>
    <span
      v-else-if="shouldShowHelp"
      :id="`${effectiveId}-help`"
      class="text-sm text-grey-500 h-20 flex items-center"
    >
      {{ helpMessage }}
    </span>
  </div>
</template>

<style scoped></style>
