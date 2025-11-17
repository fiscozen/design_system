<template>
  <div
    class="fz-appointments flex flex-col items-center gap-section-content-base"
  >
    <!-- Header with date navigation -->
    <div class="flex items-center gap-8 w-full">
      <FzIconButton
        iconName="angle-left"
        variant="invisible"
        :disabled="!canNavigateBack"
        ariaLabel="Giorno precedente"
        @click="navigateBack"
      />
      <p class="flex-1 flex justify-center text-lg font-medium capitalize">
        {{ formattedDate }}
      </p>
      <FzIconButton
        iconName="angle-right"
        variant="invisible"
        :disabled="!canNavigateForward"
        ariaLabel="Giorno successivo"
        @click="navigateForward"
      />
    </div>

    <!-- Info text -->
    <p class="text-sm text-grey-500">
      {{ infoText }}
    </p>

    <!-- Time slots or alert -->
    <FzRadioGroup
      v-if="hasAvailableSlots"
      class="flex flex-wrap items-center"
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
      type="info"
      alertStyle="default"
      :title="alertTitle"
      :showButtonAction="false"
      :showLinkAction="false"
    >
      {{ alertDescription }}
    </FzAlert>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { endOfDay, format, formatISO, isSameDay, isSameHour, isSameMinute, parseISO, startOfDay } from "date-fns";
import { it } from "date-fns/locale";
import { FzAppointmentsProps } from "./types";
import { FzRadioCard, FzRadioGroup } from "@fiscozen/radio";
import { FzIconButton } from "@fiscozen/button";
import { FzAlert } from "@fiscozen/alert";

const props = withDefaults(defineProps<FzAppointmentsProps>(), {
  slotInterval: 30,
  breakDuration: 0,
  excludedDays: () => [],
  excludedSlots: () => [],
  name: "fz-appointments",
  required: false,
  startDate: () => formatISO(startOfDay(new Date())),
  slotStartTime: "09:00",
  alertTitle: "Nessuna disponibilità",
  alertDescription: "Scegli un'altro giorno e prenota la tua consulenza.",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | undefined];
}>();

// Convert ISO-8601 strings to Date objects for internal use
const startDateAsDate = computed(() => {
  if (!props.startDate) {
    return startOfDay(new Date());
  }
  try {
    return parseISO(props.startDate);
  } catch {
    return startOfDay(new Date());
  }
});

const maxDateAsDate = computed(() => {
  if (!props.maxDate) {
    return null;
  }
  try {
    return parseISO(props.maxDate);
  } catch {
    return null;
  }
});

const modelValueAsDate = computed(() => {
  if (!props.modelValue) {
    return undefined;
  }
  try {
    return parseISO(props.modelValue);
  } catch {
    return undefined;
  }
});

// Current date being viewed
const currentDate = ref<Date>(startDateAsDate.value);

// Generate unique name for radio group
const radioGroupName = computed(() => {
  return props.name || `fz-appointments-${Date.now()}`;
});

// Get today's date at midnight for comparison
const today = computed(() => {
  return startOfDay(new Date());
});

// Check if we can navigate back
const canNavigateBack = computed(() => {
  const previousDate = new Date(currentDate.value);
  previousDate.setDate(previousDate.getDate() - 1);
  return (
    previousDate >= startOfDay(startDateAsDate.value) && previousDate >= today.value
  );
});

// Check if we can navigate forward
const canNavigateForward = computed(() => {
  const nextDate = new Date(currentDate.value);
  nextDate.setDate(nextDate.getDate() + 1);
  const maxDateLimit = maxDateAsDate.value ? startOfDay(maxDateAsDate.value) : null;
  return nextDate >= today.value && (!maxDateLimit || nextDate <= maxDateLimit);
});

// Check if a day is excluded
const isDayExcluded = (date: Date): boolean => {
  if (!props.excludedDays || props.excludedDays.length === 0) {
    return false;
  }

  const dateStart = startOfDay(date);
  const dayOfWeek = date.getDay();

  return props.excludedDays.some((excluded) => {
    // Check if it's a number (day of week)
    if (typeof excluded === "number") {
      return excluded === dayOfWeek;
    }

    // Check if it's a string (ISO date)
    if (typeof excluded === "string") {
      try {
        const excludedDate = startOfDay(parseISO(excluded));
        return isSameDay(excludedDate, dateStart);
      } catch {
        return false;
      }
    }

    // Check if it's a Date object
    if (excluded instanceof Date) {
      return isSameDay(startOfDay(excluded), dateStart);
    }

    return false;
  });
};

