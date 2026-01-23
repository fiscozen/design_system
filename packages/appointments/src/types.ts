import type { ComputedRef, Ref } from "vue";

export type FzAppointmentsCommonProps = {
  /**
   * The selected date and time (v-model) as ISO-8601 string
   */
  modelValue?: string;
  /**
   * The type of appointments component to use
   */
  type?: "auto" | "manual";
  /**
   * Name for the radio group
   */
  name?: string;
  /**
   * Whether the selection is required
   */
  required?: boolean;
  /**
   * Title for the alert
   */
  alertTitle?: string;
  /**
   * Description for the alert
   */
  alertDescription?: string;
  /**
   * Custom info text to display (e.g., "30 minuti a partire dalle")
   * If not provided, will be auto-generated in Auto mode or hidden in Manual mode
   */
  infoText?: string;
};

export type FzAppointmentsManualProps = FzAppointmentsCommonProps & {
  /**
   * The type of appointments component to use
   */
  type: "manual";
  /**
   * Pre-defined list of date-time slots as Date objects or ISO-8601 strings.
   * Each slot represents a specific date and time that can be selected.
   * Slots are automatically grouped by day for navigation.
   */
  slots: (Date | string)[];
};

export type FzAppointmentsAutoProps = FzAppointmentsCommonProps & {
  /**
   * The type of appointments component to use
   */
  type: "auto";
  /**
   * Start date for appointments as ISO-8601 string
   */
  startDate?: string;
  /**
   * Maximum date selectable as ISO-8601 string
   */
  maxDate?: string;
  /**
   * Start time for slots as ISO-8601 string (e.g., "2024-11-03T09:00:00.000Z")
   * The date part is ignored, only time is used
   */
  slotStartTime?: string;
  /**
   * Number of time slots to create (required)
   */
  slotCount: number;
  /**
   * Interval between slots in minutes
   * @default 30
   */
  slotInterval?: number;
  /**
   * Break duration between slots in minutes
   * @default 0
   */
  breakDuration?: number;
  /**
   * Days to exclude from selection. Can be:
   * - Date objects for specific dates
   * - ISO string dates (e.g., "2024-12-25")
   * - Numbers 0-6 for days of week (0 = Sunday, 6 = Saturday)
   */
  excludedDays?: (Date | string | number)[];
  /**
   * Slots that are already occupied and should be disabled.
   * Can be Date objects or ISO string dates with time
   */
  excludedSlots?: (Date | string)[];
};

export type FzAppointmentsProps =
  | FzAppointmentsManualProps
  | FzAppointmentsAutoProps;

/**
 * Common interface returned by both composables
 */
export interface UseAppointmentsReturn {
  // State
  availableSlots: ComputedRef<Date[]>;
  currentDate: Ref<Date>;
  formattedDate: ComputedRef<string>;
  infoText: ComputedRef<string | undefined>;
  hasAvailableSlots: ComputedRef<boolean>;
  selectedSlotValue: ComputedRef<string | undefined>;
  radioGroupName: ComputedRef<string>;
  alertTitle: ComputedRef<string>;
  alertDescription: ComputedRef<string>;

  // Navigation
  canNavigateBack: ComputedRef<boolean>;
  canNavigateForward: ComputedRef<boolean>;
  navigateBack: () => void;
  navigateForward: () => void;

  // Utility
  isSlotExcluded: (slot: Date) => boolean;
  formatTime: (date: Date) => string;
  handleSlotSelect: (value: string) => void;
}
