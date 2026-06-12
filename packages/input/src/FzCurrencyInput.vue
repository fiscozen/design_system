<script setup lang="ts">
/**
 * FzCurrencyInput Component
 *
 * @deprecated Use `<FzInput type="currency">` instead: the currency behavior now
 * lives in FzInput. This wrapper is kept for backwards compatibility until the
 * migration of all consumers is complete and forwards everything to
 * `<FzInput type="currency">`.
 *
 * @component
 * @example
 * <FzCurrencyInput label="Amount" v-model="value" :min="0" :max="1000" />
 */
import { computed, ref } from "vue";
import FzInput from "./FzInput.vue";
import { FzCurrencyInputProps } from "./types";

// Structural type: InstanceType<> is not applicable to generic components
const fzInputRef = ref<{
  inputRef: HTMLInputElement | null;
  containerRef: HTMLElement | null;
} | null>(null);

const containerRef = computed(() => fzInputRef.value?.containerRef);

const inputRef = computed(() => fzInputRef.value?.inputRef);

const props = defineProps<FzCurrencyInputProps>();

// DOM events (@focus, @blur, @keydown, …) propagate via v-bind fallthrough on the
// inner FzInput. @update:modelValue is handled by defineModel. Only custom events
// emitted explicitly by this component need to be declared here.
const emit = defineEmits<{
  "fzcurrencyinput:clear": [];
}>();
const model = defineModel<FzCurrencyInputProps["modelValue"]>();

/**
 * Adapter towards FzInput's currency model (`number | null | undefined`).
 * Deprecated string values are passed through unchanged: FzInput's currency mode
 * still parses them at runtime (with the same deprecation warning).
 */
const innerModel = computed({
  get: () => model.value as number | null | undefined,
  set: (value: number | null | undefined) => {
    model.value = value;
  },
});

defineExpose({
  inputRef,
  containerRef,
});
</script>

<template>
  <FzInput
    ref="fzInputRef"
    v-bind="props"
    type="currency"
    v-model="innerModel"
    @fzinput:clear="emit('fzcurrencyinput:clear')"
  >
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>
    <template v-if="$slots['left-icon']" #left-icon>
      <slot name="left-icon"></slot>
    </template>
    <template v-if="$slots.helpText" #helpText>
      <slot name="helpText"></slot>
    </template>
    <template v-if="$slots.errorMessage" #errorMessage>
      <slot name="errorMessage"></slot>
    </template>
  </FzInput>
</template>
