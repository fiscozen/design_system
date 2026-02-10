import { describe, it, expect, vi } from "vitest";
import { ref, computed, toValue } from "vue";
import {
  mergeListActionArgs,
  mergeRetrieveActionArgs,
  mergeMutationActionArgs,
  callListActionWithDefaults,
  callPaginatedListActionWithDefaults,
  callRetrieveActionWithDefaults,
  callCreateActionWithDefaults,
  callUpdateActionWithDefaults,
  callDeleteActionWithDefaults,
} from "../rest/actions/shared/merge";
import type {
  UsePaginatedListActionParamsOrOptions,
  UsePaginatedListActionOptions,
  UseListAction,
  UsePaginatedListAction,
  UseRetrieveAction,
  UseCreateAction,
  UseUpdateAction,
  UseDeleteAction,
} from "../rest/actions";

describe("mergeListActionArgs", () => {
  describe("when input is empty or undefined", () => {
    it("returns empty params and options when called with no input (list mode: no pagination in params)", () => {
      const result = mergeListActionArgs();

      expect(result.params).toEqual({
        filters: {},
        ordering: [],
      });
      expect(result.options).toEqual({});
    });

    it("returns empty params and options when called with empty object (list mode: no pagination in params)", () => {
      const result = mergeListActionArgs({});

      expect(result.params).toEqual({
        filters: {},
        ordering: [],
      });
      expect(result.options).toEqual({});
    });

    it("returns params with pagination when forPaginatedList: true and no input", () => {
      const result = mergeListActionArgs({ forPaginatedList: true });

      expect(result.params).toEqual({
        filters: {},
        ordering: [],
        pagination: {},
      });
      expect(result.options).toEqual({});
    });
  });

  describe("defaults only", () => {
    it("uses defaultParams when no additional args", () => {
      const result = mergeListActionArgs({
        defaultParams: {
          filters: { sts: true, user: 1 },
          ordering: [{ name: "asc" }],
          pagination: { page: 1, pageSize: 20 },
        },
      });

      expect(result.params.filters).toEqual({ sts: true, user: 1 });
      expect(result.params.ordering).toEqual([{ name: "asc" }]);
      expect(result.params.pagination).toEqual({ page: 1, pageSize: 20 });
      expect(result.options).toEqual({});
    });

    it("uses defaultOptions when no additional args (list mode: no pagination in params)", () => {
      const result = mergeListActionArgs({
        defaultOptions: { onMount: false, throwOnError: true },
      });

      expect(result.params).toEqual({ filters: {}, ordering: [] });
      expect(result.options).toEqual({ onMount: false, throwOnError: true });
    });
  });

  describe("discrimination (additionalParamsOrOptions as params vs options)", () => {
    it("treats additionalParamsOrOptions as params when additionalOptions is present", () => {
      const result = mergeListActionArgs({
        additionalParamsOrOptions: { filters: { role: "admin" } },
        additionalOptions: { onMount: false },
      });

      expect(result.params.filters).toEqual({ role: "admin" });
      expect(result.options).toEqual({ onMount: false });
    });

    it("discriminates additionalParamsOrOptions as params when it has filters key (list mode: no pagination)", () => {
      const result = mergeListActionArgs({
        additionalParamsOrOptions: { filters: { active: true } },
      });

      expect(result.params.filters).toEqual({ active: true });
      expect(result.params.ordering).toEqual([]);
      expect(result.params).not.toHaveProperty("pagination");
      expect(result.options).toEqual({});
    });

    it("discriminates additionalParamsOrOptions as params when it has ordering key (list mode: no pagination)", () => {
      const result = mergeListActionArgs({
        additionalParamsOrOptions: { ordering: [{ created_at: "desc" }] },
      });

      expect(result.params.ordering).toEqual([{ created_at: "desc" }]);
      expect(result.params.filters).toEqual({});
      expect(result.params).not.toHaveProperty("pagination");
    });

    it("discriminates additionalParamsOrOptions as params when it has pagination key", () => {
      const result = mergeListActionArgs({
        additionalParamsOrOptions: { pagination: { page: 2 } },
      });

      expect(result.params.pagination).toEqual({ page: 2 });
      expect(result.params.filters).toEqual({});
      expect(result.params.ordering).toEqual([]);
    });

    it("discriminates additionalParamsOrOptions as options when it has only option keys (onMount)", () => {
      const result = mergeListActionArgs({
        defaultParams: { filters: { sts: true } },
        additionalParamsOrOptions: { onMount: false },
      });

      expect(result.params.filters).toEqual({ sts: true });
      expect(result.options).toEqual({ onMount: false });
    });

    it("discriminates additionalParamsOrOptions as options when it has only option keys (throwOnError)", () => {
      const result = mergeListActionArgs({
        additionalParamsOrOptions: { throwOnError: true },
      });

      expect(result.params).toEqual({ filters: {}, ordering: [] });
      expect(result.options).toEqual({ throwOnError: true });
    });

    it("treats empty object additionalParamsOrOptions as options", () => {
      const result = mergeListActionArgs({
        defaultParams: { filters: { sts: true } },
        additionalParamsOrOptions: {},
      });

      expect(result.params.filters).toEqual({ sts: true });
      expect(result.options).toEqual({});
    });
  });

  describe("merge semantics", () => {
    it("merges filters with additional winning on same key", () => {
      const result = mergeListActionArgs({
        defaultParams: { filters: { sts: true, user: 1 } },
        additionalParamsOrOptions: { filters: { user: 2, extra: "x" } },
      });

      expect(result.params.filters).toEqual({ sts: true, user: 2, extra: "x" });
    });

    it("allows additional to remove default filter by passing undefined", () => {
      const result = mergeListActionArgs({
        defaultParams: { filters: { sts: true, user: 1 } },
        additionalParamsOrOptions: { filters: { user: undefined } },
      });

      expect(result.params.filters).toEqual({ sts: true, user: undefined });
    });

    it("allows additional to pass null (sent to server)", () => {
      const result = mergeListActionArgs({
        defaultParams: { filters: { sts: true } },
        additionalParamsOrOptions: { filters: { status: null } },
      });

      expect(result.params.filters).toEqual({ sts: true, status: null });
    });

    it("uses additional ordering when additional provides ordering key", () => {
      const result = mergeListActionArgs({
        defaultParams: { ordering: [{ name: "asc" }] },
        additionalParamsOrOptions: { ordering: [{ created_at: "desc" }] },
      });

      expect(result.params.ordering).toEqual([{ created_at: "desc" }]);
    });

    it("uses default ordering when additional has params but no ordering key", () => {
      const result = mergeListActionArgs({
        defaultParams: { ordering: [{ name: "asc" }] },
        additionalParamsOrOptions: { filters: { active: true } },
      });

      expect(result.params.ordering).toEqual([{ name: "asc" }]);
      expect(result.params.filters).toEqual({ active: true });
      expect(result.params).not.toHaveProperty("pagination");
    });

    it("merges pagination with additional winning on same key when pagination was provided", () => {
      const result = mergeListActionArgs({
        defaultParams: { pagination: { page: 1, pageSize: 50 } },
        additionalParamsOrOptions: { pagination: { page: 2 } },
      });

      expect(result.params.pagination).toEqual({ page: 2, pageSize: 50 });
    });

    it("merges options with additional winning on same key", () => {
      const result = mergeListActionArgs({
        defaultOptions: { onMount: true, throwOnError: false },
        additionalParamsOrOptions: { filters: {} },
        additionalOptions: { throwOnError: true },
      });

      expect(result.options).toEqual({ onMount: true, throwOnError: true });
    });
  });

  describe("toValue on refs/getters", () => {
    it("resolves defaultParams ref at call time", () => {
      const defaultFilters = ref({ sts: true });
      const result = mergeListActionArgs({
        defaultParams: { filters: defaultFilters },
      });

      expect(result.params.filters).toEqual({ sts: true });

      defaultFilters.value = { sts: false };
      const result2 = mergeListActionArgs({
        defaultParams: { filters: defaultFilters },
      });
      expect(result2.params.filters).toEqual({ sts: false });
    });

    it("resolves defaultOptions ref at call time", () => {
      const defaultOpts = ref({ onMount: false });
      const result = mergeListActionArgs({
        defaultOptions: defaultOpts,
      });

      expect(result.options).toEqual({ onMount: false });
    });

    it("resolves additionalParamsOrOptions ref at call time", () => {
      const additional = ref({ filters: { role: "admin" } });
      const result = mergeListActionArgs({
        additionalParamsOrOptions: additional,
      });

      expect(result.params.filters).toEqual({ role: "admin" });
    });

    it("resolves getter (computed) for defaultParams", () => {
      const userId = ref(1);
      const defaultParams = computed(() => ({
        filters: { user: userId.value },
      }));
      const result = mergeListActionArgs({
        defaultParams,
      });

      expect(result.params.filters).toEqual({ user: 1 });
      userId.value = 2;
      const result2 = mergeListActionArgs({ defaultParams });
      expect(result2.params.filters).toEqual({ user: 2 });
    });

    it("preserves refs as filter values so reactivity is maintained when passed to useList", () => {
      const userId = ref(123);
      const statusRef = ref("active");
      const result = mergeListActionArgs({
        additionalParamsOrOptions: { filters: { userId, status: statusRef } },
      });

      expect(result.params.filters.userId).toBe(userId);
      expect(result.params.filters.status).toBe(statusRef);
      expect(toValue(result.params.filters.userId)).toBe(123);
      expect(toValue(result.params.filters.status)).toBe("active");
    });

    it("preserves refs as pagination values so reactivity is maintained when pagination is provided", () => {
      const page = ref(2);
      const result = mergeListActionArgs({
        defaultParams: { pagination: { page: 1, pageSize: 50 } },
        additionalParamsOrOptions: { pagination: { page } },
      });

      expect(result.params.pagination).toBeDefined();
      const pag = result.params.pagination as { page: typeof page; pageSize: number };
      expect(pag.page).toBe(page);
      expect(pag.pageSize).toBe(50);
      expect(toValue(pag.page)).toBe(2);
    });
  });

  describe("callListActionWithDefaults vs callPaginatedListActionWithDefaults", () => {
    it("callListActionWithDefaults does not pass pagination to action when not in input", () => {
      const mockListAction = vi.fn((_params: { filters?: unknown; ordering?: unknown; pagination?: unknown }) => ({
        data: ref(null),
        error: ref(null),
        isLoading: { value: false },
        execute: vi.fn(),
        filters: {},
        ordering: [],
        pagination: {},
      }));
      callListActionWithDefaults(mockListAction as unknown as UseListAction<unknown>, {
        defaultParams: { filters: { sts: true } },
      });
      expect(mockListAction).toHaveBeenCalledTimes(1);
      const [params] = mockListAction.mock.calls[0];
      expect(params).not.toHaveProperty("pagination");
      expect(params.filters).toEqual({ sts: true });
    });

    it("callPaginatedListActionWithDefaults always passes pagination to action", () => {
      const mockPaginatedListAction = vi.fn((_params: { filters?: unknown; ordering?: unknown; pagination?: unknown }) => ({
        data: ref(null),
        error: ref(null),
        isLoading: { value: false },
        execute: vi.fn(),
        filters: {},
        ordering: [],
        pagination: {},
        meta: computed(() => null),
        handlePageChange: vi.fn(),
        handleOrderingChange: vi.fn(),
      }));
      callPaginatedListActionWithDefaults(mockPaginatedListAction as unknown as UsePaginatedListAction<unknown>, {});
      expect(mockPaginatedListAction).toHaveBeenCalledTimes(1);
      const [params] = mockPaginatedListAction.mock.calls[0];
      expect(params).toHaveProperty("pagination");
      expect(params.pagination).toEqual({});
    });
  });

  describe("type inference for paginated list (no explicit generic)", () => {
    interface Invoice {
      id: number;
      number: string;
    }

    it("infers TOptions as UsePaginatedListActionOptions when additionalOptions is typed", () => {
      const paramsOrOptions: UsePaginatedListActionParamsOrOptions<Invoice> | undefined =
        undefined;
      const options: UsePaginatedListActionOptions<Invoice> | undefined = {
        dataKey: "results",
        enableSingleOrdering: false,
      };

      const { params: mergedParams, options: mergedOptions } = mergeListActionArgs({
        defaultParams: {
          filters: { status: "active" },
          pagination: { page: 1, pageSize: 50 },
        },
        additionalParamsOrOptions: paramsOrOptions,
        additionalOptions: options,
      });

      // If inference works, mergedOptions is UsePaginatedListActionOptions<Invoice>
      // and assignable without cast to a variable of that type
      const optionsForPaginatedList: UsePaginatedListActionOptions<Invoice> =
        mergedOptions;

      expect(optionsForPaginatedList.dataKey).toBe("results");
      expect(mergedParams.filters).toEqual({ status: "active" });
    });

    it("infers TOptions when additionalParamsOrOptions is options-only (single arg)", () => {
      const optionsOnly: UsePaginatedListActionParamsOrOptions<Invoice> = {
        dataKey: "items",
        onMount: true,
      };

      const { options: mergedOptions } = mergeListActionArgs({
        defaultParams: { filters: { sts: true } },
        additionalParamsOrOptions: optionsOnly,
      });

      const optionsForPaginatedList: UsePaginatedListActionOptions<Invoice> =
        mergedOptions;

      expect(optionsForPaginatedList.dataKey).toBe("items");
    });
  });
});

