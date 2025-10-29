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
import { computed, onMounted, shallowRef, watch } from "vue";
import { FzCheckboxProps } from "./types";
import { generateCheckboxId } from "./utils";
import { FzIcon, type IconVariant } from "@fiscozen/icons";
import { FzTooltip } from "@fiscozen/tooltip";
import ErrorAlert from "./components/ErrorAlert.vue";

const props = withDefaults(defineProps<FzCheckboxProps>(), {
  indeterminate: false,
});

/**
 * Deprecation warning for size prop.
 * Watches the size prop and warns once on mount if it's provided.
 * Using watch with immediate:true ensures the warning only fires once per component instance.
 */
watch(
  () => props.size,
  (size) => {
    if (size !== undefined) {
      console.warn(
        '[FzCheckbox] The "size" prop is deprecated and will be removed in a future version. Checkboxes now have a fixed size.'
      );
    }
  },
  { immediate: true }
);

/**
 * FontAwesome icon names for different checkbox states.
 * Frozen for optimal memory usage - string literals are interned once and reused.
 *
 * @constant
 *
 * @example
 * const icon = isChecked ? CHECKBOX_ICONS.CHECKED : CHECKBOX_ICONS.UNCHECKED;
 */
const CHECKBOX_ICONS = Object.freeze({
  /** Icon for indeterminate state (partial selection) */
  INDETERMINATE: "square-minus",
  /** Icon for checked state */
  CHECKED: "square-check",
  /** Icon for unchecked state */
  UNCHECKED: "square",
} as const);

/**
 * FontAwesome icon variant prefixes for checkbox icons.
 *
 * @constant
 */
const CHECKBOX_ICON_VARIANTS = Object.freeze({
  /** Solid variant (filled) - used for checked and indeterminate states */
  SOLID: "fas",
  /** Regular variant (outline) - used for unchecked state */
  REGULAR: "far",
} as const);

/**
 * Computes the actual value to use for the checkbox.
 * Falls back to label if no explicit value is provided.
 */
const currentValue = computed<string | number | boolean>(
  () => props.value ?? props.label
);

/**
 * Unique identifier for the checkbox input.
 * Uses provided checkboxId prop if available, otherwise generates unique ID
 * using timestamp + random suffix strategy.
 * Deterministic IDs are important for aria-owns relationships in hierarchical structures.
 */
const id: string = props.checkboxId || generateCheckboxId();

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

const emit = defineEmits<{
  change: [event: Event];
}>();

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
const staticInputClass: string = "w-0 h-0 peer fz-hidden-input";

/**
 * CSS classes for the label element.
 * Includes focus ring styles.
 *
 * Focus: blue-200 border appears around checkbox icon
 *
 * Items aligned to start (top) for proper alignment with long multi-line labels.
 */
const staticLabelClass: string = `
  flex gap-6 items-start hover:cursor-pointer text-core-black
  peer-focus:[&_div]:after:border-1
  peer-focus:[&_div]:after:border-solid
  peer-focus:[&_div]:after:rounded-[2px]
  peer-focus:[&_div]:after:border-blue-200
  peer-focus:[&_div]:after:content-['']
  peer-focus:[&_div]:after:top-0
  peer-focus:[&_div]:after:left-0
  peer-focus:[&_div]:after:right-0
  peer-focus:[&_div]:after:bottom-0
  peer-focus:[&_div]:after:absolute
`;

/** Position context for the focus ring pseudo-element */
const staticIconClass: string = "relative";

/**
 * Determines if the checkbox is currently checked.
 * Handles both boolean and array models:
 * - Boolean model: Returns the boolean value directly
 * - Array model: Returns true if the array contains this checkbox's value
 * - Null/undefined: Returns false
 */
const isChecked = computed<boolean>(() => {
  if (model.value == null) return false;

  if (typeof model.value === "boolean") {
    return model.value;
  } else {
    return model.value.includes(currentValue.value);
  }
});

/**
 * Computes text color classes for the label and checkbox icon.
 *
 * Uses peer-checked and peer-indeterminate selectors to apply colors based on input state.
 *
 * Priority order (highest to lowest):
 * 1. Disabled: grey-300 (label + checkbox)
 * 2. Error: semantic-error-200 (label + checkbox, all states)
 * 3. Emphasis: blue-500 (checkbox when checked/indeterminate)
 * 4. Checked/Indeterminate: grey-500 (checkbox only)
 * 5. Unchecked: grey-400 (checkbox only, handled by textClassForIcon)
 *
 * @returns Tailwind CSS classes for label text and checkbox icon
 */
const textClassForLabel = computed<string>(() => {
  // Priority 1: Disabled
  if (props.disabled) {
    return "text-grey-300 [&_div]:text-grey-300";
  }

  // Priority 2: Error (overrides everything except disabled)
  // Red for checkbox icon AND label text (all states: unchecked, checked, indeterminate)
  if (props.error) {
    return "text-semantic-error-200 [&_div]:text-semantic-error-200 peer-checked:[&_div]:text-semantic-error-200 peer-indeterminate:[&_div]:text-semantic-error-200";
  }

  // Priority 3: Emphasis (blue-500 when checked/indeterminate)
  // Force blue color even for indeterminate state
  if (props.emphasis) {
    return "text-core-black [&_div]:text-blue-500 peer-checked:[&_div]:text-blue-500 peer-indeterminate:[&_div]:text-blue-500";
  }

  // Priority 4-5: Default (grey-500 when checked/indeterminate, grey-400 when unchecked)
  // Hover: implemented in CSS (see <style> section)
  return "text-core-black peer-checked:[&_div]:text-grey-500 peer-indeterminate:[&_div]:text-grey-500";
});

