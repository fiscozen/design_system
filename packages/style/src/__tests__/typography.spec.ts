import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const read = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')

const typography = read('../typography.css')
const generatedCss = read('../../output/global.css')

const require = createRequire(import.meta.url)
const tailwindConfig = require('../../tailwind.config.js')

describe('typography.css', () => {
  describe('paragraph/small specificity (LIB-2953)', () => {
    it('scopes the small-paragraph default with :where()', () => {
      expect(typography).toContain('p:where(.text-sm) {')
    })

    /**
     * `p.text-sm` weighs (0,1,1) and silently beats every `leading-*` /
     * `tracking-*` utility (0,1,0). The class stays valid and the override
     * stops working with no error, so only the selector itself can be asserted.
     */
    it('never qualifies the element with a bare class selector', () => {
      expect(typography).not.toMatch(/^\s*p\.text-/m)
    })
  })

  /**
   * The token custom properties live under `.global-theme`, which the apps set
   * on `<body>` in their Django template. Without a fallback any rule outside
   * that scope resolves to `unset` and the declaration silently becomes
   * `inherit` while still winning the cascade.
   *
   * Properties declared inside this file (such as `--paragraph-gap`) always
   * resolve and are therefore exempt.
   */
  it('gives every theme token a fallback value', () => {
    const declaredLocally = new Set(
      [...typography.matchAll(/^\s*(--[\w-]+):/gm)].map(([, name]) => name)
    )
    const referencedWithoutFallback = [...typography.matchAll(/var\((--[\w-]+)\)/g)].map(
      ([, name]) => name
    )

    expect(referencedWithoutFallback.filter((name) => !declaredLocally.has(name))).toEqual([])
  })

  it('is appended verbatim to the generated stylesheet', () => {
    expect(generatedCss).toContain(typography.trim())
  })
})

describe('tailwind.config.js line-height scale', () => {
  const { lineHeight } = tailwindConfig.theme.extend

  it('exposes the leading tokens as a named scale', () => {
    expect(lineHeight.sm).toBe('var(--leading-sm, 18px)')
    expect(lineHeight.base).toBe('var(--leading-base, 20px)')
    expect(lineHeight.lg).toBe('var(--leading-lg, 24px)')
  })

  it('mirrors the fontSize keys', () => {
    const fontSizeKeys = Object.keys(tailwindConfig.theme.fontSize)
    for (const key of Object.keys(lineHeight)) {
      expect(fontSizeKeys).toContain(key)
    }
  })

  it('excludes component-scoped lineHeight tokens', () => {
    expect(lineHeight).not.toHaveProperty('initials')
    expect(lineHeight).not.toHaveProperty('line-height')
  })

  /**
   * Extending rather than replacing keeps Tailwind's own `leading-4`,
   * `leading-5` and `leading-relaxed` generated: they are in use across the
   * products, and removing the keys would stop emitting those classes without
   * any build error.
   */
  it('extends the scale instead of replacing it', () => {
    expect(tailwindConfig.theme.lineHeight).toBeUndefined()
  })
})
