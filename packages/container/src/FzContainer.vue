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
});

defineSlots<FzContainerSlots>();

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
 */
const containerClass = computed(() => {
  const type = props.main ? "main-content" : "section-content";
  const orientationClass = props.horizontal
    ? "fz-container--horizontal"
    : "fz-container--vertical";
  const classes = [orientationClass, `gap-${type}-${props.gap}`];

  if (props.horizontal) {
    const layout =
      ("layout" in props ? (props as any).layout : undefined) || "default";
    classes.push(`layout-${layout}`);
  }

  return classes;
});
</script>

<template>
  <component :is="tag" :class="['fz-container', containerClass]">
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
 * - center vertical alignment
 * - no wrapping (elements shrink to fit)
 * - gap applied horizontally between elements
 */
.fz-container--horizontal {
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
}

/**
 * Layout variants for horizontal orientation
 * 
 * Control how child elements expand to fill available space.
 * 
 * Currently implemented:
 * - layout-expand-first: First element expands to fill available space
 * 
 * Future layouts (not yet implemented):
 * - layout-expand-last: Last element expands to fill available space
 * - layout-space-between: Elements distributed with space between them
 * - layout-expand-all: All elements expand equally to fill available space
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
 * Special paragraph spacing for vertical orientation
 * 
 * Applies custom spacing between consecutive paragraphs (p + p) to improve readability.
 * Overrides the default gap with a smaller, typography-specific spacing (--paragraph-gap).
 * 
 * Only applies in vertical orientation as horizontal paragraph layouts are uncommon.
 * Uses :deep() to target slotted content while maintaining style encapsulation.
 */
.fz-container--vertical.gap-main-content-sm :deep(> p + p) {
  margin-top: calc((0px - var(--main-content-sm)) + var(--paragraph-gap));
}

.fz-container--vertical.gap-main-content-base :deep(> p + p) {
  margin-top: calc((0px - var(--main-content-base)) + var(--paragraph-gap));
}

.fz-container--vertical.gap-main-content-lg :deep(> p + p) {
  margin-top: calc((0px - var(--main-content-lg)) + var(--paragraph-gap));
}

.fz-container--vertical.gap-section-content-sm :deep(> p + p) {
  margin-top: calc((0px - var(--section-content-sm)) + var(--paragraph-gap));
}

.fz-container--vertical.gap-section-content-base :deep(> p + p) {
  margin-top: calc((0px - var(--section-content-base)) + var(--paragraph-gap));
}

.fz-container--vertical.gap-section-content-lg :deep(> p + p) {
  margin-top: calc((0px - var(--section-content-lg)) + var(--paragraph-gap));
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
