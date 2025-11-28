<template>
  <div :class="[staticContainerClass, 'text-base gap-10']">
    <label
      v-if="label"
      :id="`${id}-label`"
      :for="name"
      :class="[staticLabelClass, computedLabelClass]"
    >
      <span>{{ label }}<span v-if="required"> *</span></span>
      <p :id="`${id}-help`" :class="computedHelpTextClass" v-if="$slots.help">
        <slot name="help" />
      </p>
    </label>
    <div
      :id="id"
      :class="[staticSlotContainerClass, 'text-base gap-8']"
      test-id="slot-container"
      role="radiogroup"
      :aria-labelledby="label ? `${id}-label` : undefined"
      :aria-describedby="computedAriaDescribedby"
      :aria-required="required ? 'true' : 'false'"
      :aria-invalid="isError ? 'true' : 'false'"
    >
      <slot :radioGroupProps="controlledProps" />
    </div>
    <ErrorAlert v-if="isError && $slots.error" :id="`${id}-error`">
      <slot name="error" />
    </ErrorAlert>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import { FzRadioGroupProps } from "./types";
import { generateRadioGroupId } from "./utils";
import ErrorAlert from "./components/ErrorAlert.vue";

const slots = useSlots();

const props = withDefaults(defineProps<FzRadioGroupProps>(), {
  name: `radio-group-${Math.random().toString(36).slice(2, 9)}`,
  size: "md",
  variant: "vertical",
});

/** Unique identifier for the radio group, used for ARIA relationships */
const id = generateRadioGroupId();

// Compute tone from props (with fallback to deprecated emphasis/error)
const computedTone = computed<"neutral" | "emphasis" | "error">(() => {
  if (props.tone) return props.tone;
  if (props.error) return "error";
  if (props.emphasis) return "emphasis";
  return "neutral";
});

// Compute error state
const isError = computed(() => {
  return computedTone.value === "error" || props.error === true;
});

const controlledProps = computed<Omit<FzRadioGroupProps, "label" | "variant">>(
  () => ({
    disabled: props.disabled,
    error: props.error,
    size: "md",
    emphasis: props.emphasis,
    tone: computedTone.value,
    required: props.required,
    name: props.name,
  }),
);

const staticLabelClass = "flex flex-col";
const staticContainerClass = "flex flex-col";
const staticSlotContainerClass = computed(() => [
  "flex self-stretch",
  props.variant === "horizontal" ? "flex-row" : "flex-col",
]);

const computedHelpTextClass = computed(() => [
  "text-base",
  props.disabled ? "text-grey-400" : "text-grey-500",
]);

const computedLabelClass = computed(() => [
  "text-base gap-6",
  props.disabled ? "text-grey-400" : "text-core-black",
]);

/**
 * Computes the aria-describedby attribute value for the radio group.
 * Combines help text and error message IDs when present.
 *
 * @returns Space-separated string of IDs, or undefined if no descriptions
 */
const computedAriaDescribedby = computed<string | undefined>(() => {
  const descriptions: string[] = [];

  if (slots.help) {
    descriptions.push(`${id}-help`);
  }

  if (isError.value && slots.error) {
    descriptions.push(`${id}-error`);
  }

  return descriptions.length > 0 ? descriptions.join(" ") : undefined;
});
</script>
