import { FzSelectProps, FzSelectOptionsProps } from "@fiscozen/select";
import { FzInputProps } from "@fiscozen/input";

interface FzTypeaheadProps {
  selectProps: FzSelectProps;
  inputProps: FzInputProps;
  filteredOptions?: FzSelectOptionsProps[];
  filterFn?: (text?: string) => FzSelectOptionsProps[];
  /**
   * Callback function called after writing some text in the input. It will be called after 'delayTime'. It should return a primise of FzSelectOptionsProps[]
   * @param text
   * @returns Promise<FzSelectOptionsProps[]>
   */
  remoteFn?: (text: string) => Promise<FzSelectOptionsProps[]>;
  delayTime?: number;
}

export { FzTypeaheadProps };
