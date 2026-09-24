#!/usr/bin/env node

/**
 * Fails when a published package under packages/ does not point back to this repository.
 *
 * Every package that npm receives must declare `repository` (with `directory`) and
 * `homepage` with the exact values below: npm provenance rejects a publish whose
 * `repository.url` does not match the GitHub repository it was built from.
 *
 * Private packages are never published. Packages tagged `deprecated` in project.json are
 * ignored by changesets, so they are never republished and metadata added to them would
 * never reach the registry.
 *
 * Usage: node scripts/check-package-metadata.mjs [--fix]
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PACKAGES_DIR = 'packages'
const REPOSITORY_URL = 'git+https://github.com/fiscozen/design_system.git'
const REPOSITORY_WEB = 'https://github.com/fiscozen/design_system'

/** Reads and parses a JSON file, or returns null when it does not exist. */
function readJson(path) {
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** The metadata a package living in packages/<dir> must declare. */
function expectedMetadata(dir) {
  return {
    repository: { type: 'git', url: REPOSITORY_URL, directory: `${PACKAGES_DIR}/${dir}` },
    homepage: `${REPOSITORY_WEB}/tree/main/${PACKAGES_DIR}/${dir}`
  }
}

/** True when the package's project.json carries the Nx `deprecated` tag. */
function isDeprecated(dir) {
  const project = readJson(join(PACKAGES_DIR, dir, 'project.json'))
  return Boolean(project?.tags?.includes('deprecated'))
}

/** Lists every packages/<dir> that has a package.json, with its parsed manifest. */
function listPackages() {
  const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
  return dirs
    .map((dir) => ({ dir, manifest: readJson(join(PACKAGES_DIR, dir, 'package.json')) }))
    .filter((pkg) => pkg.manifest !== null)
}

/** Returns one message per field whose value differs from the expected one. */
function metadataErrors(pkg) {
  const expected = expectedMetadata(pkg.dir)
  return Object.entries(expected)
    .filter(([field, value]) => JSON.stringify(pkg.manifest[field]) !== JSON.stringify(value))
    .map(([field, value]) => {
      const actual = JSON.stringify(pkg.manifest[field]) ?? 'missing'
      return `${pkg.manifest.name} (${PACKAGES_DIR}/${pkg.dir}): "${field}" is ${actual}, expected ${JSON.stringify(value)}`
    })
}

/** Rewrites package.json with the expected metadata placed right after `description`. */
function writeMetadata(pkg) {
  const expected = expectedMetadata(pkg.dir)
  const entries = Object.entries(pkg.manifest).filter(([key]) => !(key in expected))
  const anchor = entries.findIndex(([key]) => key === 'description') + 1
  entries.splice(anchor, 0, ...Object.entries(expected))
  const path = join(PACKAGES_DIR, pkg.dir, 'package.json')
  writeFileSync(path, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`)
}

/** Checks every published package, fixing it instead when `--fix` is passed. */
function main() {
  const fix = process.argv.includes('--fix')
  const packages = listPackages().filter((pkg) => !pkg.manifest.private)
  const skipped = packages.filter((pkg) => isDeprecated(pkg.dir))
  const published = packages.filter((pkg) => !isDeprecated(pkg.dir))
  const failing = published.filter((pkg) => metadataErrors(pkg).length > 0)

  if (fix) failing.forEach(writeMetadata)
  const errors = fix ? [] : failing.flatMap(metadataErrors)

  const skippedNames = skipped.map((pkg) => pkg.manifest.name).join(', ') || 'none'
  console.log(`📦 Package metadata: ${published.length} checked, deprecated skipped: ${skippedNames}`)
  if (fix) console.log(`   Fixed ${failing.length} package.json file(s).`)
  if (errors.length === 0) return

  console.error('\n🚨 Package metadata mismatch:\n')
  errors.forEach((error) => console.error(`   ${error}`))
  console.error('\n   To fix: node scripts/check-package-metadata.mjs --fix\n')
  process.exit(1)
}

main()
