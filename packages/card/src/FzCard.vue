<template>
  <section :class="[sectionStaticClass, backgroundColor]">
    <header :class="[headerContainerComputedClass, borderColor]">
      <div :class="headerStaticClass">
        <div class="flex flex-row gap-12 items-center">
          <h2
            v-if="title"
            class="text-core-black font-medium text-2xl m-0 p-0 break-words"
            :title="title"
          >
            {{ title }}
          </h2>
          <slot name="header"></slot>
        </div>
        <FzIconButton
          v-if="collapsible"
          :iconName="isOpen ? 'chevron-up' : 'chevron-down'"
          @click="isOpen = !isOpen"
          variant="invisible"
        />
      </div>
      <slot name="header-content"></slot>
    </header>
    <template v-if="showContent">
      <article :class="['p-20', contentClass]">
        <slot></slot>
      </article>
      <footer v-if="atLeastOneButton" :class="[footerStaticClass, borderColor]">
        <FzIconButton
          v-if="tertiaryAction"
          @click="$emit('fztertiary:click')"
          :iconName="tertiaryAction.icon"
          variant="invisible"
        />
        <FzButton
          v-if="secondaryAction"
          @click="$emit('fzsecondary:click')"
          :label="secondaryAction.label"
          variant="secondary"
        />
        <FzButton
          v-if="primaryAction"
          @click="$emit('fzprimary:click')"
          :label="primaryAction.label"
          variant="primary"
        />
      </footer>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { FzCardProps } from "./types";
import { FzButton, FzIconButton } from "@fiscozen/button";

const props = defineProps<FzCardProps>();
const isOpen = ref(props.defaultExpanded ?? false);

const sectionStaticClass =
  "border-1 border-solid border-grey-100 rounded flex flex-col";
const headerStaticClass =
  "h-64 border-solid p-16 flex flex-row justify-between";
const footerStaticClass =
  "h-64 border-t-1 border-solid p-16 flex justify-end gap-8 items-center";

const showContent = computed(() => isOpen.value || !props.collapsible);
const headerContainerComputedClass = computed(() => [
  showContent.value ? "border-b-1" : "border-b-0",
]);

const backgroundColor = computed(() => {
  switch (props.color) {
    case "blue":
      return "bg-background-alice-blue";
    case "orange":
      return "bg-background-seashell";
    case "purple":
      return "bg-background-pale-purple";
    default:
      return "bg-core-white";
  }
});

const borderColor = computed(() => {
  switch (props.color) {
    case "blue":
      return "border-blue-200";
    case "orange":
      return "border-orange-200";
    case "purple":
      return "border-purple-200";
    default:
      return "border-grey-100";
  }
});

const atLeastOneButton = computed(
  () =>
    props.primaryAction !== undefined ||
    props.secondaryAction !== undefined ||
    props.tertiaryAction !== undefined,
);

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
</script>
