/**
 * Type definitions for the useQueryString composable.
 *
 * @module @fiscozen/composables/useQueryString/types
 */

export type QueryStringKey = string;

export type TransformType = 'none' | 'string' | 'number' | 'boolean';

export type TransformFunction = (queryStringValue: QueryStringValue) => QueryStringValue;

/**
 * Configuration for a managed query string parameter.
 *
 * Allows type-safe extraction with automatic transformation and defaults,
 * avoiding manual parsing scattered across consumer code.
 */
export type HandledQueryStringKey = {
    key: QueryStringKey;
    /** Fallback when the key is absent or the value cannot be transformed */
    defaultValue?: QueryStringValue;
    /**
     * Predefined type coercion or custom function.
     * Needed because URL params are always strings; this restores the intended runtime type.
     * @default 'none'
     */
    transform?: TransformType | TransformFunction;
    /**
     * Treats the literal string `"null"` as `null`.
     * Useful when backends serialize null values as the string "null" in URLs.
     * @default false
     */
    nullStringIsNullValue?: boolean;
};

/**
 * Keys to manage — simple strings use no transformation,
 * config objects enable defaults and type coercion.
 */
export type HandledQueryStringKeys = Array<QueryStringKey | HandledQueryStringKey>;

export type QueryStringValue = string | number | boolean | null | undefined;

export type ValuesInQueryStrings = Record<QueryStringKey, QueryStringValue>;

export type TransformQueryStringValue = (
    queryStringValue: QueryStringValue,
    config?: HandledQueryStringKey
) => QueryStringValue;

/**
 * Reads current values from the query string.
 *
 * @param specificHandleQueryStringKeys - Override keys; defaults to the set provided at initialization
 */
export type GetValuesFromQueryString = (
    specificHandleQueryStringKeys?: HandledQueryStringKeys
) => ValuesInQueryStrings;

export type SetValuesInQueryStringOptions = {
    /**
     * Replace the entire query string instead of merging with existing values.
     * @default false
     */
    replaceQueryString?: boolean;
    /**
     * Use `pushState` instead of `replaceState`, creating a new browser history entry.
     * @default false
     */
    __forcePushState?: boolean;
};

/**
 * Writes values to the query string via the History API.
 */
export type SetValuesInQueryString = (
    values: ValuesInQueryStrings,
    options?: SetValuesInQueryStringOptions
) => void;
