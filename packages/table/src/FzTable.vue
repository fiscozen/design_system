<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, useSlots, onMounted, onUnmounted } from "vue";
import {
  FzRow,
  FzRowProps,
  FzRowSlots,
  FzTableProps,
  FzOrdering,
  FzTableFilters,
} from "./";
import { getBodyClasses, bodyStaticClasses } from "./utils";
import { FzButton, FzIconButton } from "@fiscozen/button";
import { FzColumn, FzColumnSlots, FzColumnProps } from "@fiscozen/simple-table";
import { FzIcon } from "@fiscozen/icons";
import { FzInput } from "@fiscozen/input";
import { useMediaQuery } from "@fiscozen/composables";
import { breakpoints } from "@fiscozen/style";
import { ascend, descend, sortWith, prop } from "ramda";
import { FzCheckbox } from "@fiscozen/checkbox";
import { FzConfirmDialog } from "@fiscozen/dialog";

const props = withDefaults(defineProps<FzTableProps>(), {
  pageInterval: 2,
  activePage: 0,
  searchFilterPlaceholder: "Cerca...",
  selectable: false,
  variant: "normal",
});

type RowData = T & {
  subRows?: T[];
};
const modelValue = defineModel<RowData[]>();
const ordering = defineModel<Record<string, FzOrdering>>("ordering", {
  default: {},
});
const filters = defineModel<FzTableFilters>("filters", {
  default: {},
});
const activePage = defineModel<number>("activePage");
const searchOpen = ref(false);
const filtersOpen = ref(false);
const grid = ref<HTMLDivElement>();
const filtersDialog = ref();

const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, rowData: Record<string, any>];
  "fztable:ordering": [
    ordering: FzOrdering,
    newOrderingDirection: FzOrdering["direction"],
  ];
  "update:searchTerm": [searchTerm: string];
  "fztable:newitem": [];
}>();

const slots = useSlots();
const smOrSmaller = useMediaQuery(`(max-width: ${breakpoints.sm})`);

const defaultSlot = slots.default?.();
const columns = computed(() => {
  if (!slots.default) return [];

  return (
    defaultSlot
      ?.filter((elem) => elem.type === FzColumn)
      .map((column) => ({
        props: column.props as FzColumnProps,
        children: column.children as FzColumnSlots,
        emit: column.ctx.emit,
      })) ?? []
  );
});

const rows = computed(() => {
  if (!slots.default) return [];
  return (
    defaultSlot
      ?.filter((elem) => elem.type === FzRow)
      .map((row) => ({
        props: row.props as FzRowProps,
        children: row.children as FzRowSlots,
      })) ?? []
  );
});

const hasActiveFilters = computed(() => {
  if (!filters.value) return false;
  const activeFilter = Object.values(filters.value).find(
    (filter) => !!filter.value,
  );
  return !!activeFilter;
});

const staticClasses = ref(["grid"]);

const headerStaticClasses = [
  "fz__header__cell",
  "sticky",
  "top-0",
  "z-[2]",
  "bg-grey-100",
  "px-16",
  "h-[52px]",
  "font-medium",
  "flex",
  "justify-center",
  "items-center",
  "cursor-pointer",
  "text-grey-500",
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
  let res = columns.value.length;
  if (props.actions?.items.length) {
    res++;
  }
  if (props.selectable) {
    res++;
  }
  if (props.variant === "accordion") {
    res++;
  }
  return res;
});

