import { IconSize } from "@fiscozen/icons/src/types";

export interface FzNavlinkProps<T = void> {
    iconName?: string;
    iconSize?: IconSize
    label?: string;
    disabled?: boolean;
    meta?: T;
}