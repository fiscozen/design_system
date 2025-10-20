<script setup lang="ts">
/**
 * FzCheckboxGroup Component
 *
 * A container component for managing multiple related checkboxes as a group.
 * Provides group-level labeling, help text, error handling, and accessibility features.
 * Supports both flat checkbox lists and hierarchical parent-child structures.
 *
 * @component
 * @example
 * // Basic checkbox group
 * <FzCheckboxGroup
 *   v-model="selectedOptions"
 *   label="Choose options"
 *   :options="[
 *     { label: 'Option 1', value: 'opt1' },
 *     { label: 'Option 2', value: 'opt2' }
 *   ]"
 * />
 *
 * @example
 * // Hierarchical checkbox group with children
 * <FzCheckboxGroup
 *   v-model="selection"
 *   label="Select features"
 *   :options="[
 *     {
 *       label: 'All Features',
 *       value: 'all',
 *       children: [
 *         { label: 'Feature A', value: 'a' },
 *         { label: 'Feature B', value: 'b' }
 *       ]
 *     }
 *   ]"
 * />
 */
import { computed } from "vue";
import { FzCheckboxGroupProps } from "./types";
import { FzAlert } from "@fiscozen/alert";
import { mapSizeToClasses } from "./common";
import { generateGroupId } from "./utils";
import FzCheckboxGroupOption from "./components/FzCheckboxGroupOption.vue";

const props = defineProps<FzCheckboxGroupProps>();

/** Unique identifier for the checkbox group, used for ARIA relationships */
const id: string = generateGroupId();

/** Dynamic classes for help text based on size and disabled state */
const computedHelpTextClass = computed<string[]>(() => [
  props.size === "sm" ? "text-xs" : "text-sm",
  props.disabled ? "text-grey-400" : "text-grey-500",
]);

/**
 * Two-way binding for selected checkbox values.
 * Always an array of strings, even when empty.
 */
const model = defineModel<string[]>({
  required: true,
  default: [],
});

/** Base layout for the label element */
const staticLabeldClass: string = "flex flex-col";

/** Base layout for the root container */
const staticContainerClass: string = "flex flex-col gap-10";

/** Base layout for the checkboxes container */
const staticSlotContainerClass: string = "flex items-start";

/** Dynamic label classes based on size, spacing, and disabled state */
const computedLabelClass = computed<string[]>(() => [
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-4" : "",
  props.size === "md" ? "gap-6" : "",
  props.disabled ? "text-grey-400" : "text-core-black",
]);

/** Dynamic container classes with size-specific spacing */
const computedContainerClass = computed<string[]>(() => [
  mapSizeToClasses[props.size],
]);

/**
 * Dynamic classes for the checkbox container.
 * Handles both horizontal and vertical layouts with appropriate spacing.
 */
const computedSlotContainerClass = computed<string[]>(() => [
  mapSizeToClasses[props.size],
  props.size === "sm" ? "gap-6" : "",
  props.size === "md" ? (props.horizontal ? "gap-16" : "gap-8") : "",
  props.horizontal ? "flex-row" : "flex-col",
]);
</script>

<template>
  <!-- Root container for the entire checkbox group -->
  <div :class="[staticContainerClass, computedContainerClass]">
    <!-- 
      Group label with optional required indicator and help text
      Connected to checkbox group via aria-labelledby
    -->
    <label :id="id + '-label'" :class="[staticLabeldClass, computedLabelClass]">
      <!-- Main label text with required asterisk if applicable -->
      <span>{{ label }}<span v-if="required"> *</span></span>

      <!-- Optional help text slot for additional context -->
      <p :class="computedHelpTextClass" v-if="$slots.help">
        <slot name="help" />
      </p>
    </label>

    <!-- 
      Checkbox group container with ARIA group role
      - role="group": Identifies this as a group of related form controls
      - aria-labelledby: Links to the label element
      - aria-describedby: Links to error message when present
      - aria-required: Indicates if selection is mandatory
      - aria-invalid: Indicates validation state
    -->
    <div
      :class="[staticSlotContainerClass, computedSlotContainerClass]"
      :id="id"
      role="group"
      :aria-labelledby="id + '-label'"
      :aria-describedby="error && $slots.error ? id + '-error' : undefined"
      :aria-required="required"
      :aria-invalid="error"
    >
      <!-- 
        Render each checkbox option
        Supports both simple checkboxes and parent-child hierarchies
        Key uses value if available, falls back to label for uniqueness
      -->
      <FzCheckboxGroupOption
        v-for="option in options"
        :key="option.value ? option.value.toString() : option.label"
        v-model="model"
        :disabled="disabled"
        v-bind="option"
        :emphasis="emphasis"
        :error="error"
        :size="size"
      />
    </div>
    <!-- 
      Error message display with ARIA live region
      Announces validation errors immediately to screen readers
      - role="alert": High-priority message
      - aria-live="assertive": Interrupts current announcements
      - aria-atomic="true": Reads complete message
      
      @TODO: When FzAlert supports automatic ARIA handling based on `type` 
      (e.g., via an `announce` prop or similar semantic API), we can remove 
      these manual attributes.
      
      Proposed future API:
        FzAlert with type="error" and announce prop
        would automatically get role="alert" and aria-live="assertive"
    -->
    <FzAlert
      v-if="error && $slots.error"
      :id="id + '-error'"
      :size="size"
      type="error"
      alertStyle="simple"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <slot name="error" />
    </FzAlert>
  </div>
</template>
