export type FzAppointmentsProps = {
  /**
   * The selected date and time (v-model) as ISO-8601 string
   */
  modelValue?: string;
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
};
