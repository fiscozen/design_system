<template>
  <div :class="containerClasses">
    <label :class="labelClasses" :for="id"
      >{{ label }}{{ required ? " *" : "" }}</label
    >
    <div class="relative">
      <textarea
        :id
        :name
        :class="classes"
        :placeholder
        :disabled
        :required
        :rows
        :cols
        :minlength
        :maxlength
        :readonly
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @paste="emit('paste', $event)"
        v-model="model"
      ></textarea>
      <FzIcon
        v-if="valid"
        name="check"
        :size="size"
        class="text-semantic-success absolute top-10 right-10"
      />
    </div>
    <div class="text-sm flex items-center gap-6 h-20">
      <template v-if="error && errorMessage">
        <FzIcon
          name="triangle-exclamation"
          size="md"
          class="text-semantic-error"
        />
        {{ errorMessage }}
      </template>
      <span v-else-if="helpMessage" class="text-grey-500">
        {{ helpMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel } from "vue";
import { FzTextareaProps } from "./types";
import { FzIcon } from "@fiscozen/icons";

const props = withDefaults(defineProps<FzTextareaProps>(), {
  size: "md",
  resize: "all",
});

const emit = defineEmits(["focus", "paste", "blur"]);

const model = defineModel<string>();

const containerClasses = computed(() => [
  "flex flex-col gap-8 items-start",
  {
    "cursor-not-allowed": props.disabled,
  },
]);

const labelClasses = computed(() => [
  "text-sm",
  {
    "text-grey-300": props.disabled,
    "cursor-not-allowed": props.disabled,
  },
]);

const mapSizeToClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const mapResizeToClass = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  all: "resize",
};

const classes = computed(() => [
  "border-1 rounded p-10 placeholder:text-gray-300 disabled:bg-grey-100 disabled:border-grey-100 block invalid:border-semantic-error",
  mapSizeToClass[props.size],
  props.error ? "border-semantic-error" : "border-grey-300",
  mapResizeToClass[props.resize],
  {
    "cursor-not-allowed": props.disabled,
    "pr-[38px]": props.valid,
  },
]);
</script>

<style scoped></style>
