import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020'
import type { ErrorObject } from 'ajv'

/**
 * Guards `packages/layout/layouts.json` — the page-layout manifest consumed by
 * the agentic-design plugin to answer "which layout should this page use?" in
 * every repo built on this design system.
 *
 * Three things are checked, in the order they can break:
 *
 * 1. The manifest satisfies the contract it declares. The contract is a JSON
 *    Schema, so an entry with a misspelled or invented field fails here rather
 *    than reaching a consumer as a field the engine silently ignores.
 * 2. The manifest stays in step with what the package actually exports. A layout
 *    added without a manifest entry is invisible to the tooling (or, worse,
 *    reported as unclassified), so parity is enforced here rather than left to
 *    review.
 * 3. The vendored contract stays identical to the plugin's own copy.
 *
 * This spec runs in the pre-commit `nx affected -t test:unit` gate — the repo's
 * only automated gate, since there is no CI workflow — which means the manifest
 * cannot drift into a commit, and that check 3 runs on a machine where the
 * plugin is installed.
 *
 * Failure messages are written to be actionable on first read — including the
 * exact JSON skeleton to add — because the thing that most often adds a layout
 * here is an agent, and a red test that says only "expected 13 to be 14" costs a
 * round trip.
 */

// `fileURLToPath` on the string, not on a `new URL(...)`: under the jsdom test
// environment the global `URL` is jsdom's, which Node's converter rejects.
const HERE = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = join(HERE, '../..')

const SCHEMA_FILE = 'ds-layouts.schema.json'
const PLUGIN_NAME = 'agentic-design'
const SCHEMA_ENV = 'FZ_AGENTIC_DESIGN_SCHEMA'
const explicitContract = process.env[SCHEMA_ENV] ?? null

const manifest = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'layouts.json'), 'utf8'))
const schemaSource = readFileSync(join(PACKAGE_ROOT, SCHEMA_FILE), 'utf8')
const schema = JSON.parse(schemaSource)
const indexSource = readFileSync(join(HERE, '../index.ts'), 'utf8')
const typesSource = readFileSync(join(HERE, '../types.ts'), 'utf8')

// Read off the contract rather than restated here, so the skeleton a failure
// prints cannot advertise a value the contract rejects.
const entryFields = schema.properties.layouts.items.properties
const KINDS: string[] = entryFields.kind.enum
const HEIGHT_CONTRACTS: string[] = entryFields.heightContract.enum

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

/** ajv's errors, rendered as lines the reader can act on. */
function contractFailure(errors: ErrorObject[]): string {
  return [
    '',
    `packages/layout/layouts.json does not satisfy ${SCHEMA_FILE}:`,
    '',
    ...errors.map(errorLine),
    '',
    `Open packages/layout/${SCHEMA_FILE} for what each field means and which are required.`,
    "It is a verbatim copy of the agentic-design plugin's docs/ds-layouts.schema.json, which",
    'owns the contract — so fix the manifest here, not the schema.',
    ''
  ].join('\n')
}

function errorLine(error: ErrorObject): string {
  return `  ${error.instancePath || '(root)'} ${error.message}${errorDetail(error)}`
}

function errorDetail(error: ErrorObject): string {
  const params = error.params as { additionalProperty?: string; allowedValues?: string[] }
  if (params.additionalProperty) return `: "${params.additionalProperty}"`
  if (params.allowedValues) return `: one of ${params.allowedValues.join(' | ')}`
  return ''
}

/** The plugin's own copy of the contract, or null when the plugin is not installed here. */
function findPluginContract(): string | null {
  return pluginContractCandidates().find((candidate) => existsSync(candidate)) ?? null
}

/** Where the plugin's copy can be, most explicit first. */
function pluginContractCandidates(): string[] {
  if (explicitContract) return [explicitContract]
  const roots = [process.env.CLAUDE_PLUGIN_ROOT, activePluginInstallPath()]
  return roots
    .filter((root): root is string => Boolean(root))
    .map((root) => join(root, 'docs', SCHEMA_FILE))
}

type PluginInstall = { installPath?: string }

/** installPath of the installed agentic-design plugin, per Claude Code's own registry. */
function activePluginInstallPath(): string | null {
  const registry = join(homedir(), '.claude', 'plugins', 'installed_plugins.json')
  if (!existsSync(registry)) return null
  const installs: Record<string, PluginInstall[]> =
    JSON.parse(readFileSync(registry, 'utf8')).plugins ?? {}
  const key = Object.keys(installs).find((name) => name.startsWith(`${PLUGIN_NAME}@`))
  return key ? (installs[key][0]?.installPath ?? null) : null
}

