<script setup lang="ts">
/**
 * FzTypeaheadOptionsList Component
 *
 * Presentational component for the FzTypeahead options list.
 * Renders the list of options with lazy loading support using FzActionList and FzAction.
 * All logic is delegated to the parent FzTypeahead component.
 *
 * @component
 * @internal
 */
import { ref } from "vue";
import { FzActionList, FzActionSection, FzAction } from "@fiscozen/action";
import { FzProgress } from "@fiscozen/progress";
import type { FzTypeaheadOptionsListProps } from "./types";
import type { FzTypeaheadOptionsProps, FzTypeaheadOptionProps } from "../types";

const props = defineProps<FzTypeaheadOptionsListProps>();

const emit = defineEmits<{
  select: [option: FzTypeaheadOptionProps];
  keydown: [event: KeyboardEvent];
  scroll: [];
  "register-ref": [value: string, element: HTMLElement | undefined];
}>();

const containerRef = ref<InstanceType<typeof FzActionList>>();

/**
 * Type guard to filter selectable options
 */
const isSelectableOption = (
  option: FzTypeaheadOptionsProps
): option is FzTypeaheadOptionProps => option.kind !== "label";

/**
 * Gets unique key for v-for iteration
 */
const getOptionKey = (option: FzTypeaheadOptionsProps): string =>
  option.kind === "label" ? option.label : option.value;

/**
 * Checks if option is a label separator
 */
const isLabelOption = (option: FzTypeaheadOptionsProps): boolean =>
  option.kind === "label";

/**
 * Gets check icon name for selected option
 */
const getCheckIcon = (option: FzTypeaheadOptionProps): string | undefined =>
  props.selectedValue === option.value ? "check" : undefined;

/**
 * Generates unique ID for an option element
 */
const getOptionId = (option: FzTypeaheadOptionProps) => {
  return `${props.openerId}-option-${option.value}`;
};

/**
 * Handles option selection
 * Delegates to parent component via emit
 */
const handleSelect = (option: FzTypeaheadOptionProps) => {
  emit("select", option);
};

/**
 * Creates a ref callback for FzAction components
 * Registers the action element with the parent for focus management
 */
const createActionRefCallback = (option: FzTypeaheadOptionProps) => {
  return (el: unknown) => {
    // Type guard: ensure el is a valid object with actionElement
    if (!el || typeof el !== "object" || !("actionElement" in el)) {
      emit("register-ref", option.value, undefined);
      return;
    }

    // Access actionElement exposed via defineExpose from FzAction
    const actionElement = (el as { actionElement?: HTMLElement }).actionElement;
    emit("register-ref", option.value, actionElement);
  };
};

/**
 * Expose containerElement for parent component to attach scroll listeners
 */
defineExpose({
  containerElement: containerRef,
});
</script>

<template>
  <FzActionList
    :style="{ minWidth: containerWidth, maxWidth: openerMaxWidth, maxHeight }"
    ref="containerRef"
    listClass="overflow-auto ml-[-2px] box-border max-h-min !gap-0"
    test-id="fztypeahead-options-container"
    role="listbox"
    :aria-labelledby="openerId"
    :aria-activedescendant="activeDescendantId"
    @keydown="emit('keydown', $event)"
    @scroll="emit('scroll')"
  >
    <template v-if="visibleOptions === undefined">
      <div class="flex justify-center items-center py-16">
        <FzProgress size="md" />
      </div>
    </template>
    <template v-else-if="visibleOptions.length">
      <template v-for="option in visibleOptions" :key="getOptionKey(option)">
        <FzActionSection v-if="isLabelOption(option)" :label="option.label" />
        <FzAction
          v-else-if="isSelectableOption(option)"
          :ref="createActionRefCallback(option)"
          type="action"
          variant="textLeft"
          environment="backoffice"
          :label="option.label"
          :subLabel="option.subtitle"
          :disabled="option.disabled"
          :readonly="option.readonly"
          :id="getOptionId(option)"
          :focused="focusedOptionValue === option.value"
          :isTextTruncated="!disableTruncate"
          :iconRightName="getCheckIcon(option)"
          role="option"
          :ariaSelected="selectedValue === option.value"
          @click="() => handleSelect(option)"
        />
      </template>
    </template>
    <template v-else>
      <FzAction
        type="action"
        variant="textLeft"
        environment="backoffice"
        :label="noResultsMessage"
        disabled
      />
    </template>
  </FzActionList>
</template>
