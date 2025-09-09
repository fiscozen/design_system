import { useFzFetch } from '../dao';

import type { UseActions } from './types';

export const useActions: UseActions = <T>(basePath: string) => {
    return {
        useRetrieve: (pk, options = {}) => {

            const response = useFzFetch<T>(`${basePath}/${pk}`, {
                immediate: options.onMount ?? true,
                refetch: options.autoUpdate ?? false,
                initialData: options.initialData ?? null,
            });

            console.log('response', response)

            return {
                error: response.error,
                data: response.data,
                isLoading: response.isFetching,
                execute: response.execute,
            };
        },
        useAll: (options = {}) => {
            const response = useFzFetch<T>(`${basePath}`, {
                immediate: options.onMount ?? true,
                refetch: options.autoUpdate ?? false,
                initialData: options.initialData ?? null,
            });

            return {
                error: response.error,
                data: response.data,
                isLoading: response.isFetching,
                execute: response.execute,
            };
        },
        /*
        add: () => null,
        modify: () => null,
        remove: () => null,
        */
    };
};