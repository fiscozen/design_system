<script setup lang="ts">
/**
 * FzCard Component
 *
 * A flexible container used to group related content and actions. Cards can include
 * elements like text, images or tables. It also has a set of buttons related to the
 * content, but other can be added inside the main area.
 *
 * Supports multiple color variants, collapsible functionality, and customizable actions.
 * The card can be divided into header, main content area, and footer sections.
 *
 * @component
 * @example
 * <FzCard title="Card Title" color="default">
 *   <p>Card content goes here</p>
 * </FzCard>
 * 
 * @example
 * <FzCard 
 *   title="Collapsible Card" 
 *   collapsible 
 *   :primaryAction="{ label: 'Save' }"
 * >
 *   <p>This card can be collapsed</p>
 * </FzCard>
 */
import { computed, onMounted, ref, watch } from "vue";
import { FzCardEvents, FzCardProps, FzCardSlots } from "./types";
import { FzButton, FzIconButton } from "@fiscozen/button";

const props = withDefaults(defineProps<FzCardProps>(), {
  environment: 'frontoffice'
});
const emit = defineEmits<FzCardEvents>();
const slots = defineSlots<FzCardSlots>();
const isOpen = ref(props.defaultExpanded ?? false);

/**
 * Deprecation warning for 'aliceblue' color prop value.
 * 
 * Watches for 'aliceblue' color usage and logs warning once on mount or when color changes.
 * Using watch with immediate:true ensures the warning only fires once per component instance.
 */
watch(
  () => props.color === "aliceblue",
  (isAliceblue) => {
    if (isAliceblue) {
      console.warn(
        "[FzCard] The color prop value 'aliceblue' is deprecated and will be removed in a future version. " +
        "Please use 'blue' instead. The component will automatically map 'aliceblue' to 'blue' for now."
      );
    }
  },
  { immediate: true }
);

/**
 * Normalizes deprecated color values to their replacements.
 * 
 * Maps deprecated colors to their replacements:
 * - 'aliceblue' → 'blue'
 * 
 * This ensures backward compatibility while encouraging migration to new values.
 * Deprecation warnings are handled separately via watch hooks.
 */
const normalizedColor = computed(() => {
  if (props.color === "aliceblue") {
    return "blue";
  }
  
  return props.color;
});

const sectionStaticClass =
  "border-1 border-solid border-grey-100 rounded flex flex-col";
const headerStaticClass =
  "border-solid pt-16 px-16 flex flex-row justify-between";
const footerStaticClass =
  "border-solid pt-0 px-16 pb-16 flex justify-end gap-12 items-center";

const showContent = computed(() => isOpen.value || !props.collapsible);
const isAlive = computed(() => props.alwaysAlive || showContent.value);
const existHeader = computed(
  () => props.title || slots["header"] || slots["header-content"],
);
const headerContainerComputedClass = computed(() => [
  props.collapsible ? "cursor-pointer" : "",
]);

const headerTitleClass = computed(() => {
  return props.environment === 'backoffice' ? 'py-2' : 'py-8';
});

const backgroundColor = computed(() => {
  switch (normalizedColor.value) {
    case "blue":
      return "bg-background-alice-blue";
    case "orange":
      return "bg-background-seashell";
    case "purple":
      return "bg-background-pale-purple";
    case "grey":
      return "bg-background-white-smoke";
    default:
      return "bg-core-white";
  }
});

const textColor = computed(() => {
  // Note: Based on Figma designs, all color variants use black text
  // The blue-500 background variant was previously using white text but
  // the new alice-blue background uses black text
  return "text-core-black";
});

const borderColor = computed(() => {
  switch (normalizedColor.value) {
    case "blue":
      return "border-background-alice-blue";
    case "orange":
      return "border-orange-200";
    case "purple":
      return "border-purple-200";
    case "grey":
      return "border-grey-200";
    default:
      return "border-grey-100";
  }
});

const borderWidth = computed(() => {
  switch (normalizedColor.value) {
    case "blue":
    case "orange":
    case "purple":
    case "grey":
      return "border-0";
    default:
      return "border-1";
  }
});

const atLeastOneButton = computed(
  () =>
    props.primaryAction !== undefined ||
    props.secondaryAction !== undefined ||
    props.tertiaryAction !== undefined,
);

function toggleOpen() {
  if (props.collapsible) isOpen.value = !isOpen.value;
}

onMounted(() => {
  if (props.tertiaryAction && !props.secondaryAction && !props.primaryAction)
    console.warn(
      "[Fiscozen Design System]: You should set primaryAction and secondaryAction if you want to set tertiaryAction",
    );
  else if (props.secondaryAction && !props.primaryAction)
    console.warn(
      "[Fiscozen Design System]: You should set primaryAction if you want to set secondaryAction",
    );
});

defineExpose({
  /**
   * Method to toggle the card open/closed state
   */
  toggleOpen,
});
</script>

<template>
  <section :class="[sectionStaticClass, backgroundColor, textColor, borderColor, {'pb-16': !showContent}]">
    <header
      v-if="existHeader"
      :class="[headerContainerComputedClass]"
      @click="toggleOpen"
    >
      <div :class="headerStaticClass">
        <div :class="['flex flex-row gap-12 items-start', headerTitleClass]">
          <h2
            v-if="title"
            class="text-core-black font-medium text-xl m-0 p-0 break-words overflow-wrap-anywhere min-w-0 flex-shrink"
            :title="title"
          >
            {{ title }}
          </h2>
          <slot name="header"></slot>
        </div>
        <div class="flex flex-row gap-8 items-start">
          <FzIconButton
            v-if="hasInfoIcon"
            iconName="circle-question"
            variant="invisible"
            :environment="environment"
            @click.stop="emit('fzcard:click-info')"
          />
          <FzIconButton
            v-if="collapsible"
            :iconName="isOpen ? 'chevron-up' : 'chevron-down'"
            variant="invisible"
            :environment="environment"
          />
        </div>
      </div>
      <slot name="header-content"></slot>
    </header>
    <article
      v-if="isAlive"
      :class="['p-16', contentClass]"
      v-show="showContent"
    >
      <slot></slot>
    </article>
    <footer
      v-if="(slots.footer || atLeastOneButton) && isAlive"
      :class="[footerStaticClass]"
      v-show="showContent"
    >
      <slot name="footer">
        <FzIconButton
          v-if="tertiaryAction"
          @click="emit('fztertiary:click')"
          :iconName="tertiaryAction.icon"
          variant="invisible"
          :environment="environment"
        />
        <FzButton
          v-if="secondaryAction"
          @click="emit('fzsecondary:click')"
          :label="secondaryAction.label"
          variant="secondary"
          :environment="environment"
        />
        <FzButton
          v-if="primaryAction"
          @click="emit('fzprimary:click')"
          :label="primaryAction.label"
          variant="primary"
          :environment="environment"
        />
      </slot>
    </footer>
  </section>
</template>
