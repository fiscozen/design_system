import type {
  UseActions,
  MutationActionOptions,
  QueryActionOptions,
} from "./shared/types";
import type { UseListAction } from "./list/types";
import type { UsePaginatedListAction } from "./paginated-list/types";
import type { UseCreateAction } from "./create/types";
import type { UseUpdateAction } from "./update/types";
import type { UseDeleteAction } from "./delete/types";
import { createRetrieveAction } from "./retrieve";
import { createListAction } from "./list";
import { createPaginatedListAction } from "./paginated-list";
import { createCreateAction } from "./create";
import { createUpdateAction } from "./update";
import { createDeleteAction } from "./delete";

/**
 * Factory function to create CRUD actions for a given resource
 *
 * This is the main entry point for creating entity-specific composables.
 * It provides all CRUD operations (Create, Retrieve, Update, Delete, List) with:
 * - Type-safe operations via TypeScript generics
 * - Reactive parameters (refs/computed automatically trigger refetch)
 * - Automatic CSRF protection for mutations
 * - Consistent error handling and loading states
 *
 * @param basePath - Base API path for the resource (e.g., 'users', 'invoices')
 * @returns Object containing all CRUD action composables
 *
 * @example
 * // Create entity-specific composable
 * const { useRetrieve, useList, useCreate, useUpdate, useDelete } = useActions<User>('users')
 *
 * // Query actions (GET)
 * const { data: user } = useRetrieve(1)
 * const { data: users } = useList({ filters: { role: 'admin' } })
 *
 * // Mutation actions (POST/PUT/PATCH/DELETE)
 * const { execute: createUser } = useCreate()
 * await createUser({ name: 'John', email: 'john@example.com' })
 *
 * @see {@link UseRetrieveAction} for retrieve operation details
 * @see {@link UseListAction} for list operation details
 * @see {@link UseCreateAction} for create operation details
 * @see {@link UseUpdateAction} for update operation details
 * @see {@link UseDeleteAction} for delete operation details
 */
export const useActions: UseActions = <T>(basePath: string) => {
  // Validate basePath is not empty
  if (!basePath || basePath.trim() === "") {
    throw new Error("[useActions] basePath is required and cannot be empty");
  }

  return {
    useRetrieve: (pk, options) =>
      createRetrieveAction<T>(
        basePath,
        pk,
        options as QueryActionOptions<T> | undefined,
      ),
    useList: ((paramsOrOptions, options) =>
      createListAction<T>(
        basePath,
        paramsOrOptions,
        options,
      )) as UseListAction<T>,
    usePaginatedList: ((paramsOrOptions, options) =>
      createPaginatedListAction<T>(
        basePath,
        paramsOrOptions,
        options,
      )) as UsePaginatedListAction<T>,
    useCreate: ((options?: MutationActionOptions) =>
      createCreateAction<T>(basePath, options)) as UseCreateAction<T>,
    useUpdate: ((options?: MutationActionOptions) =>
      createUpdateAction<T>(basePath, options)) as UseUpdateAction<T>,
    useDelete: ((options?: MutationActionOptions) =>
      createDeleteAction<T>(basePath, options)) as UseDeleteAction<T>,
  };
};

// Re-export types (grouped by layer: shared → retrieve → list → paginated-list → create → update → delete)
export type {
  UseActions,
  UseActionsReturn,
  QueryActionOptions,
  MutationActionOptions,
  UseActionOptions,
} from "./shared/types";
export type {
  UseRetrieveAction,
  UseRetrieveActionReturn,
  UseRetrieveActionOptions,
} from "./retrieve/types";
export type {
  UseListAction,
  UseListActionParamsOrOptions,
  UseListActionOptions,
  UseListActionParams,
  UseListActionReturn,
  FilterParams,
  SortParams,
  PaginationParams,
} from "./list/types";
export type {
  UsePaginatedListAction,
  UsePaginatedListParamsOrOptions,
  UsePaginatedListActionOptions,
  UsePaginatedListActionParams,
  UsePaginatedListActionReturn,
  PaginatedResponse,
  PaginationMeta,
} from "./paginated-list/types";
export type {
  UseCreateAction,
  UseCreateActionReturn,
  UseCreateActionOptions,
} from "./create/types";
export type {
  UseUpdateAction,
  UseUpdateActionReturn,
  UseUpdateExecuteOptions,
  UseUpdateActionOptions,
} from "./update/types";
export type {
  UseDeleteAction,
  UseDeleteActionReturn,
  UseDeleteActionOptions,
} from "./delete/types";

// Export paginated list action
export { createPaginatedListAction } from "./paginated-list";

// Merge helpers for custom actions (default + view → merge → action)
export {
  mergeListActionArgs,
  mergeRetrieveActionArgs,
  mergeMutationActionArgs,
} from "./shared/merge";
export type {
  MergeListActionArgsInput,
  MergeListActionArgsResult,
  MergeRetrieveActionArgsInput,
  MergeRetrieveActionArgsResult,
  MergeMutationActionArgsInput,
  MergeMutationActionArgsResult,
} from "./shared/merge";

