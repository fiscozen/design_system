<script setup lang="ts">
import { computed, ref, useSlots, onMounted, onUpdated} from 'vue'
import { FzTableProps } from './types'
import { FzColumn, FzColumnSlots, FzColumnProps} from '@fiscozen/simple-table'
import { FzIconDropdown } from '@fiscozen/dropdown';
import { FzButton } from '@fiscozen/button';

const props = withDefaults(defineProps<FzTableProps>(), {
  pageInterval: 2,
  activePage: 0
})

const emit = defineEmits([])
const activePage = defineModel<number>('activePage')

const slots = useSlots();

const defaultSlot = slots.default?.();
const columns =
  defaultSlot
    ?.filter((elem) => elem.type === FzColumn)
    .map((column) => ({
      props: column.props as FzColumnProps,
      children: column.children as FzColumnSlots,
    })) ?? [];

const grid = ref()

const staticClasses = ref(['grid'])
const classes = computed(() => {
  let res: string[] = [];

  const colLength = props.actions ? columns.length + 1 : columns.length

  switch (colLength) {
    case 1:
      res.push('grid-cols-1') 
      break;
    case 2:
      res.push('grid-cols-2') 
      break;
    case 3:
      res.push('grid-cols-3') 
      break;
    case 4:
      res.push('grid-cols-4') 
      break;
    case 5:
      res.push('grid-cols-5') 
      break;
    case 6:
      res.push('grid-cols-6') 
      break;
    case 7:
      res.push('grid-cols-7') 
      break;
    case 8:
      res.push('grid-cols-8') 
      break;
    case 9:
      res.push('grid-cols-9') 
      break;
    case 10:
      res.push('grid-cols-10') 
      break;
    case 11:
      res.push('grid-cols-11') 
      break;
    case 12:
      res.push('grid-cols-12') 
      break;
    default:
      break;
  }
  return res;
})

const colspan = computed(() => {
  let res: string[] = [];

  const colLength = props.actions ? columns.length + 1 : columns.length

  switch (colLength) {
    case 1:
      res.push('col-span-1') 
      break;
    case 2:
      res.push('col-span-2') 
      break;
    case 3:
      res.push('col-span-3') 
      break;
    case 4:
      res.push('col-span-4') 
      break;
    case 5:
      res.push('col-span-5') 
      break;
    case 6:
      res.push('col-span-6') 
      break;
    case 7:
      res.push('col-span-7') 
      break;
    case 8:
      res.push('col-span-8') 
      break;
    case 9:
      res.push('col-span-9') 
      break;
    case 10:
      res.push('col-span-10') 
      break;
    case 11:
      res.push('col-span-11') 
      break;
    case 12:
      res.push('col-span-12') 
      break;
    default:
      break;
  }
  return res;
})

const headerStaticClasses = ['fz__header__cell','sticky','top-0','z-[2]', 'bg-grey-100', 'px-16', 'h-48', 'font-medium', 'flex', 'justify-start', 'items-center']
const headerClasses = computed(() => {

})

const bodyStaticClasses = ['fz__body', 'z-[1]', 'px-16', 'h-48', 'bg-core-white', 'flex', 'justify-start', 'items-center', 'min-w-min', 'border-b-1', 'border-grey-100']
const bodyClasses = computed(() => {

})

const getBodyClasses = (column: {props: FzColumnProps, children: FzColumnSlots}, isHeader?: boolean) => {
  return {
    relative: !column.props.sticky,
    sticky: column.props.sticky,
    'left-0 z-[2]': column.props.sticky === 'left',
    'z-[3]': column.props.sticky && isHeader,
    'right-0': column.props.sticky === 'right'
  }
}

const updateClasses = () => {
  const tableWidth = columns.reduce((acc, el, index) => {
    const colWidth = grid.value.children[index].getBoundingClientRect().width
    acc+=colWidth
    return acc
  }, 0)
  grid.value.style.width = `${tableWidth}px`
}

const centerPageList = computed(() => {
  if (!props.pages) {
    return []
  }
  const safeActivePage = activePage.value || 0
  return new Array(props.pages)
    .fill(0)
    .map((val, index) => index)
    .filter(el => {
      const res = (Math.abs(el - safeActivePage) <= props.pageInterval) && el !== 0 && el !== props.pages - 1
      return res
    })
})

onMounted(() => {
  updateClasses()

  if (props.actions?.items.length) {

  }
})
onUpdated(updateClasses)
</script>

<template>
<div class="fz__table overflow-auto size-full">
  <div
    :class="[staticClasses, classes]"
    ref="grid"
    role="table"
    :aria-rowcount="value.length"
    :aria-colcount="columns.length">
    <template  v-for="(column, index) in columns">
      <div :class="[headerStaticClasses, headerClasses, getBodyClasses(column, true)]" role="columnheader" aria-sort="none" >
         {{ column.props.header }} 
      </div>
    </template>  
    <div
      v-if="actions"
      :class="['fz__table__header--actions', headerStaticClasses, headerClasses]">
      Azioni
    </div>
    <template v-if="value && value.length" v-for="(row, index) in value">
      <div
        :aria-rowindex="index"
        :class="[bodyStaticClasses, bodyClasses, getBodyClasses(column)]"
        role="cell"
        v-for="column in columns">
        {{ row[column.props.field?.toLowerCase() || column.props.header.toLowerCase()] }}
      </div>
      <div
        v-if="actions"
        :class="[bodyStaticClasses, bodyClasses]">
        <FzIconDropdown :actions="actions.items"></FzIconDropdown>
      </div>
    </template>
    <div :class="['fz__table__empty', 'h-full mt-80', 'justify-self-center', colspan]" v-else>
      {{ placeholder ?? "No data available" }}
    </div>
  </div>
  
</div>
<div class="fz__table__footer w-full flex flex-row justify-end m-8" v-if="pages && value && value.length">
  <div class="fz__table__pagination flex flex-row justify-between items-center gap-8">
    <FzButton
      @click="activePage = 0"
      :variant="activePage === 0 ? 'primary' : 'secondary'"
      size="sm">1</FzButton>
    <div class="fz__pagination__separator" v-if="activePage - pageInterval - 1 > 0">...</div>
    <FzButton
      v-for="page in centerPageList"
      @click="activePage = page"
      :variant="activePage === page ? 'primary' : 'secondary'"
      size="sm">
        {{ page + 1 }}
      </FzButton>
    <div class="fz__pagination__separator" v-if="pages - activePage - pageInterval - 2 > 0">...</div>
    <FzButton
      @click="activePage = pages - 1"
      :variant="activePage === pages - 1 ? 'primary' : 'secondary'"
      size="sm">{{pages}}</FzButton>
  </div>
</div>
</template>

<style scoped>
.fz__table .grid.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-8 {
  grid-template-columns: repeat(8, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-9 {
  grid-template-columns: repeat(9, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-10 {
  grid-template-columns: repeat(10, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-11 {
  grid-template-columns: repeat(11, minmax(min-content, 1fr))
}
.fz__table .grid.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(min-content, 1fr))
}
</style>
