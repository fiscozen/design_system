<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, useSlots, onMounted, onUnmounted, VNode } from "vue";
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
import { ascend, descend, sortWith } from "ramda";
import { FzCheckbox } from "@fiscozen/checkbox";
import { FzConfirmDialog } from "@fiscozen/dialog";
import { FzActionProps } from "@fiscozen/action";
import { FzProgress } from "@fiscozen/progress";

FzCheckbox.compatConfig = {
  MODE: 3,
};

FzInput.compatConfig = {
  MODE: 3,
};

FzIcon.compatConfig = {
  MODE: 3,
};

const props = withDefaults(defineProps<FzTableProps>(), {
  pageInterval: 2,
  searchFilterPlaceholder: "Cerca...",
  selectable: false,
  variant: "normal",
  actionLabel: "",
  loading: false,
  newItemButtonIcon: "plus",
});

type RowData = T & {
  subRows?: T[];
};
const modelValue = defineModel<RowData[]>();
const ordering = defineModel<Record<string, FzOrdering>>("ordering", {
  default: {},
});
const selectedRowIds = defineModel<Set<string | number>>("selectedRowIds");

const activePage = defineModel<number>("activePage", { default: 0 });
const searchOpen = ref(false);
const filtersOpen = ref(false);
const grid = ref<HTMLDivElement>();
const filtersDialog = ref();

const emit = defineEmits<{
  "fztable:rowactionclick": [actionIndex: number, action: FzActionProps, rowData?: Record<string, any>];
  "fztable:ordering": [
    ordering: FzOrdering,
    newOrderingDirection: FzOrdering["direction"],
  ];
  "update:searchTerm": [searchTerm: string];
  "fztable:newitem": [];
  "fztable:updateFilters": [filters: FzTableFilters];
  "fztable:emptyFilters": [];
}>();

const slots = useSlots();
const smOrSmaller = useMediaQuery(`(max-width: ${breakpoints.sm})`);

const defaultSlot = computed(() => slots.default?.());
const getColumn = (column: VNode) => ({
  props: column.props as FzColumnProps,
  children: column.children as FzColumnSlots
});
const columns = computed(() => {
  if (!slots.default) return [];

  return (
    defaultSlot.value
      ?.filter((elem) => (elem.type === FzColumn) || (typeof elem.type === 'symbol' && Array.isArray(elem.children)))
      .flatMap((slot) => {
        if (slot.type === FzColumn) {
          return getColumn(slot);
        } else {
          return (slot.children as VNode[])?.map(getColumn);
        }
      }) ?? []
  );
});

const rows = computed(() => {
  if (!slots.default) return [];
  return (
    defaultSlot.value
      ?.filter((elem) => elem.type === FzRow)
      .map((row) => ({
        props: row.props as FzRowProps<T>,
        children: row.children as FzRowSlots,
      })) ?? []
  );
});

const filters = computed({
  get() {
    const res = columns.value.filter(col => col.props.filterable).reduce((acc, column) => {
      acc[column.props.field || column.props.header] = column.props.filterName || column.props.header
      return acc;
    }, {} as Record<string, string>)
    return {
      ...res,
      ...props.extFilters
    }
  },
  set(value: FzTableFilters) {
    emit("fztable:updateFilters", value);
  }
})

const hasFilters = computed(() => Object.keys(filters.value).length > 0);

const staticClasses = ref(["grid relative"]);

const headerStaticClasses = [
  "fz__header__cell",
  "sticky",
  "top-0",
  "z-[2]",
  "bg-grey-100",
  "p-16",
  "min-h-[52px]",
  "text-base",
  "flex",
  "items-center",
  "cursor-pointer",
  "text-grey-500",
];
const getHeaderClasses = (column: FzColumnProps) => {
  return {
    'justify-start': (column.headerTextJustify === "left"),
    'justify-center': column.headerTextJustify === "center",
    'justify-end': column.headerTextJustify === "right" || typeof column.numeric !== "undefined",
  }
};

const effectivePageInterval = computed(() => {
  return smOrSmaller.value ? 1 : props.pageInterval;
});

