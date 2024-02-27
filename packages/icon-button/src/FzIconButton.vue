<template>
  <button
    type="button"
    class="fz__iconbtn w-10 h-10 px-[11px] py-2.5 bg-indigo-500 rounded shadow justify-center items-center"
    :class="{
      
    }"
    @click="onClick"></button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {IconButtonVariant} from './types';

const props = withDefaults(
  defineProps<{
    /**
     * The tooltip of the button will be shown on hover
     */
    tooltip: string
    /**
     * primary or secondary button
     */
    variant?: IconButtonVariant
    /**
     * size of the button
     */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { variant: IconButtonVariant.primary, size: 'md' }
)

const emit = defineEmits<{
  /**
   * simple emit function, always emits 1
   */
  click: [e: PointerEvent]
}>()

const classes = computed(() => ({
  
}))

const onClick = (e: PointerEvent) => {
  emit('click', e);
}
</script>

<style scoped>
.fz__iconbtn {

  &--primary {

  }
}
</style>
