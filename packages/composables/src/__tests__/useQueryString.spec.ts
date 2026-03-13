import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { HandledQueryStringKeys } from '../composables/useQueryString/types'
import {
    isEmptyValue,
    normalizeQueryValues,
    buildUrlWithQuery,
    removeEmptyValues,
    buildHistoryState,
} from '../composables/useQueryString/utils'
import {
    transformQueryStringValue,
    extractValues,
    hasAnyHandledKey,
} from '../composables/useQueryString/transform'
import { useQueryString } from '../composables/useQueryString'

describe('useQueryString utilities', () => {
    describe('isEmptyValue', () => {
        it('returns true for undefined', () => {
            expect(isEmptyValue(undefined)).toBe(true)
        })

        it('returns true for null', () => {
            expect(isEmptyValue(null)).toBe(true)
        })

        it('returns true for empty string', () => {
            expect(isEmptyValue('')).toBe(true)
        })

        it('returns false for non-empty values', () => {
            expect(isEmptyValue('hello')).toBe(false)
            expect(isEmptyValue(0)).toBe(false)
            expect(isEmptyValue(false)).toBe(false)
        })
    })

    describe('normalizeQueryValues', () => {
        it('converts values to strings', () => {
            expect(normalizeQueryValues({ a: 1, b: true, c: 'hello' })).toEqual({
                a: '1',
                b: 'true',
                c: 'hello',
            })
        })

        it('strips empty values', () => {
            expect(normalizeQueryValues({ a: 'value', b: null, c: undefined, d: '' })).toEqual({
                a: 'value',
            })
        })

        it('returns empty object for all empty values', () => {
            expect(normalizeQueryValues({ a: null, b: undefined, c: '' })).toEqual({})
        })
    })

    describe('buildUrlWithQuery', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/test', hash: '' },
                writable: true,
            })
        })

        it('builds URL with query parameters', () => {
            expect(buildUrlWithQuery({ page: '1', search: 'foo' })).toBe('/test?page=1&search=foo')
        })

        it('builds URL without query when empty', () => {
            expect(buildUrlWithQuery({})).toBe('/test')
        })

        it('preserves hash', () => {
            Object.defineProperty(window, 'location', {
                value: { pathname: '/test', hash: '#section' },
                writable: true,
            })
            expect(buildUrlWithQuery({ page: '1' })).toBe('/test?page=1#section')
        })
    })

    describe('removeEmptyValues', () => {
        it('removes null, undefined and empty string keys', () => {
            const query: Record<string, any> = { a: 'keep', b: null, c: undefined, d: '', e: '0' }
            removeEmptyValues(query)
            expect(query).toEqual({ a: 'keep', e: '0' })
        })

        it('does nothing on clean objects', () => {
            const query: Record<string, any> = { a: '1', b: '2' }
            removeEmptyValues(query)
            expect(query).toEqual({ a: '1', b: '2' })
        })
    })

    describe('buildHistoryState', () => {
        beforeEach(() => {
            vi.spyOn(window, 'history', 'get').mockReturnValue({
                ...window.history,
                state: { existingKey: 'existingValue' },
            })
        })

        it('merges query into existing history state under the dedicated key', () => {
            const state = buildHistoryState({ page: '2' })
            expect(state).toEqual({
                existingKey: 'existingValue',
                __queryString: { page: '2' },
            })
        })

        it('handles missing history state gracefully', () => {
            vi.spyOn(window, 'history', 'get').mockReturnValue({
                ...window.history,
                state: null,
            })
            const state = buildHistoryState({ page: '1' })
            expect(state).toEqual({ __queryString: { page: '1' } })
        })
    })
})

