<script setup lang="ts">
/**
 * FzTypeaheadButton Component
 *
 * Presentational component for the FzTypeahead opener button.
 * Renders the button with icons, placeholder, and selected value.
 * Handles its own styling based on state (disabled, readonly, error).
 *
 * @component
 * @internal
 */
import { ref, computed } from "vue";
import { FzIcon } from "@fiscozen/icons";
import { FzInput, type FzInputProps } from "@fiscozen/input";
import type { FzTypeaheadButtonProps } from "./types";

const props = withDefaults(defineProps<FzTypeaheadButtonProps>(), {
  environment: "frontoffice",
  filtrable: true,
});

/**
 * v-model for the input value (search string)
 */
const inputModel = defineModel<string>({
  default: "",
});

const emit = defineEmits<{
  click: [];
  keydown: [event: KeyboardEvent];
  "input-focus": [event: FocusEvent];
  "input-click": [event: MouseEvent];
  "input-keydown": [event: KeyboardEvent];
}>();

const openerButton = ref<HTMLButtonElement>();

/**
 * Computed state flags
 */
const isDisabled = computed(() => props.disabled);
const isReadonly = computed(() => props.readonly);
const isInteractive = computed(() => !isDisabled.value && !isReadonly.value);
const isError = computed(() => !!props.error && isInteractive.value);
const isSelectedValue = computed(
  () => props.selectedOption && isInteractive.value
);

/**
 * Base classes for picker button
 */
const staticPickerClass =
  "flex justify-between items-center px-10 bg-core-white rounded border-1 border-grey-300 w-full gap-8 text-left relative outline-none focus:outline-none";

/**
 * Environment-based picker button classes
 */
const environmentPickerClasses = {
  backoffice: "h-32 text-base",
  frontoffice: "h-44 text-lg",
} as const;

/**
 * Computes picker button state classes using Representation-First pattern
 */
const pickerStateClasses = computed(() => {
  switch (true) {
    case isDisabled.value:
    case isReadonly.value:
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed focus:border-grey-100";

    case isError.value:
      return "border-semantic-error-200 bg-white text-core-black cursor-pointer focus:border-semantic-error-300";

    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer focus:border-blue-500";
  }
});

/**
 * Computes picker button classes based on environment
 */
const computedPickerClass = computed(() => [
  environmentPickerClasses[props.environment],
  pickerStateClasses.value,
]);

/**
 * Base text classes
 */
const baseTextClasses = "text-base leading-5";

/**
 * Static CSS classes for the span
 */
const staticSpanClass =
  "overflow-hidden text-ellipsis whitespace-nowrap flex-[1] font-normal";

/**
 * Computes span classes for selected option display
 */
const spanClass = computed(() => {
  const baseClasses = [baseTextClasses];

  switch (true) {
    case isDisabled.value:
    case isReadonly.value:
      baseClasses.push("text-grey-300");
      break;

    case isSelectedValue.value:
      baseClasses.push("text-core-black");
      break;

    default:
      // Placeholder state
      baseClasses.push("text-grey-300");
      break;
  }

  return baseClasses;
});

/**
 * Computes icon color classes based on component state
 *
 * Returns core-black for interactive state, grey-300 for disabled/readonly states.
 */
const iconColorClass = computed(() => {
  if (isDisabled.value || isReadonly.value) {
    return "text-grey-300";
  }
  return "text-core-black";
});

const handleClick = () => {
  emit("click");
};

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event);
};

const shouldShowTheInput = computed(() => props.filtrable && props.isOpen);

/**
 * Computes input props for FzInput when filterable and open
 *
 * Maps button props to FzInput props, excluding label/help/error
 * which are handled externally in slots.
 */
const inputProps = computed<FzInputProps>(() => ({
  placeholder: props.placeholder,
  required: props.required,
  error: !!props.error,
  disabled: props.disabled,
  readonly: props.readonly,
  environment: props.environment,
  leftIcon: props.leftIcon,
  leftIconVariant: props.leftIconVariant,
  // rightIcon is handled via right-icon slot (chevron is always last)
}));

const inputRef = ref<InstanceType<typeof FzInput>>();

const handleInputUpdate = (value: string | undefined) => {
  inputModel.value = value ?? "";
};

const handleInputFocus = (event: FocusEvent) => {
  emit("input-focus", event);
};

const handleInputClick = (event: MouseEvent) => {
  emit("input-click", event);
};

const handleInputKeydown = (event: KeyboardEvent) => {
  emit("input-keydown", event);
};

defineExpose({
  openerButton,
  inputRef,
});
</script>

<template>
  <slot :handleClick :isOpen>
    <button
      v-show="!shouldShowTheInput"
      ref="openerButton"
      :id="openerId"
      @click="handleClick"
      @keydown="handleKeydown"
      test-id="fztypeahead-opener"
      type="button"
      :class="[staticPickerClass, ...computedPickerClass, pickerClass]"
      :title="selectedOption ? selectedOption.label : placeholder"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-haspopup="'listbox'"
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="
        !label
          ? selectedOption
            ? selectedOption.label
            : placeholder
          : undefined
      "
      :aria-required="required ? 'true' : 'false'"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-disabled="isInteractive ? 'false' : 'true'"
      :aria-hidden="shouldShowTheInput ? 'true' : 'false'"
    >
      <FzIcon
        v-if="leftIcon"
        :name="leftIcon"
        :variant="leftIconVariant"
        size="md"
        :class="iconColorClass"
      />
      <span :class="[staticSpanClass, ...spanClass]">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <FzIcon
        v-if="rightIcon"
        :name="rightIcon"
        :variant="rightIconVariant"
        size="md"
        :class="iconColorClass"
      />
      <FzIcon
        :name="isOpen ? 'chevron-up' : 'chevron-down'"
        size="md"
        :class="iconColorClass"
      />
    </button>
    <FzInput
      v-show="shouldShowTheInput"
      ref="inputRef"
      v-bind="inputProps"
      v-model="inputModel"
      :id="openerId"
      @update:modelValue="handleInputUpdate"
      @focus="handleInputFocus"
      @click="handleInputClick"
      @keydown="handleInputKeydown"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-haspopup="'listbox'"
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="
        !label
          ? selectedOption
            ? selectedOption.label
            : placeholder
          : undefined
      "
      :aria-required="required ? 'true' : 'false'"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-disabled="isInteractive ? 'false' : 'true'"
      :aria-hidden="shouldShowTheInput ? 'false' : 'true'"
    >
      <template #right-icon>
        <FzIcon
          v-if="rightIcon"
          :name="rightIcon"
          :variant="rightIconVariant"
          size="md"
        />
        <FzIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" size="md" />
      </template>
    </FzInput>
  </slot>
</template>
