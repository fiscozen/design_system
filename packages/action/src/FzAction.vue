<template>
  <component
    :is="componentTag"
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
import { computed } from "vue";
import { FzIcon } from "@fiscozen/icons";
import { FzLink } from "@fiscozen/link";
import type { FzActionProps } from "./types";
import { useActionClasses } from "./composables/useActionClasses";

const props = withDefaults(defineProps<FzActionProps>(), {
  type: "action",
  environment: "backoffice",
  variant: "textLeft",
  disabled: false,
  isTextTruncated: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
  keydown: [event: KeyboardEvent];
}>();

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

const boundAttrs = computed(() => {
  const baseAriaAttributes: Record<string, string | undefined> = {
    "aria-disabled": props.disabled ? "true" : "false",
    tabindex: props.disabled ? "-1" : undefined,
  };

  if (props.disabled) {
    return {
      ...baseAriaAttributes,
    };
  }

  if (props.type === "action") {
    return {
      ...baseAriaAttributes,
      type: "button",
      disabled: props.disabled,
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
  if (props.disabled) {
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
 * - Disabled elements should not respond to keyboard
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) {
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
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