// Check if current date is valid
const isCurrentDateValid = computed(() => {
  const dateStart = startOfDay(currentDate.value);
  const todayStart = today.value;

  // Cannot be in the past
  if (dateStart < todayStart) {
    return false;
  }

  // Cannot be before startDate
  if (dateStart < startOfDay(startDateAsDate.value)) {
    return false;
  }

  // Cannot be after maxDate
  if (maxDateAsDate.value && dateStart > startOfDay(maxDateAsDate.value)) {
    return false;
  }

  // Cannot be excluded
  if (isDayExcluded(currentDate.value)) {
    return false;
  }

  return true;
});

// Generate time slots for the current date
const generateTimeSlots = (date: Date): Date[] => {
  const slots: Date[] = [];
  const [hours, minutes] = props.slotStartTime.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    return slots;
  }

  const slotDate = new Date(date);
  slotDate.setHours(hours, minutes, 0, 0);

  for (let i = 0; i < props.slotCount; i++) {
    const date = new Date(slotDate);
    if (date < startOfDay(currentDate.value) || date > endOfDay(currentDate.value)) {
      continue;
    }
    slots.push(date);
    slotDate.setMinutes(slotDate.getMinutes() + props.slotInterval);

    // Add break duration between slots (except after the last one)
    if (props.breakDuration > 0 && i < props.slotCount - 1) {
      slotDate.setMinutes(slotDate.getMinutes() + props.breakDuration);
    }
  }

  return slots;
};

// Available slots for current date
const availableSlots = computed(() => {
  if (!isCurrentDateValid.value) {
    return [];
  }

  return generateTimeSlots(currentDate.value);
});

const isSlotExcluded = (slot: Date): boolean => {
  return props.excludedSlots.some((disabledSlot) => {
    return isSameDay(slot, disabledSlot) && isSameHour(slot, disabledSlot) && isSameMinute(slot, disabledSlot);
  });
};

// Filter out disabled slots
const hasAvailableSlots = computed(() => {
  return availableSlots.value.some((slot) => !isSlotExcluded(slot));
});

// Selected slot value for radio group
const selectedSlotValue = computed(() => {
  if (!modelValueAsDate.value) {
    return undefined;
  }

  // Check if selected slot is for current date
  if (isSameDay(modelValueAsDate.value, currentDate.value)) {
    return props.modelValue;
  }

  return undefined;
});

// Info text showing slot interval
const infoText = computed(() => {
  return `${props.slotInterval} minuti a partire dalle`;
});

// Format time for display
const formatTime = (date: Date): string => {
  return format(date, "HH:mm");
};

// Format date for display (e.g., "Lunedì 3 novembre")
const formattedDate = computed(() => {
  return format(currentDate.value, "EEEE d MMMM", { locale: it });
});

// Navigate to previous day
const navigateBack = () => {
  if (!canNavigateBack.value) {
    return;
  }

  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() - 1);

  // Skip excluded days
  while (isDayExcluded(newDate) && newDate >= startOfDay(startDateAsDate.value)) {
    newDate.setDate(newDate.getDate() - 1);
  }

  if (newDate >= startOfDay(startDateAsDate.value) && newDate >= today.value) {
    currentDate.value = newDate;
    // Reset selection when date changes
    emit("update:modelValue", undefined);
  }
};

// Navigate to next day
const navigateForward = () => {
  if (!canNavigateForward.value) {
    return;
  }

  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + 1);

  // Skip excluded days
  const maxDateLimit = maxDateAsDate.value ? startOfDay(maxDateAsDate.value) : null;
  while (
    isDayExcluded(newDate) &&
    newDate >= today.value &&
    (!maxDateLimit || newDate <= maxDateLimit)
  ) {
    newDate.setDate(newDate.getDate() + 1);
  }

  if (newDate >= today.value && (!maxDateLimit || newDate <= maxDateLimit)) {
    currentDate.value = newDate;
    // Reset selection when date changes
    emit("update:modelValue", undefined);
  }
};

// Handle slot selection
const handleSlotSelect = (value: string) => {
  emit("update:modelValue", value);
};

// Watch for startDate changes and update currentDate if needed
watch(
  () => startDateAsDate.value,
  (newStartDate) => {
    const startDateStart = startOfDay(newStartDate);
    const currentDateStart = startOfDay(currentDate.value);

    if (currentDateStart < startDateStart) {
      currentDate.value = new Date(newStartDate);
      emit("update:modelValue", undefined);
    }
  },
);

// Watch for modelValue changes to update currentDate if needed
watch(
  () => modelValueAsDate.value,
  (newValue) => {
    if (newValue && !isSameDay(newValue, currentDate.value)) {
      currentDate.value = new Date(newValue);
    }
  },
);
</script>
