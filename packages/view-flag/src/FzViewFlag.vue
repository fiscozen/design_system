<template>
  <div class="border-8 border-semantic-warning fixed inset-0 grid z-50">
    <div
      class="h-32 bg-semantic-warning justify-self-center self-end rounded-t-base text-sm flex p-6 gap-12 items-center"
    >
      <FzBadge v-if="props.environment">{{ props.environment }}</FzBadge>
      <div>
        <template v-if="props.role">{{ props.role }}: </template>
        <template v-if="props.firstName && props.lastName"
          >{{ props.firstName }} {{ props.lastName[0] }}.</template
        >
      </div>
    </div>
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
