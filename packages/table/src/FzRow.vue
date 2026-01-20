<script setup lang="ts" generic="T extends Record<string, any>">
import { ref } from "vue";
import { FzRowProps, getBodyClasses, bodyStaticClasses } from "./";
import { FzIconDropdown } from "@fiscozen/dropdown";
import { FzIcon } from "@fiscozen/icons";
import { FzCheckbox } from "@fiscozen/checkbox";
import { FzActionProps } from "@fiscozen/action";
import { FzRadio } from "@fiscozen/radio";
import { useMediaQuery } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";

const props = defineProps<FzRowProps<T>>();
const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, action: FzActionProps, rowData: T | undefined];
  click: [rowIndex: number, rowData: T | undefined];
}>();
const selected = defineModel<boolean>("selected");
const smOrSmaller = useMediaQuery(`(max-width: ${breakpoints.sm})`);
const hover = ref(false);
const handleClick = (event: MouseEvent) => {
   if((event.target as HTMLElement)?.closest('input[type="checkbox"]+label')) {
     event.stopPropagation();
     event.preventDefault();
   }
  emit("click", props.id, props.data);
  if (props.selectable || props.hasRadio) {
    selected.value = !selected.value;
  }
};
</script>

<template>
  <slot :columns :data :actions>
    <div class="grid grid-cols-subgrid border-b-1 border-solid border-grey-100 col-span-full" :style="colSpan" @mouseover="hover = true" @mouseleave="hover = false"
      @click="handleClick">
      <div v-if="leftColIcon" role="cell" :class="[
        'w-[40px]',
        bodyStaticClasses,
        '!px-0',
        'self-center',
        'justify-self-center',
        'flex',
        'justify-center',
        rowClass,
        { 'bg-core-white': !hover, '!bg-background-alice-blue': hover },
      ]">
        <FzIcon :name="leftColIcon" :class="leftColIconClass" variant="fas" :size="leftColIconSize || 'md'" />
      </div>
      <div v-if="props.selectable" role="cell" :class="[
        'w-[36px]',
        bodyStaticClasses,
        'sticky left-0 z-[2] justify-center !min-w-[36px]',
        rowClass,
        { 'bg-core-white': !hover, '!bg-background-alice-blue': hover },
      ]">
        <FzCheckbox :modelValue="selected" label="" :value="`row-${props.id}`" emphasis />
      </div>
      <div v-if="props.hasRadio" role="cell" :class="[
        'w-[36px]',
        bodyStaticClasses,
        'sticky left-0 z-[2] justify-center !min-w-[36px]',
        rowClass,
        { 'bg-core-white': !hover, '!bg-background-alice-blue': hover },
      ]">
        <FzRadio :modelValue="selected ? `row-${props.id}` : ''" :label="''" :value="`row-${props.id}`"
          emphasis />
      </div>
      <template v-if="smOrSmaller && isList">
        <div class="flex flex-col">
          <div :class="[
            bodyStaticClasses,
            getBodyClasses(column),
            rowClass,
            { 'bg-core-white': !hover, '!bg-background-alice-blue': hover },
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

        </div>
      </template>
      <div v-else :class="[
        bodyStaticClasses,
        getBodyClasses(column),
        rowClass,
        { 'bg-core-white': !hover, '!bg-background-alice-blue': hover },
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
      <div v-if="actions" role="cell" :class="[
        bodyStaticClasses,
        '!p-[12px]',
        'sticky right-0 z-[2] flex justify-center items-start',
        { 'bg-core-white': !hover, 'bg-background-alice-blue': hover, 'left-shadow': props.isOverflowing },
      ]">
        <FzIconDropdown :actions="(typeof actions === 'function' ? actions(props.data as T) : actions).items as FzActionProps[]" buttonVariant="invisible" :openerDisabled="actionsDisabled"
          iconName="ellipsis-vertical" size="sm" @fzaction:click="
            (actionIndex: number, action: FzActionProps) =>
              emit('fztable:rowactionclick', actionIndex, action, props.data)
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
.subrow-grey {
  background-color: #F9FBFB;
}
</style>
