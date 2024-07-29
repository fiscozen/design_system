<template>
  <table class="w-full text-left rounded overflow-hidden bg-core-white">
    <thead>
      <tr class="bg-grey-100">
        <th v-for="column in columns" class="px-16 h-48 font-medium">
          {{ column.props.header }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="rowData in value" class="border-b-1 border-grey-100">
        <td v-for="column in columns" class="px-16 h-48 text-grey-500">
          <component
            v-if="column.children?.default"
            :is="column.children.default"
            :data="rowData"
          />
          <template v-else-if="column.props.field">
            {{ rowData[column.props.field] }}
          </template>
        </td>
      </tr>

      <tr v-if="!value.length" class="text-center text-grey-500">
        <td colspan="100%" class="h-80">
          {{ placeholder ?? "No data available" }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useSlots } from "vue";
import {
  FzColumnProps,
  FzColumnSlots,
  FzSimpleTableProps,
  FzSimpleTableSlots,
} from "./types";
import FzColumn from "./FzColumn.vue";

const props = withDefaults(defineProps<FzSimpleTableProps>(), {});

const emit = defineEmits([]);

defineSlots<FzSimpleTableSlots>();
const slots = useSlots();

const defaultSlot = slots.default?.();
const columns =
  defaultSlot
    ?.filter((elem) => elem.type === FzColumn)
    .map((column) => ({
      props: column.props as FzColumnProps,
      children: column.children as FzColumnSlots,
    })) ?? [];
</script>

<style scoped></style>
