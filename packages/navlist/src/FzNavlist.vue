<script lang="ts" setup>
import { FzNavlink, FzNavlinkProps, FzRouterNavlink, FzRouterNavlinkProps } from '@fiscozen/navlink'
import { FzCollapse } from '@fiscozen/collapse'
import { FzNavlistItem, FzNavlistProps, isSubMenu } from './types'

defineProps<FzNavlistProps>()

const emit = defineEmits<{
  'fznavlink:click': [index: number, item: FzNavlistItem]
}>()
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
      <div class="flex flex-col">
        <template v-for="(item, itemIndex) in section.items" :key="itemIndex">
          <FzCollapse v-if="isSubMenu(item)" :summary-class="'px-12'">
            <template #summary
              ><span class="grow">{{ item.summary }}</span></template
            >
            <template #content>
              <div class="flex flex-col">
                <template v-for="(subitem, subIndex) in item.subitems" :key="subIndex">
                  <FzNavlink
                    v-if="subitem.type === 'button'"
                    class="grow-1 flex justify-start pl-24 !font-normal"
                    v-bind="subitem"
                    @click="emit('fznavlink:click', itemIndex, subitem)"
                    >{{ subitem.label }}</FzNavlink
                  >
                  <FzRouterNavlink
                    v-if="subitem.type === 'link'"
                    class="grow-1 flex justify-start pl-24 !font-normal"
                    v-bind="subitem"
                    @click="emit('fznavlink:click', itemIndex, subitem)"
                    >{{ subitem.label }}</FzRouterNavlink
                  >
                </template>
              </div>
            </template>
          </FzCollapse>
          <FzNavlink
            class="grow-1 flex justify-start"
            v-else-if="item.type === 'button'"
            v-bind="item"
            @click="emit('fznavlink:click', itemIndex, item)"
            >{{ item.label }}</FzNavlink
          >
          <FzRouterNavlink
            v-else
            v-bind="item"
            class="grow-1 flex justify-start"
            @click="emit('fznavlink:click', itemIndex, item)"
            >{{ item.label }}
          </FzRouterNavlink>
        </template>
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
