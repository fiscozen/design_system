<script setup lang="ts">
import { computed } from "vue";
import type { FzContainerProps, FzContainerSlots } from "./types";
import {
  generateResponsiveClasses,
  displayMapper,
  directionMapper,
  wrapMapper,
  justifyMapper,
  alignMapper,
  gapMapper,
  rowGapMapper,
  colGapMapper,
  paddingMapper,
  paddingTopMapper,
  paddingRightMapper,
  paddingBottomMapper,
  paddingLeftMapper,
  paddingXMapper,
  paddingYMapper,
  marginMapper,
  marginTopMapper,
  marginRightMapper,
  marginBottomMapper,
  marginLeftMapper,
  marginXMapper,
  marginYMapper,
  widthMapper,
  heightMapper,
  maxWidthMapper,
  maxHeightMapper,
  minWidthMapper,
  minHeightMapper,
  overflowMapper,
  overflowXMapper,
  overflowYMapper,
  gridColsMapper,
  gridRowsMapper,
  getCenteredClasses,
} from "./utils";

const props = withDefaults(defineProps<FzContainerProps>(), {
  display: "flex",
  direction: "row",
  wrap: "nowrap",
  justify: "start",
  align: "stretch",
  gap: "0",
  tag: "div",
  fullWidth: false,
  fullHeight: false,
  centerX: false,
  centerY: false,
  center: false,
});

defineSlots<FzContainerSlots>();

const containerClasses = computed(() => {
  const classes: string[] = [];

  // Display classes
  classes.push(...generateResponsiveClasses(props.display, displayMapper));

  // Flex specific classes
  const currentDisplay =
    typeof props.display === "object"
      ? props.display.xs || "flex"
      : props.display;
  const isFlexDisplay =
    currentDisplay === "flex" || currentDisplay === "inline-flex";
  const isGridDisplay =
    currentDisplay === "grid" || currentDisplay === "inline-grid";

  if (isFlexDisplay) {
    // Direction classes
    classes.push(
      ...generateResponsiveClasses(props.direction, directionMapper)
    );

    // Wrap classes
    classes.push(...generateResponsiveClasses(props.wrap, wrapMapper));
  }

  // Justify and align classes (work for both flex and grid)
  classes.push(...generateResponsiveClasses(props.justify, justifyMapper));
  classes.push(...generateResponsiveClasses(props.align, alignMapper));

  // Gap classes
  classes.push(...generateResponsiveClasses(props.gap, gapMapper));
  classes.push(...generateResponsiveClasses(props.rowGap, rowGapMapper));
  classes.push(...generateResponsiveClasses(props.colGap, colGapMapper));

  // Grid specific classes
  if (isGridDisplay) {
    classes.push(...generateResponsiveClasses(props.gridCols, gridColsMapper));
    classes.push(...generateResponsiveClasses(props.gridRows, gridRowsMapper));
  }

  // Padding classes
  classes.push(...generateResponsiveClasses(props.padding, paddingMapper));
  classes.push(
    ...generateResponsiveClasses(props.paddingTop, paddingTopMapper)
  );
  classes.push(
    ...generateResponsiveClasses(props.paddingRight, paddingRightMapper)
  );
  classes.push(
    ...generateResponsiveClasses(props.paddingBottom, paddingBottomMapper)
  );
  classes.push(
    ...generateResponsiveClasses(props.paddingLeft, paddingLeftMapper)
  );
  classes.push(...generateResponsiveClasses(props.paddingX, paddingXMapper));
  classes.push(...generateResponsiveClasses(props.paddingY, paddingYMapper));

  // Margin classes
  classes.push(...generateResponsiveClasses(props.margin, marginMapper));
  classes.push(...generateResponsiveClasses(props.marginTop, marginTopMapper));
  classes.push(
    ...generateResponsiveClasses(props.marginRight, marginRightMapper)
  );
  classes.push(
    ...generateResponsiveClasses(props.marginBottom, marginBottomMapper)
  );
  classes.push(
    ...generateResponsiveClasses(props.marginLeft, marginLeftMapper)
  );
  classes.push(...generateResponsiveClasses(props.marginX, marginXMapper));
  classes.push(...generateResponsiveClasses(props.marginY, marginYMapper));

  // Size classes
  classes.push(...generateResponsiveClasses(props.width, widthMapper));
  classes.push(...generateResponsiveClasses(props.height, heightMapper));
  classes.push(...generateResponsiveClasses(props.maxWidth, maxWidthMapper));
  classes.push(...generateResponsiveClasses(props.maxHeight, maxHeightMapper));
  classes.push(...generateResponsiveClasses(props.minWidth, minWidthMapper));
  classes.push(...generateResponsiveClasses(props.minHeight, minHeightMapper));

  // Full width/height classes
  if (props.fullWidth) classes.push("w-full");
  if (props.fullHeight) classes.push("h-full");

  // Overflow classes
  classes.push(...generateResponsiveClasses(props.overflow, overflowMapper));
  classes.push(...generateResponsiveClasses(props.overflowX, overflowXMapper));
  classes.push(...generateResponsiveClasses(props.overflowY, overflowYMapper));

  // Centering classes
  classes.push(
    ...getCenteredClasses(props.centerX, props.centerY, props.center)
  );

  // Custom class
  if (props.class) {
    classes.push(props.class);
  }

  return classes.filter(Boolean).join(" ");
});
</script>

<template>
  <component :is="tag" :class="containerClasses">
    <slot />
  </component>
</template>
