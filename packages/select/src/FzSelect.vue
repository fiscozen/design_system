<template>
  <FzFloating
    :position="position ?? 'auto-vertical-start'"
    ref="floatingRef"
    :isOpen
    class="flex flex-col gap-8 overflow-visible"
    :teleport="teleport"
    :useViewport="true"
    :overrideOpener
    contentClass="z-70"
    @fzfloating:setPosition="calculateMaxHeight"
  >
    <template #opener-start>
      <label v-if="label" :class="['text-sm', computedLabelClass]">
        {{ label }}{{ required ? " *" : "" }}
      </label>
    </template>
    <template #opener="{ floating }" class="flex">
      <div class="w-full flex flex-col gap-8" ref="openerContainer">
        <slot name="opener" :handlePickerClick :isOpen :floating>
          <button
            @click="handlePickerClick"
            test-id="fzselect-opener"
            type="button"
            :size="size"
            :class="[staticPickerClass, computedPickerClass, pickerClass]"
            ref="opener"
            :title="selectedOption ? selectedOption.label : placeholder"
          >
            <FzIcon v-if="leftIcon" :name="leftIcon" :size="size" />
            <div class="flex flex-col min-w-0">
              <span
                v-if="!showNormalPlaceholder"
                :class="[staticSpanClass, 'text-grey-300 text-xs']"
                >{{ placeholder }}</span
              >
              <span :class="[staticSpanClass, computedSpanClass]">
                {{ selectedOption ? selectedOption.label : placeholder }}
              </span>
            </div>
            <FzIcon
              v-if="rightIcon && !rightIconLast"
              :name="rightIcon"
              :size="size"
            />
            <FzIcon
              :name="isOpen ? 'chevron-up' : 'chevron-down'"
              :size="size"
            />
            <FzIcon
              v-if="rightIcon && rightIconLast && !rightIconButton"
              :iconName="rightIcon"
              :size="mappedSize"
            />
            <FzIconButton
              v-if="rightIconButton && rightIconLast"
              :class="{'bg-grey-100 text-gray-300': disabled}"
              :iconName="rightIcon"
              :size="mappedSize"
              :variant="disabled ? 'invisible' : rightIconButtonVariant"
              @click.stop="emit('fzselect:right-icon-click')"
            />
          </button>
        </slot>
      </div>
    </template>
    <template #opener-end>
      <div
        v-if="error && $slots.error"
        class="flex gap-4"
        :style="{ 'max-width': containerWidth }"
      >
        <FzIcon
          name="triangle-exclamation"
          class="text-semantic-error"
          :size="size"
        />
        <div :class="['mt-1', computedErrorClass]">
          <slot name="error"></slot>
        </div>
      </div>
      <span
        v-else-if="$slots.help"
        :class="[computedHelpClass]"
        :style="{ 'max-width': containerWidth }"
      >
        <slot name="help"></slot>
      </span>
    </template>
    <div
      class="flex flex-col p-4 rounded shadow overflow-auto ml-[-2px] box-border max-h-min"
      :style="{ minWidth: containerWidth, maxWidth: openerMaxWidth, maxHeight }"
      ref="containerRef"
      test-id="fzselect-options-container"
    >
      <template v-if="visibleOptions.length">
        <template
          v-for="option in visibleOptions"
          :key="option.kind === 'label' ? option.label : option.value"
        >
          <FzSelectLabel
            v-if="option.kind === 'label'"
            :option="option"
            :disableTruncate="disableTruncate"
            :size="size"
          />
          <FzSelectOption
            v-else
            @click="() => handleSelect(option.value)"
            :option="option"
            :size="size"
            :disableTruncate="disableTruncate"
            :selectedValue="model"
          />
        </template>
      </template>
      <template v-else>
        <FzSelectOption
          :option="{
            label: 'Nessun risultato trovato',
            readonly: true,
            value: '',
          }"
          :disableTruncate="disableTruncate"
          :size="size"
          :selectedValue="model"
        />
      </template>
    </div>
  </FzFloating>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, Ref } from "vue";
import { FzSelectProps, FzSelectOptionsProps } from "./types";
import { FzIcon } from "@fiscozen/icons";
import { FzIconButton } from "@fiscozen/button";
import {
  FzFloating,
  FzFloatingPosition,
  FzRect,
  useClickOutside,
} from "@fiscozen/composables";
import FzSelectOption from "./components/FzSelectOption.vue";
import { calculateContainerWidth, MIN_WIDTH } from "./common";
import FzSelectLabel from "./components/FzSelectLabel.vue";

const props = withDefaults(defineProps<FzSelectProps>(), {
  size: "md",
  optionsToShow: 25,
  teleport: true,
  variant: "normal",
  rightIconVariant: "invisible",
});
const model = defineModel({
  required: true,
  default: "",
});
const isOpen = ref(false);
const opener = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();
const containerWidth = ref<string>(`${MIN_WIDTH}px`);
const openerMaxWidth = ref<string>("none");
const openerContainer = ref<HTMLElement>();
const visibleOptions = ref<FzSelectOptionsProps[]>([]);
const OPTIONS_HEIGHT = 20;
const OPTIONS_BUFFER = 5;
const maxHeight = ref("");
const floatingRef = ref<InstanceType<typeof FzFloating>>();

