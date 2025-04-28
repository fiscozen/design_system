<script setup lang="ts" generic="T extends Record<string, any>">
import { ref } from "vue";
import { FzRowProps, getBodyClasses, bodyStaticClasses } from "./";
import { FzIconDropdown } from "@fiscozen/dropdown";
import { FzIcon } from "@fiscozen/icons";
import { FzCheckbox } from "@fiscozen/checkbox";
import { ActionlistItem } from "@fiscozen/actionlist";

const props = defineProps<FzRowProps<T>>();
const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, actionlistItem: ActionlistItem, rowData: T | undefined];
  click: [rowIndex: number, rowData: T | undefined];
}>();
const selected = defineModel<boolean>("selected");
const hover = ref(false);
</script>

<template>
  <slot :columns :data :actions>
    <div class="grid grid-cols-subgrid" :style="colSpan" @mouseover="hover = true" @mouseleave="hover = false"
      @click="emit('click', id, data)">
      <div v-if="leftColIcon" :class="[
        'w-[40px]',
        bodyStaticClasses,
        '!px-0',
        'self-center',
        'justify-self-center',
        'flex',
        'justify-center',
        { 'bg-core-white': !hover, 'bg-background-alice-blue': hover },
      ]">
        <FzIcon :name="leftColIcon" :class="leftColIconClass" variant="fas" :size="leftColIconSize || 'md'" />
      </div>
      <div v-if="props.selectable" :class="[
        'w-[40px]',
        bodyStaticClasses,
        'sticky left-0 z-[2] justify-center',
        { 'bg-core-white': !hover, 'bg-background-alice-blue': hover },
      ]">
        <FzCheckbox v-model="selected" label="" :value="`row-${props.id}`" emphasis />
      </div>
      <div :class="[
        bodyStaticClasses,
        getBodyClasses(column),
        { 'bg-core-white': !hover, 'bg-background-alice-blue': hover },
      ]" role="cell" v-for="(column, index) in props.columns">
        <slot :name="`col-${index}`" :column :data>
          <component v-if="column.children?.default" :is="column.children.default" :data="props.data" />
          <template v-else-if="
            (column.props.field || column.props.header) && props.data
          ">
            {{
              props.data[
              column.props.field?.toLowerCase() ||
              column.props.header.toLowerCase()
              ]
            }}
          </template>
        </slot>
      </div>
      <div v-if="actions" :class="[
        'w-[44px] px-4',
        bodyStaticClasses,
        'sticky right-0 z-[2]',
        { 'bg-core-white': !hover, 'bg-background-alice-blue': hover, 'left-shadow': props.isOverflowing },
      ]">
        <FzIconDropdown :actions="actions.items" buttonVariant="invisible" iconName="ellipsis-vertical" @fzaction:click="
          (actionIndex: number, actionListItem: ActionlistItem) =>
            emit('fztable:rowactionclick', actionIndex, actionListItem, props.data)
        "></FzIconDropdown>
      </div>
    </div>
  </slot>
</template>

<style>
.left-shadow {
  box-shadow:
    -1px 0px 2px 0px rgba(0, 0, 0, 0.06),
    -1px 0px 3px 0px rgba(0, 0, 0, 0.1);
}
</style>
