/**
 * Type definitions for the Fiscozen Textarea component library.
 *
 * @module @fiscozen/textarea/types
 */

/**
 * Props for the FzTextarea component.
 *
 * Multi-line text input with label, validation states, resize control,
 * and full WCAG 2.1 AA accessibility support.
 *
 * @example
 * <FzTextarea label="Notes" v-model="notes" resize="vertical" />
 */
type FzTextareaProps = {
  /**
   * HTML id attribute. Falls back to auto-generated ID for label association.
   */
  id?: string;
  /**
   * Form field name for submission and identification
   */
  name?: string;
  /**
   * Text size variant affecting font size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Text label displayed above the textarea
   */
  label: string;
  /**
   * Marks field as required. Adds asterisk to label and sets native required attribute.
   * @default false
   */
  required?: boolean;
  /**
   * Placeholder text shown when textarea is empty
   */
  placeholder?: string;
  /**
   * Enables error state with red border. Paired with errorMessage to display error text.
   * @default false
   */
  error?: boolean;
  /**
   * Error text displayed below textarea when error is true
   */
  errorMessage?: string;
  /**
   * Disables interaction and applies muted styling
   * @default false
   */
  disabled?: boolean;
  /**
   * Controls resize behavior of the textarea
   * @default 'all'
   */
  resize?: "none" | "vertical" | "horizontal" | "all";
  /**
   * Number of visible text rows
   */
  rows?: number;
  /**
   * Visible width in average character widths
   */
  cols?: number;
  /**
   * Help text displayed below textarea. Hidden when error message is shown.
   */
  helpMessage?: string;
  /**
   * Shows success checkmark icon when true
   * @default false
   */
  valid?: boolean;
  /**
   * Native minlength constraint
   */
  minlength?: number;
  /**
   * Native maxlength constraint
   */
  maxlength?: number;
  /**
   * Prevents editing while keeping field focusable and selectable
   * @default false
   */
  readonly?: boolean;
};

interface FzTextareaEvents {
  /**
   * Fired when textarea loses focus
   */
  (event: "blur", e: FocusEvent): void;
  /**
   * Fired when textarea gains focus
   */
  (event: "focus", e: FocusEvent): void;
  /**
   * Fired when content is pasted into textarea
   */
  (event: "paste", e: ClipboardEvent): void;
}

export { FzTextareaProps, FzTextareaEvents };
