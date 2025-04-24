import { FzColumnSlots, type FzColumnProps, type FzSimpleTableProps } from "@fiscozen/simple-table";
import { type FzActionlistProps } from "@fiscozen/actionlist";
import { IconSize } from "@fiscozen/icons";

export interface FzOrdering {
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

export interface FzTableFilter {
 type: 'select' | 'date' | 'badge'
 value: any
}

export type FzTableFilters = Record<string, FzTableFilter>

interface FzTableProps extends Omit<FzSimpleTableProps, 'value'> {
  /**
   * Title of the table
   */
  title?: string;
  /**
   * Subtitle of the table
   */
  subtitle?: string;
  /**
   * Label for data records
   */
  recordLabel?: string;
  /**
   * Wether to show the new item button
   */
  newItemButton?: boolean;
  /**
   * Label for new item button
   */
  newItemButtonLabel?: string;
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
   * Shows tulltext search input
   */
  searchable?: boolean;
  /**
   * placeholder for search filter input
   */
  searchFilterPlaceholder?: string;
  /**
   * internal ordering (natural sort)
   */
  internalOrdering?: boolean;
  /**
   * wether to show filters icon
   */
  filterable?: boolean;
  /**
   * wether to show fullscreen icon
   */
  allowFullscreen?: boolean;
  /**
   * Whether rows can be selected
   */
  selectable?: boolean;
  /**
   * Table variant
   */
  variant?: 'normal' | 'accordion' | 'list';
}

type FzTableSlots = {
  /**
   * Default template where columns must be defined as FzColumn components
   */
  default(props: {}): any;
};

type FzRowProps<T> = {
  /**
   * Row id
   */
  id: number;
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
  /**
   * Whether the row is selectable
   */
  selectable?: boolean;
  /**
   * CSS grid column configuration
   */
  colSpan?: Record<string, string>;
  /**
   * icon to show in a leftmost dedicated column
   */
  leftColIcon?: string;
  /**
   * left icon size
   */
  leftColIconSize?: IconSize;
  /**
   * left icon CSS class
   */
  leftColIconClass?: string;
  /** 
   * Is the row overflowing 
   */
  isOverflowing?: boolean;
};

type FzRowSlots = {
  default(props: { data: any }): any;
};

export { FzTableProps, FzTableSlots, FzRowProps, FzRowSlots };
