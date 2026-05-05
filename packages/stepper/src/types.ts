type FzStepperEnvironment = "frontoffice" | "backoffice";

type FzStepperProps = {
  /**
   * Step objects. Recommended maximum of 8 steps.
   */
  steps: FzStepProps[];
  /**
   * Show the progress bar above each step.
   * @default true
   */
  hasStepbar?: boolean;
  /**
   * Show the step navigation dropdown in mobile view.
   * When false, only the active step is displayed with no toggle.
   * @default true
   */
  hasStepperList?: boolean;
  /**
   * Color environment. Controls the accent color for the active step.
   * @default 'frontoffice'
   */
  environment?: FzStepperEnvironment;
  /**
   * @deprecated Use the responsive breakpoint behaviour instead.
   * Forces the mobile layout regardless of screen size.
   */
  forceMobile?: boolean;
};

type FzStepStatus = "completed" | "error" | "disabled";

type FzStepProps = {
  /**
   * Title of the step.
   */
  title: string;
  /**
   * Description of the step.
   */
  description?: string;
  /**
   * Status of the step.
   * Note: 'current' is computed internally by the stepper based on activeStep and should not be passed.
   */
  status?: FzStepStatus;
  /**
   * Truncate the title and description to a single line with ellipsis.
   * @default false
   */
  isTextTruncated?: boolean;
  /**
   * Explicitly show or hide the description.
   * When false, hides the description even if a description string is provided.
   * @default true
   */
  hasStepDescription?: boolean;
};

export { FzStepperProps, FzStepperEnvironment, FzStepStatus, FzStepProps };
