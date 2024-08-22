import type { VueDatePickerProps } from "@vuepic/vue-datepicker";
import type { FzInputProps } from "@fiscozen/input";

interface FzDatepickerProps extends VueDatePickerProps {
    inputProps: FzInputProps;
    valueFormat?: boolean;
}

export { FzDatepickerProps };
