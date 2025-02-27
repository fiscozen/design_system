import { FzColumnProps, FzColumnSlots } from "@fiscozen/simple-table";

export const getBodyClasses = (
  column: { props: FzColumnProps; children: FzColumnSlots },
  isHeader?: boolean,
) => {
  return {
    relative: !column.props.sticky,
    sticky: column.props.sticky,
    "left-0 z-[2]": column.props.sticky === "left",
    "z-[3]": column.props.sticky && isHeader,
    "right-0": column.props.sticky === "right",
  };
};

export const bodyStaticClasses = [
  "fz__body",
  "z-[1]",
  "px-16",
  "min-h-48",
  "bg-core-white",
  "flex",
  "justify-start",
  "items-center",
  "min-w-min",
];