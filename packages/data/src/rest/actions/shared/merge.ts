import { toValue, type MaybeRefOrGetter } from "vue";
import type {
  UseListActionParams,
  FilterParams,
  SortParams,
  PaginationParams,
} from "../list/types";
import type { QueryActionOptions, MutationActionOptions } from "./types";
import { isParamsObject } from "./normalize";

/**
 * Resolves only the top-level params (filters, ordering, pagination) with toValue.
 * Keeps refs/getters as values inside filters and pagination so that when the result
 * is passed to useList/usePaginatedList, reactivity is preserved (watch triggers on ref change).
 */
function resolveListParams(
  params: UseListActionParams | undefined,
): { filters: FilterParams; ordering: SortParams; pagination: PaginationParams } {
  if (!params || typeof params !== "object") {
    return { filters: {}, ordering: [], pagination: {} };
  }
  const filtersRaw = (params.filters !== undefined && params.filters !== null
    ? toValue(params.filters)
    : {}) as Record<string, unknown>;
  const orderingRaw = (params.ordering !== undefined && params.ordering !== null
    ? toValue(params.ordering)
    : []) as SortParams;
  const paginationRaw = (params.pagination !== undefined && params.pagination !== null
    ? toValue(params.pagination)
    : {}) as PaginationParams;

  const filters =
    filtersRaw && typeof filtersRaw === "object" && !Array.isArray(filtersRaw)
      ? (filtersRaw as FilterParams)
      : {};
  const ordering = Array.isArray(orderingRaw) ? orderingRaw : [];
  // Only include keys that are present so merge spread preserves defaults (e.g. pageSize when additional has only page)
  const pagination: PaginationParams = {};
  if (
    paginationRaw &&
    typeof paginationRaw === "object" &&
    !Array.isArray(paginationRaw)
  ) {
    if (paginationRaw.page !== undefined && paginationRaw.page !== null) {
      (pagination as Record<string, unknown>).page = paginationRaw.page;
    }
    if (
      paginationRaw.pageSize !== undefined &&
      paginationRaw.pageSize !== null
    ) {
      (pagination as Record<string, unknown>).pageSize =
        paginationRaw.pageSize;
    }
  }

  return {
    filters,
    ordering,
    pagination,
  };
}

// =============================================================================
// mergeListActionArgs – useList / usePaginatedList
// =============================================================================

/**
 * Input for merging list action arguments (defaults + view call args).
 *
 * Used when building a custom list/paginated-list action that preconfigures
 * params and options while allowing the view to override or extend them.
 * All keys are optional; defaults and view args are resolved at call time (toValue).
 *
 * **Discrimination:** When additionalOptions is present, additionalParamsOrOptions is treated as params.
 * When only additionalParamsOrOptions is present, it is discriminated via isParamsObject
 * (presence of filters, ordering, or pagination) to decide if it is params or options.
 */
export interface MergeListActionArgsInput<T = unknown, TOptions = QueryActionOptions<T[]>> {
  /**
   * Default params (filters, ordering, pagination).
   * Resolved at call time; supports ref/getter for reactive defaults (e.g. user: toValue(userId)).
   */
  defaultParams?: MaybeRefOrGetter<UseListActionParams>;

  /**
   * Default options (onMount, autoUpdate, throwOnError, etc.).
   * Resolved at call time.
   */
  defaultOptions?: MaybeRefOrGetter<TOptions>;

  /**
   * First argument from the view call: either params or options (same overload as useList).
   * Resolved at call time before discrimination.
   */
  additionalParamsOrOptions?: MaybeRefOrGetter<UseListActionParams | TOptions>;

  /**
   * Second argument from the view call (options only, when additionalParamsOrOptions is params).
   * Resolved at call time.
   */
  additionalOptions?: MaybeRefOrGetter<TOptions>;
}

/**
 * Result of merging list action arguments.
 * Params and options ready to pass to useList / usePaginatedList. Refs as filter/pagination
 * values are preserved so that reactivity is maintained (ref changes trigger refetch).
 */
export interface MergeListActionArgsResult<T = unknown, TOptions = QueryActionOptions<T[]>> {
  params: UseListActionParams;
  options: TOptions;
}

