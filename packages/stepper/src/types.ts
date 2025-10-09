type FzStepperProps = {
  /**
   *  step objects
   */
  steps: FzStepProps[];
  /**
   *  Disable stepper progress bar
   */
  disableProgressBar?: boolean;
  /**
   * force the mobile version
   */
  forceMobile?: boolean;
}
type FzStepStatus = 'completed' | 'error' | 'disabled'; 
type FzStepProps = {
  /**
   *  Title of the stepper
   */
  title: string;
  /**
   *  Description of the stepper
   */
  description?: string
  /**
   *  Status of the stepper
   */
  status?: FzStepStatus;
}

export { FzStepperProps, FzStepStatus, FzStepProps };
