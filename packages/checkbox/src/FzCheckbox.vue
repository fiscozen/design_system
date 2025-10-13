<script setup lang="ts">
/**
 * FzCheckbox Component
 *
 * A fully accessible checkbox component with support for single selection (boolean),
 * multi-selection (array), indeterminate states, and hierarchical relationships.
 *
 * @component
 * @example
 * // Single checkbox (boolean)
 * <FzCheckbox v-model="accepted" label="I accept terms" />
 *
 * @example
 * // Multi-select checkbox (array)
 * <FzCheckbox v-model="selectedItems" value="item1" label="Item 1" />
 *
 * @example
 * // Indeterminate checkbox (parent with children)
 * <FzCheckbox v-model="selection" :indeterminate="true" label="Select All" />
 */
import { computed, onMounted, shallowRef } from "vue";
import { FzCheckboxProps } from "./types";
import {
  mapSizeToClasses,
  CHECKBOX_ICONS,
  CHECKBOX_ICON_VARIANTS,
} from "./common";
import { generateCheckboxId } from "./utils";
import { FzIcon } from "@fiscozen/icons";
import { FzTooltip } from "@fiscozen/tooltip";
import { FzAlert } from "@fiscozen/alert";

const props = withDefaults(defineProps<FzCheckboxProps>(), {
  size: "md",
  indeterminate: false,
});

/**
 * Computes the actual value to use for the checkbox.
 * Falls back to label if no explicit value is provided.
 */
const currentValue = computed(() => props.value ?? props.label);

/**
 * Unique identifier for the checkbox input.
 * Uses provided checkboxId prop if available, otherwise generates unique ID
 * using timestamp + random suffix strategy.
 * Deterministic IDs are important for aria-owns relationships in hierarchical structures.
 */
const id = props.checkboxId || generateCheckboxId();

/**
 * Two-way binding for checkbox state.
 * Supports three modes:
 * - null/undefined: Uncontrolled state
 * - boolean: Single checkbox (true/false)
 * - array: Multi-select checkbox group (contains values of checked items)
 */
const model = defineModel<
  null | undefined | boolean | (string | number | boolean)[]
>({
  required: true,
});

const emit = defineEmits(["change"]);

/**
 * Reference to the native checkbox input element.
 * Uses shallowRef for optimal performance with DOM element references.
 * ShallowRef avoids deep reactivity tracking of all DOM element properties.
 *
 * @see https://vuejs.org/api/reactivity-advanced.html#shallowref
 * @note When upgrading to Vue 3.5+, consider migrating to useTemplateRef()
 */
const refCheckbox = shallowRef<HTMLInputElement | null>(null);

/**
 * CSS classes for the hidden native checkbox input.
 * Uses "peer" for Tailwind's peer selector to style adjacent elements based on input state.
 * Input is visually hidden but remains accessible to screen readers and keyboard navigation.
 */
const staticInputClass = "w-0 h-0 peer fz-hidden-input";

/**
 * CSS classes for the label element.
 * Includes focus ring styles that appear on the icon when the hidden input receives focus.
 * The pseudo-element (after:) creates a visible focus indicator for keyboard navigation.
 */
const staticLabelClass = `
  flex gap-4 items-center hover:cursor-pointer text-core-black
  peer-focus:[&_div]:after:border-1
  peer-focus:[&_div]:after:border-solid
  peer-focus:[&_div]:after:rounded-[3px]
  peer-focus:[&_div]:after:border-blue-500
  peer-focus:[&_div]:after:content-['']
  peer-focus:[&_div]:after:top-0
  peer-focus:[&_div]:after:left-0
  peer-focus:[&_div]:after:right-0
  peer-focus:[&_div]:after:bottom-0
  peer-focus:[&_div]:after:absolute
`;

/** Position context for the focus ring pseudo-element */
const staticIconClass = "relative";

/**
 * Determines if the checkbox is currently checked.
 * Handles both boolean and array models:
 * - Boolean model: Returns the boolean value directly
 * - Array model: Returns true if the array contains this checkbox's value
 * - Null/undefined: Returns false
 */
const isChecked = computed(() => {
  if (model.value == null) return false;

  if (typeof model.value === "boolean") {
    return model.value;
  } else {
    return model.value.includes(currentValue.value);
  }
});

/** Dynamic label classes based on size and state (disabled, error, emphasis) */
const computedLabelClass = computed(() => [
  mapSizeToClasses[props.size],
  getTextClassForLabel(),
]);

/** Dynamic icon classes based on size and state */
const computedIconClasses = computed(() => [
  props.size === "sm" ? "mt-1" : "",
  getTextClassForIcon(),
]);

/**
 * Determines which FontAwesome icon to display:
 * - Indeterminate: square with minus (partial selection)
 * - Checked: square with check
 * - Unchecked: empty square
 */
const computedName = computed(() => {
  if (props.indeterminate) {
    return CHECKBOX_ICONS.INDETERMINATE;
  }

  return isChecked.value ? CHECKBOX_ICONS.CHECKED : CHECKBOX_ICONS.UNCHECKED;
});

/**
 * FontAwesome icon variant:
 * - "fas" (solid): For checked or indeterminate states
 * - "far" (regular): For unchecked state
 */
const computedVariant = computed(() => {
  return props.indeterminate || isChecked.value
    ? CHECKBOX_ICON_VARIANTS.SOLID
    : CHECKBOX_ICON_VARIANTS.REGULAR;
});

