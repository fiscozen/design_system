import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Guards `packages/layout/layouts.json` — the page-layout manifest consumed by
 * the agentic-design plugin to answer "which layout should this page use?" in
 * every repo built on this design system.
 *
 * The manifest is only useful if it stays in step with what the package actually
 * exports. A layout added without a manifest entry is invisible to the tooling
 * (or, worse, reported as unclassified), so parity is enforced here rather than
 * left to review. This spec runs in the pre-commit `nx affected -t test:unit`
 * gate, which means the manifest cannot drift into a commit.
 *
 * Failure messages are written to be actionable on first read — including the
 * exact JSON skeleton to add — because the thing that most often adds a layout
 * here is an agent, and a red test that says only "expected 13 to be 14" costs a
 * round trip.
 */

// `fileURLToPath` on the string, not on a `new URL(...)`: under the jsdom test
// environment the global `URL` is jsdom's, which Node's converter rejects.
const HERE = dirname(fileURLToPath(import.meta.url))
const manifest = JSON.parse(readFileSync(join(HERE, '../../layouts.json'), 'utf8'))
const indexSource = readFileSync(join(HERE, '../index.ts'), 'utf8')
const typesSource = readFileSync(join(HERE, '../types.ts'), 'utf8')

const KINDS = ['shell', 'page-content', 'bounded', 'region', 'grid']
const HEIGHT_CONTRACTS = ['owns-viewport', 'document-scroll', 'fills-parent']

/** Names re-exported from the barrel that look like page layouts. */
function exportedLayoutNames(): string[] {
  const pattern = new RegExp(manifest.exportPattern ?? 'Template$')
  const names = new Set<string>()
  for (const line of indexSource.split('\n')) {
    const match = line.match(/export\s*\{\s*default\s+as\s+([A-Za-z0-9_]+)\s*\}/)
    if (match && pattern.test(match[1])) names.add(match[1])
  }
  return [...names].sort()
}

