<script setup lang="ts">
/**
 * FzTextarea Component
 *
 * Multi-line text input with label, validation states, and resize control.
 * Error messages use FzAlert (tone="error", variant="text") for consistency
 * with FzInput. Supports combined states (error+disabled, required+help).
 * WCAG 2.1 AA compliant with custom focus ring and full ARIA support.
 *
 * Uses inheritAttrs: false so that all extra attributes and native event
 * listeners (blur, focus, paste, keydown, etc.) are forwarded directly
 * to the native textarea element via v-bind="$attrs", not the root div.
 *
 * @component
 * @example
 * <FzTextarea label="Description" v-model="text" @blur="onBlur" />
 */
import { computed, ref, watch, useSlots } from "vue";
import { FzTextareaProps } from "./types";
import { FzAlert } from "@fiscozen/alert";
import { FzIcon } from "@fiscozen/icons";
import { generateTextareaId } from "./utils";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FzTextareaProps>(), {
  resize: "all",
});

watch(
  () => props.size,
  (size) => {
    if (size !== undefined) {
      console.warn(
        `[FzTextarea] The "size" prop is deprecated and will be removed in the next major version. The textarea always uses text-base (16px).`
      );
    }
  },
  { immediate: true },
);

defineSlots<{
  errorMessage?: () => unknown;
  helpText?: () => unknown;
}>();

const runtimeSlots = useSlots();

const model = defineModel<string>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const uniqueId = generateTextareaId();

/**
 * Falls back to auto-generated ID when no explicit id prop is provided,
 * ensuring label-textarea association always works via for/id binding.
 */
const effectiveId = computed(() => props.id || uniqueId);

/**
 * Links textarea to its error or help message for screen readers.
 * Mirrors the template v-if/v-else-if chain: error+errorMessage slot → error id,
 * otherwise helpText slot → help id. This ensures help text is always linked
 * even when error is true but no errorMessage slot is provided.
 */
const ariaDescribedBy = computed(() => {
  if (props.error && runtimeSlots.errorMessage) {
    return `${effectiveId.value}-error`;
  }
  if (runtimeSlots.helpText) {
    return `${effectiveId.value}-help`;
  }
  return undefined;
});

/**
 * References label ID for aria-labelledby when default label is rendered,
 * providing stronger screen reader association alongside for/id binding.
 */
const ariaLabelledBy = computed(() =>
  props.label ? `${effectiveId.value}-label` : undefined,
);

const isReadonlyOrDisabled = computed(() => !!props.disabled || !!props.readonly);

const containerClasses = computed(() => [
  "fz-textarea flex flex-col gap-8 items-start w-full",
  {
    "cursor-not-allowed": isReadonlyOrDisabled.value,
  },
]);

defineExpose({ textareaRef });

const labelClasses = computed(() => [
  "font-normal text-base",
  (props.disabled || props.readonly) ? "text-grey-300" : "text-core-black",
]);

const mapResizeToClass = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  all: "resize",
} as const;

/**
 * Generates textarea state-specific classes following the same priority order
 * as FzInput: error > disabled/readonly > default.
 * Readonly and disabled share identical visual styling.
 */
const evaluateStateClasses = () => {
  switch (true) {
    case !!props.error:
      return "border-semantic-error-200 focus:border-semantic-error-300 bg-core-white text-core-black cursor-text";

    case isReadonlyOrDisabled.value:
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";

    default:
      return "border-grey-300 focus:border-blue-600 bg-core-white text-core-black cursor-text";
  }
};

const classes = computed(() => [
  "border-1 rounded p-10 placeholder:text-grey-300 block w-full outline-none focus:ring-0 focus:outline-none text-base min-w-[96px]",
  evaluateStateClasses(),
  mapResizeToClass[props.resize],
  {
    "pr-[38px]": props.valid,
  },
]);

const helpClasses = computed(() => [
  "font-normal text-base",
  (props.disabled || props.readonly) ? "text-grey-300" : "text-grey-500",
]);

</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :id="`${effectiveId}-label`" :class="labelClasses" :for="effectiveId"
      >{{ label }}{{ required ? " *" : "" }}</label
    >
    <div class="relative w-full">
      <textarea
        ref="textareaRef"
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
        :aria-disabled="isReadonlyOrDisabled ? 'true' : 'false'"
        :aria-labelledby="ariaLabelledBy"
        :aria-describedby="ariaDescribedBy"
        v-model="model"
        v-bind="$attrs"
      ></textarea>
      <FzIcon
        v-if="valid"
        name="check"
        size="sm"
        class="text-semantic-success absolute top-10 right-10"
        aria-hidden="true"
      />
    </div>
    <FzAlert
      v-if="error && $slots.errorMessage"
      :id="`${effectiveId}-error`"
      role="alert"
      tone="error"
      variant="text"
    >
      <slot name="errorMessage"></slot>
    </FzAlert>
    <span
      v-else-if="$slots.helpText"
      :id="`${effectiveId}-help`"
      :class="helpClasses"
    >
      <slot name="helpText"></slot>
    </span>
  </div>
</template>
