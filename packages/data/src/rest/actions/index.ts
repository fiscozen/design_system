import { useFzFetch } from '../dao';
import { computed, toValue, watch } from 'vue';

import type { UseFzFetchOptions, UseFzFetchReturn } from '../dao/types';

import type { UseActions, UseActionOptions, UseActionReturn, UseAllAction } from './types';

const normalizeOptions = (options: UseActionOptions = {}): UseFzFetchOptions => ({
    immediate: options.onMount ?? true,
    refetch: options.autoUpdate ?? true,
    initialData: options.initialData ?? null,
});

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
            // URL reattivo che si aggiorna quando pk cambia
            const url = computed(() => `${basePath}/${toValue(pk)}`);
            
            const response = useFzFetch<T>(url, normalizeOptions(options));

            return normalizeResponse<T>(response);
        },
        useAll: ((paramsOrOptions, options) => {
            if (paramsOrOptions !== undefined && options !== undefined) {
                const response = useFzFetch<T>(`${basePath}`, {/*paramsOrOptions*/}, normalizeOptions(options));
                return normalizeResponse<T>(response);
            } else {
                const response = useFzFetch<T>(`${basePath}`, normalizeOptions(paramsOrOptions as UseActionOptions));
                return normalizeResponse<T>(response);
            }
        }) as UseAllAction<T>,
        /*
        add: () => null,
        modify: () => null,
        remove: () => null,
        */
    };
};