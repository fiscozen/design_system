<script setup lang="ts">
/**
 * FzSelectOptionsList Component
 *
 * Presentational component for the options list with lazy loading support.
 *
 * @component
 * @internal
 */
import { ref } from "vue";
import { FzActionList, FzActionSection, FzAction } from "@fiscozen/action";
import { FzProgress } from "@fiscozen/progress";
import type { FzSelectOptionsListProps } from "./types";
import type { FzSelectOptionsProps, FzSelectOptionProps } from "../types";

const props = defineProps<FzSelectOptionsListProps>();

const emit = defineEmits<{
  select: [option: FzSelectOptionProps];
  keydown: [event: KeyboardEvent];
  scroll: [];
  "register-ref": [value: string, element: HTMLElement | undefined];
  focus: [value: string];
}>();

const containerRef = ref<InstanceType<typeof FzActionList>>();

const isSelectableOption = (
  option: FzSelectOptionsProps
): option is FzSelectOptionProps => option.kind !== "label";

const getOptionKey = (option: FzSelectOptionsProps): string =>
  option.kind === "label" ? option.label : option.value;

const isLabelOption = (option: FzSelectOptionsProps): boolean =>
  option.kind === "label";

const getCheckIcon = (option: FzSelectOptionProps): string | undefined =>
  props.selectedValue === option.value ? "check" : undefined;

/**
 * Gets tabindex for an option
 *
 * Focused option is always focusable (tabindex="0"), including disabled/readonly.
 * When no option is focused, selected option is focusable (for filterable mode).
 */
const getTabIndex = (option: FzSelectOptionProps): number => {
  // If this is the focused option, it should be focusable (even if disabled/readonly)
  if (props.focusedOptionValue === option.value) {
    return 0;
  }
  // If no option is focused (focusedOptionValue is null) and this is the selected option,
  // it should be focusable (for filterable: true case)
  if (
    props.focusedOptionValue === null &&
    props.selectedValue === option.value
  ) {
    return 0;
  }
  // Otherwise, not focusable
  return -1;
};

const getOptionId = (option: FzSelectOptionProps) => {
  return `${props.openerId}-option-${option.value}`;
};

const handleSelect = (option: FzSelectOptionProps) => {
  emit("select", option);
};

const handleOptionFocus = (option: FzSelectOptionProps) => {
  emit("focus", option.value);
};

const createActionRefCallback = (option: FzSelectOptionProps) => {
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

defineExpose({
  containerElement: containerRef,
});
</script>

<template>
  <FzActionList
    :style="{ minWidth: containerWidth, maxWidth: openerMaxWidth, maxHeight }"
    ref="containerRef"
    listClass="overflow-auto ml-[-2px] box-border max-h-min !gap-0"
    test-id="fzselect-options-container"
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
