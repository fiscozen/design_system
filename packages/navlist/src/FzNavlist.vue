<script lang="ts" setup>
import { FzRouterNavlinkProps, FzNavlink } from '@fiscozen/navlink'
import { FzCollapse } from '@fiscozen/collapse'
import { FzNavlistProps, FzNavlistSub } from './types'

defineProps<FzNavlistProps>()

const isSubMenu = (item: FzRouterNavlinkProps | FzNavlistSub): item is FzNavlistSub => {
  return Boolean((item as FzNavlistSub).subitems)
}
</script>

<template>
  <div class="fz__navlist inline-flex grow-0 flex-col rounded px-4">
    <div
      class="fz__navlist__section border-grey-200"
      v-for="(section, index) in sections"
      :key="index"
    >
      <div class="text-grey-400 flex h-32 items-center px-12 text-xs">
        <span>{{ section.label }}</span>
      </div>
      <div class="flex flex-col" v-for="(item, itemid) in section.items" :key="itemid">
        <fz-collapse v-if="isSubMenu(item)" :summary-class="'px-12'">
          <template #summary
            ><span class="grow">{{ item.summary }}</span></template
          >
          <template #content>
            <div class="flex flex-col">
              <fz-navlink
                class="grow-1 flex justify-start"
                v-for="(subitem, index) in item.subitems"
                :key="index"
                v-bind="subitem"
                >{{ subitem.label }}</fz-navlink
              >
            </div>
          </template>
        </fz-collapse>
        <fz-navlink class="grow-1 flex justify-start" v-else v-bind="item">{{
          item.label
        }}</fz-navlink>
      </div>
      <hr
        v-if="index !== sections.length - 1"
        class="bg-grey-200 my-8 h-1 w-full border-none px-4"
      />
    </div>
  </div>
</template>

<style>
.fz__navlist {
  min-width: 240px;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px 0px rgba(0, 0, 0, 0.06);
}
</style>
