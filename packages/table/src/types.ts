import { FzColumnSlots, type FzColumnProps, type FzSimpleTableProps } from "@fiscozen/simple-table";
import { type FzActionlistProps } from "@fiscozen/actionlist";

export interface Ordering {
  /**
   *  Should a column be orderable
   */
  orderable?: boolean;
  /**
   *  Type of ordering 
   */
  direction?: 'asc' | 'desc';
  /**
   *  field to be ordered
   */
  field?: boolean
}

interface FzTableProps extends Omit<FzSimpleTableProps, 'value'> {
  /**
   * Actions to show in the dropdown in the action column
   */
  actions?: FzActionlistProps;
  /**
   * Number of pages to show in the pagination section
   */
  pages?: number;
  /**
   * Number of pages to show around the selected one
   */
  pageInterval?: number;
  /**
   * Grid template columns css property that will override default
   */
  gridTemplateColumns?: string;
  /**
   * Shows a fulltext input search filter
   */
  filterable?: boolean;
  /**
   * search input value
   */
  searchTerm?: string;
  /**
   * label for search filter input
   */
  searchFilterLabel?: string;
  /**
   * internal ordering (natural sort)
   */
  internalOrdering?: boolean;
}

type FzTableSlots = {
  /**
   * Default template where columns must be defined as FzColumn components
   */
  default(props: {}): any;
};

type FzRowProps<T> = {
  /**
   * Actions to show in the dropdown in the action column
   */
  actions?: FzActionlistProps;
  /**
   * Actions to show in the dropdown in the action column
   */
  data?: T;
  /**
   * Column configuration
   */
  columns: {props: FzColumnProps, children: FzColumnSlots}[];
};

type FzRowSlots = {
  default(props: { data: any }): any;
};

export { FzTableProps, FzTableSlots, FzRowProps, FzRowSlots };
