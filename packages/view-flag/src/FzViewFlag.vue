<template>
  <div class="w-8 h-full bg-semantic-warning fixed top-0 left-0 z-50"></div>
  <div class="w-8 h-full bg-semantic-warning fixed top-0 right-0 z-50"></div>
  <div class="w-full h-8 bg-semantic-warning fixed top-0 left-0 z-50"></div>
  <div class="w-full h-8 bg-semantic-warning fixed bottom-0 left-0 z-50"></div>
  <div
    class="bg-semantic-warning justify-self-center self-end rounded-t-base text-sm flex p-6 gap-12 items-center bottom-8 fixed m-auto left-1/2 -translate-x-1/2 z-50"
  >
    <slot>
      <FzBadge v-if="props.environment">{{ props.environment }}</FzBadge>
      <div>
        <template v-if="props.role">{{ props.role }}: </template>
        <template v-if="props.firstName && props.lastName"
          >{{ props.firstName }} {{ props.lastName[0] }}.</template
        >
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { FzBadge } from "@fiscozen/badge";

const props = withDefaults(
  defineProps<{
    /**
     * Role of user, if available
     */
    role?: string;
    /**
     * First name of user, if available
     */
    firstName?: string;
    /**
     * Last name of user, if available
     */
    lastName?: string;
    /**
     * Environment name, if available
     */
    environment?: string;
  }>(),
  {},
);
</script>
