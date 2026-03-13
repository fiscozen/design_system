import { describe, it, expect, beforeEach } from 'vitest'
import { getInitialPageFromUrl } from '../utils'

describe('getInitialPageFromUrl', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: { search: '' },
            writable: true,
        })
    })

    describe('default arguments', () => {
        it('returns 1 when URL has no query params', () => {
            expect(getInitialPageFromUrl()).toBe(1)
        })

        it('reads from "page" key by default', () => {
            window.location.search = '?page=5'
            expect(getInitialPageFromUrl()).toBe(5)
        })
    })

    describe('custom defaultValue', () => {
        it('returns custom default when key is absent', () => {
            expect(getInitialPageFromUrl(0)).toBe(0)
        })

        it('returns custom default when value is not a number', () => {
            window.location.search = '?page=abc'
            expect(getInitialPageFromUrl(0)).toBe(0)
        })

        it('returns custom default when value is empty string', () => {
            window.location.search = '?page='
            expect(getInitialPageFromUrl(42)).toBe(42)
        })
    })

    describe('custom urlKey', () => {
        it('reads from a custom key', () => {
            window.location.search = '?p=3'
            expect(getInitialPageFromUrl(1, 'p')).toBe(3)
        })

        it('returns default when custom key is absent', () => {
            window.location.search = '?page=5'
            expect(getInitialPageFromUrl(1, 'p')).toBe(1)
        })
    })

    describe('numeric parsing', () => {
        it('parses integer values', () => {
            window.location.search = '?page=10'
            expect(getInitialPageFromUrl()).toBe(10)
        })

        it('parses float values (truncation is caller responsibility)', () => {
            window.location.search = '?page=3.7'
            expect(getInitialPageFromUrl()).toBe(3.7)
        })

        it('parses zero', () => {
            window.location.search = '?page=0'
            expect(getInitialPageFromUrl()).toBe(0)
        })

        it('parses negative numbers', () => {
            window.location.search = '?page=-1'
            expect(getInitialPageFromUrl()).toBe(-1)
        })

        it('returns default for NaN values', () => {
            window.location.search = '?page=notanumber'
            expect(getInitialPageFromUrl()).toBe(1)
        })
    })

    describe('coexistence with other params', () => {
        it('reads the correct key when multiple params exist', () => {
            window.location.search = '?search=foo&page=8&sort=asc'
            expect(getInitialPageFromUrl()).toBe(8)
        })
    })
})
