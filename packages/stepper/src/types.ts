type FzStepperProps = {
  /**
   *  step objects
   */
  steps: FzStepProps[];
  /**
   *  Disable stepper progress bar
   */
  disableProgressBar?: boolean;
}
type FzStepStatus = 'completed' | 'error'; 
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
