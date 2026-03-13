/**
 * Value transformation and extraction logic for useQueryString.
 *
 * Handles type coercion from raw URL strings to typed JavaScript values,
 * bridging the gap between the always-string nature of query parameters
 * and the typed values consumers expect.
 *
 * @module @fiscozen/composables/useQueryString/transform
 */

import type {
    HandledQueryStringKey,
    HandledQueryStringKeys,
    TransformQueryStringValue,
    ValuesInQueryStrings,
    QueryStringValue,
} from './types';

/**
 * Coerces a raw query string value according to the provided config.
 *
 * Priority: custom function > nullString handling > undefined check > type coercion.
 * Falls back to defaultValue when the value is absent or cannot be converted.
 */
const transformQueryStringValue: TransformQueryStringValue = (
    queryStringValue: QueryStringValue,
    config: Partial<HandledQueryStringKey> = {}
): QueryStringValue => {
    const {
        defaultValue,
        nullStringIsNullValue = false,
        transform = 'none'
    } = config;

    if (typeof transform === 'function') {
        return transform(queryStringValue);
    }

    if (nullStringIsNullValue && queryStringValue === 'null') {
        return null;
    }

    if (queryStringValue === undefined) {
        return defaultValue;
    }

    switch (transform) {
        case 'string':
            return queryStringValue?.toString() ?? defaultValue;

        case 'number': {
            if (queryStringValue === '' || queryStringValue === null) {
                return defaultValue;
            }
            const num = Number(queryStringValue);
            return isNaN(num) ? defaultValue : num;
        }

        case 'boolean': {
            if (queryStringValue === '' || queryStringValue === null) {
                return defaultValue;
            }
            // Boolean('false') === true, so string values need explicit matching
            if (typeof queryStringValue === 'string') {
                const lower = queryStringValue.toLowerCase();
                if (lower === 'true' || lower === '1') return true;
                if (lower === 'false' || lower === '0') return false;
            }
            return Boolean(queryStringValue);
        }

        case 'none':
        default:
            return queryStringValue ?? defaultValue;
    }
};

/**
 * Extracts and transforms values for all handled keys from a raw store.
 * Unhandled keys in the store are ignored.
 */
const extractValues = (
    handledKeys: HandledQueryStringKeys,
    store: Record<string, QueryStringValue>
): ValuesInQueryStrings => {
    const values: ValuesInQueryStrings = {};

    handledKeys.forEach((keyConfig) => {
        if (typeof keyConfig === 'string') {
            values[keyConfig] = transformQueryStringValue(store[keyConfig]);
        } else if (typeof keyConfig === 'object' && keyConfig.key) {
            values[keyConfig.key] = transformQueryStringValue(store[keyConfig.key], keyConfig);
        }
    });

    return values;
};

/** Checks whether the query object contains at least one of the handled keys */
const hasAnyHandledKey = (
    handledKeys: HandledQueryStringKeys,
    query: Record<string, unknown>
): boolean => {
    return handledKeys.some((keyConfig) => {
        const key = typeof keyConfig === 'string' ? keyConfig : keyConfig.key;
        return key in query;
    });
};

export {
    transformQueryStringValue,
    extractValues,
    hasAnyHandledKey,
};