/**
 * Merges default and view arguments for list/paginated-list actions.
 *
 * Use when building a custom action (e.g. useSTSLists) that preconfigures filters/options
 * but allows the view to override ordering, pagination, options, or remove default filters
 * (pass filter key as undefined to omit from request; null is sent to the server).
 *
 * **Reactivity:** Refs/getters as filter or pagination values are preserved (not resolved),
 * so when the result is passed to useList/usePaginatedList, changes to those refs trigger
 * refetch (same behaviour as calling useList directly with refs in filters).
 *
 * @param input - Optional object with defaultParams, defaultOptions, additionalParamsOrOptions, additionalOptions
 * @returns Merged params and options to pass to useList or usePaginatedList
 *
 * @example
 * const useSTSLists = (paramsOrOptions?, options?) => {
 *   const { params, options: mergedOptions } = mergeListActionArgs<Invoice>({
 *     defaultParams: { filters: { sts: true, user: toValue(userId) } },
 *     additionalParamsOrOptions: paramsOrOptions,
 *     additionalOptions: options,
 *   });
 *   return useInvoicesList(params, mergedOptions);
 * };
 */
export function mergeListActionArgs<T = unknown, TOptions extends QueryActionOptions<T[]> = QueryActionOptions<T[]>>(
  input?: MergeListActionArgsInput<T, TOptions>,
): MergeListActionArgsResult<T, TOptions> {
  const defaultParamsResolved = input?.defaultParams != null
    ? (toValue(input.defaultParams) as UseListActionParams | undefined)
    : undefined;
  const defaultOptionsResolved = input?.defaultOptions != null
    ? (toValue(input.defaultOptions) as TOptions)
    : ({} as TOptions);
  const additionalFirstResolved = input?.additionalParamsOrOptions != null
    ? toValue(input.additionalParamsOrOptions)
    : undefined;
  const additionalOptionsResolved = input?.additionalOptions != null
    ? (toValue(input.additionalOptions) as TOptions)
    : undefined;

  let additionalParamsResolved: UseListActionParams | undefined;
  let additionalOptionsOnlyResolved: TOptions | undefined;
  if (additionalOptionsResolved !== undefined) {
    additionalParamsResolved = additionalFirstResolved as UseListActionParams | undefined;
    additionalOptionsOnlyResolved = additionalOptionsResolved;
  } else if (additionalFirstResolved !== undefined && isParamsObject(additionalFirstResolved)) {
    additionalParamsResolved = additionalFirstResolved as UseListActionParams;
    additionalOptionsOnlyResolved = undefined;
  } else {
    additionalParamsResolved = undefined;
    additionalOptionsOnlyResolved = additionalFirstResolved as TOptions | undefined;
  }

  const defaultPlain = resolveListParams(defaultParamsResolved);
  const additionalPlain = resolveListParams(additionalParamsResolved);

  const filters: FilterParams = { ...defaultPlain.filters, ...additionalPlain.filters };
  const ordering: SortParams =
    additionalParamsResolved !== undefined && "ordering" in additionalParamsResolved
      ? additionalPlain.ordering
      : defaultPlain.ordering;
  const pagination: PaginationParams = { ...defaultPlain.pagination, ...additionalPlain.pagination };

  const params: UseListActionParams = { filters, ordering, pagination };
  const options: TOptions = {
    ...defaultOptionsResolved,
    ...additionalOptionsOnlyResolved,
  } as TOptions;

  return { params, options };
}

// =============================================================================
// mergeRetrieveActionArgs – useRetrieve
// =============================================================================

/**
 * Input for merging retrieve action arguments (defaults + view call args).
 *
 * For useRetrieve the view always passes (pk?, options?); no discrimination needed.
 * pk in the result can remain a ref/getter so the underlying action stays reactive.
 */
export interface MergeRetrieveActionArgsInput<T = unknown> {
  /**
   * Default primary key (e.g. current user id when resource is scoped).
   * Resolved at call time when used as fallback; can be ref/getter.
   */
  defaultPk?: MaybeRefOrGetter<string | number>;

  /**
   * Default options. Resolved at call time.
   */
  defaultOptions?: MaybeRefOrGetter<QueryActionOptions<T>>;

  /**
   * Primary key passed by the view (first argument of useRetrieve).
   * When provided, overrides defaultPk. Preserved as-is in result (refs kept for reactivity).
   */
  overridePk?: MaybeRefOrGetter<string | number>;