const gridTemplateStyle = computed(() => {
  let res = "";
  if (props.variant === "accordion") {
    res = `40px`;
  }
  columns.value.reduce((acc, column) => {
    if (column.props.width) {
      res += ` ${column.props.width}`;
    } else {
      res += ` auto`;
    }
    return acc;
  }, res);
  if (props.actions?.items.length) {
    res = `${res} 44px`;
  }
  if (props.selectable) {
    res = `40px ${res}`;
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

const iconCols = computed(() => {
  let res = 1;
  if (props.searchable && !smOrSmaller.value) res++;
  if (props.filterable) res++;
  if (props.allowFullscreen) res++;
  if (props.newItemButton) res++;
  return res;
});

const inconColsStyle = computed(() => {
  let res = `grid-template-columns: 1fr`;
  if (props.searchable && !smOrSmaller.value && !searchOpen.value)
    res += ` auto`;
  if (props.searchable && !smOrSmaller.value && searchOpen.value)
    res += ` auto`;
  if (props.filterable && !smOrSmaller.value) res += ` auto`;
  if (props.allowFullscreen) res += ` 32px`;
  if (props.newItemButton && !smOrSmaller.value) res += ` auto`;
  if (props.newItemButton && smOrSmaller.value) res += ` auto`;
  return res;
});

const selectedRowIds = ref(new Set());
const openRowIds = ref(new Set());
const allSelected = ref(false);

const isOverflowing = ref(false);
const handleResize = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    if (entry) {
      isOverflowing.value = entry.target.scrollWidth > entry.target.clientWidth;
    }
  }
};
const resizeObserver = new ResizeObserver(handleResize);

const toggleSelectAll = () => {
  if (!allSelected.value) {
    allSelected.value = true;
    selectedRowIds.value = new Set(
      internalValue.value.map((row, index) => index),
    );
  } else {
    allSelected.value = false;
    selectedRowIds.value.clear();
  }
};

const toggleRowSelection = (rowId: number) => {
  if (allSelected.value) {
    allSelected.value = false;
  }
  if (selectedRowIds.value.has(rowId)) {
    selectedRowIds.value.delete(rowId);
  } else {
    selectedRowIds.value.add(rowId);
  }
};

const selectedRows = computed(() => {
  return internalValue.value.filter((row, index) =>
    selectedRowIds.value.has(index),
  );
});

const toggleSubRow = (rowId: number) => {
  if (openRowIds.value.has(rowId)) {
    openRowIds.value.delete(rowId);
  } else {
    openRowIds.value.add(rowId);
  }
};

const getOrdering = (column: FzColumnProps): FzOrdering | undefined => {
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

const emptyFilters = () => {
  for (const filter in filters.value) {
    filters.value[filter].value = "";
  }
  if (smOrSmaller.value) {
    filtersDialog.value.close()
  } else {
    filtersOpen.value = false;
  }
};

const handleCloseSearch = () => {
  emit("update:searchTerm", "");
  searchOpen.value = false;
};

const handleOpenFilters = () => {
  if (smOrSmaller.value) {
    filtersDialog.value.show();
  } else {
    filtersOpen.value = true;
  }
};

const handleFullscreen = () => {
  const el = document.querySelector('.fz-table-container');
  el?.requestFullscreen();
  isFullScreen.value = true;
}

const isFullScreen = ref(false);

const exitFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  isFullScreen.value = false;
}

const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullScreen.value) {
    exitFullScreen();
  }
};