function driftMessage(pluginCopy: string): string {
  return [
    '',
    `packages/layout/${SCHEMA_FILE} has drifted from the plugin's copy at:`,
    `  ${pluginCopy}`,
    '',
    'The plugin owns this contract: it is the engine that reads the manifest and decides what',
    'conformance means. The copy here exists only because the plugin repo is private, so its',
    'raw URL 404s and neither an editor nor this spec could resolve it. Re-copy it verbatim:',
    '',
    `  cp "${pluginCopy}" packages/layout/${SCHEMA_FILE}`,
    '',
    'then re-run this spec. If the contract changed in a way layouts.json violates, the',
    '"satisfies the contract it declares" test names the field.',
    ''
  ].join('\n')
}

const pluginContract = findPluginContract()

// Nothing to compare against, and nothing was asked for: the alignment check is
// out of scope on this machine rather than passing. Setting SCHEMA_ENV asks for
// it explicitly, so a bad path there fails instead of skipping.
const alignmentOutOfScope = pluginContract === null && explicitContract === null

// Written to stderr, not through `console`: the reporter swallows module-scope
// console output, and a skip whose reason is invisible reads as a pass.
if (alignmentOutOfScope) {
  process.stderr.write(
    `[layouts.manifest] the ${PLUGIN_NAME} plugin is not installed here, so the contract ` +
      `alignment check did not run. Point ${SCHEMA_ENV} at the plugin's docs/${SCHEMA_FILE} ` +
      'to run it.\n'
  )
}

describe('layouts.json manifest', () => {
  // ============================================
  // THE CONTRACT
  // ============================================
  describe('The contract', () => {
    it('declares a $schema that resolves to a file in this package', () => {
      const declared: string = manifest.$schema

      expect(
        /^https?:/.test(declared),
        `layouts.json points $schema at "${declared}". A remote URL is the wrong pointer here: ` +
          'the contract lives in a private repo, so its raw URL answers 404 for every reader ' +
          `and every tool. Point $schema at the vendored sibling copy, ./${SCHEMA_FILE}.`
      ).toBe(false)

      expect(
        existsSync(resolve(PACKAGE_ROOT, declared)),
        `layouts.json declares $schema "${declared}", which resolves to nothing. The vendored ` +
          `contract is packages/layout/${SCHEMA_FILE}.`
      ).toBe(true)
    })

    it('satisfies the contract it declares', () => {
      const validate = new Ajv2020({ allErrors: true }).compile(schema)

      const valid = validate(manifest)

      expect(valid, valid ? '' : contractFailure(validate.errors ?? [])).toBe(true)
    })
  })

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
              `Field meanings — see packages/layout/${SCHEMA_FILE}, the contract this manifest`,
              'is validated against:',
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
  // RULES STRICTER THAN THE CONTRACT
  // ============================================
  // The contract admits any manifest a consuming design system could publish.
  // These are the additional promises THIS package makes about its own entries,
  // which a schema cannot express.
  describe('Rules stricter than the contract', () => {
    it('declares the package these layouts ship in', () => {
      expect(manifest.package).toBe('@fiscozen/layout')
    })

    it.each(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      manifest.layouts.map((l: any) => [l.name, l] as const)
    )('%s describes the page shape it is for, and versions itself', (name, layout) => {
      expect(
        typeof layout.whenToUse === 'string' && layout.whenToUse.length > 20,
        `${name}.whenToUse must describe the page shape this layout is for — it is the text the ` +
          'layout decision is actually made from'
      ).toBe(true)
      expect(layout.since, `${name}.since must be a semver version`).toMatch(/^\d+\.\d+\.\d+/)
    })

    it.each(
      manifest.layouts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((l: any) => l.composeOnly?.safe === false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((l: any) => [l.name, l.composeOnly] as const)
    )('%s lists the gaps that make it compose-only unsafe', (name, composeOnly) => {
      expect(
        composeOnly.gaps?.length,
        `${name}.composeOnly.safe is false, so list the gap(s) — consumers under a ` +
          'compose-only policy are shown this text before they commit to the layout'
      ).toBeGreaterThan(0)
    })

    it('never names a nesting host that is not a shell', () => {
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

  // ============================================
  // ALIGNMENT WITH THE PLUGIN
  // ============================================
  // The comparison is byte-for-byte, which is why the vendored copy is verbatim
  // down to its `$id` — that `$id` names the plugin's private URL and does not
  // resolve, and per JSON Schema it does not have to: it identifies the schema,
  // it is not fetched. `$schema` in layouts.json is the pointer tools resolve,
  // and that one is local.
  describe('Alignment with the agentic-design plugin', () => {
    it.skipIf(alignmentOutOfScope)("matches the plugin's own copy", () => {
      expect(
        pluginContract,
        `${SCHEMA_ENV} is set to "${explicitContract}", which does not exist. Point it at the ` +
          `plugin's docs/${SCHEMA_FILE}, or unset it to skip this check.`
      ).not.toBeNull()

      const canonical = readFileSync(pluginContract!, 'utf8')

      expect(schemaSource, driftMessage(pluginContract!)).toBe(canonical)
    })
  })
})
