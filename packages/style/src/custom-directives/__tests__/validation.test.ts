import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { validateElement, getValidTagsForDirective, getDirectivesForTag } from '../validation'
import type { DirectiveValidationConfig, ValidationRule } from '../validation'

describe('Directive Validation', () => {
  let mockConfig: DirectiveValidationConfig
  let consoleErrorSpy: any

  beforeEach(() => {
    mockConfig = {
      'v-color': [
        { tags: ['P'] },
        { tags: ['H2'], modifiers: ['red'], values: ['200'] },
      ],
      'v-bold': [
        { tags: ['P'] },
      ],
    }
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('validateElement', () => {
    it('should validate valid directive-tag combination', () => {
      const el = document.createElement('p')
      const result = validateElement(mockConfig, el, {
        name: 'v-color',
        arg: 'blue',
        value: '500',
      } as any)

      expect(result).toBe(true)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should not log error for H2 with v-color (regression test for false positive)', () => {
      // This test verifies the fix for the original issue:
      // H2 with v-color should not log "[v-color] Directive can not be used on: h2"
      // even though H2 is not a paragraph, it's a valid heading
      const configWithH2: DirectiveValidationConfig = {
        'v-color': [
          { tags: ['P'] },
          { tags: ['H1', 'H2', 'H3'] },
        ],
      }
      const el = document.createElement('h2')
      const result = validateElement(configWithH2, el, {
        name: 'v-color',
        arg: 'blue',
        value: '500',
      } as any)

      expect(result).toBe(true)
      // Critical: verify no error was logged for valid H2 usage
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should reject invalid tag for directive', () => {
      const el = document.createElement('div')
      const result = validateElement(mockConfig, el, {
        name: 'v-color',
        arg: 'blue',
        value: '500',
      } as any)

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should validate tag with restricted modifier and value', () => {
      const el = document.createElement('h2')
      const result = validateElement(mockConfig, el, {
        name: 'v-color',
        arg: 'red',
        value: '200',
      } as any)

      expect(result).toBe(true)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should reject invalid modifier for restricted tag', () => {
      const el = document.createElement('h2')
      const result = validateElement(mockConfig, el, {
        name: 'v-color',
        arg: 'blue',
        value: '200',
      } as any)

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should reject invalid value for restricted tag', () => {
      const el = document.createElement('h2')
      const result = validateElement(mockConfig, el, {
        name: 'v-color',
        arg: 'red',
        value: '300',
      } as any)

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle directive without modifier', () => {
      const el = document.createElement('p')
      const result = validateElement(mockConfig, el, {
        name: 'v-bold',
        value: true,
      } as any)

      expect(result).toBe(true)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should handle unknown directive', () => {
      const el = document.createElement('p')
      const result = validateElement(mockConfig, el, {
        name: 'v-unknown',
        value: true,
      } as any)

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('getValidTagsForDirective', () => {
    it('should return all valid tags for a directive', () => {
      const tags = getValidTagsForDirective(mockConfig, 'v-color')
      expect(tags).toContain('P')
      expect(tags).toContain('H2')
      expect(tags.length).toBe(2)
    })

    it('should return empty array for unknown directive', () => {
      const tags = getValidTagsForDirective(mockConfig, 'v-unknown')
      expect(tags).toEqual([])
    })
  })

  describe('getDirectivesForTag', () => {
    it('should return all directives that support a tag', () => {
      const directives = getDirectivesForTag(mockConfig, 'P')
      expect(directives).toContain('v-color')
      expect(directives).toContain('v-bold')
    })

    it('should return only matching directives for restricted tag', () => {
      const directives = getDirectivesForTag(mockConfig, 'H2')
      expect(directives).toContain('v-color')
      expect(directives).not.toContain('v-bold')
    })

    it('should return empty array for unsupported tag', () => {
      const directives = getDirectivesForTag(mockConfig, 'DIV')
      expect(directives).toEqual([])
    })
  })
})

