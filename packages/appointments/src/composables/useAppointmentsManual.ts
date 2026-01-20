import { computed, ref, watch } from "vue";
import { format, isSameDay, isValid, parseISO, startOfDay } from "date-fns";
import type {
  FzAppointmentsManualProps,
  UseAppointmentsReturn,
} from "../types";
import { useAppointmentsGeneric } from "./useAppointmentsGeneric";

export interface UseAppointmentsManualOptions {
  props: FzAppointmentsManualProps;
  emit: (event: "update:modelValue", value: string | undefined) => void;
}

export function useAppointmentsManual({
  props,
  emit,
}: UseAppointmentsManualOptions): UseAppointmentsReturn {
  // Convert all slots to Date objects
  const allSlots = computed(() => {
    return props.slots
      .map((slot) => {
        if (typeof slot === "string") {
          const parsed = parseISO(slot);
          return isValid(parsed) ? parsed : null;
        }
        return isValid(slot) ? slot : null;
      })
      .filter((slot): slot is Date => slot !== null && isValid(slot))
      .sort((a, b) => a.getTime() - b.getTime());
  });

  // Group slots by day
  const slotsByDay = computed(() => {
    const groups = new Map<string, Date[]>();

    for (const slot of allSlots.value) {
      const dayKey = format(slot, "yyyy-MM-dd");
      const existing = groups.get(dayKey) || [];
      existing.push(slot);
      groups.set(dayKey, existing);
    }

    return groups;
  });

  // Get available days (sorted)
  const availableDays = computed(() => {
    return Array.from(slotsByDay.value.keys())
      .map((key) => parseISO(key))
      .filter((date) => isValid(date))
      .sort((a, b) => a.getTime() - b.getTime());
  });

  // Current day index
  const currentDayIndex = ref(0);

  // Current date being viewed
  const currentDate = ref<Date>(
    availableDays.value.length > 0
      ? startOfDay(availableDays.value[0])
      : startOfDay(new Date()),
  );

  // Use generic composable for common functionality
  const {
    modelValueAsDate,
    radioGroupName,
    selectedSlotValue,
    alertTitle,
    alertDescription,
    formatTime,
    formattedDate,
    handleSlotSelect,
  } = useAppointmentsGeneric({
    props,
    currentDate,
    emit,
  });

  // Watch for availableDays changes to reset currentDate if needed
  watch(
    () => availableDays.value,
    (days) => {
      if (days.length === 0) {
        // No days available, reset to safe default
        currentDayIndex.value = 0;
        currentDate.value = startOfDay(new Date());
        return;
      }

      // Find if current date is still valid
      const currentDayKey = format(currentDate.value, "yyyy-MM-dd");
      const index = days.findIndex(
        (day) => format(day, "yyyy-MM-dd") === currentDayKey,
      );

      if (index === -1) {
        // Current date is no longer available, reset to first day
        currentDayIndex.value = 0;
        currentDate.value = startOfDay(days[0]);
        emit("update:modelValue", undefined);
      } else {
        currentDayIndex.value = index;
      }
    },
    { immediate: true },
  );

  // Check if we can navigate back
  const canNavigateBack = computed(() => {
    return availableDays.value.length > 0 && currentDayIndex.value > 0;
  });

  // Check if we can navigate forward
  const canNavigateForward = computed(() => {
    return currentDayIndex.value < availableDays.value.length - 1;
  });

  // Available slots for current date
  const availableSlots = computed(() => {
    // Safety check: ensure currentDate is valid
    if (!isValid(currentDate.value)) {
      return [];
    }

    const dayKey = format(currentDate.value, "yyyy-MM-dd");
    return slotsByDay.value.get(dayKey) || [];
  });

  // In manual mode, slots are never excluded (they're pre-filtered by the consumer)
  const isSlotExcluded = (_slot: Date): boolean => {
    return false;
  };

  // Filter out disabled slots
  const hasAvailableSlots = computed(() => {
    return availableSlots.value.length > 0;
  });

  // Info text - use custom if provided, otherwise undefined (hidden)
  const infoText = computed(() => {
    return props.infoText;
  });

  // Navigate to previous day
  const navigateBack = () => {
    if (!canNavigateBack.value) {
      return;
    }

    const newIndex = currentDayIndex.value - 1;
    const targetDay = availableDays.value[newIndex];

    // Safety check: ensure target day exists
    if (!targetDay || !isValid(targetDay)) {
      return;
    }

    currentDayIndex.value = newIndex;
    currentDate.value = startOfDay(targetDay);
    // Reset selection when date changes
    emit("update:modelValue", undefined);
  };

  // Navigate to next day
  const navigateForward = () => {
    if (!canNavigateForward.value) {
      return;
    }

    const newIndex = currentDayIndex.value + 1;
    const targetDay = availableDays.value[newIndex];

    // Safety check: ensure target day exists
    if (!targetDay || !isValid(targetDay)) {
      return;
    }

    currentDayIndex.value = newIndex;
    currentDate.value = startOfDay(targetDay);
    // Reset selection when date changes
    emit("update:modelValue", undefined);
  };

  // Watch for modelValue changes to update currentDate if needed
  watch(
    () => modelValueAsDate.value,
    (newValue) => {
      if (!newValue || availableDays.value.length === 0) {
        return;
      }

      if (!isSameDay(newValue, currentDate.value)) {
        // Find the day index for this value
        const dayKey = format(newValue, "yyyy-MM-dd");
        const index = availableDays.value.findIndex(
          (day) => format(day, "yyyy-MM-dd") === dayKey,
        );

        if (index !== -1) {
          const targetDay = availableDays.value[index];
          // Safety check: ensure target day exists and is valid
          if (targetDay && isValid(targetDay)) {
            currentDayIndex.value = index;
            currentDate.value = startOfDay(targetDay);
          }
        }
      }
    },
  );

  return {
    availableSlots,
    currentDate,
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
  };
}
