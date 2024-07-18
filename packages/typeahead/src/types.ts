import { FzSelectProps, FzSelectOptionsProps } from "@fiscozen/select";

interface FzTypeaheadProps extends FzSelectProps {
  filteredOptions?: FzSelectOptionsProps[];
  filterFn?: (text?: string) => FzSelectOptionsProps[];
  label?: string;
}

export { FzTypeaheadProps };
