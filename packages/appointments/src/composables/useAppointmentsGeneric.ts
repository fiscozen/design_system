import { computed, type ComputedRef, type Ref } from "vue";
import { format, isSameDay, isValid, parseISO, startOfDay } from "date-fns";
import { it } from "date-fns/locale";
import type { FzAppointmentsCommonProps } from "../types";

export interface UseAppointmentsGenericOptions {
  props: Pick<
    FzAppointmentsCommonProps,
    "modelValue" | "name" | "alertTitle" | "alertDescription" | "infoText"
  >;
  currentDate: Ref<Date>;
  hasAnyAvailability: ComputedRef<boolean>;
  emit: (event: "update:modelValue", value: string | undefined) => void;
}

// Default values
const defaultAlertTitle = "Nessuna disponibilità";
const defaultOtherDayDescription =
  "Scegli un altro giorno e prenota la tua consulenza.";
const defaultNoAvailabilityDescription =
  "Al momento non ci sono orari disponibili.";

/**
 * Generic composable with common functionality shared between Auto and Manual modes
 */
export function useAppointmentsGeneric({
  props,
  currentDate,
  hasAnyAvailability,
  emit,
}: UseAppointmentsGenericOptions) {
  // Convert modelValue ISO-8601 string to Date object for internal use
  const modelValueAsDate = computed(() => {
    if (!props.modelValue) {
      return undefined;
    }
    const parsed = parseISO(props.modelValue);
    return isValid(parsed) ? parsed : undefined;
  });

  // Generate unique name for radio group
  const radioGroupName = computed(() => {
    const randomId = Math.random().toString(36).substring(2, 15);
    return props.name || `fz-appointments-${randomId}`;
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

  // Alert title
  const alertTitle = computed(() => {
    return props.alertTitle ?? defaultAlertTitle;
  });

  // Alert description: inviting another day only makes sense when another day exists
  const alertDescription = computed(() => {
    if (props.alertDescription !== undefined) {
      return props.alertDescription;
    }
    return hasAnyAvailability.value
      ? defaultOtherDayDescription
      : defaultNoAvailabilityDescription;
  });

  // Format time for display
  const formatTime = (date: Date): string => {
    return format(date, "HH:mm");
  };

  // Format date for display (e.g., "Lunedì 3 novembre")
  const formattedDate = computed(() => {
    return format(currentDate.value, "EEEE d MMMM", { locale: it });
  });

  // Handle slot selection
  const handleSlotSelect = (value: string) => {
    emit("update:modelValue", value);
  };

  return {
    modelValueAsDate,
    radioGroupName,
    selectedSlotValue,
    alertTitle,
    alertDescription,
    formatTime,
    formattedDate,
    handleSlotSelect,
  };
}
