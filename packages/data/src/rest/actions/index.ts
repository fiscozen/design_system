import { useFzFetch } from '../dao';
import { computed, toValue, watch } from 'vue';

import type { UseFzFetchOptions, UseFzFetchReturn, UseFzFetchParams } from '../dao/types';

import type { UseActions, UseActionOptions, UseActionReturn, UseListAction, ListActionParams } from './types';

const normalizeOptions = (options: UseActionOptions = {}): UseFzFetchOptions => ({
    immediate: options.onMount ?? true,
    refetch: options.autoUpdate ?? true,
    initialData: options.initialData ?? null,
});

// Converte ListActionParams in UseFzFetchParams
const normalizeParams = (params: ListActionParams = {}): UseFzFetchParams => {
    const queryParams: UseFzFetchParams['queryParams'] = {};
    
    // Filters: { by_city: 'san_diego' } → queryParams.by_city = 'san_diego'
    if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams[key] = value;
            }
        });
    }
    
    // Sort: { name: 'asc', created_at: 'desc' } → queryParams.sort = 'name:asc,created_at:desc'
    if (params.sort) {
        const sortEntries = Object.entries(params.sort).map(([key, direction]) => 
            `${key}:${direction}`
        );
        if (sortEntries.length > 0) {
            queryParams.sort = sortEntries.join(',');
        }
    }
    
    // Pagination
    if (params.page !== undefined) {
        queryParams.page = params.page;
    }
    if (params.pageSize !== undefined) {
        queryParams.per_page = params.pageSize;
    }
    
    return {
        queryParams,
    };
};

const normalizeResponse = <T>(response: UseFzFetchReturn<T>): UseActionReturn<T> => {
    return {
        error: computed(() => response.error.value),
        data: computed(() => response.data.value),
        isLoading: computed(() => response.isFetching.value),
        execute: response.execute,
    } as UseActionReturn<T>;
};

export const useActions: UseActions = <T>(basePath: string) => {
    return {
        useRetrieve: (pk, options) => {
            const url = computed(() => `${basePath}/${toValue(pk)}`);
            
            const response = useFzFetch<T>(url, normalizeOptions(options));

            return normalizeResponse<T>(response);
        },
        useList: ((paramsOrOptions, options) => {
            // Caso 3: useList(params, options)
            if (options !== undefined) {
                const params = paramsOrOptions as ListActionParams;
                const response = useFzFetch<T>(`${basePath}`, normalizeParams(params), normalizeOptions(options));
                return normalizeResponse<T>(response);
            }

            // Caso 2: useList(paramsOrOptions)
            if (paramsOrOptions !== undefined) {
                // Distingui tra ListActionParams e UseActionOptions
                if ('filters' in paramsOrOptions || 'sort' in paramsOrOptions || 'page' in paramsOrOptions || 'pageSize' in paramsOrOptions) {
                    // È ListActionParams
                    const params = paramsOrOptions as ListActionParams;
                    const response = useFzFetch<T>(`${basePath}`, normalizeParams(params));
                    return normalizeResponse<T>(response);
                } else {
                    // È UseActionOptions
                    const actionOptions = paramsOrOptions as UseActionOptions;
                    const response = useFzFetch<T>(`${basePath}`, normalizeOptions(actionOptions));
                    return normalizeResponse<T>(response);
                }
            }

            // Caso 1: useList()
            const response = useFzFetch<T>(`${basePath}`);
            return normalizeResponse<T>(response);
        }) as UseListAction<T>,
        /*
        add: () => null,
        modify: () => null,
        remove: () => null,
        */
    };
};