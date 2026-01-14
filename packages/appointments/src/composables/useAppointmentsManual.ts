import { computed, ref, watch } from "vue";
import { format, isSameDay, isValid, parseISO, startOfDay } from "date-fns";
import { it } from "date-fns/locale";
import type {
  FzAppointmentsManualProps,
  UseAppointmentsReturn,
} from "../types";

export interface UseAppointmentsManualOptions {
  props: FzAppointmentsManualProps;
  emit: (event: "update:modelValue", value: string | undefined) => void;
}

export function useAppointmentsManual({
  props,
  emit,
}: UseAppointmentsManualOptions): UseAppointmentsReturn {
  const defaultAlertTitle = "Nessuna disponibilità";
  const defaultAlertDescription =
    "Scegli un'altro giorno e prenota la tua consulenza.";

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

  // Watch for availableDays changes to reset currentDate if needed
  watch(
    () => availableDays.value,
    (days) => {
      if (days.length > 0) {
        // Find if current date is still valid
        const currentDayKey = format(currentDate.value, "yyyy-MM-dd");
        const index = days.findIndex(
          (day) => format(day, "yyyy-MM-dd") === currentDayKey,
        );

        if (index === -1) {
          // Current date is no longer available, reset to first day
          currentDayIndex.value = 0;
          currentDate.value = startOfDay(days[0]);
        } else {
          currentDayIndex.value = index;
        }
      }
    },
    { immediate: true },
  );

  const modelValueAsDate = computed(() => {
    if (!props.modelValue) {
      return undefined;
    }
    const parsed = parseISO(props.modelValue);
    return isValid(parsed) ? parsed : undefined;
  });

  // Generate unique name for radio group
  const radioGroupName = computed(() => {
    return props.name || `fz-appointments-${Date.now()}`;
  });

  // Check if we can navigate back
  const canNavigateBack = computed(() => {
    return currentDayIndex.value > 0;
  });

  // Check if we can navigate forward
  const canNavigateForward = computed(() => {
    return currentDayIndex.value < availableDays.value.length - 1;
  });

  // Available slots for current date
  const availableSlots = computed(() => {
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

  // Info text - use custom if provided, otherwise undefined (hidden)
  const infoText = computed(() => {
    return props.infoText;
  });

  // Alert title
  const alertTitle = computed(() => {
    return props.alertTitle ?? defaultAlertTitle;
  });

  // Alert description
  const alertDescription = computed(() => {
    return props.alertDescription ?? defaultAlertDescription;
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

    currentDayIndex.value--;
    currentDate.value = startOfDay(availableDays.value[currentDayIndex.value]);
    // Reset selection when date changes
    emit("update:modelValue", undefined);
  };

  // Navigate to next day
  const navigateForward = () => {
    if (!canNavigateForward.value) {
      return;
    }

    currentDayIndex.value++;
    currentDate.value = startOfDay(availableDays.value[currentDayIndex.value]);
    // Reset selection when date changes
    emit("update:modelValue", undefined);
  };

  // Handle slot selection
  const handleSlotSelect = (value: string) => {
    emit("update:modelValue", value);
  };

  // Watch for modelValue changes to update currentDate if needed
  watch(
    () => modelValueAsDate.value,
    (newValue) => {
      if (newValue && !isSameDay(newValue, currentDate.value)) {
        // Find the day index for this value
        const dayKey = format(newValue, "yyyy-MM-dd");
        const index = availableDays.value.findIndex(
          (day) => format(day, "yyyy-MM-dd") === dayKey,
        );

        if (index !== -1) {
          currentDayIndex.value = index;
          currentDate.value = startOfDay(availableDays.value[index]);
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