/** Slot keys declared on a layout's `Fz<Name>Slots` type in types.ts. */
function declaredSlots(name: string): string[] | null {
  const typeName = `${name}Slots`
  const start = typesSource.indexOf(`type ${typeName} = {`)
  if (start === -1) return null
  const open = typesSource.indexOf('{', start)
  let depth = 0
  let end = -1
  for (let i = open; i < typesSource.length; i++) {
    if (typesSource[i] === '{') depth++
    else if (typesSource[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  if (end === -1) return null
  const body = typesSource.slice(open + 1, end)
  const slots: string[] = []
  // Top-level members only: `name?(props): any` / `'name'?(props): any`
  let nesting = 0
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (nesting === 0) {
      const member = trimmed.match(/^'?([A-Za-z][A-Za-z0-9-]*)'?\??\(/)
      if (member) slots.push(member[1])
    }
    nesting += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length
  }
  return slots
}

function skeleton(name: string): string {
  return JSON.stringify(
    {
      name,
      kind: `one of ${KINDS.join(' | ')}`,
      heightContract: `one of ${HEIGHT_CONTRACTS.join(' | ')}`,
      surfaces: ['FO or BO'],
      since: 'the version this ships in',
      whenToUse: 'the page shape this is for, in one or two sentences',
      notWhenToUse: 'the layout it is most easily confused with, and why this is not it',
      slots: declaredSlots(name) ?? ['see Fz…Slots in types.ts'],
      keyProps: ['props worth surfacing at plan time'],
      nestWithin: ['only hosts proven by a composition test — omit if none'],
      composeOnly: { safe: true, gaps: [] }
    },
    null,
    2
  )
}

describe('layouts.json manifest', () => {
  // ============================================
  // PARITY WITH THE BARREL
  // ============================================
  describe('Parity with src/index.ts', () => {
    it('has an entry for every exported page layout', () => {
      const declared = new Set(manifest.layouts.map((l: { name: string }) => l.name))
      const missing = exportedLayoutNames().filter((n) => !declared.has(n))

      expect(
        missing,
        missing.length === 0
          ? ''
          : [
              '',
              `packages/layout/layouts.json is missing ${missing.length} exported layout(s): ${missing.join(', ')}.`,
              '',
              'This manifest is how every repo built on this design system decides which layout a',
              'page should use. A layout that is exported but unlisted is invisible to that tooling.',
              '',
              'Add an entry per missing layout to the `layouts` array, e.g.:',
              '',
              missing.map(skeleton).join(',\n'),
              '',
              'Field meanings — see docs/ds-layouts.schema.json in the agentic-design plugin:',
              '  kind=shell         a top-level page frame that owns the viewport height (one per page)',
              '  kind=page-content  renders INSIDE a shell; set `nestWithin` + `whenNested`',
              '  kind=bounded       fills its parent and needs a bounded-height ancestor',
              '  kind=region        an internal region wrapper — not for app code',
              '  kind=grid          an in-page grid primitive, not a page frame',
              '',
              'Only list a host in `nestWithin` if a composition test proves the pair works.',
              ''
            ].join('\n')
      ).toEqual([])
    })

    it('has no entry for a layout the package no longer exports', () => {
      // Region molecules and the grid primitive are exported without the layout
      // suffix, so check every manifest entry against the barrel text directly.
      const stale = manifest.layouts
        .map((l: { name: string }) => l.name)
        .filter((name: string) => !new RegExp(`\\b${name}\\b`).test(indexSource))

      expect(
        stale,
        stale.length === 0
          ? ''
          : `layouts.json lists ${stale.join(', ')}, which src/index.ts no longer exports. ` +
              'Remove the stale entry (or restore the export).'
      ).toEqual([])
    })
  })

  // ============================================
  // SHAPE
  // ============================================
  describe('Shape', () => {
    it('declares the package and a non-empty layouts array', () => {
      expect(manifest.package).toBe('@fiscozen/layout')
      expect(Array.isArray(manifest.layouts)).toBe(true)
      expect(manifest.layouts.length).toBeGreaterThan(0)
    })

    it.each(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      manifest.layouts.map((l: any) => [l.name, l] as const)
    )('%s has the required fields with valid values', (name, layout) => {
      expect(typeof name, 'every entry needs a `name`').toBe('string')
      expect(KINDS, `${name}.kind must be one of ${KINDS.join(' | ')}`).toContain(layout.kind)
      expect(
        typeof layout.whenToUse === 'string' && layout.whenToUse.length > 20,
        `${name}.whenToUse must describe the page shape this layout is for — it is the text the ` +
          'layout decision is actually made from'
      ).toBe(true)
      if (layout.heightContract !== undefined) {
        expect(HEIGHT_CONTRACTS, `${name}.heightContract is invalid`).toContain(layout.heightContract)
      }
      if (layout.since !== undefined) {
        expect(layout.since, `${name}.since must be a semver version`).toMatch(/^\d+\.\d+\.\d+/)
      }
      if (layout.composeOnly !== undefined) {
        expect(typeof layout.composeOnly.safe, `${name}.composeOnly.safe must be a boolean`).toBe(
          'boolean'
        )
        if (layout.composeOnly.safe === false) {
          expect(
            layout.composeOnly.gaps?.length,
            `${name}.composeOnly.safe is false, so list the gap(s) — consumers under a ` +
              'compose-only policy are shown this text before they commit to the layout'
          ).toBeGreaterThan(0)
        }
      }
    })

    it('gives every nesting layout a host list or none at all, never a host that is not a shell', () => {
      const shells = new Set(
        manifest.layouts
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((l: any) => l.kind === 'shell')
          .map((l: { name: string }) => l.name)
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const layout of manifest.layouts as any[]) {
        for (const host of layout.nestWithin ?? []) {
          expect(
            shells.has(host),
            `${layout.name}.nestWithin lists "${host}", which is not a shell in this manifest`
          ).toBe(true)
        }
      }
    })
  })

  // ============================================
  // SLOT PARITY
  // ============================================
  describe('Slot parity with types.ts', () => {
    it.each(
      manifest.layouts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((l: any) => Array.isArray(l.slots) && declaredSlots(l.name) !== null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((l: any) => [l.name, l.slots] as const)
    )('%s slots match its Fz…Slots type', (name, slots) => {
      const declared = declaredSlots(name as string)!
      expect(
        [...slots].sort(),
        `layouts.json lists slots [${[...slots].sort().join(', ')}] for ${name}, but ` +
          `${name}Slots in types.ts declares [${[...declared].sort().join(', ')}]. ` +
          'Update the manifest (or the type) so the two agree — consumers read the manifest ' +
          'to know which slots exist.'
      ).toEqual([...declared].sort())
    })
  })
})
