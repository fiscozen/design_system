import { computed, ref, watch } from "vue";
import {
  endOfDay,
  isSameDay,
  isSameHour,
  isSameMinute,
  isValid,
  parseISO,
  startOfDay,
} from "date-fns";
import type { FzAppointmentsAutoProps, UseAppointmentsReturn } from "../types";
import { useAppointmentsGeneric } from "./useAppointmentsGeneric";

export interface UseAppointmentsAutoOptions {
  props: FzAppointmentsAutoProps;
  emit: (event: "update:modelValue", value: string | undefined) => void;
}

export function useAppointmentsAuto({
  props,
  emit,
}: UseAppointmentsAutoOptions): UseAppointmentsReturn {
  const slotInterval = computed(() => props.slotInterval ?? 30);
  const breakDuration = computed(() => props.breakDuration ?? 0);
  const excludedDays = computed(() => props.excludedDays ?? []);
  const excludedSlots = computed(() => props.excludedSlots ?? []);

  // Convert ISO-8601 strings to Date objects for internal use
  const startDateAsDate = computed(() => {
    if (!props.startDate) {
      return startOfDay(new Date());
    }
    const parsed = parseISO(props.startDate);
    return isValid(parsed) ? parsed : startOfDay(new Date());
  });

  const slotStartTimeAsDate = computed(() => {
    if (!props.slotStartTime) {
      const date = new Date();
      date.setHours(9, 0, 0, 0);
      return date;
    }
    const parsed = parseISO(props.slotStartTime);
    if (isValid(parsed)) {
      return parsed;
    }
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });

  const maxDateAsDate = computed(() => {
    if (!props.maxDate) {
      return null;
    }
    const parsed = parseISO(props.maxDate);
    return isValid(parsed) ? parsed : null;
  });

  // Current date being viewed
  const currentDate = ref<Date>(startDateAsDate.value);

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

  // Get today's date at midnight for comparison
  const today = computed(() => {
    return startOfDay(new Date());
  });

  // Helper function to check if a single excluded value matches the date
  const matchesExcludedDay = (
    excluded: Date | string | number,
    dateStart: Date,
    dayOfWeek: number,
  ): boolean => {
    // Check if it's a number (day of week)
    if (typeof excluded === "number") {
      return excluded === dayOfWeek;
    }

    // Check if it's a string (ISO date)
    if (typeof excluded === "string") {
      const parsed = parseISO(excluded);
      if (!isValid(parsed)) {
        return false;
      }
      return isSameDay(startOfDay(parsed), dateStart);
    }

    // Check if it's a Date object
    if (excluded instanceof Date) {
      return isSameDay(startOfDay(excluded), dateStart);
    }

    return false;
  };

  // Check if a day is excluded
  const isDayExcluded = (date: Date): boolean => {
    if (excludedDays.value.length === 0) {
      return false;
    }

    const dateStart = startOfDay(date);
    const dayOfWeek = date.getDay();

    return excludedDays.value.some((excluded) =>
      matchesExcludedDay(excluded, dateStart, dayOfWeek),
    );
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

      if (!isValid(disabledDate)) {
        return false;
      }

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

  // Info text showing slot interval
  const infoText = computed(() => {
    if (props.infoText !== undefined) {
      return props.infoText;
    }
    return `${slotInterval.value} minuti a partire dalle`;
  });

  // Navigate to previous day
  const navigateBack = () => {
    if (!canNavigateBack.value) {
      return;
    }

    const newDate = new Date(currentDate.value);
    newDate.setDate(newDate.getDate() - 1);

    // Skip excluded days with safety limit to prevent infinite loops
    const maxIterations = 365; // Maximum days to check (1 year)
    let iterations = 0;
    while (
      isDayExcluded(newDate) &&
      newDate >= startOfDay(startDateAsDate.value) &&
      iterations < maxIterations
    ) {
      newDate.setDate(newDate.getDate() - 1);
      iterations++;
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

    // Skip excluded days with safety limit to prevent infinite loops
    const maxDateLimit = maxDateAsDate.value
      ? startOfDay(maxDateAsDate.value)
      : null;
    const maxIterations = 365; // Maximum days to check (1 year)
    let iterations = 0;
    while (
      isDayExcluded(newDate) &&
      newDate >= today.value &&
      (!maxDateLimit || newDate <= maxDateLimit) &&
      iterations < maxIterations
    ) {
      newDate.setDate(newDate.getDate() + 1);
      iterations++;
    }

    // Only update if we found a valid date and didn't hit the iteration limit
    if (
      iterations < maxIterations &&
      newDate >= today.value &&
      (!maxDateLimit || newDate <= maxDateLimit)
    ) {
      currentDate.value = newDate;
      // Reset selection when date changes
      emit("update:modelValue", undefined);
    }
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
