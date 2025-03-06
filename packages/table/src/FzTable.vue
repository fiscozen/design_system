<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import { FzRow, FzRowProps, FzRowSlots, FzTableProps, Ordering } from "./";
import { getBodyClasses, bodyStaticClasses } from "./utils";
import { FzButton } from "@fiscozen/button";
import { FzColumn, FzColumnSlots, FzColumnProps } from "@fiscozen/simple-table";
import { FzIcon } from "@fiscozen/icons";
import { FzInput } from "@fiscozen/input";
import { ascend, descend, sortWith, prop } from "ramda";

const props = withDefaults(defineProps<FzTableProps>(), {
  pageInterval: 2,
  activePage: 0,
  searchFilterLabel: "Ricerca",
});

const modelValue = defineModel<Record<string, any>[]>();
const ordering = defineModel<Record<string, Ordering>>("ordering", {
  default: {},
});
const activePage = defineModel<number>("activePage");

const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, rowData: Record<string, any>];
  "fztable:ordering": [
    ordering: Ordering,
    newOrderingDirection: Ordering["direction"],
  ];
  "update:searchTerm": [searchTerm: string];
}>();

const slots = useSlots();

const defaultSlot = slots.default?.();
const columns =
  defaultSlot
    ?.filter((elem) => elem.type === FzColumn)
    .map((column) => ({
      props: column.props as FzColumnProps,
      children: column.children as FzColumnSlots,
    })) ?? [];

const rows =
  defaultSlot
    ?.filter((elem) => elem.type === FzRow)
    .map((row) => ({
      props: row.props as FzRowProps,
      children: row.children as FzRowSlots,
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
  "justify-center",
  "items-center",
  "cursor-pointer",
];
const headerClasses = computed(() => {});

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

const internalValue = computed(() => {
  let res = modelValue.value || [];
  const safeOrdering = Object.entries(ordering.value)
    .filter(([key, val]) => !!val.orderable && !!val.direction)
    .map(([key, val]) => {
      let dirFn = val.direction === "asc" ? ascend : descend;
      return dirFn(prop(key));
    });
  if (props.internalOrdering) {
    res = sortWith(safeOrdering)(res) as Record<string, any>[];
  }
  return res;
});

const getOrdering = (column: FzColumnProps): Ordering | undefined => {
  const safeKey = column.field || column.header;
  return ordering?.value && ordering.value[safeKey.toLowerCase()];
};

const handleOrderingClick = (colProps: FzColumnProps) => {
  const colOrdering = getOrdering(colProps);
  if (!colOrdering) {
    return;
  }
  if (colOrdering.direction === "asc") {
    emit("fztable:ordering", colOrdering, "desc");
    if (props.internalOrdering) {
      colOrdering.direction = "desc";
    }
  } else {
    emit("fztable:ordering", colOrdering, "asc");
    if (props.internalOrdering) {
      colOrdering.direction = "asc";
    }
  }
};
</script>

<template>
  <div class="m-0 p-0 size-full">
    <div class="flex flex-row justify-end">
      <FzInput
        v-if="props.filterable"
        data-cy="fztable-search"
        class="mb-8 max-w-xs"
        :label="props.searchFilterLabel"
        @update:modelValue="emit('update:searchTerm', $event)"
      />
    </div>
    <div class="fz__table overflow-auto size-full">
      <div
        :class="[staticClasses]"
        :style="{
          'grid-template-columns':
            props.gridTemplateColumns ??
            `repeat(${columns.length}, minmax(min-content, 1fr))`,
        }"
        ref="grid"
        role="table"
        :aria-rowcount="internalValue?.length || rows.length"
        :aria-colcount="columns.length"
      >
        <div
          v-for="column in columns"
          :class="[
            headerStaticClasses,
            headerClasses,
            getBodyClasses(column, true),
          ]"
          @click="handleOrderingClick(column.props)"
          role="columnheader"
          aria-sort="none"
        >
          {{ column.props.header }}
          <FzIcon
            v-if="getOrdering(column.props)?.orderable"
            data-cy="fztable-ordering"
            :name="
              getOrdering(column.props).direction === 'asc'
                ? 'chevron-up'
                : 'chevron-down'
            "
            size="sm"
            class="ml-4 cursor-pointer"
          ></FzIcon>
        </div>
        <div
          v-if="actions"
          :class="[
            'fz__table__header--actions w-[80px]',
            headerStaticClasses,
            headerClasses,
          ]"
        >
          Azioni
        </div>
        <template v-if="internalValue?.length">
          <div
            class="grid grid-cols-subgrid border-b-1 border-solid border-grey-100"
            v-for="(row, index) in internalValue"
            :aria-rowindex="index + 1"
            :style="colSpan"
            role="row"
          >
            <slot :name="`row-${index}`" :columns :data="row" :actions>
              <FzRow :columns :data="row" :actions> </FzRow>
            </slot>
          </div>
        </template>
        <template v-else-if="rows && rows.length">
          <div
            :class="[
              'grid grid-cols-subgrid border-b-1 border-solid border-grey-100',
              bodyStaticClasses,
            ]"
            v-for="(row, index) in rows"
            :aria-rowindex="index + 1"
            :style="colSpan"
            role="row"
          >
            <component
              v-if="row.children?.default"
              :is="row.children.default"
              :actions
              :columns
            />
          </div>
        </template>
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
      v-if="pages && internalValue?.length"
    >
      <div
        class="fz__table__pagination flex flex-row justify-between items-center gap-8"
      >
        <FzButton
          @click="activePage = 0"
          :variant="activePage === 0 ? 'primary' : 'secondary'"
          size="sm"
          >1</FzButton
        >
        <div
          class="fz__pagination__separator"
          v-if="activePage - pageInterval - 1 > 0"
        >
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
