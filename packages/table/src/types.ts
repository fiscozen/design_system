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
  direction?: 'asc' | 'desc' | 'none';
  /**
   *  field to be ordered
   */
  field?: boolean
}

export interface FzTableFilter {
  value: any;
  label: string;
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
   * https://github.com/fiscozen/it.fiscozen.app/pull/10156
   * CSS class for the table
   */
  tableClass?: string;
  /**
   * Label for data records
   */
  recordLabel?: string;
  /**
   * Override total records number
   */
  recordNumber?: number;
  /**
   * Wether to show the new item button
   */
  newItemButton?: boolean;
  /**
   * Label for new item button
   */
  newItemButtonLabel?: string;
  /**
   * Icon name for new item button
   */
  newItemButtonIcon?: string;
  /**
   * Wether the new item button is disabled
   */
  newItemButtonDisabled?: boolean;
  /**
   * Actions to show in the dropdown in the action column
   */
  actions?: FzActionlistProps | ((data: any) => FzActionlistProps);
  /**
   * Wether to disable the actions dropdown opener button
   */
  actionsDisabled?: boolean;
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
   * wether to show fullscreen icon
   */
  allowFullscreen?: boolean;
  /**
   * Whether rows can be selected
   */
  selectable?: boolean;
  /**
   * Whether there are active filters
   */
  hasActiveFilters?: boolean;
  /**
   * Additional filters not defined in the columns
   */
  extFilters?: Record<string, string>;
  /**
   * Table variant
   */
  variant?: 'normal' | 'accordion' | 'list' | 'radio';
  /**
   * Action column label
   *
   * @default 'Azione'
   */
  actionLabel?: string;
  /**
   * Wether to show the loading spinner
   * @default false
   * */
  loading?: boolean;
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
  actions?: ((data: T) => FzActionlistProps) | FzActionlistProps;
  /**
   * Wether to disable the actions dropdown opener button
   */
  actionsDisabled?: boolean;
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
  /**
   * Whether the row should show a radio input
   */
  hasRadio?: boolean;
  /**
   * Custom CSS classes for the row
   */
  rowClass?: string;
  /**
   * Show a list like row
   */
  isList?: boolean;
};

type FzRowSlots = {
  default(props: { data: any }): any;
};

export { FzTableProps, FzTableSlots, FzRowProps, FzRowSlots };
