type FzTextareaProps = {
  /** 
   * Uniquely identifies textarea and binds label to it
   */
  id?: string;
  /**
   * Defines the textarea key in a form
   */
  name?: string;
  /**
   * Size of the textarea
   */
  size?: "sm" | "md" | "lg";
  /**
   * A message shown above the textarea describing what to insert
   */
  label: string;
  /**
   * Whether a value is required
   */
  required?: boolean;
  /**
   * A message shown inside the textarea to guide the user
   */
  placeholder?: string;
  /**
   * Signals an error to the user
   */
  error?: boolean;
  /**
   * A message of error shown under the textarea if error is true
   */
  errorMessage?: string;
  /**
   * Disables any user interaction
   */
  disabled?: boolean;
  /**
   * Whether and how the user can resize
   */
  resize?: "none" | "vertical" | "horizontal" | "all";
  /**
   * Number of rows that fit in the textarea
   */
  rows?: number;
  /**
   * Number of characters that horizontally fit in the textarea
   */
  cols?: number;
  /**
   * A message shown under the textarea
   */
  helpMessage?: string;
  /**
   * Whether to toggle the green check icon
   */
  valid?: boolean;
  /**
   * Permitted minimum length
   */
  minlength?: number;
  /**
   * Permitted maximum length
   */
  maxlength?: number;
  /**
   * If true, cannot be edited but can still be focused
   */
  readonly?: boolean;
};

export { FzTextareaProps };
