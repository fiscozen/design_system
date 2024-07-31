<template>
  <div class="fz__actionlist bg-core-white inline-flex grow-0 flex-col rounded p-4">
    <div v-if="label" class="text-grey-400 flex h-32 items-center px-12 text-xs">
      <span>{{ label }}</span>
    </div>
    <div class="flex flex-col" v-for="(item, itemIndex) in items" :key="itemIndex">
      <FzNavlink
        v-if="item.type === 'button'"
        class="grow-1 flex justify-start"
        v-bind="item"
        @click="emit('fzaction:click', itemIndex, item)"
        >{{ item.label }}</FzNavlink
      >
      <FzRouterNavlink
        v-else
        class="grow-1 flex justify-start"
        v-bind="item"
        @click="emit('fzaction:click', itemIndex, item)"
        >{{ item.label }}</FzRouterNavlink
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FzNavlink, FzRouterNavlink } from '@fiscozen/navlink'
import { FzActionlistProps, ActionlistItem } from './types'

const props = defineProps<FzActionlistProps>()
const emit = defineEmits<{
  'fzaction:click': [index: number, action: ActionlistItem]
}>()
</script>

<style>
.fz__actionlist {
  min-width: 240px;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px 0px rgba(0, 0, 0, 0.06);
}
</style>