const sizeMap = {
  xl: "lg",
  lg: "md",
  md: "sm",
  sm: "xs",
};
const mappedSize = computed(() => {
  return sizeMap[props.size];
});

const showNormalPlaceholder = computed(() => {
  return (
    !(props.variant === "floating-label") ||
    (props.variant === "floating-label" && !model.value)
  );
});

const calculateMaxHeight = (
  rect: Ref<DOMRect | undefined>,
  openerRect: Ref<DOMRect | undefined>,
  containerRect: Ref<DOMRect | undefined>,
  position: Ref<FzFloatingPosition>,
  actualPosition: Ref<FzFloatingPosition | undefined>,
): void => {
  nextTick(() => {
    if (props.floatingPanelMaxHeight) {
      return;
    }
    const bottom = openerRect.value?.bottom ?? 0;
    const top = openerRect.value?.top ?? 0;
    const pos = actualPosition.value ? actualPosition.value : position.value;
    maxHeight.value = pos.includes("bottom")
      ? `calc(100vh - ${bottom}px - ${OPTIONS_BUFFER * OPTIONS_HEIGHT}px)`
      : `${top}px`;
    floatingRef.value?.setPosition(true);
  });
};

const safeOpener = computed(() => {
  return props.extOpener ? props.extOpener : opener.value;
});

useClickOutside(safeOpener, () => {
  isOpen.value = false;
});

const emit = defineEmits(["select", "fzselect:right-icon-click"]);

const staticPickerClass =
  "flex justify-between items-center px-10 border-1 w-full rounded gap-8 text-left relative";
const mapPickerClass = {
  sm: "h-24 text-sm",
  md: "h-32 text-base",
  lg: "h-40 text-lg",
};
const computedPickerClass = computed(() => [
  props.variant === "floating-label"
    ? "h-40 text-sm pr-6"
    : mapPickerClass[props.size],
  evaluateProps(),
]);

const computedLabelClass = computed(() => [
  props.disabled ? "text-grey-300" : "text-core-black",
]);

const staticSpanClass =
  "overflow-hidden text-ellipsis whitespace-nowrap flex-[1]";
const computedSpanClass = computed(() => [
  selectedOption.value && !props.disabled
    ? "text-core-black font-medium"
    : "text-grey-300",
]);

const computedHelpClass = computed(() => [
  props.size === "sm" ? "text-xs" : "",
  props.size === "md" ? "text-sm" : "",
  props.size === "lg" ? "text-base" : "",
  props.disabled ? "text-grey-300" : "text-grey-500",
]);

const computedErrorClass = computed(() => [
  props.size === "sm" ? "text-xs" : "",
  props.size === "md" ? "text-sm" : "",
  props.size === "lg" ? "text-base" : "",
  props.disabled ? "text-grey-300" : "text-core-black",
]);

const selectedOption = computed(() => {
  const options = props.options.filter((option) => option.kind !== "label");
  return options.find((option) => option.value === model.value);
});

watch(() => [props.size, model.value], updateContainerWidth);
watch(
  () => props.options,
  () => {
    visibleOptions.value = props.options.slice(0, props.optionsToShow);
  },
);

onMounted(() => {
  if (props.floatingPanelMaxHeight) {
    maxHeight.value = props.floatingPanelMaxHeight;
  }
  updateContainerWidth();
  addScrollListener();
  updateVisibleOptions();
});

const handleSelect = (value: string) => {
  model.value = value;
  emit("select", value);
  isOpen.value = false;
};

const handlePickerClick = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  updateContainerWidth();
};

const forceOpen = () => {
  isOpen.value = true;
  if (safeOpener.value) {
    calculateContainerWidth(safeOpener.value);
  }
};

const evaluateProps = () => {
  switch (true) {
    case props.disabled:
      return "bg-grey-100 border-grey-100 text-grey-300 cursor-not-allowed";
    case props.error:
      return "border-semantic-error bg-white text-core-black cursor-pointer ";
    default:
      return "border-grey-300 bg-white text-core-black cursor-pointer";
  }
};

function updateContainerWidth() {
  if (!safeOpener.value) return;

  const { minWidth, maxWidth } = calculateContainerWidth(safeOpener.value);

  containerWidth.value = `${minWidth}px`;
  openerMaxWidth.value = `${maxWidth}px`;
}

function addScrollListener() {
  containerRef.value?.addEventListener("scroll", handleScroll);
}

function handleScroll() {
  const container = containerRef.value!;
  const { scrollTop, scrollHeight, clientHeight } = container;
  if (
    scrollTop + clientHeight >=
    scrollHeight - OPTIONS_BUFFER * OPTIONS_HEIGHT
  ) {
    updateVisibleOptions();
  }
}

function updateVisibleOptions() {
  const nextItems = props.options.slice(
    visibleOptions.value.length,
    visibleOptions.value.length + props.optionsToShow,
  );
  visibleOptions.value.push(...nextItems);
}

defineExpose({
  handlePickerClick,
  calculateContainerWidth,
  openerMaxWidth,
  forceOpen,
});
</script>
<style scoped></style>
