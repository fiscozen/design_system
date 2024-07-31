import { FzSelectProps, FzSelectOptionsProps } from "@fiscozen/select";
import { FzInputProps } from "@fiscozen/input";

interface FzTypeaheadProps {
  selectProps: FzSelectProps;
  inputProps: FzInputProps;
  filteredOptions?: FzSelectOptionsProps[];
  filterFn?: (text?: string) => FzSelectOptionsProps[];
}

export { FzTypeaheadProps };