describe("mergeRetrieveActionArgs", () => {
  describe("when input is empty or undefined", () => {
    it("returns pk undefined and empty options when called with no input", () => {
      const result = mergeRetrieveActionArgs();

      expect(result.pk).toBeUndefined();
      expect(result.options).toEqual({});
    });
  });

  describe("defaults only", () => {
    it("uses defaultPk when overridePk not provided", () => {
      const result = mergeRetrieveActionArgs({
        defaultPk: 42,
      });

      expect(result.pk).toBe(42);
      expect(result.options).toEqual({});
    });

    it("uses defaultOptions when additionalOptions not provided", () => {
      const result = mergeRetrieveActionArgs({
        defaultPk: 1,
        defaultOptions: { onMount: false },
      });

      expect(result.pk).toBe(1);
      expect(result.options).toEqual({ onMount: false });
    });
  });

  describe("view overrides", () => {
    it("uses overridePk when provided (overrides defaultPk)", () => {
      const result = mergeRetrieveActionArgs({
        defaultPk: 1,
        overridePk: 99,
      });

      expect(result.pk).toBe(99);
    });

    it("merges options with additional winning on same key", () => {
      const result = mergeRetrieveActionArgs({
        defaultPk: 1,
        defaultOptions: { onMount: true, throwOnError: false },
        overridePk: 1,
        additionalOptions: { throwOnError: true },
      });

      expect(result.options).toEqual({ onMount: true, throwOnError: true });
    });
  });

  describe("pk ref preservation", () => {
    it("preserves overridePk ref when view passes ref (same reference)", () => {
      const pkRef = ref(10);
      const result = mergeRetrieveActionArgs({
        overridePk: pkRef,
      });

      expect(result.pk).toBe(pkRef);
      expect(result.pk).not.toBe(10);
    });

    it("uses toValue(defaultPk) when overridePk not provided", () => {
      const defaultPkRef = ref(5);
      const result = mergeRetrieveActionArgs({
        defaultPk: defaultPkRef,
      });

      expect(result.pk).toBe(5);
    });
  });

  describe("toValue on options", () => {
    it("resolves defaultOptions and additionalOptions at call time", () => {
      const defaultOpts = ref({ onMount: false });
      const result = mergeRetrieveActionArgs({
        defaultPk: 1,
        defaultOptions: defaultOpts,
        additionalOptions: { throwOnError: true },
      });

      expect(result.options).toEqual({ onMount: false, throwOnError: true });
    });
  });
});