  /**
   * Options passed by the view (second argument of useRetrieve).
   * Resolved at call time before merging.
   */
  additionalOptions?: MaybeRefOrGetter<QueryActionOptions<T>>;
}

/**
 * Result of merging retrieve action arguments.
 * pk can be a ref/getter when provided by the view; options are plain (resolved).
 */
export interface MergeRetrieveActionArgsResult<T = unknown> {
  pk: MaybeRefOrGetter<string | number> | undefined;
  options: QueryActionOptions<T>;
}

/**
 * Merges default and view arguments for retrieve actions.
 *
 * Use when building a custom retrieve action with default pk or options.
 * At least one of defaultPk or overridePk should be provided when calling the underlying action.
 *
 * @param input - Optional object with defaultPk, defaultOptions, overridePk, additionalOptions
 * @returns Merged pk and options to pass to useRetrieve
 *
 * @example
 * const useSTSInvoice = (pk?, options?) => {
 *   const { pk: mergedPk, options: mergedOptions } = mergeRetrieveActionArgs<Invoice>({
 *     defaultPk: toValue(userId),
 *     overridePk: pk,
 *     additionalOptions: options,
 *   });
 *   return useRetrieveInvoice(mergedPk, mergedOptions);
 * };
 */
export function mergeRetrieveActionArgs<T = unknown>(
  input?: MergeRetrieveActionArgsInput<T>,
): MergeRetrieveActionArgsResult<T> {
  const pk =
    input?.overridePk !== undefined && input?.overridePk !== null
      ? input.overridePk
      : (input?.defaultPk != null ? toValue(input.defaultPk) : undefined);
  const defaultOptionsResolved = input?.defaultOptions != null
    ? (toValue(input.defaultOptions) as QueryActionOptions<T>)
    : {};
  const additionalOptionsResolved = input?.additionalOptions != null
    ? (toValue(input.additionalOptions) as QueryActionOptions<T>)
    : {};
  const options: QueryActionOptions<T> = {
    ...defaultOptionsResolved,
    ...additionalOptionsResolved,
  };
  return { pk, options };
}

// =============================================================================
// mergeMutationActionArgs – useCreate / useUpdate / useDelete
// =============================================================================

/**
 * Input for merging mutation action arguments (defaults + view options).
 *
 * Mutations only have options (no params in the composable call).
 * View passes a single optional argument: options.
 */
export interface MergeMutationActionArgsInput {
  /**
   * Default options (e.g. throwOnError: true).
   * Resolved at call time.
   */
  defaultOptions?: MaybeRefOrGetter<MutationActionOptions>;

  /**
   * Options passed by the view (single argument of useCreate/useUpdate/useDelete).
   * Resolved at call time before merging.
   */
  additionalOptions?: MaybeRefOrGetter<MutationActionOptions>;
}

/**
 * Result of merging mutation action arguments.
 * Plain options object ready to pass to useCreate / useUpdate / useDelete.
 */
export interface MergeMutationActionArgsResult {
  options: MutationActionOptions;
}

/**
 * Merges default and view options for mutation actions (create, update, delete).
 *
 * Use when building a custom mutation action with default options
 * (e.g. throwOnError: true for all create calls from this composable).
 *
 * @param input - Optional object with defaultOptions, additionalOptions
 * @returns Merged options to pass to useCreate / useUpdate / useDelete
 *
 * @example
 * const useSTSCreateInvoice = (additionalOptions?) => {
 *   const { options: mergedOptions } = mergeMutationActionArgs({
 *     defaultOptions: { throwOnError: true },
 *     additionalOptions,
 *   });
 *   return useCreateInvoice(mergedOptions);
 * };
 */
export function mergeMutationActionArgs(
  input?: MergeMutationActionArgsInput,
): MergeMutationActionArgsResult {
  const defaultOptionsResolved = input?.defaultOptions != null
    ? toValue(input.defaultOptions)
    : {};
  const additionalOptionsResolved = input?.additionalOptions != null
    ? toValue(input.additionalOptions)
    : {};
  const options: MutationActionOptions = {
    ...defaultOptionsResolved,
    ...additionalOptionsResolved,
  };
  return { options };
}
