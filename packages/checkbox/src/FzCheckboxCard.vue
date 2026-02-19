<script setup lang="ts">
import { computed, inject } from "vue";
import { FzCheckboxCardProps } from "./types";
import { generateCheckboxId } from "./utils";
import { CHECKED_SET_KEY } from "./common";
import { FzIcon, type IconVariant } from "@fiscozen/icons";
import { FzTooltip } from "@fiscozen/tooltip";

const props = withDefaults(defineProps<FzCheckboxCardProps>(), {
  variant: "horizontal",
  hasCheckbox: true,
});

const computedValue = computed<string | number>(
  () => props.value ?? props.label,
);

const id: string = generateCheckboxId();

const model = defineModel<(string | number | boolean)[]>({
  required: true,
  default: [],
});

const injected = inject(CHECKED_SET_KEY, null);

const isChecked = computed<boolean>(() => {
  if (model.value == null) return false;
  if (injected && injected.source.value === model.value) {
    return injected.set.value.has(computedValue.value);
  }
  return model.value.includes(computedValue.value);
});

function handleChange() {
  if (props.disabled) return;
  const current = model.value ?? [];
  if (isChecked.value) {
    model.value = current.filter((v) => v !== computedValue.value);
  } else {
    model.value = [...current, computedValue.value];
  }
}

const CHECKBOX_ICONS = Object.freeze({
  CHECKED: "square-check",
  UNCHECKED: "square",
} as const);

const CHECKBOX_ICON_VARIANTS = Object.freeze({
  SOLID: "fas",
  REGULAR: "far",
} as const);

const computedIconName = computed<string>(() =>
  isChecked.value ? CHECKBOX_ICONS.CHECKED : CHECKBOX_ICONS.UNCHECKED,
);

const computedIconVariant = computed<IconVariant>(() =>
  isChecked.value ? CHECKBOX_ICON_VARIANTS.SOLID : CHECKBOX_ICON_VARIANTS.REGULAR,
);

const computedIconColor = computed<string>(() => {
  if (props.disabled) return "text-grey-300";
  if (props.error) return "text-semantic-error-200";
  if (props.emphasis) return "text-blue-500";
  return isChecked.value ? "text-blue-500" : "text-grey-400";
});

const showImage = computed(() => props.variant === "vertical" || !!props.imageUrl);

const staticInputClass: string = "w-0 h-0 peer fz-hidden-input";

const labelClass = computed(() => ({
  "flex-col": props.variant === "vertical",
  "flex-row": props.variant === "horizontal",
  "pb-20": props.variant === "vertical" && (!isChecked.value || props.disabled),
  "pb-12": props.variant === "horizontal" && (!isChecked.value || props.disabled),
  "pb-[19px]": props.variant === "vertical" && isChecked.value && !props.disabled,
  "pb-[11px]": props.variant === "horizontal" && isChecked.value && !props.disabled,
  "pt-[11px]": isChecked.value && !props.disabled,
  "gap-20": props.variant === "vertical",
  "gap-12": props.variant === "horizontal",
  "border-2 px-[11px] border-blue-500":
    isChecked.value && !props.disabled,
  "border-1 border-grey-300":
    !isChecked.value || props.disabled,
  "hover:bg-[#f9faff] peer-focus:outline peer-focus:bg-[#f9faff] peer-focus:outline-blue-200 peer-focus:outline-2 peer-checked:bg-[#f9faff]":
    !props.disabled,
}));
</script>

<template>
  <div>
    <input
      type="checkbox"
      :id="id"
      :class="[staticInputClass]"
      :value="computedValue"
      :disabled="disabled"
      :checked="isChecked"
      :name="name"
      :required="required"
      tabindex="0"
      :aria-checked="isChecked"
      :aria-required="required ? 'true' : 'false'"
      :aria-invalid="error ? 'true' : 'false'"
      @change="handleChange"
    />
    <label
      :class="[
        'relative flex block rounded-lg border-solid pt-12 px-12 cursor-pointer w-full',
        labelClass,
      ]"
      :for="id"
    >
      <FzIcon
        v-if="hasCheckbox"
        :name="computedIconName"
        size="md"
        :class="[
          'shrink-0',
          computedIconColor,
          {
            'absolute top-[23px] left-[23px]': variant === 'vertical',
            'self-start': variant === 'horizontal',
          },
        ]"
        :variant="computedIconVariant"
        aria-hidden="true"
      />

      <picture
        v-if="showImage"
        :class="[
          'rounded overflow-hidden',
          {
            'shrink-0 size-[58px]': variant === 'horizontal',
            'w-full aspect-[16/9]': variant === 'vertical',
            'opacity-30': props.disabled,
          },
        ]"
        :title="imageAlt || ''"
      >
        <img
          :src="imageUrl"
          :alt="imageAlt || ''"
          class="object-cover h-full w-full"
        />
      </picture>

      <div
        class="flex flex-row w-full justify-between min-w-0"
      >
        <div class="justify-center flex flex-col w-full grow-0 min-w-0 gap-4">
          <p
            :class="[
              'font-medium break-words !m-0 !leading-[20px]',
              { 'text-grey-300': props.disabled },
            ]"
          >
            {{ title }}
          </p>
          <p
            v-if="subtitle"
            :class="[
              'font-normal text-sm mt-4 break-words !m-0 !leading-[16px]',
              {
                'text-grey-300': props.disabled,
                'text-grey-500': !props.disabled,
              },
            ]"
          >
            {{ subtitle }}
          </p>
        </div>
        <FzTooltip
          v-if="tooltip"
          :class="{
            'self-center': props.variant === 'horizontal',
            'self-start': props.variant === 'vertical',
            'ml-8': props.variant === 'vertical',
            'ml-12': props.variant === 'horizontal',
          }"
          :disabled="props.disabled"
          :text="tooltip"
          :status="tooltipStatus || 'neutral'"
        >
          <FzIcon
            name="circle-info"
            variant="far"
            size="md"
            class="text-semantic-info"
          />
        </FzTooltip>
      </div>
    </label>
  </div>
</template>

<style scoped>
.fz-hidden-input {
  opacity: 0;
  margin: 0;
  height: 0;
  border: 0 none;
  appearance: none;
}
</style>
