import { type FzSimpleTableProps } from "@fiscozen/simple-table";
import { type FzActionlistProps } from "@fiscozen/actionlist";

interface FzTableProps extends FzSimpleTableProps {
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
}

type FzTableSlots = {
  /**
   * Default template where columns must be defined as FzColumn components
   */
  default(props: {}): any;
};

export { FzTableProps, FzTableSlots };
