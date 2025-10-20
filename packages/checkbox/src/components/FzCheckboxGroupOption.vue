<script setup lang="ts">
/**
 * FzCheckboxGroupOption Component
 *
 * Renders a single checkbox option within a checkbox group, with support for
 * hierarchical parent-child relationships. When children are present, the parent
 * checkbox displays an indeterminate state when partially selected.
 *
 * Key features:
 * - Automatic indeterminate state management for parent checkboxes
 * - Bi-directional sync: parent controls children, children update parent
 * - ARIA relationships via aria-owns for accessibility
 * - Deterministic IDs for proper ARIA associations
 *
 * @component
 * @internal Used internally by FzCheckboxGroup, not intended for direct use
 */
import { computed } from "vue";
import FzCheckbox from "../FzCheckbox.vue";
import { ParentCheckbox } from "../types";
import { generateCheckboxId } from "../utils";

// Vue 3 compatibility config
FzCheckbox.compatConfig = {
  MODE: 3,
};

const props = defineProps<ParentCheckbox & { size: "sm" | "md" }>();

/** The actual value used for this checkbox (falls back to label if no value provided) */
const currentValue = computed<string | number | boolean>(
  () => props.value ?? props.label
);

/**
 * Two-way binding for selected values.
 * Shared with parent component and all sibling checkboxes.
 */
const model = defineModel<(string | number | boolean)[]>({
  required: true,
  default: [],
});

/**
 * Unique identifier for this parent checkbox.
 * Used as a prefix for child checkbox IDs to establish ARIA relationships.
 */
const parentId: string = generateCheckboxId();

/**
 * Computes space-separated list of child checkbox IDs.
 * Used for aria-owns attribute to establish semantic parent-child relationship.
 *
 * @returns Space-separated string of child IDs, or undefined if no children
 */
const childrenIds = computed<string | undefined>(() =>
  props.children?.map((child, index) => `${parentId}-child-${index}`).join(" ")
);

/** Base layout classes for the children container (indented and vertical) */
const staticChildContainerClass: string =
  "flex flex-col justify-center gap-8 pl-24";

/** Size-specific spacing for child checkboxes */
const computedChildContainerClasses = computed<string[]>(() => []);

/**
 * Determines if parent checkbox should be in indeterminate state.
 * Indeterminate means some, but not all, children are checked.
 *
 * States:
 * - No children: false (not indeterminate)
 * - No children checked: false (unchecked)
 * - All children checked: false (fully checked)
 * - Some children checked: true (indeterminate/partial)
 *
 * @returns true if parent should display indeterminate state
 */
const isIndeterminate = computed<boolean>(() => {
  if (!props.children) return false;

  const numChecked = props.children.filter((child) =>
    model.value.includes(child.value ?? child.label)
  ).length;
  return numChecked > 0 && numChecked < props.children.length;
});

/**
 * Handles child checkbox changes to update parent state.
 * Called when a child checkbox is toggled.
 *
 * Logic:
 * - If ALL children are now checked → add parent to selection
 * - If ANY child is unchecked → remove parent from selection
 *
 * Note: Uses concat() instead of push() to ensure Vue reactivity triggers.
 */
function handleCheckboxParentChange() {
  if (!props.children) return;

  const numChecked = props.children.filter((child) =>
    model.value.includes(child.value ?? child.label)
  ).length;

  if (numChecked === props.children.length) {
    // All children checked: add parent value to model if not already present
    if (!model.value.includes(currentValue.value)) {
      model.value = model.value.concat(currentValue.value);
    }
  } else {
    // Not all children checked: remove parent value if present
    if (model.value.includes(currentValue.value))
      model.value = model.value.filter((value) => value !== currentValue.value);
  }
}

/**
 * Handles parent checkbox changes to cascade to children.
 * Called when the parent checkbox is clicked.
 *
 * Cascade behavior:
 * - Parent checked → check all children
 * - Parent unchecked → uncheck all children
 *
 * Only modifies children that need changes (doesn't re-add already selected children).
 */
function onCheckboxParentChange() {
  if (!props.children) return;

  if (model.value.includes(currentValue.value)) {
    // Parent is checked: add all unchecked children to model
    model.value = model.value.concat(
      props.children
        ?.map((child) => child.value ?? child.label)
        .filter((value) => !model.value.includes(value))
    );
  } else {
    // Parent is unchecked: remove all children from model
    model.value = model.value.filter(
      (value) =>
        !props.children
          ?.map((child) => child.value ?? child.label)
          .includes(value)
    );
  }
}
</script>

<template>
  <!-- 
    Parent checkbox
    - Displays indeterminate state when children are partially selected
    - aria-owns links to child checkboxes for screen reader navigation
    - Change event cascades selection to all children
  -->
  <FzCheckbox
    v-model="model"
    :value="props.value"
    :label="props.label"
    :disabled="disabled"
    :emphasis="emphasis"
    :error="error"
    :size="size"
    :indeterminate="isIndeterminate"
    :aria-owns="children?.length ? childrenIds : undefined"
    @change="onCheckboxParentChange"
  >
    <!-- 
      Children slot: renders nested child checkboxes
      Only rendered if children array has items
    -->
    <template #children v-if="children?.length">
      <!-- Indented container for visual hierarchy -->
      <div :class="[staticChildContainerClass, computedChildContainerClasses]">
        <!-- 
          Child checkboxes
          - Assigned deterministic IDs matching those in parent's aria-owns
          - Change events update parent's indeterminate state
          - Share same v-model array with parent and siblings
        -->
        <FzCheckbox
          v-for="(child, index) in children"
          :key="child.value ? child.value.toString() : child.label"
          v-model="model"
          :disabled="disabled"
          v-bind="child"
          :emphasis="emphasis"
          :error="error"
          :size="size"
          :checkbox-id="`${parentId}-child-${index}`"
          @change="handleCheckboxParentChange"
        />
      </div>
    </template>
  </FzCheckbox>
</template>