/**
 * Computes base text color for the checkbox icon.
 *
 * Handles disabled, error, and emphasis states. Default unchecked color is grey-400.
 * Checked/indeterminate colors are controlled by textClassForLabel via peer-checked/peer-indeterminate.
 *
 * Priority order:
 * 1. Disabled: grey-300
 * 2. Error: semantic-error-200
 * 3. Emphasis: blue-500 (all states)
 * 4-5. Default: grey-400 (unchecked)
 *
 * @returns Tailwind CSS class for checkbox icon color
 */
const textClassForIcon = computed<string>(() => {
  // Priority 1: Disabled
  if (props.disabled) {
    return "text-grey-300";
  }

  // Priority 2: Error
  if (props.error) {
    return "text-semantic-error-200";
  }

  // Priority 3: Emphasis (blue-500 for all states)
  if (props.emphasis) {
    return "text-blue-500";
  }

  // Priority 4-5: Default unchecked (grey-400)
  // Checked/indeterminate colors are controlled by textClassForLabel
  return "text-grey-400";
});

/** Dynamic label classes based on state (disabled, error, emphasis) */
const computedLabelClass = computed<string[]>(() => [
  "text-base",
  textClassForLabel.value,
]);

/** Dynamic icon classes based on size and state */
const computedIconClasses = computed<string[]>(() => [textClassForIcon.value]);

/**
 * Determines which FontAwesome icon to display:
 * - Indeterminate: square with minus (partial selection)
 * - Checked: square with check
 * - Unchecked: empty square
 */
const computedIconName = computed<string>(() => {
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
const computedVariant = computed<IconVariant>(() => {
  return props.indeterminate || isChecked.value
    ? CHECKBOX_ICON_VARIANTS.SOLID
    : CHECKBOX_ICON_VARIANTS.REGULAR;
});

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
    <!-- Checkbox row: input + label + optional tooltip, aligned to top for long labels -->
    <!-- Hover effects are handled in CSS using data attributes -->
    <div
      class="flex items-start group"
      :data-emphasis="emphasis || undefined"
      :data-error="error || undefined"
      :data-disabled="disabled || undefined"
    >
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
        :aria-label="standalone ? label : undefined"
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
          :name="computedIconName"
          size="md"
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
      <FzTooltip v-if="tooltip" v-bind="tooltip" class="ml-6">
        <!-- 
          Info icon (informative, not decorative)
          Has role="img" and aria-label because it conveys meaning
          @TODO: When FzIcon natively supports role and ariaLabel props, use them instead of HTML attributes
        -->
        <FzIcon
          name="info-circle"
          size="md"
          class="text-semantic-info"
          role="img"
          aria-label="Informazioni aggiuntive"
        />
      </FzTooltip>
    </div>
    <!-- Error message display with accessible ARIA live region -->
    <ErrorAlert v-if="error && $slots.error" :id="`${id}-error`" size="md">
      <slot name="error" />
    </ErrorAlert>

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

/**
 * Hover effects for checkbox icon and label.
 * 
 * Uses data attributes (data-emphasis, data-error, data-disabled) and pseudo-classes
 * (:checked, :indeterminate) to apply hover colors based on state.
 * 
 * Priority order (highest to lowest):
 * 1. Disabled: no hover effect
 * 2. Error: semantic-error-300 (checkbox + label, all states)
 * 3. Emphasis: blue-600 (checkbox only, all states)
 * 4. Checked/Indeterminate: core-black (checkbox only, no emphasis/error)
 * 5. Unchecked: blue-600 (checkbox only, no emphasis/error)
 */

/* Priority 1: Disabled - no hover (no rule needed) */

/* Priority 2: Error hover (all states): semantic-error-300 for checkbox AND label */
.group[data-error]:hover:not([data-disabled]) .peer ~ label > div {
  color: var(--semantic-error-300) !important;
}
.group[data-error]:hover:not([data-disabled]) .peer ~ label {
  color: var(--semantic-error-300) !important;
}

/* Priority 3: Emphasis hover (all states): blue-600 */
.group[data-emphasis]:hover:not([data-disabled]):not([data-error])
  .peer
  ~ label
  > div {
  color: var(--blue-600) !important;
}

/* Priority 4: Checked hover (no emphasis, no error): core-black */
.group:hover:not([data-emphasis]):not([data-error]):not([data-disabled])
  .peer:checked
  ~ label
  > div {
  color: var(--core-black) !important;
}

/* Priority 4: Indeterminate hover (no emphasis, no error): core-black */
.group:hover:not([data-emphasis]):not([data-error]):not([data-disabled])
  .peer:indeterminate
  ~ label
  > div {
  color: var(--core-black) !important;
}

/* Priority 5: Unchecked hover (no emphasis, no error): blue-600 */
.group:hover:not([data-emphasis]):not([data-error]):not([data-disabled])
  .peer:not(:checked):not(:indeterminate)
  ~ label
  > div {
  color: var(--blue-600) !important;
}
</style>
