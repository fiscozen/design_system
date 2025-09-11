import { createFetch } from '@vueuse/core';

import type { SetupFzFetcher, UseFzFetch, UseFzFetchOptions, UseFzFetchParams } from './types';
import { toValue, type MaybeRefOrGetter, computed } from 'vue';

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

// Costruisce URL con query parameters mergiando quelli esistenti nel basePath
const getUrlWithQueryParams = (basePath: MaybeRefOrGetter<string>, queryParams?: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    // Estrai query parameters esistenti dal basePath
    const [baseUrl, existingQuery] = toValue(basePath).split('?');
    if (existingQuery) {
        // Aggiungi parametri esistenti
        const existing = new URLSearchParams(existingQuery);
        existing.forEach((value, key) => {
            searchParams.append(key, value);
        });
    }
    
    // Aggiungi nuovi queryParams se presenti (hanno priorità)
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // Rimuovi il parametro esistente e aggiungi quello nuovo (priorità)
                searchParams.delete(key);
                searchParams.append(key, String(value));
            }
        });
    }
    
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const useFzFetch: UseFzFetch = <T>(
    basePath: MaybeRefOrGetter<string>,
    paramsOrUseFetchOptions?: UseFzFetchParams | UseFzFetchOptions,
    useFetchOptions?: UseFzFetchOptions
) => {
    if (fzFetcher) {
        // Caso 3: Tutti e 3 i parametri (useFetchOptions presente)
        if (useFetchOptions !== undefined) {
            const params = paramsOrUseFetchOptions as UseFzFetchParams;
            // Mantiene basePath reattivo e crea finalUrl reattivo se necessario
            const finalUrl = computed(() => getUrlWithQueryParams(toValue(basePath), params.queryParams));
            const requestInit = {
                method: params?.method || 'GET',
                body: params?.body,
                headers: params?.headers,
            };
            return fzFetcher<T>(finalUrl, requestInit, useFetchOptions).json();
        }
        
        // Caso 2: basePath + secondo parametro (useFetchOptions assente)
        if (paramsOrUseFetchOptions !== undefined) {
            // Distingui tra UseFzFetchParams e UseFzFetchOptions
            if ('queryParams' in paramsOrUseFetchOptions || 'method' in paramsOrUseFetchOptions || 'body' in paramsOrUseFetchOptions) {
                // È UseFzFetchParams
                const params = paramsOrUseFetchOptions as UseFzFetchParams;
                const finalUrl = computed(() => getUrlWithQueryParams(toValue(basePath), params.queryParams));
                const requestInit = {
                    method: params.method || 'GET',
                    body: params.body,
                    headers: params.headers,
                };
                return fzFetcher<T>(finalUrl, requestInit).json();
            } else {
                // È UseFzFetchOptions
                const finalUrl = computed(() => getUrlWithQueryParams(toValue(basePath), undefined));
                const requestInit = { method: 'GET' };
                return fzFetcher<T>(finalUrl, requestInit, paramsOrUseFetchOptions as UseFzFetchOptions).json();
            }
        }
        
        // Caso 1: Solo basePath - mantiene reattività dell'URL
        const finalUrl = computed(() => getUrlWithQueryParams(toValue(basePath), undefined));
        return fzFetcher<T>(finalUrl).json();
    } else {
        throw new Error('FzFetcher not initialized! Use setupFzFetcher first.');
    }
};

