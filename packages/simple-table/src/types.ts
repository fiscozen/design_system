type FzSimpleTableProps = {
  data: Record<string, any>[];
};

type FzSimpleTableSlots = {
  default(props: {}): any;
  header(props: {}): any;
  footer(props: {}): any;
};

type FzColumnProps = {
  field: string;
  header: string;
};

type FzColumnSlots = {
  default(props: { data: any }): any;
};

export { FzSimpleTableProps, FzSimpleTableSlots, FzColumnProps, FzColumnSlots };
