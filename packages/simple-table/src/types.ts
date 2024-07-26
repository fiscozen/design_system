type FzSimpleTableProps = {
  /**
   * The data that gets rendered in the table rows. Must be an array of POJOs.
   */
  value: Record<string, any>[];
  /**
   * Rendered when no data gets provided
   */
  placeholder?: string;
};

type FzSimpleTableSlots = {
  /**
   * Default template where columns must be defined as FzColumn components
   */
  default(props: {}): any;
};

type FzColumnProps = {
  /**
   * When no custom template is provided, this is the key used for looking up the value.
   * For example, if the field is "user" then the table renders data[rowIndex]["user"] for each row.
   */
  field?: string;
  /**
   * The header label of this column
   */
  header: string;
};

type FzColumnSlots = {
  /**
   * Custom template that can be provided if additional formatting or custom components are needed.
   * When not provided, the table will render the value using the field prop as lookup key.
   */
  default(props: { data: any }): any;
};

export { FzSimpleTableProps, FzSimpleTableSlots, FzColumnProps, FzColumnSlots };
