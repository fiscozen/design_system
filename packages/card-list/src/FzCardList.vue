<script setup lang="ts">
/**
 * FzCardList Component
 *
 * A layout container that renders a list of FzCardListItem components either from
 * a data array (via the `items` prop).
 *
 *
 * @component
 * @example
 * <FzCardList title="My List" :items="listItems" />
 *
 * @example
 * <FzCardList>
 *   <FzCardListItem title="Item 1" amount="0,00 €" />
 *   <FzCardListItem title="Item 2" amount="1,00 €" />
 * </FzCardList>
 */
import FzCardListItem from './FzCardListItem.vue';
import { FzCardListProps, FzCardListEmits } from './types';

const props = defineProps<FzCardListProps>();

const emit = defineEmits<FzCardListEmits>();
</script>

<template>
  <div>
    <FzCardListItem
      v-for="(item, index) in items"
      :key="index"
      :badge="item.badge"
      :title="item.title"
      :value="item.value"
      :descriptions="item.descriptions"
      :showIndicator="item.showIndicator"
      :actions="item.actions"
      @fzmenu:click="emit('fzmenu:click', index)"
      @fzaction:click="
        (actionIndex, action) => emit('fzaction:click', index, actionIndex, action)
      "
    />
  </div>
</template>
