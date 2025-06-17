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
    "justify-end": !isHeader && typeof column.props.numeric !== "undefined",
    "justify-start": !isHeader && !(typeof column.props.numeric === 'undefined'),
    "lining-nums": !isHeader && !(typeof column.props.numeric === 'undefined'),
    "tabular-nums": !isHeader && !(typeof column.props.numeric === 'undefined'),
  };
};

export const bodyStaticClasses = [
  "fz__body",
  "z-[1]",
  "p-16",
  "min-h-[52px]",
  "text-base",
  "flex",
  "items-start",
  "min-w-min",
  "text-grey-500"
];
