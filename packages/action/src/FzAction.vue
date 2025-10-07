<template>
  <component
    :is="componentTag"
    v-bind="boundAttrs"
    :class="baseClasses"
    @click="handleClick"
    :aria-label="label || subLabel || iconName"
  >
    <template v-if="variant === 'textLeft'">
      <FzIcon
        v-if="iconName && iconPosition === 'left'"
        :name="iconName"
        :variant="iconVariant"
        size="md"
        :class="iconClasses"
      />
      <div class="flex flex-col gap-4 overflow-hidden">
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
        v-if="iconName && iconPosition === 'right'"
        :name="iconName"
        :variant="iconVariant"
        size="md"
        :class="iconClasses"
      />
    </template>
    <div
      v-else-if="variant === 'textCenter'"
      class="flex flex-col items-center gap-4 overflow-hidden"
    >
      <div class="flex items-center gap-8">
        <FzIcon
          v-if="iconName && iconPosition === 'left'"
          :name="iconName"
          :variant="iconVariant"
          size="md"
          :class="iconClasses"
        />

        <span
          v-if="label || $slots.default"
          :class="labelClasses"
          :title="label"
        >
          <slot>{{ label }}</slot>
        </span>

        <FzIcon
          v-if="iconName && iconPosition === 'right'"
          :name="iconName"
          :variant="iconVariant"
          size="md"
          :class="iconClasses"
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
      aria-hidden="true"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FzIcon } from "@fiscozen/icons";
import { FzLink } from "@fiscozen/link";
import { FzActionProps } from "./types";
import { useActionClasses } from "./composables/useActionClasses";

const props = withDefaults(defineProps<FzActionProps>(), {
  type: "action",
  environment: "backoffice",
  variant: "textLeft",
  disabled: false,
  isTextTruncated: false,
  iconPosition: "right",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const { baseClasses, iconClasses, labelClasses, subLabelClasses } =
  useActionClasses(props);

const SPAN_ATTRS = {
  role: "presentation",
  "aria-disabled": "true",
};

const boundAttrs = computed(() => {
  if (props.disabled) return SPAN_ATTRS;

  if (props.type === "action") {
    return {
      type: "button",
      disabled: props.disabled,
    };
  }

  return {
    to: props.to,
    replace: props.replace,
    target: props.target,
    external: props.external,
    meta: props.meta,
  };
});

// Computed properties
const componentTag = computed(() => {
  if (props.disabled) return "span";

  return props.type === "action" ? "button" : FzLink;
});

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (props.type !== "action" || props.disabled) return;

  emit("click", event);
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
