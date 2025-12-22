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
  focus: [value: string];
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
 * Gets tabindex for an option
 * When filtrable is true and focusedIndex is -1, the selected option (if any) should be focusable
 * Otherwise, only the focused option should be focusable
 *
 * Note: Disabled/readonly options can also receive focus (tabindex="0") when focused,
 * allowing keyboard navigation to traverse them even though they're not interactive.
 */
const getTabIndex = (option: FzTypeaheadOptionProps): number => {
  // If this is the focused option, it should be focusable (even if disabled/readonly)
  if (props.focusedOptionValue === option.value) {
    return 0;
  }
  // If no option is focused (focusedOptionValue is null) and this is the selected option,
  // it should be focusable (for filtrable: true case)
  if (
    props.focusedOptionValue === null &&
    props.selectedValue === option.value
  ) {
    return 0;
  }
  // Otherwise, not focusable
  return -1;
};

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
 * Handles option focus event
 * Updates focusedIndex in parent when user tabs to an option
 */
const handleOptionFocus = (option: FzTypeaheadOptionProps) => {
  emit("focus", option.value);
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
          :isTextTruncated="!disableTruncate"
          :iconRightName="getCheckIcon(option)"
          role="option"
          :tabindex="getTabIndex(option)"
          :ariaSelected="selectedValue === option.value"
          @click="() => handleSelect(option)"
          @focus="() => handleOptionFocus(option)"
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