onMounted(() => {
  const el = document.querySelector('.fz__table.overflow-auto');
  if (el) {
    resizeObserver.observe(el);
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  resizeObserver.disconnect();
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('keydown', handleKeyDown);
});

</script>

<template>
  <div class="fz-table-container m-0 p-0 size-full text-grey-500">
    <div class="w-full flex flex-col items-start mb-20" v-if="title">
      <span class="text-xl font-medium text-core-black">
        {{ title }}
      </span>
      <span class="text-lg">{{ subtitle }}</span>
    </div>
    <div
      :class="[
        'grid mb-12 items-center gap-8',
        smOrSmaller && searchOpen ? 'grid-rows-2' : 'grid-rows-1',
      ]"
      :style="inconColsStyle"
    >
      <div class="justify-self-start grow">
        <span v-if="!selectedRows.length"
          >{{ internalValue.length || rows.length }}
          {{ recordLabel || "risultati" }}</span
        >
        <span v-if="selectedRows.length"
          >{{ selectedRows.length }} {{ recordLabel || "selezionate" }}</span
        >
      </div>
      <FzIconButton
        v-if="searchable && !searchOpen && !smOrSmaller"
        variant="invisible"
        iconName="magnifying-glass"
        @click="() => (searchOpen = true)"
      ></FzIconButton>
      <FzInput
        v-if="(searchable && searchOpen) || (searchable && smOrSmaller)"
        data-cy="fztable-search"
        :class="[smOrSmaller ? 'row-start-2' : 'max-w-xs']"
        :style="smOrSmaller ? `grid-column: 1 / span ${iconCols}` : ''"
        label=""
        leftIcon="magnifying-glass"
        rightIcon="xmark"
        :placeholder="searchFilterPlaceholder"
        @fzinput:right-icon-click="handleCloseSearch"
        @update:modelValue="emit('update:searchTerm', $event)"
      />
      <FzIconButton
        v-if="allowFullscreen && !isFullScreen"
        @click="handleFullscreen"
        variant="invisible"
        iconName="arrow-up-right-and-arrow-down-left-from-center"
      ></FzIconButton>
      <FzIconButton
        v-if="allowFullscreen && isFullScreen"
        @click="exitFullScreen()"
        variant="invisible"
        iconName="arrow-down-left-and-arrow-up-right-to-center"
      ></FzIconButton>
      <FzIconButton
        :class="['ml-8', { 'row-start-1': smOrSmaller }]"
        :style="smOrSmaller ? `grid-column-start: ${iconCols - 1}` : ''"
        v-if="filterable"
        :variant="hasActiveFilters ? 'notification' : 'invisible'"
        iconName="bars-filter"
        @click="handleOpenFilters"
      ></FzIconButton>
      <FzButton
        class="ml-16"
        v-if="newItemButton && !smOrSmaller"
        @click="emit('fztable:newitem')"
        >{{ newItemButtonLabel }}</FzButton
      >
      <FzIconButton
        :class="['ml-8', { 'row-start-1': smOrSmaller }]"
        :style="smOrSmaller ? `grid-column-start: ${iconCols}` : ''"
        v-if="newItemButton && smOrSmaller"
        iconName="plus"
        iconVariant="far"
        bars-filter
        @click="emit('fztable:newitem')"
      ></FzIconButton>
    </div>
    <div class="fz__table overflow-auto size-full">
      <div
        :class="[staticClasses]"
        :style="{
          'grid-template-columns':
            props.gridTemplateColumns ?? gridTemplateStyle,
        }"
        ref="grid"
        role="table"
        :aria-rowcount="internalValue?.length || rows.length"
        :aria-colcount="columns.length"
      >
        <div
          v-if="variant === 'accordion'"
          :class="[
            'fz__table__header--accordion',
            headerStaticClasses,
            headerClasses,
          ]"
        ></div>
        <div
          v-if="selectable"
          :class="[
            headerStaticClasses,
            headerClasses,
            'sticky left-0 z-[3] w-[40px] justify-center items-center',
          ]"
        >
          <FzCheckbox
            label=""
            class="fz__table__header--checkbox"
            :modelValue="allSelected"
            :emphasis="true"
            value="all"
            @change="toggleSelectAll($event)"
          />
        </div>
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
                ? 'arrow-up'
                : 'arrow-down'
            "
            size="md"
            class="ml-8 cursor-pointer"
          ></FzIcon>
        </div>
        <div
          v-if="actions"
          :class="[
            'fz__table__header--actions',
            headerStaticClasses,
            headerClasses,
            'sticky right-0 z-[3] px-4',
            {'left-shadow': isOverflowing},
          ]"
        >
        </div>
        <template v-if="internalValue?.length && variant === 'normal'">
          <slot v-for="(row, index) in internalValue" :name="`row-${index}`">
            <FzRow
              :key="index"
              :id="index"
              :columns="columns"
              :colSpan
              :data="row"
              :isOverflowing
              :actions="props.actions"
              :selectable="props.selectable"
              :selected="selectedRowIds.has(index)"
              @update:selected="toggleRowSelection(index)"
            />
          </slot>
        </template>
        <template
          v-else-if="internalValue?.length && variant === 'accordion'"
          v-for="(row, index) in internalValue"
        >
          <FzRow
            :id="index"
            :columns="columns"
            :data="row"
            :actions="props.actions"
            :selectable="props.selectable"
            :selected="selectedRowIds.has(index)"
            :isOverflowing
            :colSpan
            :leftColIconClass="openRowIds.has(index) ? 'text-blue-500' : ''"
            :leftColIcon="openRowIds.has(index) ? 'angle-up' : 'angle-right'"
            @update:selected="toggleRowSelection(index)"
            @click="toggleSubRow(index)"
          />
          <template
            v-for="(subrow, subindex) in row.subRows"
            v-if="openRowIds.has(index)"
            class="!bg-slate-100"
            :key="subindex"
          >
            <FzRow
              :id="subindex"
              :columns="columns"
              :data="subrow"
              :actions="props.actions"
              :colSpan
              :isOverflowing
              leftColIcon="circle"
              leftColIconSize="xs"
              leftColIconClass="text-blue-500"
            />
          </template>
        </template>
        <template v-else-if="rows && rows.length">
          <div
            :class="[
              'grid grid-cols-subgrid border-b-1 border-solid border-grey-100 bg-core-white hover:bg-alice-blue',
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
          @click="activePage--"
          variant="invisible"
          :disabled="activePage === 0"
          size="md"
          iconPosition="before"
          iconName="angle-left"
          >Indietro</FzButton
        >
        <FzButton
          class="size-32 !px-0"
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
          class="size-32 !px-0"
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
          class="size-32 !px-0"
          @click="activePage = pages - 1"
          :variant="activePage === pages - 1 ? 'primary' : 'secondary'"
          size="sm"
          >{{ pages }}</FzButton
        >
        <FzButton
          @click="activePage++"
          variant="invisible"
          :disabled="activePage === pages - 1"
          size="md"
          iconPosition="after"
          iconName="angle-right"
          >Avanti</FzButton
        >
      </div>
    </div>
  </div>
  <Transition name="filters" v-if="!smOrSmaller">
    <div
      class="flex flex-col fz-filters h-screen w-[480px] border-solid border-gray-100 border-1 fixed z-40 top-0 right-0 bg-core-white justify-between"
      v-if="filtersOpen"
    >
      <div
        class="flex flex-row h-[42px] w-full text-lg text-core-black border-b-1 border-solid border-gray-100 items-center p-12"
      >
        <span class="grow text-xl">Filtri</span>
        <FzIconButton
          iconName="xmark-large"
          @click="filtersOpen = false"
          variant="invisible"
        />
      </div>
      <div
        class="flex flex-col w-full mt-32 px-12 grow"
        v-for="(filter, filterKey) in filters"
        :key="filterKey"
      >
        <span class="text-xl text-core-black capitalize mb-12">{{
          filterKey
        }}</span>
        <slot :name="`filter-${filterKey}`"></slot>
      </div>
      <div
        class="flex flex-row items-center h-64 p-12 border-t-1 border-solid border-gray-100"
      >
        <FzButton
          variant="danger"
          :disabled="!hasActiveFilters"
          @click="emptyFilters"
          >Cancella filtri</FzButton
        >
      </div>
    </div>
  </Transition>
  <FzConfirmDialog
    ref="filtersDialog"
    v-if="smOrSmaller"
    title="Filtri"
    cancelLabel="Indietro"
    confirmLabel="Salva"
    :cancelButtonEnabled="hasActiveFilters"
  >
    <template #body>
      <div
        class="flex flex-col w-full mt-32 px-12 grow"
        v-for="(filter, filterKey) in filters"
        :key="filterKey"
      >
        <span class="text-xl text-core-black capitalize mb-12">{{
          filterKey
        }}</span>
        <slot :name="`filter-${filterKey}`"></slot>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row w-full justify-between">
        <FzButton
          variant="danger"
          :disabled="!hasActiveFilters"
          @click="emptyFilters"
          >Cancella filtri</FzButton
        >
        <FzButton
          variant="primary"
          @click="() => filtersDialog.close()"
          >Chiudi</FzButton
        >
      </div>
    </template>
  </FzConfirmDialog>
</template>

<style>
.search-enter-active,
.search-leave-active {
  transition: width 2.5s ease;
}

.search-enter-from,
.search-leave-to {
  width: 0px;
}

.filters-enter-active,
.filters-leave-active {
  transition: right 0.5s ease;
}

.filters-enter-from,
.filters-leave-to {
  right: -480px;
}

.left-shadow {
  box-shadow:
    -1px 0px 2px 0px rgba(0, 0, 0, 0.06),
    -1px 0px 3px 0px rgba(0, 0, 0, 0.1);
}
</style>
