<template>
  <component
    :is="componentTag"
    ref="actionElement"
    v-bind="boundAttrs"
    :class="baseClasses"
    :aria-label="ariaLabel"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <template v-if="variant === 'textLeft'">
      <FzIcon
        v-if="iconLeftName"
        :name="iconLeftName"
        :variant="iconLeftVariant"
        size="md"
        :class="iconClasses"
        :aria-hidden="isIconDecorative"
      />
      <div class="flex flex-1 flex-col gap-4 overflow-hidden">
        <span
          v-if="label || $slots.default"
          :class="labelClasses"
          :title="label"
        >
          <slot>{{ label }}</slot>
        </span>
        <span v-if="subLabel" :class="subLabelClasses" :title="subLabel">
          {{ subLabel }}
        </span>
      </div>
      <FzIcon
        v-if="iconRightName"
        :name="iconRightName"
        :variant="iconRightVariant"
        size="md"
        :class="iconClasses"
        :aria-hidden="isIconDecorative"
      />
    </template>
    <div
      v-else-if="variant === 'textCenter'"
      class="flex flex-col items-center gap-4 overflow-hidden"
    >
      <div class="flex items-center gap-8">
        <FzIcon
          v-if="iconLeftName"
          :name="iconLeftName"
          :variant="iconLeftVariant"
          size="md"
          :class="iconClasses"
          :aria-hidden="isIconDecorative"
        />

        <span
          v-if="label || $slots.default"
          :class="labelClasses"
          :title="label"
        >
          <slot>{{ label }}</slot>
        </span>

        <FzIcon
          v-if="iconRightName"
          :name="iconRightName"
          :variant="iconRightVariant"
          size="md"
          :class="iconClasses"
          :aria-hidden="isIconDecorative"
        />
      </div>
      <span v-if="subLabel" :class="subLabelClasses" :title="subLabel">
        {{ subLabel }}
      </span>
    </div>
    <FzIcon
      v-else-if="variant === 'onlyIcon' && iconName"
      :name="iconName"
      :variant="iconVariant"
      size="md"
      :class="iconClasses"
      :aria-hidden="isIconDecorative"
    />
  </component>
</template>

<script setup lang="ts">
/**
 * FzAction Component
 *
 * Versatile action component that can render as either a button or link.
 * Supports multiple variants (textLeft, textCenter, onlyIcon) and environments (backoffice, frontoffice).
 *
 * Key features:
 * - Configurable ARIA roles (e.g., "option", "menuitem") for accessibility
 * - Support for disabled and readonly states
 * - Icon positioning (left, right, or icon-only)
 * - Text truncation with ellipsis
 * - Keyboard navigation support with focus management
 *
 * @component
 * @example
 * // As a button action
 * <FzAction type="action" variant="textLeft" label="Click me" />
 *
 * @example
 * // As a listbox option (used in FzSelect)
 * <FzAction
 *   type="action"
 *   variant="textLeft"
 *   label="Option 1"
 *   role="option"
 *   :ariaSelected="true"
 * />
 *
 * @example
 * // As a menu item
 * <FzAction type="action" variant="textLeft" label="Edit" role="menuitem" />
 */
import { computed, ref } from "vue";
import { FzIcon } from "@fiscozen/icons";
import { FzLink } from "@fiscozen/link";
import type { FzActionProps } from "./types";
import { useActionClasses } from "./composables/useActionClasses";

