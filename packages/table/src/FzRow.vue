<script setup lang="ts" generic="T extends Record<string, any>">
import { FzRowProps, getBodyClasses, bodyStaticClasses } from "./";
import { FzIconDropdown } from "@fiscozen/dropdown";

const props = defineProps<FzRowProps<T>>();
const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, rowData: T | undefined];
}>();

</script>

<template>
  <slot :columns :data :actions>
    <div
      :class="[bodyStaticClasses, getBodyClasses(column)]"
      role="cell"
      v-for="(column, index) in props.columns"
    >
      <slot :name="`col-${index}`" :column :data>
        <component
          v-if="column.children?.default"
          :is="column.children.default"
          :data="props.data"
        />
        <template
          v-else-if="(column.props.field || column.props.header) && props.data"
        >
          {{
            props.data[
              column.props.field?.toLowerCase() ||
                column.props.header.toLowerCase()
            ]
          }}
        </template>
      </slot>
    </div>
    <div v-if="actions" :class="['w-[80px]', bodyStaticClasses]">
      <FzIconDropdown
        :actions="actions.items"
        @fzaction:click="
          (actionIndex: number) =>
            emit('fztable:rowactionclick', actionIndex, props.data)
        "
      ></FzIconDropdown>
    </div>
  </slot>
</template>