const centerPageList = computed(() => {
  const pages = props.pages;
  if (!pages) {
    return [];
  }
  const safeActivePage = activePage.value || 0;
  return new Array(pages)
    .fill(0)
    .map((val, index) => index)
    .filter((el) => {
      const res =
        Math.abs(el - safeActivePage) <= effectivePageInterval.value &&
        el !== 0 &&
        el !== pages - 1;
      return res;
    });
});

const totalColumns = computed(() => {
  let res = columns.value.length;
  if (props.actions) {
    res++;
  }
  if (props.selectable) {
    res++;
  }
  if (['accordion', 'radio'].includes(props.variant)) {
    res++;
  }
  return res;
});

const gridTemplateStyle = computed(() => {
  let res = "";
  if (['radio', 'list'].includes(props.variant) && smOrSmaller.value) {
    res = '1fr';
  } else {
    res = columns.value.reduce((acc, column) => {
      if (column.props.width) {
        acc += ` ${column.props.width}`;
      } else {
        acc += ` auto`;
      }
      return acc;
    }, "");
  }
  if (props.actions) {
    res = `${res} min-content`;
  }
  if (props.selectable || props.variant === "radio" || props.variant === "accordion") {
    res = `min-content ${res}`;
  }
  return res;
});

const internalValue = computed(() => {
  let res: RowData[] = modelValue.value || [];
  const safeOrdering = Object.entries(ordering.value)
    .filter(([key, val]) => !!val.orderable && !!val.direction && val.direction !== "none")
    .map(([key, val]) => {
      let dirFn = val.direction === "asc" ? ascend : descend;
      return dirFn((obj: RowData) => obj[key]);
    });
  if (props.internalOrdering) {
    res = sortWith(safeOrdering)(res);
  }
  return res;
});

const iconCols = computed(() => {
  let res = 1;
  if (props.searchable && !smOrSmaller.value) res++;
  if (hasFilters.value) res++;
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
  if (hasFilters.value && !smOrSmaller.value) res += ` auto`;
  if (props.allowFullscreen) res += ` 32px`;
  if (props.newItemButton && !smOrSmaller.value) res += ` auto`;
  if (props.newItemButton && smOrSmaller.value) res += ` auto`;
  return res;
});

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
      internalValue.value.map((row, index) => row.id || index),
    );
  } else {
    allSelected.value = false;
    selectedRowIds.value?.clear();
  }
};

const toggleRowSelection = (rowId: number) => {
  if (allSelected.value) {
    allSelected.value = false;
  }
  if (selectedRowIds.value?.has(rowId)) {
    selectedRowIds.value.delete(rowId);
  } else {
    if (props.variant === "radio") {
      selectedRowIds.value?.clear();
    }
    selectedRowIds.value?.add(rowId);
  }
  selectedRowIds.value = new Set(selectedRowIds.value);
};

