<script lang="ts" setup>
import { FzNavlink } from '@fiscozen/navlink'
import { FzCollapse } from '@fiscozen/collapse'
import { FzNavlistProps, isSubMenu } from './types'

defineProps<FzNavlistProps>()
</script>

<template>
  <div class="fz__navlist inline-flex grow-0 flex-col rounded p-4">
    <div
      class="fz__navlist__section border-grey-200"
      v-for="(section, sectionIndex) in sections"
      :key="sectionIndex"
    >
      <div class="text-grey-400 flex h-32 items-center px-12 text-xs">
        <span>{{ section.label }}</span>
      </div>
      <div class="flex flex-col" v-for="(item, itemIndex) in section.items" :key="itemIndex">
        <FzCollapse v-if="isSubMenu(item)" :summary-class="'px-12'">
          <template #summary
            ><span class="grow">{{ item.summary }}</span></template
          >
          <template #content>
            <div class="flex flex-col">
              <FzNavlink
                class="grow-1 flex justify-start pl-24"
                v-for="(subitem, subIndex) in item.subitems"
                :key="subIndex"
                v-bind="subitem"
                >{{ subitem.label }}</FzNavlink
              >
            </div>
          </template>
        </FzCollapse>
        <FzNavlink class="grow-1 flex justify-start" v-else v-bind="item">{{
          item.label
        }}</FzNavlink>
      </div>
      <hr
        v-if="sectionIndex !== sections.length - 1"
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
