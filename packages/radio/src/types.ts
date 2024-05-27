export type FzRadioProps = FzRadioSharedProps & {
  label: string;
  value?: string;
  errorText?: string;
  checked?: boolean;
  standalone?: boolean;
};

export type FzRadioGroupProps = FzRadioSharedProps & {
  label: string;
  errorText?: string;
  helpText?: string;
};

export type FzRadioSharedProps = {
  size: "sm" | "md";
  emphasis?: boolean;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  required?: boolean;
};