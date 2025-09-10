import { createFetch } from '@vueuse/core';

import type { SetupFzFetcher, UseFzFetch } from './types';

const DEFAULT_BASE_URL = 'http://localhost:3000';

let fzFetcher: ReturnType<typeof createFetch> | null = null;

export const setupFzFetcher: SetupFzFetcher = (options) => {
    // console.debug('setupFzFetcher', options);
    fzFetcher = createFetch({
        baseUrl: DEFAULT_BASE_URL,
        ...options,
    });
    // console.debug('fzFetcher initialized', fzFetcher);
};

export const useFzFetch: UseFzFetch = <T>(
    basePath: any,
    optionsOrUseFetchOptions?: any,
    useFetchOptions?: any
) => {
    if (fzFetcher) {
        if (useFetchOptions !== undefined) {
            return fzFetcher<T>(basePath, optionsOrUseFetchOptions, useFetchOptions);
        }
        
        if (optionsOrUseFetchOptions !== undefined) {
            return fzFetcher<T>(basePath, optionsOrUseFetchOptions);
        }
        
        return fzFetcher<T>(basePath);
    }

    throw new Error('FzFetcher not initialized! Use setupFzFetcher first.');
};

