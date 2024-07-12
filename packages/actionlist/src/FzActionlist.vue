<template>
  <div class="fz__actionlist inline-flex grow-0 flex-col rounded p-4">
    <div v-if="label" class="text-grey-400 flex h-32 items-center px-12 text-xs">
      <span>{{ label }}</span>
    </div>
    <div class="flex flex-col" v-for="(item, itemIndex) in items" :key="itemIndex">
      <FzRouterNavlink class="grow-1 flex justify-start" v-bind="item">{{
        item.label
      }}</FzRouterNavlink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FzRouterNavlink } from '@fiscozen/navlink'
import { FzActionlistProps } from './types'

defineProps<FzActionlistProps>()
</script>

<style>
.fz__actionlist {
  min-width: 240px;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.1),
    0px 1px 2px 0px rgba(0, 0, 0, 0.06);
}
</style>
