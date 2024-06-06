<template>
  <section :class="[sectionStaticClass, backgroundColor]">
    <header :class="[headerStaticClass, borderColor]">
      <h2 class="text-core-black text-2xl m-0 p-0">{{ props.title }}</h2>
    </header>
    <article :class="['p-20 flex-1', contentClass]">
      <slot></slot>
    </article>
    <footer v-if="atLeastOneButton" :class="[footerStaticClass, borderColor]">
      <FzIconButton
        v-if="tertiaryAction"
        @click="$emit('click:tertiary')"
        :iconName="tertiaryAction.icon"
        variant="invisible"
      />
      <FzButton
        v-if="secondaryAction"
        @click="$emit('click:secondary')"
        :label="secondaryAction.label"
        variant="secondary"
      />
      <FzButton
        v-if="primaryAction"
        @click="$emit('click:primary')"
        :label="primaryAction.label"
        variant="primary"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { FzCardColor, FzCardProps } from "./types";
import { FzButton, FzIconButton } from "@fiscozen/button";

const props = defineProps<FzCardProps>();
const sectionStaticClass =
  "border-1 border-solid border-grey-100 rounded flex flex-col w-fit";
const headerStaticClass = "h-72 border-b-1 border-solid p-20";
const footerStaticClass =
  "h-64 border-t-1 border-solid p-20 flex justify-end gap-8 items-center";

const backgroundColor = computed(() => {
  switch (props.color) {
    case FzCardColor.Blue:
      return "bg-background-alice-blue";
    case FzCardColor.Orange:
      return "bg-background-seashell";
    case FzCardColor.Purple:
      return "bg-background-pale-purple";
    default:
      return "bg-core-white";
  }
});

const borderColor = computed(() => {
  switch (props.color) {
    case FzCardColor.Blue:
      return "border-blue-200";
    case FzCardColor.Orange:
      return "border-orange-200";
    case FzCardColor.Purple:
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
