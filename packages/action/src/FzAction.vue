<template>
  <component
    :is="componentTag"
    v-bind="props"
    :class="baseClasses"
    @click="handleClick"
  >
    <template v-if="variant === 'textLeft'">
      <div
        v-if="variant === 'textLeft'"
        class="flex flex-col gap-4 overflow-hidden"
      >
        <span v-if="label || $slots.default" :class="labelClasses">
          <slot>{{ label }}</slot>
        </span>
        <span v-if="subLabel" :class="subLabelClasses">
          {{ subLabel }}
        </span>
      </div>
      <FzIcon
        v-if="iconName && variant === 'textLeft'"
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
        <span v-if="label || $slots.default" :class="labelClasses">
          <slot>{{ label }}</slot>
        </span>

        <FzIcon
          v-if="iconName"
          :name="iconName"
          :variant="iconVariant"
          size="md"
          :class="iconClasses"
        />
      </div>
      <span v-if="subLabel" :class="subLabelClasses">
        {{ subLabel }}
      </span>
    </div>
    <FzIcon
      v-else-if="variant === 'onlyIcon' && iconName"
      :name="iconName"
      :variant="iconVariant"
      size="md"
      :class="iconClasses"
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
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const { baseClasses, iconClasses, labelClasses, subLabelClasses } =
  useActionClasses(props);

// Computed properties
const componentTag = computed(() => {
  if (props.disabled) return "span";
  return props.type === "action" ? "button" : FzLink;
});

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
