<script setup lang="ts">
/**
 * FzContainer - A flexible layout component for organizing content with controlled spacing
 *
 * Supports both vertical and horizontal orientations with customizable gap sizes.
 * Uses CSS custom properties for consistent spacing across the design system.
 */
import { computed } from "vue";

import type { FzContainerProps, FzContainerSlots } from "./types";

const props = withDefaults(defineProps<FzContainerProps>(), {
  main: false,
  gap: "base",
  horizontal: false,
  tag: "div",
  alignItems: undefined,
});

defineSlots<FzContainerSlots>();

/**
 * Computes the default alignItems value based on orientation
 *
 * Horizontal containers default to 'center' for better visual alignment.
 * Vertical containers default to 'stretch' so child elements expand to full width.
 */
const alignItemsValue = computed(() => {
  return props.alignItems ?? (props.horizontal ? "center" : "stretch");
});

/**
 * Validate layout prop usage
 *
 * The layout prop only works when horizontal is true.
 * Logs an error to console to alert developers of incorrect usage.
 */
if (!props.horizontal && "layout" in props) {
  const layout = (props as any).layout;
  if (layout && layout !== "default") {
    console.error(
      '[FzContainer] The "layout" prop only works when horizontal is true. ' +
        `Current horizontal: ${props.horizontal}, layout: "${layout}".`
    );
  }
}

/**
 * Computes CSS classes based on props
 *
 * Generates orientation-specific class and gap class based on container type.
 * Main containers use --main-content spacing, sections use --section-content spacing.
 * For horizontal containers, also includes layout class.
 * Includes alignItems class for cross-axis alignment.
 */
const containerClass = computed(() => {
  const type = props.main ? "main-content" : "section-content";
  const orientationClass = props.horizontal
    ? "fz-container--horizontal"
    : "fz-container--vertical";
  const classes = [
    orientationClass,
    `gap-${type}-${props.gap}`,
    `align-items-${alignItemsValue.value}`,
  ];

  if (props.horizontal) {
    const layout =
      ("layout" in props ? (props as any).layout : undefined) || "default";
    classes.push(`layout-${layout}`);
  }

  return classes;
});
</script>

<template>
  <component :is="props.tag" :class="['fz-container', containerClass]">
    <slot />
  </component>
</template>

<style scoped lang="css">
/**
 * Base container styles
 * Common flexbox setup for both orientations
 */
.fz-container {
  display: flex;
}

/**
 * Vertical orientation (default)
 * Elements stack vertically with gap applied between them
 */
.fz-container--vertical {
  flex-direction: column;
}

/**
 * Horizontal orientation
 * Elements align horizontally with:
 * - no wrapping (elements shrink to fit)
 * - gap applied horizontally between elements
 * - vertical alignment controlled by align-items-* class
 */
.fz-container--horizontal {
  flex-direction: row;
  flex-wrap: nowrap;
}

/**
 * Cross-axis alignment variants
 * 
 * Control how child elements are aligned on the cross-axis (perpendicular to main axis).
 * Works for both vertical and horizontal orientations.
 * 
 * - align-items-start: Align to start (left for vertical, top for horizontal)
 * - align-items-center: Center alignment
 * - align-items-end: Align to end (right for vertical, bottom for horizontal)
 * - align-items-stretch: Stretch to fill container on cross-axis
 * - align-items-baseline: Align along text baseline (useful for horizontal text)
 */
.fz-container.align-items-start {
  align-items: flex-start;
}

.fz-container.align-items-center {
  align-items: center;
}

.fz-container.align-items-end {
  align-items: flex-end;
}

.fz-container.align-items-stretch {
  align-items: stretch;
}

.fz-container.align-items-baseline {
  align-items: baseline;
}

/**
 * Layout variants for horizontal orientation
 * 
 * Control how child elements expand to fill available space.
 * 
 * Currently implemented:
 * - layout-expand-first: First element expands to fill available space
 * - layout-expand-all: All elements expand equally to fill available space
 * - layout-space-between: Elements distributed with space between them
 * 
 * Future layouts (not yet implemented):
 * - layout-expand-last: Last element expands to fill available space
 */

/**
 * Expand first element
 * 
 * The first child element expands to fill all available horizontal space,
 * while other elements maintain their natural size.
 * Useful for layouts like: [expanding content | action buttons]
 */
.fz-container--horizontal.layout-expand-first :deep(> *:first-child) {
  flex-grow: 1;
}

/**
 * Expand all elements
 * 
 * All child elements expand equally to fill available horizontal space.
 * Each element gets the same amount of space (flex-grow: 1).
 * Useful for layouts like: [button | button | button] with equal widths
 */
.fz-container--horizontal.layout-expand-all :deep(> *) {
  flex-grow: 1;
}

/**
 * Space between elements
 * 
 * Elements maintain their natural size but are distributed with space between them.
 * First element aligns to the start, last element aligns to the end.
 * Useful for layouts like: [logo | navigation menu] in a navbar
 */
.fz-container--horizontal.layout-space-between {
  justify-content: space-between;
}

/**
 * Special paragraph spacing for vertical orientation
 * 
 * Applies custom spacing between consecutive paragraphs (p + p) to improve readability.
 * Overrides the default gap with a smaller, typography-specific spacing (--paragraph-gap).
 * 
 * Only applies in vertical orientation as horizontal paragraph layouts are uncommon.
 * Uses :deep() to target slotted content while maintaining style encapsulation.
 */
.fz-container--vertical.gap-main-content-sm :deep(> p + p) {
  margin-top: calc(
    (0px - var(--main-content-sm, 32px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-main-content-base :deep(> p + p) {
  margin-top: calc(
    (0px - var(--main-content-base, 48px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-main-content-lg :deep(> p + p) {
  margin-top: calc(
    (0px - var(--main-content-lg, 64px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-section-content-none :deep(> p + p) {
  margin-top: calc(
    (0px - var(--section-content-none, 0px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-section-content-xs :deep(> p + p) {
  margin-top: calc(
    (0px - var(--section-content-xs, 8px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-section-content-sm :deep(> p + p) {
  margin-top: calc(
    (0px - var(--section-content-sm, 16px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-section-content-base :deep(> p + p) {
  margin-top: calc(
    (0px - var(--section-content-base, 24px)) + var(--paragraph-gap, 8px)
  );
}

.fz-container--vertical.gap-section-content-lg :deep(> p + p) {
  margin-top: calc(
    (0px - var(--section-content-lg, 32px)) + var(--paragraph-gap, 8px)
  );
}

/**
 * Reset paragraph spacing for horizontal orientation
 * 
 * In horizontal layouts, paragraphs are aligned side-by-side, so the vertical
 * margin-top from the global p + p rule (defined in typography.css) must be removed.
 */
.fz-container--horizontal :deep(> p + p) {
  margin-top: 0;
}
</style>