describe('useQueryString transform', () => {
    describe('transformQueryStringValue', () => {
        describe('transform: none (default)', () => {
            it('returns value as-is', () => {
                expect(transformQueryStringValue('hello')).toBe('hello')
            })

            it('returns defaultValue when value is undefined', () => {
                expect(transformQueryStringValue(undefined, { key: 'k', defaultValue: 'def' })).toBe('def')
            })

            it('returns defaultValue when value is null (nullish coalescing)', () => {
                expect(transformQueryStringValue(null)).toBe(undefined)
                expect(transformQueryStringValue(null, { key: 'k', defaultValue: 'fallback' })).toBe('fallback')
            })
        })

        describe('transform: string', () => {
            it('converts to string', () => {
                expect(transformQueryStringValue(42, { key: 'k', transform: 'string' })).toBe('42')
            })

            it('returns defaultValue when value is undefined', () => {
                expect(transformQueryStringValue(undefined, { key: 'k', transform: 'string', defaultValue: 'def' })).toBe('def')
            })

            it('returns defaultValue when value is null and toString is not available', () => {
                expect(transformQueryStringValue(null, { key: 'k', transform: 'string', defaultValue: 'def' })).toBe('def')
            })
        })

        describe('transform: number', () => {
            it('converts string to number', () => {
                expect(transformQueryStringValue('42', { key: 'k', transform: 'number' })).toBe(42)
            })

            it('returns defaultValue for empty string', () => {
                expect(transformQueryStringValue('', { key: 'k', transform: 'number', defaultValue: 0 })).toBe(0)
            })

            it('returns defaultValue for null', () => {
                expect(transformQueryStringValue(null, { key: 'k', transform: 'number', defaultValue: 0 })).toBe(0)
            })

            it('returns defaultValue for NaN', () => {
                expect(transformQueryStringValue('abc', { key: 'k', transform: 'number', defaultValue: -1 })).toBe(-1)
            })

            it('handles float values', () => {
                expect(transformQueryStringValue('3.14', { key: 'k', transform: 'number' })).toBe(3.14)
            })
        })

        describe('transform: boolean', () => {
            it('converts "true" to true', () => {
                expect(transformQueryStringValue('true', { key: 'k', transform: 'boolean' })).toBe(true)
            })

            it('converts "false" to false', () => {
                expect(transformQueryStringValue('false', { key: 'k', transform: 'boolean' })).toBe(false)
            })

            it('converts "1" to true', () => {
                expect(transformQueryStringValue('1', { key: 'k', transform: 'boolean' })).toBe(true)
            })

            it('converts "0" to false', () => {
                expect(transformQueryStringValue('0', { key: 'k', transform: 'boolean' })).toBe(false)
            })

            it('is case-insensitive', () => {
                expect(transformQueryStringValue('TRUE', { key: 'k', transform: 'boolean' })).toBe(true)
                expect(transformQueryStringValue('False', { key: 'k', transform: 'boolean' })).toBe(false)
            })

            it('returns defaultValue for empty string', () => {
                expect(transformQueryStringValue('', { key: 'k', transform: 'boolean', defaultValue: false })).toBe(false)
            })

            it('returns defaultValue for null', () => {
                expect(transformQueryStringValue(null, { key: 'k', transform: 'boolean', defaultValue: true })).toBe(true)
            })
        })

        describe('custom transform function', () => {
            it('uses custom function', () => {
                const transform = (v: any) => (v ? String(v).toUpperCase() : v)
                expect(transformQueryStringValue('hello', { key: 'k', transform })).toBe('HELLO')
            })
        })

        describe('nullStringIsNullValue', () => {
            it('converts string "null" to null when enabled', () => {
                expect(transformQueryStringValue('null', { key: 'k', nullStringIsNullValue: true })).toBe(null)
            })

            it('keeps string "null" when disabled', () => {
                expect(transformQueryStringValue('null', { key: 'k', nullStringIsNullValue: false })).toBe('null')
            })
        })
    })

    describe('extractValues', () => {
        it('extracts values for string keys', () => {
            const keys: HandledQueryStringKeys = ['page', 'search']
            const store = { page: '2', search: 'foo', other: 'bar' }
            expect(extractValues(keys, store)).toEqual({ page: '2', search: 'foo' })
        })

        it('extracts values with config objects', () => {
            const keys: HandledQueryStringKeys = [
                { key: 'page', transform: 'number', defaultValue: 1 },
                { key: 'active', transform: 'boolean', defaultValue: false },
            ]
            const store = { page: '3', active: 'true' }
            expect(extractValues(keys, store)).toEqual({ page: 3, active: true })
        })

        it('uses defaultValue when key is missing', () => {
            const keys: HandledQueryStringKeys = [
                { key: 'page', transform: 'number', defaultValue: 1 },
            ]
            expect(extractValues(keys, {})).toEqual({ page: 1 })
        })

        it('handles mix of string and config keys', () => {
            const keys: HandledQueryStringKeys = [
                'simple',
                { key: 'typed', transform: 'number', defaultValue: 0 },
            ]
            const store = { simple: 'value', typed: '42' }
            expect(extractValues(keys, store)).toEqual({ simple: 'value', typed: 42 })
        })
    })

    describe('hasAnyHandledKey', () => {
        it('returns true when a string key is present', () => {
            expect(hasAnyHandledKey(['page'], { page: '1' })).toBe(true)
        })

        it('returns true when a config key is present', () => {
            expect(hasAnyHandledKey([{ key: 'page' }], { page: '1' })).toBe(true)
        })

        it('returns false when no key is present', () => {
            expect(hasAnyHandledKey(['page', 'search'], { other: 'value' })).toBe(false)
        })

        it('returns true when at least one key matches', () => {
            expect(hasAnyHandledKey(['page', 'search'], { search: 'foo' })).toBe(true)
        })
    })
})

