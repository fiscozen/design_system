<template>
  <FzContainer
    class="fz-appointments"
    alignItems="center"
    gap="base"
  >
    <!-- Header with date navigation -->
    <FzContainer horizontal gap="base" class="w-full">
      <FzIconButton
        iconName="angle-left"
        variant="invisible"
        :disabled="!canNavigateBack"
        ariaLabel="Giorno precedente"
        @click="navigateBack"
      />
      <h3 class="flex-1 flex justify-center capitalize">
        {{ formattedDate }}
      </h3>
      <FzIconButton
        iconName="angle-right"
        variant="invisible"
        :disabled="!canNavigateForward"
        ariaLabel="Giorno successivo"
        @click="navigateForward"
      />
    </FzContainer>

    <!-- Info text -->
    <p v-if="infoText" class="text-grey-500">
      {{ infoText }}
    </p>

    <!-- Time slots or alert -->
    <FzRadioGroup
      v-if="hasAvailableSlots"
      class="flex flex-wrap items-center gap-0 w-full"
      emphasis
      :name="radioGroupName"
      role="group"
    >
      <template v-slot="{ radioGroupProps }">
        <template v-for="slot in availableSlots">
          <FzRadioCard
            v-if="!isSlotExcluded(slot)"
            v-bind="radioGroupProps"
            :key="slot.toISOString()"
            :modelValue="selectedSlotValue"
            :value="slot.toISOString()"
            :title="formatTime(slot)"
            :label="slot.toISOString()"
            orientation="horizontal"
            :radioIcon="false"
            :required="required"
            class="text-center"
            @update:modelValue="handleSlotSelect"
          />
        </template>
      </template>
    </FzRadioGroup>
    <FzAlert
      v-else
      tone="info"
      alertStyle="default"
      :title="alertTitle"
      :showButtonAction="false"
      :showLinkAction="false"
    >
      {{ alertDescription }}
    </FzAlert>
  </FzContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  FzAppointmentsProps
} from "./types";
import { useAppointmentsManual } from "./composables/useAppointmentsManual";
import { useAppointmentsAuto } from "./composables/useAppointmentsAuto";
import { FzRadioCard, FzRadioGroup } from "@fiscozen/radio";
import { FzIconButton } from "@fiscozen/button";
import { FzAlert } from "@fiscozen/alert";
import { FzContainer } from "@fiscozen/container";

const props = defineProps<FzAppointmentsProps>();

const emit = defineEmits<{
  "update:modelValue": [value: string | undefined];
}>();

// Use the appropriate composable based on mode
const {
  availableSlots,
  formattedDate,
  infoText,
  hasAvailableSlots,
  selectedSlotValue,
  radioGroupName,
  alertTitle,
  alertDescription,
  canNavigateBack,
  canNavigateForward,
  navigateBack,
  navigateForward,
  isSlotExcluded,
  formatTime,
  handleSlotSelect,
} = props.type === "manual"
  ? useAppointmentsManual({ props, emit })
  : useAppointmentsAuto({ props, emit });

// Expose required for template
const required = computed(() => props.required ?? false);
</script>
