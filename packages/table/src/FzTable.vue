<script setup lang="ts">
import { computed, ref, useSlots, onMounted, onUpdated } from "vue";
import { FzTableProps } from "./types";
import { FzColumn, FzColumnSlots, FzColumnProps } from "@fiscozen/simple-table";
import { FzIconDropdown } from "@fiscozen/dropdown";
import { FzButton } from "@fiscozen/button";

const props = withDefaults(defineProps<FzTableProps>(), {
  pageInterval: 2,
  activePage: 0,
});

const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, rowData: Record<string, any>];
}>();
const activePage = defineModel<number>("activePage");

const slots = useSlots();

const defaultSlot = slots.default?.();
const columns =
  defaultSlot
    ?.filter((elem) => elem.type === FzColumn)
    .map((column) => ({
      props: column.props as FzColumnProps,
      children: column.children as FzColumnSlots,
    })) ?? [];

const grid = ref<HTMLDivElement>();

const staticClasses = ref(["grid"]);

const headerStaticClasses = [
  "fz__header__cell",
  "sticky",
  "top-0",
  "z-[2]",
  "bg-grey-100",
  "px-16",
  "h-48",
  "font-medium",
  "flex",
  "justify-start",
  "items-center",
];
const headerClasses = computed(() => {});

const bodyStaticClasses = [
  "fz__body",
  "z-[1]",
  "px-16",
  "min-h-48",
  "bg-core-white",
  "flex",
  "justify-start",
  "items-center",
  "min-w-min",
  "border-b-1",
  "border-grey-100",
];

const getBodyClasses = (
  column: { props: FzColumnProps; children: FzColumnSlots },
  isHeader?: boolean
) => {
  return {
    relative: !column.props.sticky,
    sticky: column.props.sticky,
    "left-0 z-[2]": column.props.sticky === "left",
    "z-[3]": column.props.sticky && isHeader,
    "right-0": column.props.sticky === "right",
  };
};

const centerPageList = computed(() => {
  if (!props.pages) {
    return [];
  }
  const safeActivePage = activePage.value || 0;
  return new Array(props.pages)
    .fill(0)
    .map((val, index) => index)
    .filter((el) => {
      const res =
        Math.abs(el - safeActivePage) <= props.pageInterval &&
        el !== 0 &&
        el !== props.pages - 1;
      return res;
    });
});

const totalColumns = computed(() => {
  let res = columns.length;
  if (props.actions?.items.length) {
    res++;
  }
  return res;
});

const colSpan = computed(() => ({
  "grid-column": `span ${totalColumns.value} / span ${totalColumns.value}`,
}));
</script>

<template>
  <div class="m-0 p-0 size-full">
    <div class="fz__table overflow-auto size-full">
      <div
        :class="[staticClasses]"
        :style="{
          'grid-template-columns': `repeat(${columns.length}, minmax(min-content, 1fr))`
        }"
        ref="grid"
        role="table"
        :aria-rowcount="value.length"
        :aria-colcount="columns.length"
      >
        <div
          v-for="column in columns"
          :class="[headerStaticClasses, headerClasses, getBodyClasses(column, true)]"
          role="columnheader"
          aria-sort="none"
        >
          {{ column.props.header }}
        </div>
        <div
          v-if="actions"
          :class="['fz__table__header--actions w-[80px]', headerStaticClasses, headerClasses]"
        >
          Azioni
        </div>
        <div
          class="grid grid-cols-subgrid"
          v-if="value && value.length"
          v-for="(row, index) in value"
          :aria-rowindex="index + 1"
          :style="colSpan"
          role="row"
        >
          <slot :name="`row-${index}`">
            <div
              :class="[bodyStaticClasses, getBodyClasses(column)]"
              role="cell"
              v-for="column in columns"
            >
              {{
                row[column.props.field?.toLowerCase() || column.props.header.toLowerCase()]
              }}
            </div>
            <div v-if="actions" :class="['w-[80px]', bodyStaticClasses]">
              <FzIconDropdown
                :actions="actions.items"
                @fzaction:click="(actionIndex: number) => emit('fztable:rowactionclick', actionIndex, row)"
              ></FzIconDropdown>
            </div>
          </slot>
        </div>
        <div
          v-else
          class="fz__table__empty h-full mt-80 justify-self-center"
          :style="colSpan"
        >
          {{ placeholder ?? "No data available" }}
        </div>
      </div>
    </div>
    <div
      class="fz__table__footer w-full flex flex-row justify-end m-8"
      v-if="pages && value?.length"
    >
      <div class="fz__table__pagination flex flex-row justify-between items-center gap-8">
        <FzButton
          @click="activePage = 0"
          :variant="activePage === 0 ? 'primary' : 'secondary'"
          size="sm"
          >1</FzButton
        >
        <div class="fz__pagination__separator" v-if="activePage - pageInterval - 1 > 0">
          ...
        </div>
        <FzButton
          v-for="page in centerPageList"
          @click="activePage = page"
          :variant="activePage === page ? 'primary' : 'secondary'"
          size="sm"
        >
          {{ page + 1 }}
        </FzButton>
        <div
          class="fz__pagination__separator"
          v-if="pages - activePage - pageInterval - 2 > 0"
        >
          ...
        </div>
        <FzButton
          @click="activePage = pages - 1"
          :variant="activePage === pages - 1 ? 'primary' : 'secondary'"
          size="sm"
          >{{ pages }}</FzButton
        >
      </div>
    </div>
  </div>
</template>
