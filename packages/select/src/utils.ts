/**
 * Utility functions for the Fiscozen Select component library.
 *
 * @module @fiscozen/select/utils
 */

import Fuse from "fuse.js";
import type {
  FzSelectOptionsProps,
  FzSelectOptionProps,
} from "./types";

export type { Fuse };

/**
 * Type for functions that can be debounced
 */
type FuncToDebounce = (...args: unknown[]) => void;

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified timeout has elapsed since the last invocation.
 *
 * Useful for limiting the rate of function calls, especially for input handlers
 * that trigger expensive operations like API calls or filtering.
 *
 * @param func - The function to debounce
 * @param timeout - Delay in milliseconds before invoking the function
 * @returns A debounced version of the input function
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query)
 * }, 300)
 *
 * debouncedSearch('test') // Will execute after 300ms of no further calls
 */
function debounce(func: FuncToDebounce, timeout: number = 300): FuncToDebounce {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return function debounced(this: unknown, ...args: unknown[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Type guard to check if an option is selectable (not a label)
 *
 * @param option - Option to check
 * @returns True if option is selectable
 */
function isSelectableOption(
  option: FzSelectOptionsProps
): option is FzSelectOptionProps {
  return option.kind !== "label";
}

/**
 * Applies fuzzy search using Fuse.js to filter selectable options
 *
 * Uses Fuse.js for approximate string matching, useful for handling typos
 * and partial matches in option labels.
 *
 * Accepts an optional Fuse instance to avoid rebuilding the index on each search.
 * If not provided, creates a new instance (less efficient for repeated searches).
 *
 * @param options - All options to search through
 * @param searchValue - Search query string
 * @param fuseInstance - Optional cached Fuse instance (recreated if options changed)
 * @returns Filtered selectable options matching the search
 */
function applyFuzzySearch(
  options: FzSelectOptionProps[],
  searchValue: string,
  fuseInstance?: Fuse<FzSelectOptionProps>
): FzSelectOptionProps[] {
  const fuse =
    fuseInstance || new Fuse(options, { keys: ["label"] });
  return fuse
    .search(searchValue)
    .map((searchRes: { item: FzSelectOptionProps }) => searchRes.item);
}

/**
 * Applies simple case-insensitive substring matching to filter options
 *
 * Filters options where the label contains the search value as a substring.
 * Faster than fuzzy search but less forgiving of typos.
 *
 * @param options - All options to search through
 * @param searchValue - Search query string
 * @returns Filtered selectable options matching the search
 */
function applySimpleSearch(
  options: FzSelectOptionProps[],
  searchValue: string
): FzSelectOptionProps[] {
  const lowerCaseSearchValue = searchValue.toLowerCase();
  return options.filter((option) =>
    option.label.toLowerCase().includes(lowerCaseSearchValue)
  );
}

/**
 * Reconstructs grouped options structure after filtering
 *
 * Preserves group labels only when they contain filtered options.
 * This maintains visual grouping while showing only relevant results.
 *
 * @param allOptions - Original options array with groups
 * @param filteredSelectableOptions - Filtered selectable options
 * @returns Reconstructed options array with preserved group labels
 */
function reconstructGroupedOptions(
  allOptions: FzSelectOptionsProps[],
  filteredSelectableOptions: FzSelectOptionProps[]
): FzSelectOptionsProps[] {
  const result: FzSelectOptionsProps[] = [];
  const filteredValues = new Set(
    filteredSelectableOptions.map((opt) => opt.value)
  );

  let currentGroupLabel: FzSelectOptionsProps | null = null;
  let labelAdded = false; // Track if current group label has been added

  for (const item of allOptions) {
    if (item.kind === "label") {
      // Start new group - reset tracking
      currentGroupLabel = item;
      labelAdded = false;
    } else if (isSelectableOption(item)) {
      // Check if this option is in the filtered list
      if (filteredValues.has(item.value)) {
        // Add group label only once, before the first filtered option in the group
        if (currentGroupLabel && !labelAdded) {
          result.push(currentGroupLabel);
          labelAdded = true;
        }
        // Add the filtered option
        result.push(item);
      }
    }
  }

  return result;
}

/**
 * Filters options using custom async filter function
 *
 * Handles async filter functions with error handling. Returns empty array
 * on error to prevent component crashes.
 *
 * @param filterFn - Custom filter function (can be async)
 * @param searchValue - Search query string
 * @returns Filtered options array, or empty array on error
 */
async function applyCustomFilter(
  filterFn: (
    text?: string,
  ) => Promise<FzSelectOptionsProps[]> | FzSelectOptionsProps[],
  searchValue: string
): Promise<FzSelectOptionsProps[]> {
  try {
    const result = await filterFn(searchValue);
    return result || [];
  } catch (error) {
    console.error("[FzSelect] Error in filterFn:", error);
    return [];
  }
}

/**
 * Filters selectable options based on search strategy
 *
 * Applies the appropriate filtering strategy based on component configuration:
 * - Custom filterFn (if provided)
 * - Fuzzy search (if fuzzySearch is true)
 * - Simple substring matching (default)
 *
 * For grouped options, reconstructs the group structure preserving labels
 * only for groups containing filtered results.
 *
 * @param options - All options to filter
 * @param searchValue - Search query string (must be non-empty)
 * @param fuzzySearch - Whether to use fuzzy search
 * @param fuseInstance - Optional cached Fuse instance for fuzzy search (recreated if options changed)
 * @returns Filtered options array (may include group labels)
 */
function filterSelectableOptions(
  options: FzSelectOptionsProps[],
  searchValue: string,
  fuzzySearch: boolean,
  fuseInstance?: Fuse<FzSelectOptionProps>
): FzSelectOptionsProps[] {
  // Filter only selectable options (exclude labels)
  const selectableOptions = options.filter(isSelectableOption);

  // Apply appropriate search strategy
  const filteredSelectable = fuzzySearch
    ? applyFuzzySearch(selectableOptions, searchValue, fuseInstance)
    : applySimpleSearch(selectableOptions, searchValue);

  // Reconstruct grouped structure if original had groups
  const hasGroups = options.some((opt) => opt.kind === "label");
  if (hasGroups) {
    return reconstructGroupedOptions(options, filteredSelectable);
  }

  return filteredSelectable;
}

export {
  debounce,
  isSelectableOption,
  applyFuzzySearch,
  applySimpleSearch,
  reconstructGroupedOptions,
  applyCustomFilter,
  filterSelectableOptions,
};
