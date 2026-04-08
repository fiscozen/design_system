<script setup lang="ts">
import { FzContainer } from '@fiscozen/container';
import { FzIcon } from '@fiscozen/icons';
import { FzCardTitleProps } from './types';

const props = defineProps<FzCardTitleProps>();
</script>

<template>
  <!-- Title and indicator -->
  <FzContainer horizontal gap="xs" alignItems="center" class="min-w-0">
    <!-- Indicator -->
    <FzIcon
      v-if="showIndicator"
      name="circle-small"
      size="xs"
      variant="fas"
      v-color:blue
    />
    <!-- Title -->
    <p
      v-bold
      class="min-w-0 flex-1 truncate"
      :id="titleId"
    >
      {{ title }}
    </p>
  </FzContainer>
</template>