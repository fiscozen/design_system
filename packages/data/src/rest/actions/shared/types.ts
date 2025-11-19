import type { ShallowRef, MaybeRefOrGetter } from "vue";

// ============================================================
// BASE TYPES
// ============================================================

/**
 * Base return type for all actions (query and mutation)
 */
export interface BaseActionReturn<T> {
  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<Error | null>;

  /**
   * The response data from server
   */
  data: ShallowRef<T | null>;

  /**
   * Indicates if the action is currently being executed
   */
  isLoading: Readonly<ShallowRef<boolean>>;
}

/**
 * Options for query actions (GET requests)
 * 
 * Query actions support automatic execution and reactivity.
 */
export interface QueryActionOptions<T = unknown> {
    /**
     * Will automatically run the action on mount
     *
     * @default true
     */
    onMount?: boolean;

    /**
     * Will automatically refetch when reactive dependencies change
     *
     * @default false
     */
    autoUpdate?: MaybeRefOrGetter<boolean>;

    /**
     * Initial data before the request finishes
     *
     * @default null
     */
    initialData?: T | null;

    /**
     * Enable request deduplication for this specific action
     * 
     * When enabled, identical requests (same URL + query + payload + method)
     * made simultaneously will be deduplicated - only the first one executes,
     * others wait for and share the same result.
     * 
     * @default undefined (uses global deduplication setting)
     */
    deduplication?: boolean;

    /**
     * Request timeout in milliseconds for this specific action
     * 
     * If the request takes longer than this value, it will be aborted with a timeout error.
     * Set to `null` for infinite timeout (no timeout).
     * Overrides global timeout setting from setupFzFetcher.
     * 
     * @default undefined (uses global timeout setting, or null for infinite timeout if not set)
     */
    timeout?: number | null;

    /**
     * Whether to throw errors instead of storing them in the error ref
     * 
     * When `false` (default), errors are stored in `error` ref and can be checked reactively.
     * When `true`, errors are thrown as exceptions and can be caught with try/catch.
     * 
     * @default false
     */
    throwOnError?: boolean;
}

/**
 * Options for mutation actions (POST/PUT/PATCH/DELETE requests)
 *
 * Mutation actions are imperative and don't support automatic execution.
 * Reserved for future extensions (optimistic updates, retry logic, etc.)
 */
export interface MutationActionOptions {
  /**
   * Request timeout in milliseconds for this specific action
   * 
   * If the request takes longer than this value, it will be aborted with a timeout error.
   * Set to `null` for infinite timeout (no timeout).
   * Overrides global timeout setting from setupFzFetcher.
   * 
   * @default undefined (uses global timeout setting, or null for infinite timeout if not set)
   */
  timeout?: number | null;

  /**
   * Whether to throw errors instead of storing them in the error ref
   * 
   * When `false` (default), errors are stored in `error` ref and can be checked reactively.
   * When `true`, errors are thrown as exceptions and can be caught with try/catch.
   * 
   * @default false
   */
  throwOnError?: boolean;

  // Reserved for future: optimistic?, retry?, debounce?, etc.
}

// Backward compatibility alias
export type UseActionOptions = QueryActionOptions;

/**
 * Return type for query actions with execute function
 */
export interface QueryActionReturn<T> extends BaseActionReturn<T> {
  /**
   * Manually execute the query action
   */
  execute: () => Promise<void>;
}

// ============================================================
// USE ACTIONS FACTORY
// ============================================================

/**
 * Return type for useActions factory
 *
 * Provides all CRUD operations for a given entity type.
 */
export interface UseActionsReturn<T> {
  /**
   * Retrieve a single entity by primary key (GET /resource/:id)
   */
  useRetrieve: import("../retrieve/types").UseRetrieveAction<T>;

  /**
   * List/query multiple entities with filters, sorting, pagination (GET /resource)
   */
  useList: import("../list/types").UseListAction<T>;

  /**
   * Create a new entity (POST /resource)
   */
  useCreate: import("../create/types").UseCreateAction<T>;

  /**
   * Update an existing entity (PUT/PATCH /resource/:id)
   */
  useUpdate: import("../update/types").UseUpdateAction<T>;

  /**
   * Delete an existing entity (DELETE /resource/:id)
   */
  useDelete: import("../delete/types").UseDeleteAction<T>;
}

/**
 * Factory function to create CRUD actions for a given resource
 *
 * @param basePath - Base API path for the resource (e.g., 'users', 'invoices')
 * @returns Object containing all CRUD action composables
 *
 * @example
 * const { useRetrieve, useList, useCreate, useUpdate, useDelete } = useActions<User>('users')
 *
 * // Query actions
 * const { data: user } = useRetrieve(1)
 * const { data: users } = useList({ filters: { role: 'admin' } })
 *
 * // Mutation actions
 * const { execute: createUser } = useCreate()
 * await createUser({ name: 'John', email: 'john@example.com' })
 */
export interface UseActions {
  <T>(basePath: string): UseActionsReturn<T>;
}

