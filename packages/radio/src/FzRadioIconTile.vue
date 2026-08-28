<script setup lang="ts">
/**
 * FzRadioIconTile — a single-select tile whose entire content is one icon:
 * full height, full column width, icon centred, colour by accent.
 *
 * It fills the gap between `FzIconButton` (fixed, toolbar-sized) and
 * `FzRadioCard` (a card with image, title and subtitle): a plain, tall,
 * icon-only control for a hard choice between a handful of options represented
 * by a glyph — a satisfaction rating, a mode picker, a three-state filter.
 *
 * It is a **native radio**, not a toggle button. That choice buys the things a
 * button has to re-implement by hand: the selected state travels to assistive
 * technology through `:checked` rather than a hand-maintained `aria-pressed`,
 * and dropping the tile inside `FzRadioGroup` gives it `role="radiogroup"`, a
 * shared `name`, the aria wiring and native arrow-key navigation for free.
 *
 * **Colour is never the only signal.** `label` is required and renders as the
 * tile's visually-hidden accessible name, so options stay distinguishable to a
 * screen reader and to anyone who does not separate green from amber from red.
 * The selected state is a tint *and* a thicker border *and* the native checked
 * state — three vectors, only one of which is colour.
 */
import "./fz-radio.css";
import { computed } from "vue";
import { FzIcon } from "@fiscozen/icons";
import { FzRadioIconTileProps, FzRadioIconTileAccent } from "./types";
import { staticInputClass } from "./common";
import { generateRadioId } from "./utils";

const props = withDefaults(defineProps<FzRadioIconTileProps>(), {
  iconVariant: "far",
  accent: "neutral",
  disabled: false,
});

const emits = defineEmits(["update:modelValue"]);

/**
 * Per-accent classes, spelled out as complete literals rather than composed at
 * runtime: Tailwind's scanner only sees class names that appear verbatim in the
 * source, so a `hover:${...}` template would compile to nothing.
 *
 * `icon` applies in every state — a coloured glyph is what identifies the
 * option, so it does not appear only once selected. `border` and `background`
 * are the selected state's tint, `hover` its rehearsal.
 */
const ACCENTS: Record<
  FzRadioIconTileAccent,
  { icon: string; border: string; background: string; hover: string }
> = {
  neutral: {
    icon: "text-grey-500",
    border: "border-blue-500",
    background: "bg-blue-50",
    hover: "hover:bg-blue-50",
  },
  success: {
    icon: "text-semantic-success-200",
    border: "border-semantic-success-200",
    background: "bg-semantic-success-50",
    hover: "hover:bg-semantic-success-50",
  },
  warning: {
    icon: "text-semantic-warning-200",
    border: "border-semantic-warning-200",
    background: "bg-semantic-warning-50",
    hover: "hover:bg-semantic-warning-50",
  },
  error: {
    icon: "text-semantic-error-200",
    border: "border-semantic-error-200",
    background: "bg-semantic-error-50",
    hover: "hover:bg-semantic-error-50",
  },
};

const accentClasses = computed(() => ACCENTS[props.accent]);

/**
 * Falls back to the label, matching FzRadio and FzRadioCard: a tile with a
 * unique label needs no separate value.
 */
const computedValue = computed(() => props.value ?? props.label);

const isChecked = computed(() => props.modelValue === computedValue.value);

/**
 * The radio family's validation state, honouring the deprecated `error` prop.
 * `FzRadioGroup` spreads it down through `radioGroupProps`, so a group in error
 * marks all of its tiles. Distinct from `accent`, which is what the tile means.
 */
const isError = computed(() => props.tone === "error" || props.error === true);

/**
 * Generated per instance rather than derived from `name` + `label` (as
 * `useRadio` does): the label is free-form prose here, and a space in an id
 * makes the `for`/`id` pairing brittle.
 */
const inputId = generateRadioId();

const borderClass = computed(() => {
  if (props.disabled) return "border-1 border-grey-100";
  if (isChecked.value) return `border-2 ${accentClasses.value.border}`;
  if (isError.value) return "border-1 border-semantic-error-200";
  return "border-1 border-grey-100";
});

const tileClass = computed(() => [
  borderClass.value,
  isChecked.value && !props.disabled ? accentClasses.value.background : "",
  props.disabled
    ? "cursor-not-allowed"
    : ["cursor-pointer", accentClasses.value.hover],
]);

/**
 * `min-h-[82px]` is the design's tile height and doubles as the floor that keeps
 * the control above the 44x44 minimum touch target; `h-full` lets it grow to
 * fill a taller row, which is what "full height" asks for. The 1px -> 2px border
 * swap on selection costs no layout shift: Tailwind's preflight puts every box on
 * `border-box`, so the outer size is unchanged and a centred icon does not move.
 */
const staticTileClass =
  "flex h-full min-h-[82px] w-full items-center justify-center rounded border-solid m-0";

/** Keyboard-only, so a pointer click on the tile does not draw a ring. */
const focusRingClass =
  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600";

const iconClass = computed(() =>
  props.disabled ? "text-grey-300" : accentClasses.value.icon,
);
</script>

<template>
  <div class="flex h-full w-full">
    <input
      type="radio"
      :id="inputId"
      :class="[staticInputClass]"
      :value="computedValue"
      :disabled="disabled"
      :checked="isChecked"
      :name="name"
      :required="required"
      tabindex="0"
      @change="emits('update:modelValue', computedValue)"
    />
    <label :for="inputId" :class="[staticTileClass, focusRingClass, tileClass]">
      <FzIcon
        :name="iconName"
        :variant="iconVariant"
        size="xl"
        :class="iconClass"
      />
      <span class="sr-only">{{ label }}</span>
    </label>
  </div>
</template>