describe('useQueryString composable', () => {
    const createMockRoute = (query: Record<string, string> = {}) =>
        ({ query }) as unknown as RouteLocationNormalizedLoaded

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: { pathname: '/app', search: '', hash: '' },
            writable: true,
        })
        vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
        vi.spyOn(window.history, 'pushState').mockImplementation(() => {})
        vi.spyOn(window, 'history', 'get').mockReturnValue({
            ...window.history,
            state: {},
            replaceState: window.history.replaceState,
            pushState: window.history.pushState,
        })
    })

    it('returns frozen initialValuesInQueryString', () => {
        window.location.search = '?page=5&search=hello'
        const keys: HandledQueryStringKeys = [
            { key: 'page', transform: 'number', defaultValue: 1 },
            'search',
        ]
        const { initialValuesInQueryString } = useQueryString(keys, createMockRoute())
        expect(initialValuesInQueryString).toEqual({ page: 5, search: 'hello' })
        expect(Object.isFrozen(initialValuesInQueryString)).toBe(true)
    })

    it('uses defaultValue when key is not in URL', () => {
        window.location.search = ''
        const keys: HandledQueryStringKeys = [
            { key: 'page', transform: 'number', defaultValue: 1 },
        ]
        const { initialValuesInQueryString } = useQueryString(keys, createMockRoute())
        expect(initialValuesInQueryString.page).toBe(1)
    })

    describe('setValuesInQueryString', () => {
        it('merges values with existing query by default', () => {
            window.location.search = '?page=1&search=old'
            const route = createMockRoute({ page: '1', search: 'old' })
            const { setValuesInQueryString } = useQueryString(['page', 'search'], route)

            setValuesInQueryString({ page: '2' })

            expect(window.history.replaceState).toHaveBeenCalledWith(
                expect.objectContaining({ __queryString: expect.objectContaining({ page: '2', search: 'old' }) }),
                '',
                expect.any(String)
            )
        })

        it('uses current URL query as merge base across consecutive writes', () => {
            window.location.search = '?page=1&search=old'
            const route = createMockRoute({ page: '1', search: 'old' })
            const { setValuesInQueryString } = useQueryString(['page', 'search'], route)

            setValuesInQueryString({ page: '2' })
            window.location.search = '?page=2&search=old'

            setValuesInQueryString({ search: 'new' })

            expect(window.history.replaceState).toHaveBeenLastCalledWith(
                expect.objectContaining({ __queryString: { page: '2', search: 'new' } }),
                '',
                expect.any(String)
            )
        })

        it('replaces entire query when replaceQueryString is true', () => {
            window.location.search = ''
            const route = createMockRoute({ page: '1', search: 'old' })
            const { setValuesInQueryString } = useQueryString(['page', 'search'], route)

            setValuesInQueryString({ page: '3' }, { replaceQueryString: true })

            expect(window.history.replaceState).toHaveBeenCalledWith(
                expect.objectContaining({ __queryString: { page: '3' } }),
                '',
                expect.any(String)
            )
        })

        it('uses pushState when __forcePushState is true', () => {
            window.location.search = ''
            const route = createMockRoute()
            const { setValuesInQueryString } = useQueryString(['page'], route)

            setValuesInQueryString({ page: '1' }, { __forcePushState: true })

            expect(window.history.pushState).toHaveBeenCalled()
            expect(window.history.replaceState).not.toHaveBeenCalled()
        })

        it('strips empty values from the query', () => {
            window.location.search = ''
            const route = createMockRoute({ page: '1', search: 'old' })
            const { setValuesInQueryString } = useQueryString(['page', 'search'], route)

            setValuesInQueryString({ page: '2', search: '' })

            expect(window.history.replaceState).toHaveBeenCalledWith(
                expect.objectContaining({ __queryString: { page: '2' } }),
                '',
                expect.any(String)
            )
        })
    })

    describe('getValuesFromQueryString', () => {
        it('reads values from URL', () => {
            window.location.search = '?page=10&search=bar'
            const keys: HandledQueryStringKeys = [
                { key: 'page', transform: 'number' },
                'search',
            ]
            const { getValuesFromQueryString } = useQueryString(keys, createMockRoute())

            expect(getValuesFromQueryString()).toEqual({ page: 10, search: 'bar' })
        })

        it('accepts override keys', () => {
            window.location.search = '?page=10&search=bar'
            const keys: HandledQueryStringKeys = ['page', 'search']
            const { getValuesFromQueryString } = useQueryString(keys, createMockRoute())

            const result = getValuesFromQueryString([{ key: 'page', transform: 'number' }])
            expect(result).toEqual({ page: 10 })
        })
    })

    describe('router-agnostic mode (route: null)', () => {
        it('returns frozen initialValuesInQueryString', () => {
            window.location.search = '?page=5&search=hello'
            const keys: HandledQueryStringKeys = [
                { key: 'page', transform: 'number', defaultValue: 1 },
                'search',
            ]
            const { initialValuesInQueryString } = useQueryString(keys, null)
            expect(initialValuesInQueryString).toEqual({ page: 5, search: 'hello' })
            expect(Object.isFrozen(initialValuesInQueryString)).toBe(true)
        })

        it('reads values from URL in getValuesFromQueryString', () => {
            window.location.search = '?page=10&search=bar'
            const keys: HandledQueryStringKeys = [
                { key: 'page', transform: 'number' },
                'search',
            ]
            const { getValuesFromQueryString } = useQueryString(keys, null)
            expect(getValuesFromQueryString()).toEqual({ page: 10, search: 'bar' })
        })

        it('merges with current URL params when setting values', () => {
            window.location.search = '?page=1&search=old'
            const { setValuesInQueryString } = useQueryString(['page', 'search'], null)

            setValuesInQueryString({ page: '2' })

            expect(window.history.replaceState).toHaveBeenCalledWith(
                expect.objectContaining({ __queryString: expect.objectContaining({ page: '2', search: 'old' }) }),
                '',
                expect.any(String)
            )
        })

        it('replaces entire query when replaceQueryString is true', () => {
            window.location.search = '?page=1&search=old'
            const { setValuesInQueryString } = useQueryString(['page', 'search'], null)

            setValuesInQueryString({ page: '3' }, { replaceQueryString: true })

            expect(window.history.replaceState).toHaveBeenCalledWith(
                expect.objectContaining({ __queryString: { page: '3' } }),
                '',
                expect.any(String)
            )
        })

        it('uses pushState when __forcePushState is true', () => {
            window.location.search = ''
            const { setValuesInQueryString } = useQueryString(['page'], null)

            setValuesInQueryString({ page: '1' }, { __forcePushState: true })

            expect(window.history.pushState).toHaveBeenCalled()
            expect(window.history.replaceState).not.toHaveBeenCalled()
        })

        it('strips empty values from the query', () => {
            window.location.search = '?page=1&search=old'
            const { setValuesInQueryString } = useQueryString(['page', 'search'], null)

            setValuesInQueryString({ page: '2', search: '' })

            expect(window.history.replaceState).toHaveBeenCalledWith(
                expect.objectContaining({ __queryString: { page: '2' } }),
                '',
                expect.any(String)
            )
        })
    })
})