describe("mergeMutationActionArgs", () => {
  describe("when input is empty or undefined", () => {
    it("returns empty options when called with no input", () => {
      const result = mergeMutationActionArgs();

      expect(result.options).toEqual({});
    });
  });

  describe("defaults only", () => {
    it("uses defaultOptions when additionalOptions not provided", () => {
      const result = mergeMutationActionArgs({
        defaultOptions: { throwOnError: true },
      });

      expect(result.options).toEqual({ throwOnError: true });
    });
  });

  describe("additional only", () => {
    it("uses additionalOptions when defaultOptions not provided", () => {
      const result = mergeMutationActionArgs({
        additionalOptions: { throwOnError: true },
      });

      expect(result.options).toEqual({ throwOnError: true });
    });
  });

  describe("merge semantics", () => {
    it("merges options with additional winning on same key", () => {
      const result = mergeMutationActionArgs({
        defaultOptions: { throwOnError: false },
        additionalOptions: { throwOnError: true },
      });

      expect(result.options).toEqual({ throwOnError: true });
    });

    it("merges multiple keys correctly", () => {
      const result = mergeMutationActionArgs({
        defaultOptions: { throwOnError: true },
        additionalOptions: { throwOnError: false },
      });

      expect(result.options).toEqual({ throwOnError: false });
    });
  });

  describe("toValue on refs", () => {
    it("resolves defaultOptions ref at call time", () => {
      const defaultOpts = ref<{ throwOnError?: boolean }>({ throwOnError: true });
      const result = mergeMutationActionArgs({
        defaultOptions: defaultOpts,
      });

      expect(result.options).toEqual({ throwOnError: true });
    });

    it("resolves additionalOptions ref at call time", () => {
      const additionalOpts = ref<{ throwOnError?: boolean }>({ throwOnError: true });
      const result = mergeMutationActionArgs({
        additionalOptions: additionalOpts,
      });

      expect(result.options).toEqual({ throwOnError: true });
    });
  });
});

