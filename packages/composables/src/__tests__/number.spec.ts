import { describe, it, expect } from 'vitest'
import { truncateDecimals, format, parse, roundTo, clamp } from '../utils/number'

describe('number utilities', () => {
  describe('truncateDecimals', () => {
    it('truncates to the specified number of decimals', () => {
      expect(truncateDecimals(1.2345, 2)).toBe(1.23)
      expect(truncateDecimals(1.2345, 3)).toBe(1.234)
      expect(truncateDecimals(1.2345, 0)).toBe(1)
    })

    it('preserves values that already have the correct number of decimals', () => {
      expect(truncateDecimals(1.23, 2)).toBe(1.23)
      expect(truncateDecimals(1.2, 2)).toBe(1.2)
      expect(truncateDecimals(1, 2)).toBe(1)
    })

    it('truncates without rounding up', () => {
      expect(truncateDecimals(1.999, 2)).toBe(1.99)
      expect(truncateDecimals(1.996, 2)).toBe(1.99)
      expect(truncateDecimals(1.005, 2)).toBe(1)
    })

    it('handles negative numbers', () => {
      expect(truncateDecimals(-1.2345, 2)).toBe(-1.23)
      expect(truncateDecimals(-1.999, 2)).toBe(-1.99)
      expect(truncateDecimals(-40.3, 2)).toBe(-40.3)
    })

    it('handles zero', () => {
      expect(truncateDecimals(0, 2)).toBe(0)
      expect(truncateDecimals(0.0, 2)).toBe(0)
    })

    it('handles integers', () => {
      expect(truncateDecimals(42, 2)).toBe(42)
      expect(truncateDecimals(1000, 3)).toBe(1000)
    })

    describe('floating-point precision edge cases', () => {
      it('correctly handles 40.3 (regression: was truncated to 40.29)', () => {
        expect(truncateDecimals(40.3, 2)).toBe(40.3)
      })

      it('correctly handles 299.96 (regression: was truncated to 299.95)', () => {
        expect(truncateDecimals(299.96, 2)).toBe(299.96)
      })

      it('correctly handles 40.2 (no drift)', () => {
        expect(truncateDecimals(40.2, 2)).toBe(40.2)
      })

      it('correctly handles 40.4 (no drift)', () => {
        expect(truncateDecimals(40.4, 2)).toBe(40.4)
      })

      it('correctly handles 0.1 + 0.2 (classic floating-point case)', () => {
        expect(truncateDecimals(0.1 + 0.2, 2)).toBe(0.3)
      })

      it('correctly handles 1234567.89 (regression: was truncated to 1234567.88)', () => {
        expect(truncateDecimals(1234567.89, 2)).toBe(1234567.89)
      })

      it.each([
        [10.1, 10.1],
        [10.2, 10.2],
        [10.3, 10.3],
        [10.6, 10.6],
        [10.7, 10.7],
        [20.3, 20.3],
        [30.3, 30.3],
        [50.6, 50.6],
        [99.99, 99.99],
        [100.01, 100.01],
        [999.99, 999.99],
        [1000.01, 1000.01],
        [0.01, 0.01],
        [0.10, 0.10],
        [0.99, 0.99],
      ])('preserves %f as %f with 2 decimals', (input, expected) => {
        expect(truncateDecimals(input, 2)).toBe(expected)
      })
    })
  })

  describe('parse', () => {
    it('parses Italian format (comma as decimal separator)', () => {
      expect(parse('40,30')).toBe(40.3)
      expect(parse('299,96')).toBe(299.96)
      expect(parse('1.234,56')).toBe(1234.56)
    })

    it('parses plain numbers', () => {
      expect(parse('42')).toBe(42)
      expect(parse('1234.56')).toBe(1234.56)
    })

    it('returns NaN for invalid input', () => {
      expect(parse('')).toBeNaN()
      expect(parse('abc')).toBeNaN()
    })
  })

  describe('clamp', () => {
    it('clamps value within range', () => {
      expect(clamp(0, 5, 10)).toBe(5)
      expect(clamp(0, -1, 10)).toBe(0)
      expect(clamp(0, 11, 10)).toBe(10)
    })
  })
})