const props = withDefaults(defineProps<FzActionProps>(), {
  type: "action",
  environment: "backoffice",
  variant: "textLeft",
  disabled: false,
  readonly: false,
  isTextTruncated: false,
  focused: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  keydown: [event: KeyboardEvent];
}>();

const actionElement = ref<HTMLElement>();

const { baseClasses, iconClasses, labelClasses, subLabelClasses } =
  useActionClasses(props);

/*
  Those computed properties are necessary to avoid type errors when using the component with the different variants.
  Using directly props values inside the template would cause type errors.
*/
const iconName = computed(() => {
  if (props.variant === "onlyIcon") {
    return props.iconName;
  }
  return undefined;
});

const iconVariant = computed(() => {
  if (props.variant === "onlyIcon") {
    return props.iconVariant;
  }
  return undefined;
});

const iconLeftName = computed(() => {
  if (props.variant === "textLeft" || props.variant === "textCenter") {
    return props.iconLeftName;
  }
  return undefined;
});

const iconLeftVariant = computed(() => {
  if (props.variant === "textLeft" || props.variant === "textCenter") {
    return props.iconLeftVariant;
  }
  return undefined;
});

const iconRightName = computed(() => {
  if (props.variant === "textLeft" || props.variant === "textCenter") {
    return props.iconRightName;
  }
  return undefined;
});

const iconRightVariant = computed(() => {
  if (props.variant === "textLeft" || props.variant === "textCenter") {
    return props.iconRightVariant;
  }
  return undefined;
});

/**
 * Computed aria-label for accessibility
 * - For icon-only variant: combine label/subLabel/iconName
 * - For links with text: only add if external (to indicate new window)
 * - For buttons with text: not needed (text is visible)
 */
const ariaLabel = computed(() => {
  // Icon-only variant always needs aria-label
  if (props.variant === "onlyIcon") {
    const parts = [];
    if (props.label) parts.push(props.label);
    if (props.subLabel) parts.push(props.subLabel);
    if (parts.length === 0 && iconName.value) parts.push(iconName.value);
    return parts.join(". ") || undefined;
  }

  // For external links, add indication that it opens in new window
  if (props.type === "link" && props.external && props.target === "_blank") {
    const parts = [];
    if (props.label) parts.push(props.label);
    if (props.subLabel) parts.push(props.subLabel);
    if (parts.length > 0) {
      return `${parts.join(". ")} (opens in new window)`;
    }
  }

  // When there's visible text, aria-label is not needed
  // (screen readers will read the visible text)
  return undefined;
});

/**
 * Check if icon should be hidden from screen readers
 * Icons are decorative when:
 * - There's visible text (label/subLabel), OR
 * - There's an aria-label (screen reader will read that instead)
 */
const isIconDecorative = computed(() => {
  // If there's visible text, icon is decorative
  if (props.label || props.subLabel) return true;

  // If there's an aria-label, icon is decorative (screen reader reads aria-label)
  if (ariaLabel.value) return true;

  // Otherwise, icon provides meaning and should not be hidden
  return false;
});

/**
 * Computes tabindex value based on component state and role
 *
 * Priority:
 * 1. Explicit override via tabindex prop
 * 2. Not interactive (disabled/readonly) → -1
 * 3. role="option" → 0 if focused, -1 otherwise (for custom focus management in listboxes)
 * 4. Other roles → 0 if focused, undefined otherwise (browser default for standalone use)
 */
const computedTabindex = computed(() => {
  // Explicit override takes precedence
  if (props.tabindex !== undefined) {
    return props.tabindex;
  }

  const isInteractive = !props.disabled && !props.readonly;

  // Non-interactive elements are not tabbable
  if (!isInteractive) {
    return -1;
  }

  // For role="option" (e.g., in FzSelect), only focused option is tabbable
  if (props.role === "option") {
    return props.focused ? 0 : -1;
  }

  // For other roles, use browser default (undefined) unless explicitly focused
  return props.focused ? 0 : undefined;
});

/**
 * Computes bound attributes for the component
 *
 * Includes ARIA attributes for accessibility:
 * - role: Configurable ARIA role (e.g., "option", "menuitem")
 * - aria-disabled: Always present with explicit "true"/"false" values
 * - aria-selected: Only added when explicitly provided (for role="option")
 * - tabindex: Computed based on interactive state, role, and focus (see computedTabindex)
 *
 * For button type: adds type="button" and disabled attribute
 * For link type: adds router-link props (to, replace, target, etc.)
 */
const boundAttrs = computed(() => {
  const isInteractive = !props.disabled && !props.readonly;

  const baseAriaAttributes: Record<
    string,
    string | number | boolean | undefined
  > = {
    id: props.id,
    "aria-disabled": isInteractive ? "false" : "true",
    tabindex: computedTabindex.value,
    role: props.role,
  };

  // Add aria-selected only if explicitly provided (for role="option")
  if (props.ariaSelected !== undefined) {
    baseAriaAttributes["aria-selected"] = props.ariaSelected ? "true" : "false";
  }

  // For button type, include disabled attribute when disabled is true
  if (props.type === "action") {
    const buttonAttrs: Record<string, string | number | boolean | undefined> = {
      ...baseAriaAttributes,
      type: "button",
    };

    // Set disabled attribute for buttons when props.disabled is true
    // This ensures native HTML disabled behavior, preventing all interactions
    // (click, keyboard, programmatic) regardless of tabindex value
    if (props.disabled) {
      buttonAttrs.disabled = true;
    }

    return buttonAttrs;
  }

  // For non-interactive links, return early with just ARIA attributes
  if (!isInteractive) {
    return {
      ...baseAriaAttributes,
    };
  }

  return {
    ...baseAriaAttributes,
    to: props.to,
    replace: props.replace,
    target: props.target,
    external: props.external,
    meta: props.meta,
  };
});

// Computed properties
const componentTag = computed(() => {
  return props.type === "action" ? "button" : FzLink;
});

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.readonly) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (props.type !== "action") return;

  emit("click", event);
};

/**
 * Handle keyboard events for accessibility
 * - Enter and Space should trigger click for buttons
 * - Disabled and readonly elements should not respond to keyboard
 * - Navigation keys (arrows, Home, End, Tab) are allowed to bubble up
 *   for parent components to handle (e.g., FzSelect navigation)
 *   This applies even when disabled/readonly to allow keyboard navigation traversal
 */
const handleKeydown = (event: KeyboardEvent) => {
  // Navigation keys should always bubble up, even for disabled/readonly elements
  // This allows parent components to handle navigation (e.g., Tab traversal)
  const navigationKeys = [
    "ArrowDown",
    "ArrowUp",
    "Home",
    "End",
    "Tab",
    "Escape",
  ];
  if (navigationKeys.includes(event.key)) {
    // Let the event bubble up to parent handlers (even if disabled/readonly)
    return;
  }

  // For disabled/readonly elements, prevent other keyboard events
  if (props.disabled || props.readonly) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  // Only handle keyboard for button type
  if (props.type !== "action") return;

  // Enter or Space should trigger keydown
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("keydown", event);
  }
};

// Expose the action element for parent components to access
defineExpose({
  actionElement,
});
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
