/**
 * Type definitions for the Fiscozen Pagination component library.
 * @module @fiscozen/pagination/types
 */

// ---------------------------------------------------------------------------
// Primitive types
// ---------------------------------------------------------------------------

export type EllipsisVisibility = 'none' | 'both' | 'before' | 'after';

/** Lets the consumer choose the right control (e.g. icon for prev/next, disabled style for ellipsis). */
export type PaginationItemType = 'prev' | 'next' | 'ellipsis' | 'firstPage' | 'lastPage' | 'page';

/** A single token in the page list: either a page number or an ellipsis marker. */
export type PageToken = number | 'ellipsis';

// ---------------------------------------------------------------------------
// Data models
// ---------------------------------------------------------------------------

/** One button/slot in the bar. value is the page to go to on click; ellipsis items are disabled and not navigable. */
export interface PaginationItem {
    current: boolean;
    disabled: boolean;
    label: string;
    type: PaginationItemType;
    value: number;
}

/** Internal slot budget used by `usePagination` to decide how many center pages, anchors, and ellipsis to render. */
export interface SlotConfig {
    centerCount: number;
    ellipsisAfter: boolean;
    ellipsisBefore: boolean;
    maxVisibleSlots: number;
    showFirst: boolean;
    showLast: boolean;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * firstPage/lastPage affect only the anchored 1 and N (when they sit next to an ellipsis).
 * pages.show = false strips all page numbers except first/last and current, for minimal UIs.
 */
export interface PaginationOptions {
    ellipsis?: {
        label?: string;
        show?: EllipsisVisibility;
    };
    firstPage?: {
        show?: boolean;
    };
    lastPage?: {
        show?: boolean;
    };
    next?: {
        label?: string;
        show?: boolean;
    };
    pages?: {
        show?: boolean;
    };
    prev?: {
        label?: string;
        show?: boolean;
    };
}

/** Fully resolved options where every nested field is guaranteed present after merging with defaults. */
export interface ResolvedPaginationOptions {
    ellipsis: {
        label: string;
        show: EllipsisVisibility;
    };
    firstPage: {
        show: boolean;
    };
    lastPage: {
        show: boolean;
    };
    next: {
        label: string;
        show: boolean;
    };
    pages: {
        show: boolean;
    };
    prev: {
        label: string;
        show: boolean;
    };
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

/**
 * Props for the FzPagination component.
 *
 * Provides page-based navigation controls for paginated data sets.
 *
 * @example
 * <FzPagination :totalPages="10" v-model:currentPage="page" />
 */
export type FzPaginationProps = {
    /** Environment to use for the component. @default 'frontoffice' */
    environment?: 'frontoffice' | 'backoffice'
    /** Currently active page (v-model:currentPage). @default 0 */
    currentPage?: number
    /** Configuration for pagination controls (prev/next labels, ellipsis visibility, anchors). Merged with composable defaults. */
    options?: PaginationOptions
    /** Position of the pagination controls. @default 'end' */
    position?: 'start' | 'center' | 'end'
    /**
     * URL query parameter name for currentPage synchronization.
     * Only effective when syncUrl is true.
     * @default 'page'
     */
    urlKey?: string
    /**
     * Enables two-way sync between currentPage and a URL query parameter.
     * On mount, reads the page from the URL and emits update:currentPage.
     * On page change, writes the new value back to the URL.
     * Uses provideQueryStringRoute() if available, otherwise falls back to browser History API.
     * @default true
     */
    syncUrl?: boolean
    /** Total number of pages available. @default 0 */
    totalPages?: number
}
