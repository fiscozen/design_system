type FzTextareaProps = {
  id?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "all";
  rows?: number;
  cols?: number;
  helpMessage?: string;
  valid?: boolean;
  minlength?: number;
  maxlength?: number;
  readonly?: boolean;
};

export { FzTextareaProps };