describe("callRetrieveActionWithDefaults / callCreateActionWithDefaults / callUpdateActionWithDefaults / callDeleteActionWithDefaults", () => {
  it("callRetrieveActionWithDefaults calls action with (pk, options)", () => {
    const mockRetrieve = vi.fn(
      (_pk: string | number | undefined, _opts?: unknown) => ({
        data: ref(null),
        error: ref(null),
        isLoading: { value: false },
        execute: vi.fn(),
      }),
    );
    callRetrieveActionWithDefaults(mockRetrieve as unknown as UseRetrieveAction<unknown>, {
      defaultPk: 1,
      additionalOptions: { onMount: false },
    });
    expect(mockRetrieve).toHaveBeenCalledTimes(1);
    const [pk, options] = mockRetrieve.mock.calls[0];
    expect(pk).toBe(1);
    expect(options).toEqual({ onMount: false });
  });

  it("callRetrieveActionWithDefaults uses overridePk over defaultPk", () => {
    const mockRetrieve = vi.fn(
      (_pk: string | number | undefined, _opts?: unknown) => ({
        data: ref(null),
        error: ref(null),
        isLoading: { value: false },
        execute: vi.fn(),
      }),
    );
    callRetrieveActionWithDefaults(mockRetrieve as unknown as UseRetrieveAction<unknown>, {
      defaultPk: 1,
      overridePk: 99,
    });
    expect(mockRetrieve).toHaveBeenCalledWith(99, {});
  });

  it("callCreateActionWithDefaults calls action with merged options only", () => {
    const mockCreate = vi.fn((_opts?: unknown) => ({
      data: ref(null),
      error: ref(null),
      isLoading: { value: false },
      execute: vi.fn(),
    }));
    callCreateActionWithDefaults(mockCreate as unknown as UseCreateAction<unknown>, {
      defaultOptions: { throwOnError: false },
      additionalOptions: { throwOnError: true },
    });
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({ throwOnError: true });
  });

  it("callUpdateActionWithDefaults calls action with merged options only", () => {
    const mockUpdate = vi.fn((_opts?: unknown) => ({
      data: ref(null),
      error: ref(null),
      isLoading: { value: false },
      execute: vi.fn(),
    }));
    callUpdateActionWithDefaults(mockUpdate as unknown as UseUpdateAction<unknown>, {
      defaultOptions: { throwOnError: true },
      additionalOptions: { throwOnError: false },
    });
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({ throwOnError: false });
  });

  it("callDeleteActionWithDefaults calls action with merged options only", () => {
    const mockDelete = vi.fn((_opts?: unknown) => ({
      data: ref(null),
      error: ref(null),
      isLoading: { value: false },
      execute: vi.fn(),
    }));
    callDeleteActionWithDefaults(mockDelete as unknown as UseDeleteAction<unknown>, {
      additionalOptions: { throwOnError: true },
    });
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith({ throwOnError: true });
  });
});
