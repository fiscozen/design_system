import { FzSelectProps, FzSelectOptionsProps } from "@fiscozen/select";
import { FzInputProps } from "@fiscozen/input";

interface FzTypeaheadProps {
  selectProps: FzSelectProps;
  inputProps: FzInputProps;
  /**
   * If true, writing in the input will filter the options
   */
  filtrable?: boolean;
  /**
   * @deprecated use `selectProps.options` instead
   */
  filteredOptions?: FzSelectOptionsProps[];
  filterFn?: (text?: string) => FzSelectOptionsProps[];
  delayTime?: number;
}

export { FzTypeaheadProps };