/**
 * Computes text color classes for the label based on checkbox state.
 * Priority order: disabled > error > emphasis > default
 *
 * @returns Tailwind CSS classes for label text color
 */
const getTextClassForLabel = () => {
  switch (true) {
    case props.disabled:
      return "text-grey-300";
    case props.error:
      return "text-semantic-error";
    case props.emphasis:
      // Emphasis mode: icon changes to blue when checked/indeterminate
      return "text-core-black peer-checked:[&_div]:text-blue-500 peer-indeterminate:[&_div]:text-blue-500";
    default:
      return "text-core-black";
  }
};

/**
 * Computes text color classes for the checkbox icon.
 * Priority order: disabled > error > default
 * Note: Emphasis state falls through to default (grey) for unchecked state
 *
 * @returns Tailwind CSS classes for icon color
 */
const getTextClassForIcon = () => {
  switch (true) {
    case props.disabled:
      return "text-grey-300";
    case props.error:
      return "text-semantic-error";
    case props.emphasis:
    default:
      return "text-grey-500";
  }
};

/**
 * Lifecycle hook: Triggers change event on mount if checkbox is initially checked.
 * This ensures that any parent components listening to change events receive
 * initial state, which is particularly important for parent checkboxes that need
 * to synchronize with their children's initial state.
 */
onMounted(() => {
  if (model.value == null) return;

  // Boolean model: dispatch change if true
  if (typeof model.value === "boolean") {
    if (model.value) refCheckbox.value?.dispatchEvent(new Event("change"));
  }
  // Array model: dispatch change if this checkbox's value is in the array
  else {
    if (model.value.includes(currentValue.value))
      refCheckbox.value?.dispatchEvent(new Event("change"));
  }
});
</script>

<template>
  <!-- Root container: vertical layout with consistent spacing -->
  <div class="flex justify-center flex-col w-fit gap-4">
    <!-- Checkbox row: input + label + optional tooltip -->
    <div class="flex gap-0 items-center">
      <!-- 
        Native checkbox input (visually hidden but functionally present)
        - Maintains native keyboard navigation and form behavior
        - Screen readers can interact with it normally
        - Styled via adjacent label and icon using Tailwind's "peer" selector
      -->
      <input
        type="checkbox"
        :id="id"
        :disabled="disabled"
        :class="staticInputClass"
        :required="required"
        :value="value"
        @change="emit('change', $event)"
        v-model="model"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-label="label"
        :aria-required="required"
        :aria-invalid="error"
        :aria-describedby="error ? `${id}-error` : undefined"
        :aria-labelledby="standalone ? undefined : `${id}-label`"
        :aria-owns="props.ariaOwns"
        ref="refCheckbox"
      />
      <!-- 
        Label element: provides click target and visual representation
        Connected to hidden input via "for" attribute
      -->
      <label
        :id="`${id}-label`"
        :for="id"
        :class="[staticLabelClass, computedLabelClass]"
      >
        <!-- 
          Visual checkbox icon (replaces hidden native checkbox)
          aria-hidden because it's purely decorative - the native input conveys state
          @TODO: When FzIcon natively supports ariaHidden prop, remove aria-hidden as HTML attribute and use :aria-hidden as prop
        -->
        <FzIcon
          :name="computedName"
          :size="size"
          :class="[staticIconClass, computedIconClasses]"
          :variant="computedVariant"
          aria-hidden="true"
        />
        <!-- Label text (hidden in standalone mode for checkbox-only display) -->
        <template v-if="!standalone">{{ label }}</template>
      </label>

      <!-- 
        Optional tooltip for additional context
        @TODO: When FzTooltip supports keyboard accessibility and ARIA attributes (role="tooltip", aria-describedby), update implementation
      -->
      <FzTooltip v-if="tooltip" v-bind="tooltip" class="ml-4">
        <!-- 
          Info icon (informative, not decorative)
          Has role="img" and aria-label because it conveys meaning
          @TODO: When FzIcon natively supports role and ariaLabel props, use them instead of HTML attributes
        -->
        <FzIcon
          name="info-circle"
          :size="size"
          class="text-semantic-info"
          role="img"
          aria-label="Informazioni aggiuntive"
        />
      </FzTooltip>
    </div>
    <!-- 
      Error message display
      Uses ARIA live region to announce errors to screen readers immediately
      - role="alert": Identifies as important message
      - aria-live="assertive": Interrupts current screen reader announcement
      - aria-atomic="true": Reads entire message, not just changes
      @TODO: When FzAlert natively supports role, ariaLive, ariaAtomic as props, remove HTML attributes and use typed props
    -->
    <FzAlert
      v-if="error && $slots.error"
      :id="`${id}-error`"
      :size="size"
      type="error"
      alertStyle="simple"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <slot name="error" />
    </FzAlert>

    <!-- 
      Children slot for nested checkboxes
      Used by FzCheckboxGroupOption to render child checkboxes
    -->
    <slot name="children" />
  </div>
</template>

<style scoped>
/**
 * Visually hides the native checkbox input while keeping it accessible.
 * 
 * Why not display:none or visibility:hidden?
 * - Those would remove the input from the accessibility tree
 * - Screen readers couldn't interact with it
 * - Keyboard navigation would be broken
 * 
 * This approach:
 * - Maintains accessibility tree presence
 * - Preserves keyboard focus capability
 * - Allows screen reader interaction
 * - Enables form submission behavior
 */
.fz-hidden-input {
  opacity: 0;
  margin: 0;
  height: 0;
  border: 0 none;
  appearance: none;
}
</style>