const selectedRows = computed(() => {
  if (!selectedRowIds.value || !internalValue.value) {
    return [];
  }
  return internalValue.value.filter((row, index) =>
    selectedRowIds.value?.has(row.id || index),
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

const orderingIconName = (colProps: FzColumnProps) => {
  const colOrdering = getOrdering(colProps);
  switch (colOrdering?.direction) {
    case "asc":
      return "sort-up";
    case "desc":
      return "sort-down";
    case "none":
      return "sort";
    default:
      return "";
  }
};

const getAriaSort = (colProps: FzColumnProps): "ascending" | "descending" | "none" | undefined => {
  const colOrdering = getOrdering(colProps);
  if (!colOrdering?.orderable) {
    return undefined;
  }
  switch (colOrdering.direction) {
    case "asc":
      return "ascending";
    case "desc":
      return "descending";
    case "none":
      return "none";
    default:
      return undefined;
  }
};

const handleOrderingClick = (colProps: FzColumnProps) => {
  const colOrdering = getOrdering(colProps);
  if (!colOrdering) {
    return;
  }
  switch (colOrdering.direction) {
    case "asc":
      emit("fztable:ordering", colOrdering, "desc");
      if (props.internalOrdering) {
        colOrdering.direction = "desc";
      }
      break;
    case "desc":
      emit("fztable:ordering", colOrdering, "none");
      if (props.internalOrdering) {
        colOrdering.direction = "none";
      }
      break;
    case "none":
      emit("fztable:ordering", colOrdering, "asc");
      if (props.internalOrdering) {
        colOrdering.direction = "asc";
      }
  }
};

const emptyFilters = () => {
  emit('fztable:emptyFilters');
  filtersOpen.value = false;
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

const isSelected = (rowId: number) => {
  return selectedRowIds.value?.has(rowId);
};

const indeterminate = computed(() => {
  return (
    selectedRowIds.value &&
    selectedRowIds.value.size > 0 &&
    !allSelected.value
  );
});

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
  <div :class="['fz-table-container m-0 p-0 size-full text-grey-500 relative flex flex-col', tableClass]">
    <div class="w-full flex flex-col items-start mb-20" v-if="title">
      <span class="text-xl font-medium text-core-black">
        {{ title }}
      </span>
      <span class="text-lg">{{ subtitle }}</span>
    </div>
    <div :class="[
      'grid mb-20 items-center gap-8',
      smOrSmaller && searchOpen ? 'grid-rows-2' : 'grid-rows-1',
    ]" :style="inconColsStyle">
      <div class="justify-self-start grow">
        <span v-if="!selectedRows.length">{{ props.recordNumber || (internalValue.length || rows.length) }}
          {{ recordLabel || "risultati" }}</span>
        <span v-if="selectedRows.length">{{ selectedRows.length }} {{ recordLabel || "selezionate" }}</span>
      </div>
      <FzIconButton v-if="searchable && !searchOpen && !smOrSmaller" variant="invisible" iconName="magnifying-glass"
        @click="() => (searchOpen = true)"></FzIconButton>
      <FzInput v-if="(searchable && searchOpen) || (searchable && smOrSmaller)" data-cy="fztable-search"
        :class="[smOrSmaller ? 'row-start-2' : 'max-w-xs']"
        :style="smOrSmaller ? `grid-column: 1 / span ${iconCols}` : ''" label="" leftIcon="magnifying-glass"
        rightIcon="xmark" :placeholder="searchFilterPlaceholder" @fzinput:right-icon-click="handleCloseSearch"
        @update:modelValue="emit('update:searchTerm', $event)" />
      <FzIconButton v-if="allowFullscreen && !isFullScreen" @click="handleFullscreen" variant="invisible"
        iconName="arrow-up-right-and-arrow-down-left-from-center"></FzIconButton>
      <FzIconButton v-if="allowFullscreen && isFullScreen" @click="exitFullScreen()" variant="invisible"
        iconName="arrow-down-left-and-arrow-up-right-to-center"></FzIconButton>
      <FzIconButton :class="['ml-8', { 'row-start-1': smOrSmaller }]"
        :style="smOrSmaller ? `grid-column-start: ${iconCols - 1}` : ''" v-if="hasFilters"
        variant="invisible" :hasNotification="hasActiveFilters" iconName="bars-filter" @click="handleOpenFilters">
      </FzIconButton>
      <FzButton class="ml-16" v-if="newItemButton && !smOrSmaller" :disabled="newItemButtonDisabled" :iconAndLabel="!!newItemButtonIcon" :iconName="newItemButtonIcon" size="lg"
        @click="emit('fztable:newitem')">{{ newItemButtonLabel }}</FzButton>
      <FzIconButton :class="['ml-8', { 'row-start-1': smOrSmaller }]"
        :style="smOrSmaller ? `grid-column-start: ${iconCols}` : ''" v-if="newItemButton && smOrSmaller" :iconName="newItemButtonIcon"
        iconVariant="far" bars-filter size="lg" @click="emit('fztable:newitem')"></FzIconButton>
    </div>
    <div class="fz__table overflow-auto relative">
      <template v-if="loading">
        <div class="fz__table__loading h-full w-full flex justify-center items-center min-h-[200px] absolute z-20 bg-gray-100/60">
          <slot name="loading">
            <FzProgress />
          </slot>
        </div>
      </template>
      <div :class="[staticClasses, { 'min-h-[200px]': !(internalValue?.length || rows?.length) }]" :style="{
        'grid-template-columns':
          props.gridTemplateColumns ?? gridTemplateStyle,
      }" ref="grid" role="table" :aria-rowcount="internalValue?.length || rows.length" :aria-colcount="totalColumns">
        <template v-if="!((variant == 'list') || (variant === 'radio' && smOrSmaller))">
          <div v-if="variant === 'accordion'" :class="[
            'fz__table__header--accordion',
            headerStaticClasses,
          ]"></div>
          <div v-if="variant === 'radio'" :class="[
            'fz__table__header--radio',
            headerStaticClasses,
          ]"></div>
          <div v-if="selectable" :class="[
            headerStaticClasses,
            'sticky left-0 z-[3] w-[36px] justify-center items-center',
          ]">
            <FzCheckbox label="" class="fz__table__header--checkbox" :modelValue="allSelected" :emphasis="!indeterminate"
              :indeterminate
              value="all" @change="toggleSelectAll()" />
          </div>
          <div v-for="column in columns" :class="[
            headerStaticClasses,
            getHeaderClasses(column.props),
            getBodyClasses(column, true),
          ]" @click="handleOrderingClick(column.props)" role="columnheader" :aria-sort="getAriaSort(column.props)">
            {{ column.props.header }}
            <FzIcon v-if="getOrdering(column.props)?.orderable"
              :class="{'text-blue-500': getOrdering(column.props)?.direction !== 'none'}"
              data-cy="fztable-ordering" :name="orderingIconName(column.props)" size="md" variant="fas" class="ml-8 cursor-pointer"></FzIcon>
          </div>
          <div v-if="actions" :class="[
            'fz__table__header--actions',
            headerStaticClasses,
            'sticky right-0 z-[3]',
            { 'left-shadow': isOverflowing },
          ]">
            {{ actionLabel }}
          </div>
        </template>
        <template v-if="internalValue?.length && ['normal', 'radio', 'list'].includes(variant)">
          <slot v-for="(row, index) in internalValue" :name="`row-${index}`">
            <FzRow :key="index" :id="index" :columns="columns" :data="row" :isList="['radio', 'list'].includes(variant)" :isOverflowing
              :actions="typeof props.actions === 'function' ? props.actions(row) : props.actions"
              @fztable:rowactionclick="(...args) =>
                emit('fztable:rowactionclick', ...args)" :selectable="props.selectable"
              :hasRadio="props.variant === 'radio'" :selected="isSelected(row.id || index)"
              :actionsDisabled="props.actionsDisabled" @update:selected="toggleRowSelection(row.id || index)" />
          </slot>
        </template>
        <template v-else-if="internalValue?.length && variant === 'accordion'" v-for="(row, index) in internalValue">
          <FzRow :id="index" :columns="columns" :data="row"
            :actions="typeof props.actions === 'function' ? props.actions(row) : props.actions" :isList="['radio', 'list'].includes(variant)"
            :hasRadio="props.variant === 'radio'" :selectable="props.selectable" :selected="isSelected(row.id || index)"
            :isOverflowing :leftColIconClass="openRowIds.has(index) ? 'text-blue-500' : ''"
            :leftColIcon="openRowIds.has(index) ? 'angle-up' : 'angle-right'" :actionDisabled="props.actionsDisabled"
            @fztable:rowactionclick="(...args) =>
              emit('fztable:rowactionclick', ...args)" @update:selected="toggleRowSelection(row.id || index)"
            @click="toggleSubRow(row.id || index)" />
          <template v-for="(subrow, subindex) in row.subRows" v-if="openRowIds.has(row.id || index)" :key="subindex">
            <FzRow :id="subindex" :columns="columns" :data="subrow"
              :actions="typeof props.actions === 'function' ? props.actions(row) : props.actions"
              :isOverflowing :actionsDisabled="props.actionsDisabled" leftColIcon="circle" leftColIconSize="xs"
              leftColIconClass="text-blue-500" rowClass="subrow-grey" @fztable:rowactionclick="(...args) =>
                emit('fztable:rowactionclick', ...args)" />
          </template>
        </template>
        <template v-else-if="rows && rows.length">
          <div :class="[
            'grid grid-cols-subgrid border-b-1 border-solid border-grey-100 bg-core-white hover:bg-alice-blue border-b-1 border-solid border-grey-100',
            bodyStaticClasses,
            'col-span-full',
            row.props?.rowClass,
          ]" v-for="(row, index) in rows" :aria-rowindex="index + 1" role="row">
            <component v-if="row.children?.default" :is="row.children.default" :data="row.props?.data" :actions :columns />
          </div>
        </template>
        <div v-else class="fz__table__empty h-full self-center justify-self-center min-h-[200px] flex justify-center items-center col-span-full">
          {{ placeholder ?? "No data available" }}
        </div>
      </div>
    </div>
    <div class="fz__table__footer w-full overflow-x-auto mt-[20px]" v-if="pages && pages > 1 && internalValue?.length">
      <div class="fz__table__pagination flex flex-row justify-end items-center gap-4 min-w-fit ml-auto">
        <FzButton v-if="!smOrSmaller" @click="activePage--" variant="invisible" :disabled="activePage === 0" size="md" iconPosition="before"
          iconName="angle-left">Indietro</FzButton>
        <FzIconButton v-else @click="activePage--" variant="invisible" :disabled="activePage === 0" size="md"
          iconName="angle-left"></FzIconButton>
        <FzButton class="min-w-32 min-h-32" @click="activePage = 0"
          :variant="activePage === 0 ? 'primary' : 'secondary'" size="sm">1</FzButton>
        <div class="fz__pagination__separator size-32 flex justify-center items-center" v-if="activePage - effectivePageInterval - 1 > 0">
          <span>...</span>
        </div>
        <FzButton v-for="page in centerPageList" class="min-w-32 min-h-32" @click="activePage = page"
          :variant="activePage === page ? 'primary' : 'secondary'" size="sm">
          {{ page + 1 }}
        </FzButton>
        <div class="fz__pagination__separator size-32 flex justify-center items-center" v-if="pages - activePage - effectivePageInterval - 2 > 0">
          <span>...</span>
        </div>
        <FzButton class="min-w-32 min-h-32" v-if="pages > 1" @click="activePage = pages - 1"
          :variant="activePage === pages - 1 ? 'primary' : 'secondary'" size="sm">{{ pages }}</FzButton>
        <FzButton v-if="!smOrSmaller" @click="activePage++" variant="invisible" :disabled="activePage === pages - 1" size="md"
          iconPosition="after" iconName="angle-right">Avanti</FzButton>
        <FzIconButton v-else @click="activePage++" variant="invisible" :disabled="activePage === pages - 1" size="md"
          iconName="angle-right"></FzIconButton>
      </div>
    </div>
  </div>
  <Transition name="filters" v-if="!smOrSmaller">
    <div
      class="flex flex-col fz-filters h-screen w-[480px] border-solid border-gray-100 border-1 fixed z-40 top-0 right-0 bg-core-white justify-start"
      v-if="filtersOpen">
      <div
        class="flex flex-row h-[52px] w-full text-lg text-core-black border-b-1 border-solid border-gray-100 items-center p-12">
        <span class="grow text-xl">Filtri</span>
        <FzIconButton iconName="xmark-large" @click="filtersOpen = false" variant="invisible" />
      </div>
      <div class="fztable__filters__container grow flex flex-col overflow-auto">
        <div class="flex flex-col w-full mt-32 px-12" v-for="(filter, filterKey) in filters" :key="filterKey">
          <span class="text-lg text-core-black capitalize mb-12">{{
            filter
            }}</span>
          <slot :name="`filter-${filterKey}`"></slot>
        </div>
      </div>
      <div class="flex flex-row items-center h-64 p-12 border-t-1 border-solid border-gray-100 justify-self-end">
        <FzButton variant="danger" :disabled="!hasActiveFilters" @click="emptyFilters">Cancella filtri</FzButton>
      </div>
    </div>
  </Transition>
  <FzConfirmDialog ref="filtersDialog" v-if="smOrSmaller" title="Filtri" cancelLabel="Indietro" confirmLabel="Salva"
    :cancelButtonEnabled="hasActiveFilters">
    <template #body>
      <div class="flex flex-col w-full mt-32 px-12 grow overflow-auto" v-for="(filter, filterKey) in filters"
        :key="filterKey">
        <span class="text-xl text-core-black capitalize mb-12">{{
          filterKey
          }}</span>
        <slot :name="`filter-${filterKey}`"></slot>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row w-full justify-between">
        <FzButton variant="danger" :disabled="!hasActiveFilters" @click="emptyFilters">Cancella filtri</FzButton>
        <FzButton variant="primary" @click="() => filtersDialog.close()">Chiudi</FzButton>
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
