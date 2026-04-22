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
  import { computed, toRefs, Ref, ref, watch, useSlots, useAttrs } from "vue";
  import { FzInputProps, type InputEnvironment } from "./types";
  import { FzAlert } from "@fiscozen/alert";
  import { FzIcon } from "@fiscozen/icons";
  import { FzIconButton } from "@fiscozen/button";
  import useInputStyle from "./useInputStyle";
  import { generateInputId, sizeToEnvironmentMapping } from "./utils";

  const props = withDefaults(defineProps<FzInputProps>(), {
    error: false,
    type: "text",
    rightIconButtonVariant: "invisible",
    secondRightIconButtonVariant: "invisible",
    variant: "normal",
    environment: "frontoffice",
    autocomplete: false,
    highlighted: false,
    highlightedDescription: "Campo in evidenza",
    aiReasoning: false,
    aiReasoningDescription: "Suggerito dall'intelligenza artificiale",
    disableEmphasisReset: false,
    clearable: false,
  });

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  /**
   * Attrs forwarded to the native input element.
   * Excludes class which are applied to the root wrapper div
   * so that consumers can control layout/positioning of the component.
   */
  const inputAttrs = computed(() => {
    return {
      ...attrs,
      class: undefined,
    };
  });

  const rootClass = computed(() => attrs.class);

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
            `Please remove the deprecated "size" prop.`,
          );
        } else {
          console.warn(
            `[FzInput] The "size" prop is deprecated and will be removed in a future version. ` +
            `Please use environment="${mappedEnvironment}" instead of size="${size}".`,
          );
        }
      }
    },
    { immediate: true },
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
          `Icons now have a fixed size of "md". The provided value "${rightIconSize}" will be ignored.`,
        );
      }
    },
    { immediate: true },
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
  const isFocused = ref(false);

  /**
   * Internal visual state for emphasis props.
   * These track the effective visual state which can differ from props when
   * the user types into a highlighted/aiReasoning input (user input resets emphasis).
   * Programmatic value changes (via v-model) do not affect these states.
   */
  const effectiveHighlighted = ref(props.highlighted);
  const effectiveAiReasoning = ref(props.aiReasoning);

  watch(
    () => props.highlighted,
    (val) => {
      effectiveHighlighted.value = val;
    },
  );
  watch(
    () => props.aiReasoning,
    (val) => {
      effectiveAiReasoning.value = val;
    },
  );

  /**
   * Resets visual emphasis (highlighted/aiReasoning) when user physically types.
   * Only triggered by native input events (user interaction), not programmatic v-model updates.
   * Emits update events so parents using v-model:highlighted / v-model:aiReasoning stay in sync.
   */
  const handleUserInput = () => {
    if (props.disableEmphasisReset) return;
    if (effectiveHighlighted.value) {
      effectiveHighlighted.value = false;
      emit("update:highlighted", false);
    }
    if (effectiveAiReasoning.value) {
      effectiveAiReasoning.value = false;
      emit("update:aiReasoning", false);
    }
  };

  const propsRefs = toRefs(props);

  const {
    staticContainerClass,
    computedContainerClass,
    computedLabelClass,
    staticInputClass,
    computedInputClass,
    computedHelpClass,
    containerWidth,
    showNormalPlaceholder,
  } = useInputStyle(
    {
      ...propsRefs,
      highlighted: effectiveHighlighted,
      aiReasoning: effectiveAiReasoning,
    },
    containerRef,
    model,
    effectiveEnvironment,
    isFocused,
  );

  const slots = defineSlots<{
    label?: () => unknown;
    "left-icon"?: () => unknown;
    "right-icon"?: () => unknown;
    errorMessage?: () => unknown;
    helpText?: () => unknown;
  }>();

  const runtimeSlots = useSlots();

  /**
   * Computes aria-labelledby value linking input to label element
   *
   * Only set when default label element is rendered. Custom label slot replaces default label,
   * so the ID doesn't exist and aria-labelledby would reference a non-existent element.
   */
  const ariaLabelledBy = computed(() => {
    const hasLabelProp = !!props.label;
    const hasCustomLabelSlot = !!runtimeSlots.label;

    if (hasLabelProp && !hasCustomLabelSlot) {
      return `${uniqueId}-label`;
    }
    return undefined;
  });

  /**
   * Computes aria-describedby value linking input to help text or error message
   *
   * Uses runtimeSlots (not slots from defineSlots) because defineSlots is only for TypeScript typing.
   */
  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];
    if (props.error && runtimeSlots.errorMessage) {
      ids.push(`${uniqueId}-error`);
    }
    if (!props.error && runtimeSlots.helpText) {
      ids.push(`${uniqueId}-help`);
    }
    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const emit = defineEmits<{
    focus: [event: FocusEvent];
    blur: [event: FocusEvent];
    // Other DOM events (keydown, keyup, paste, input, change, etc.) are automatically
    // forwarded to the native input element via v-bind="$attrs" and don't need to be
    // explicitly declared here. They will work automatically when used on FzInput.
    "fzinput:left-icon-click": [];
    "fzinput:right-icon-click": [];
    "fzinput:second-right-icon-click": [];
    "update:highlighted": [value: boolean];
    "update:aiReasoning": [value: boolean];
    "fzinput:clear": [];
  }>();

  /**
   * Handles container interaction (click or keyboard) to focus the input
   *
   * Makes the entire container area clickable and keyboard-accessible for better UX,
   * especially useful for floating-label variant and mobile devices.
   * Respects disabled and readonly states.
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
   * Only prevents default when event originates from container itself (not from child elements like input),
   * allowing form submission when Enter is pressed inside the input field.
   *
   * @param e - Keyboard event
   */
  const handleContainerKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      // Only prevent default if event originated from container itself, not from child elements
      // This allows Enter key presses in the input to trigger form submission
      if (e.target === e.currentTarget || e.target === containerRef.value) {
        e.preventDefault();
        handleContainerInteraction();
      }
    }
  };

  /**
   * Handles keyboard events on clickable icons
   *
   * Supports Enter and Space keys following accessibility best practices.
   *
   * @param e - Keyboard event
   * @param emitEvent - Event name to emit when key is pressed
   */
  const handleIconKeydown = (
    e: KeyboardEvent,
    emitEvent:
      | "fzinput:left-icon-click"
      | "fzinput:right-icon-click"
      | "fzinput:second-right-icon-click",
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isReadonlyOrDisabled.value) {
        if (emitEvent === "fzinput:left-icon-click") {
          emit("fzinput:left-icon-click");
        } else if (emitEvent === "fzinput:right-icon-click") {
          emit("fzinput:right-icon-click");
        } else {
          emit("fzinput:second-right-icon-click");
        }
      }
    }
  };

  /**
   * Handles left icon click events
   *
   * Respects disabled and readonly states - does not emit if input is disabled or readonly.
   */
  const handleLeftIconClick = () => {
    if (!isReadonlyOrDisabled.value) {
      emit("fzinput:left-icon-click");
    }
  };

  /**
   * Handles right icon click events
   *
   * Respects disabled and readonly states - does not emit if input is disabled or readonly.
   */
  const handleRightIconClick = () => {
    if (!isReadonlyOrDisabled.value) {
      emit("fzinput:right-icon-click");
    }
  };

  /**
   * Handles second right icon click events
   *
   * Respects disabled and readonly states - does not emit if input is disabled or readonly.
   */
  const handleSecondRightIconClick = () => {
    if (!isReadonlyOrDisabled.value) {
      emit("fzinput:second-right-icon-click");
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
    () => isLeftIconClickable.value && !!props.leftIconAriaLabel,
  );

  /**
   * Determines if input is disabled or readonly
   *
   * Readonly inputs have the same visual styling and behavior as disabled inputs.
   */
  const isReadonlyOrDisabled = computed(
    () => !!props.disabled || !!props.readonly,
  );

  /**
   * Computed class for the auto-rendered AI sparkles icon.
   * Muted when the input is in error, disabled, or readonly state.
   */
  const aiIconClass = computed(() => {
    if (isReadonlyOrDisabled.value || props.error) return "text-grey-300";
    return "text-purple-600";
  });

  const emphasisDescription = computed(() => {
    if (isReadonlyOrDisabled.value || props.error) return undefined;
    if (effectiveHighlighted.value) return props.highlightedDescription;
    if (effectiveAiReasoning.value) return props.aiReasoningDescription;
    return undefined;
  });

  /**
   * Determines if right icon is clickable (not rendered as button)
   */
  const isRightIconClickable = computed(
    () => !!props.rightIcon && !props.rightIconButton,
  );

  /**
   * Determines if right icon is keyboard-accessible (has aria-label)
   *
   * Icons are only accessible via keyboard when aria-label is provided.
   */
  const isRightIconAccessible = computed(
    () => isRightIconClickable.value && !!props.rightIconAriaLabel,
  );

  /**
   * Determines if second right icon is clickable (not rendered as button)
   */
  const isSecondRightIconClickable = computed(
    () => !!props.secondRightIcon && !props.secondRightIconButton,
  );

  /**
   * Determines if second right icon is keyboard-accessible (has aria-label)
   *
   * Icons are only accessible via keyboard when aria-label is provided.
   */
  const isSecondRightIconAccessible = computed(
    () => isSecondRightIconClickable.value && !!props.secondRightIconAriaLabel,
  );

  const shouldShowClearIcon = computed(() => {
    return props.clearable && !!model.value && !isReadonlyOrDisabled.value;
  });

  const handleClear = () => {
    model.value = "";
    emit("fzinput:clear");
  };

  defineExpose({
    inputRef,
    containerRef,
  });
</script>

<template>
  <div class="fz-input w-full flex flex-col gap-8" :class="rootClass">
    <slot name="label">
      <label v-if="label" :id="`${uniqueId}-label`" :class="computedLabelClass" :for="uniqueId">
        {{ label }}{{ required ? " *" : "" }}
      </label>
    </slot>
    <div :class="[staticContainerClass, computedContainerClass]" ref="containerRef"
      :tabindex="isReadonlyOrDisabled ? undefined : 0" @click="handleContainerInteraction"
      @keydown="handleContainerKeydown">
      <slot name="left-icon">
        <FzIcon v-if="leftIcon" :name="leftIcon" size="md" :variant="leftIconVariant"
          :role="isLeftIconAccessible ? 'button' : undefined"
          :aria-label="isLeftIconAccessible ? leftIconAriaLabel : undefined" :aria-disabled="isLeftIconAccessible && isReadonlyOrDisabled ? 'true' : undefined
            " :tabindex="isLeftIconAccessible && !isReadonlyOrDisabled ? 0 : undefined
              " :class="leftIconClass" @click.stop="handleLeftIconClick" @keydown="
                isLeftIconAccessible
                  ? (e: KeyboardEvent) =>
                    handleIconKeydown(e, 'fzinput:left-icon-click')
                  : undefined
                " />
        <FzIcon v-else-if="effectiveAiReasoning && !effectiveHighlighted" name="sparkles" variant="fas" size="md"
          aria-hidden="true" :class="aiIconClass" />
      </slot>
      <div class="flex flex-col justify-around min-w-0 grow">
        <span v-if="!showNormalPlaceholder"
          class="text-xs text-grey-300 grow-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ placeholder }}</span>
        <input :type="type" :required="required" :disabled="disabled" :readonly="readonly"
          :placeholder="showNormalPlaceholder ? placeholder : ''" v-model="model" :id="uniqueId" ref="inputRef"
          :class="[staticInputClass, computedInputClass]" :pattern="pattern" :name :maxlength
          :autocomplete="autocomplete ? 'on' : 'off'" :aria-required="required ? 'true' : 'false'"
          :aria-invalid="error ? 'true' : 'false'" :aria-disabled="isReadonlyOrDisabled ? 'true' : 'false'"
          :aria-labelledby="ariaLabelledBy" :aria-describedby="ariaDescribedBy" :aria-description="emphasisDescription"
          v-bind="inputAttrs" @input="handleUserInput" @blur="
            (e) => {
              isFocused = false;
              $emit('blur', e);
            }
          " @focus="
            (e) => {
              isFocused = true;
              $emit('focus', e);
            }
          " />
      </div>
      <div class="flex items-center gap-4">
        <FzIconButton v-if="shouldShowClearIcon" iconName="xmark" size="md" variant="invisible" aria-label="Clear"
          @click.stop="handleClear" />
        <slot name="right-icon">
          <FzIcon v-if="secondRightIcon && !secondRightIconButton" :name="secondRightIcon" size="md"
            :variant="secondRightIconVariant" :role="isSecondRightIconAccessible ? 'button' : undefined" :aria-label="isSecondRightIconAccessible ? secondRightIconAriaLabel : undefined
              " :aria-disabled="isSecondRightIconAccessible && isReadonlyOrDisabled
                ? 'true'
                : undefined
                " :tabindex="isSecondRightIconAccessible && !isReadonlyOrDisabled
                  ? 0
                  : undefined
                  " :class="secondRightIconClass" @click.stop="handleSecondRightIconClick" @keydown="
                    isSecondRightIconAccessible
                      ? (e: KeyboardEvent) =>
                        handleIconKeydown(e, 'fzinput:second-right-icon-click')
                      : undefined
                    " />
          <FzIconButton v-if="secondRightIcon && secondRightIconButton" :iconName="secondRightIcon" size="md"
            :iconVariant="secondRightIconVariant" :variant="isReadonlyOrDisabled ? 'invisible' : secondRightIconButtonVariant
              " @click.stop="handleSecondRightIconClick" :class="[
                { 'bg-grey-100 !text-grey-300': isReadonlyOrDisabled },
                secondRightIconClass,
              ]" />
          <FzIcon v-if="rightIcon && !rightIconButton" :name="rightIcon" size="md" :variant="rightIconVariant"
            :role="isRightIconAccessible ? 'button' : undefined"
            :aria-label="isRightIconAccessible ? rightIconAriaLabel : undefined" :aria-disabled="isRightIconAccessible && isReadonlyOrDisabled ? 'true' : undefined
              " :tabindex="isRightIconAccessible && !isReadonlyOrDisabled ? 0 : undefined
                " :class="rightIconClass" @click.stop="handleRightIconClick" @keydown="
                  isRightIconAccessible
                    ? (e: KeyboardEvent) =>
                      handleIconKeydown(e, 'fzinput:right-icon-click')
                    : undefined
                  " />
          <FzIconButton v-if="rightIcon && rightIconButton" :iconName="rightIcon" size="md"
            :iconVariant="rightIconVariant" :variant="isReadonlyOrDisabled ? 'invisible' : rightIconButtonVariant
              " @click.stop="handleRightIconClick" :class="[
                { 'bg-grey-100 !text-grey-300': isReadonlyOrDisabled },
                rightIconClass,
              ]" />
          <FzIcon v-if="valid" name="check" size="md" class="text-semantic-success" aria-hidden="true" />
        </slot>
      </div>
    </div>
    <FzAlert v-if="error && $slots.errorMessage" :id="`${uniqueId}-error`" role="alert" tone="error" variant="text"
      :style="{ width: containerWidth }">
      <slot name="errorMessage"></slot>
    </FzAlert>
    <span v-else-if="$slots.helpText" :id="`${uniqueId}-help`" :class="[computedHelpClass]"
      :style="{ width: containerWidth }">
      <slot name="helpText"></slot>
    </span>
  </div>
</template>

<style scoped></style>
