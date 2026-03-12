/**
 * Type definitions for the Fiscozen Textarea component library.
 *
 * @module @fiscozen/textarea/types
 */

/**
 * Props for the FzTextarea component.
 *
 * Multi-line text input with label, validation states, resize control,
 * and full WCAG 2.1 AA accessibility support. Error and help content
 * are provided via slots (errorMessage, helpText) following the same
 * pattern as FzInput.
 *
 * @example
 * <FzTextarea label="Notes" v-model="notes" resize="vertical">
 *   <template #helpText>Max 500 characters</template>
 * </FzTextarea>
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
   * @deprecated Not part of the Figma design. Will be removed in the next major version.
   * The textarea always uses text-base (16px). This prop is accepted but ignored.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Text label displayed above the textarea. When omitted, no label element is rendered.
   */
  label?: string;
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
   * Enables error state with red border. Paired with errorMessage slot
   * to display error via FzAlert. Works with disabled (both states reflected in ARIA).
   * @default false
   */
  error?: boolean;
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

export { FzTextareaProps };
