import { computed, ref, watch } from "vue";
import {
  endOfDay,
  format,
  isSameDay,
  isSameHour,
  isSameMinute,
  parseISO,
  startOfDay,
} from "date-fns";
import { it } from "date-fns/locale";
import type {
  FzAppointmentsAutoProps,
  UseAppointmentsReturn,
} from "../types";

export interface UseAppointmentsAutoOptions {
  props: FzAppointmentsAutoProps;
  emit: (event: "update:modelValue", value: string | undefined) => void;
}

export function useAppointmentsAuto({
  props,
  emit,
}: UseAppointmentsAutoOptions): UseAppointmentsReturn {
  // Default values
  const slotInterval = computed(() => props.slotInterval ?? 30);
  const breakDuration = computed(() => props.breakDuration ?? 0);
  const excludedDays = computed(() => props.excludedDays ?? []);
  const excludedSlots = computed(() => props.excludedSlots ?? []);
  const defaultAlertTitle = "Nessuna disponibilità";
  const defaultAlertDescription =
    "Scegli un'altro giorno e prenota la tua consulenza.";

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

  const slotStartTimeAsDate = computed(() => {
    if (!props.slotStartTime) {
      const date = new Date();
      date.setHours(9, 0, 0, 0);
      return date;
    }
    try {
      return parseISO(props.slotStartTime);
    } catch {
      const date = new Date();
      date.setHours(9, 0, 0, 0);
      return date;
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

  // Check if a day is excluded
  const isDayExcluded = (date: Date): boolean => {
    if (excludedDays.value.length === 0) {
      return false;
    }

    const dateStart = startOfDay(date);
    const dayOfWeek = date.getDay();

    return excludedDays.value.some((excluded) => {
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

  // Check if we can navigate back
  const canNavigateBack = computed(() => {
    const previousDate = new Date(currentDate.value);
    previousDate.setDate(previousDate.getDate() - 1);
    return (
      previousDate >= startOfDay(startDateAsDate.value) &&
      previousDate >= today.value
    );
  });

  // Check if we can navigate forward
  const canNavigateForward = computed(() => {
    const nextDate = new Date(currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);
    const maxDateLimit = maxDateAsDate.value
      ? startOfDay(maxDateAsDate.value)
      : null;
    return (
      nextDate >= today.value && (!maxDateLimit || nextDate <= maxDateLimit)
    );
  });

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
    const hours = slotStartTimeAsDate.value.getHours();
    const minutes = slotStartTimeAsDate.value.getMinutes();

    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);

    for (let i = 0; i < props.slotCount; i++) {
      const slotDateTime = new Date(slotDate);
      if (
        slotDateTime >= startOfDay(currentDate.value) &&
        slotDateTime >= new Date() &&
        slotDateTime <= endOfDay(currentDate.value)
      ) {
        slots.push(slotDateTime);
      }
      slotDate.setMinutes(slotDate.getMinutes() + slotInterval.value);

      // Add break duration between slots (except after the last one)
      if (breakDuration.value > 0 && i < props.slotCount - 1) {
        slotDate.setMinutes(slotDate.getMinutes() + breakDuration.value);
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
    return excludedSlots.value.some((disabledSlot) => {
      const disabledDate =
        typeof disabledSlot === "string"
          ? parseISO(disabledSlot)
          : disabledSlot;
      return (
        isSameDay(slot, disabledDate) &&
        isSameHour(slot, disabledDate) &&
        isSameMinute(slot, disabledDate)
      );
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
    if (props.infoText !== undefined) {
      return props.infoText;
    }
    return `${slotInterval.value} minuti a partire dalle`;
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

    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() - 1);

    // Skip excluded days
    while (
      isDayExcluded(newDate) &&
      newDate >= startOfDay(startDateAsDate.value)
    ) {
      newDate.setDate(newDate.getDate() - 1);
    }

    if (
      newDate >= startOfDay(startDateAsDate.value) &&
      newDate >= today.value
    ) {
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
    const maxDateLimit = maxDateAsDate.value
      ? startOfDay(maxDateAsDate.value)
      : null;
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
