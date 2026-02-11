#!/usr/bin/env node

/**
 * Release check & preview for the Fiscozen Design System.
 *
 * Designed around the Changesets workflow:
 *   changeset add → merge PRs → changeset:version → changeset:publish
 *
 * Sections (all run by default):
 *   1. Unpublished Versions      — compares local package.json versions
 *      against the npm registry, showing packages ready to publish
 *      (the dry-run view of `changeset publish`).
 *   2. Pending Release Preview   — reads .changeset/*.md, simulates version
 *      bumps (including cascade from updateInternalDependencies), shows
 *      impact summary and aggregated changelogs.
 *   3. Dependency Graph Analysis  — shows the internal dependency graph,
 *      cascade potential for "hub" packages, and minimum coherent update
 *      sets the consumer should adopt.
 *   4. Health Checks              — detects peer-dependency misalignment,
 *      flags 0.x packages, and warns about potential issues.
 *
 * Usage:
 *   node scripts/release-check.mjs [section] [--json]
 *
 * Sections (pick one, or omit for all):
 *   --unpublished  Only unpublished versions analysis (local vs npm)
 *   --pending      Only pending changesets analysis
 *   --graph        Only dependency graph analysis
 *   --health       Only health checks
 *
 * Options:
 *   --json      Output raw JSON instead of the human-readable report
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PACKAGES_DIR = join(ROOT, 'packages');
const CHANGESETS_DIR = join(ROOT, '.changeset');

const args = new Set(process.argv.slice(2));
const JSON_OUTPUT = args.has('--json');
const SECTION_UNPUBLISHED = args.has('--unpublished');
const SECTION_PENDING = args.has('--pending');
const SECTION_GRAPH = args.has('--graph');
const SECTION_HEALTH = args.has('--health');
const SHOW_ALL =
  !SECTION_UNPUBLISHED && !SECTION_PENDING && !SECTION_GRAPH && !SECTION_HEALTH;

// Tooling packages — excluded from analysis
const TOOLING_PACKAGES = new Set([
  '@fiscozen/eslint-config',
  '@fiscozen/prettier-config',
  '@fiscozen/tsconfig',
]);

// ── ANSI helpers ────────────────────────────────────────────────────────────

const useColour = !JSON_OUTPUT && process.stdout.isTTY;
const c = {
  reset: useColour ? '\x1b[0m' : '',
  bold: useColour ? '\x1b[1m' : '',
  dim: useColour ? '\x1b[2m' : '',
  red: useColour ? '\x1b[31m' : '',
  yellow: useColour ? '\x1b[33m' : '',
  green: useColour ? '\x1b[32m' : '',
  cyan: useColour ? '\x1b[36m' : '',
  magenta: useColour ? '\x1b[35m' : '',
  blue: useColour ? '\x1b[34m' : '',
};

function line(ch = '─', len = 90) {
  return ch.repeat(len);
}

function header(title) {
  console.log();
  console.log(`${c.bold}${title}${c.reset}`);
  console.log(line());
}

// ── Package discovery ───────────────────────────────────────────────────────

/**
 * @typedef {{name: string, version: string, dir: string, deps: string[], peerDeps: Record<string, string>}} PkgInfo
 */

/** @returns {Promise<Map<string, PkgInfo>>} name → info */
async function discoverPackages() {
  const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
  /** @type {Map<string, PkgInfo>} */
  const pkgs = new Map();

  await Promise.all(
    entries
      .filter((e) => e.isDirectory())
      .map(async (e) => {
        try {
          const raw = await readFile(join(PACKAGES_DIR, e.name, 'package.json'), 'utf-8');
          const pkg = JSON.parse(raw);
          if (!pkg.name || TOOLING_PACKAGES.has(pkg.name)) return;
          const fzDeps = Object.keys(pkg.dependencies || {}).filter(
            (n) => n.startsWith('@fiscozen/') && !TOOLING_PACKAGES.has(n),
          );
          pkgs.set(pkg.name, {
            name: pkg.name,
            version: pkg.version || '0.0.0',
            dir: e.name,
            deps: fzDeps,
            peerDeps: pkg.peerDependencies || {},
          });
        } catch {
          /* skip non-package dirs */
        }
      }),
  );

  return pkgs;
}

// ── Dependency graph utilities ──────────────────────────────────────────────

/**
 * Build a reverse dependency map: for each package, which other packages
 * depend on it (i.e. its "dependents" / "consumers").
 * @param {Map<string, PkgInfo>} pkgs
 * @returns {Map<string, Set<string>>} dependencyName → Set<consumerName>
 */
function buildReverseDeps(pkgs) {
  /** @type {Map<string, Set<string>>} */
  const reverse = new Map();
  for (const [, info] of pkgs) {
    for (const dep of info.deps) {
      if (!reverse.has(dep)) reverse.set(dep, new Set());
      reverse.get(dep).add(info.name);
    }
  }
  return reverse;
}

/**
 * Compute the transitive cascade: given a set of directly-bumped packages,
 * find all packages that would receive a patch bump via
 * updateInternalDependencies: "patch".
 *
 * @param {Set<string>} directlyBumped
 * @param {Map<string, Set<string>>} reverseDeps
 * @returns {Map<string, string[]>} cascadedPkg → [reason deps that triggered it]
 */
function computeCascade(directlyBumped, reverseDeps) {
  /** @type {Map<string, string[]>} */
  const cascaded = new Map();
  const queue = [...directlyBumped];
  const visited = new Set(directlyBumped);

  while (queue.length > 0) {
    const pkg = queue.shift();
    const consumers = reverseDeps.get(pkg);
    if (!consumers) continue;

    for (const consumer of consumers) {
      if (!cascaded.has(consumer)) cascaded.set(consumer, []);
      cascaded.get(consumer).push(pkg);

      if (!visited.has(consumer)) {
        visited.add(consumer);
        queue.push(consumer);
      }
    }
  }

  // Remove packages that were directly bumped — they're not "cascade-only"
  for (const pkg of directlyBumped) {
    cascaded.delete(pkg);
  }

  return cascaded;
}

/**
 * Compute the full transitive fan-out of a package: how many packages would
 * receive a cascade bump if this single package changed.
 * @param {string} pkgName
 * @param {Map<string, Set<string>>} reverseDeps
 * @returns {Set<string>}
 */
function transitiveConsumers(pkgName, reverseDeps) {
  const result = new Set();
  const queue = [pkgName];
  while (queue.length > 0) {
    const current = queue.shift();
    const consumers = reverseDeps.get(current);
    if (!consumers) continue;
    for (const consumer of consumers) {
      if (!result.has(consumer)) {
        result.add(consumer);
        queue.push(consumer);
      }
    }
  }
  return result;
}

// ── Changeset parsing ───────────────────────────────────────────────────────

/**
 * @typedef {{id: string, packages: Record<string, string>, summary: string}} Changeset
 */

/** Parse all pending .changeset/*.md files. */
async function readPendingChangesets() {
  /** @type {Changeset[]} */
  const changesets = [];

  let entries;
  try {
    entries = await readdir(CHANGESETS_DIR);
  } catch {
    return changesets;
  }

  const mdFiles = entries.filter((f) => f.endsWith('.md') && f !== 'README.md');

  await Promise.all(
    mdFiles.map(async (file) => {
      try {
        const raw = await readFile(join(CHANGESETS_DIR, file), 'utf-8');
        const parsed = parseChangesetFile(raw);
        if (parsed) {
          changesets.push({ id: basename(file, '.md'), ...parsed });
        }
      } catch {
        /* skip malformed */
      }
    }),
  );

  return changesets;
}

/**
 * Parse a single changeset markdown file.
 * Format:
 * ```
 * ---
 * "@fiscozen/button": minor
 * "@fiscozen/icons": patch
 * ---
 *
 * Description of the change
 * ```
 */
function parseChangesetFile(content) {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!frontMatterMatch) return null;

  const [, yaml, body] = frontMatterMatch;
  /** @type {Record<string, string>} */
  const packages = {};

  for (const line of yaml.split('\n')) {
    // Match: "@fiscozen/button": minor   or   "@fiscozen/button": patch
    const m = line.match(/^["']?([^"']+)["']?\s*:\s*(major|minor|patch)\s*$/);
    if (m) {
      packages[m[1]] = m[2];
    }
  }

  if (Object.keys(packages).length === 0) return null;
  return { packages, summary: body.trim() };
}

// ── Semver helpers ──────────────────────────────────────────────────────────

function parseSemver(version) {
  const m = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] || null,
  };
}

function bumpVersion(version, type) {
  const v = parseSemver(version);
  if (!v) return version;
  switch (type) {
    case 'major':
      return `${v.major + 1}.0.0`;
    case 'minor':
      return `${v.major}.${v.minor + 1}.0`;
    case 'patch':
      return `${v.major}.${v.minor}.${v.patch + 1}`;
    default:
      return version;
  }
}

/**
 * Compare two semver versions. Returns:
 *   > 0  if a > b
 *   < 0  if a < b
 *     0  if equal
 */
function compareSemver(a, b) {
  const va = parseSemver(a);
  const vb = parseSemver(b);
  if (!va || !vb) return 0;
  if (va.major !== vb.major) return va.major - vb.major;
  if (va.minor !== vb.minor) return va.minor - vb.minor;
  if (va.patch !== vb.patch) return va.patch - vb.patch;
  // A prerelease version is always less than the normal version
  if (va.prerelease && !vb.prerelease) return -1;
  if (!va.prerelease && vb.prerelease) return 1;
  return 0;
}

/**
 * Determine the bump type between two versions.
 * @param {string} from
 * @param {string} to
 * @returns {'major'|'minor'|'patch'|'release'|null}
 */
function inferBumpType(from, to) {
  const vf = parseSemver(from);
  const vt = parseSemver(to);
  if (!vf || !vt) return null;
  if (vt.major > vf.major) return 'major';
  if (vt.minor > vf.minor) return 'minor';
  if (vt.patch > vf.patch) return 'patch';
  // prerelease → stable (e.g. 1.0.0-next.0 → 1.0.0)
  if (vf.prerelease && !vt.prerelease) return 'release';
  return null;
}

// Bump type priority: major > minor > release > patch
const BUMP_PRIORITY = { major: 4, minor: 3, release: 2, patch: 1 };

// ── npm registry helpers ────────────────────────────────────────────────────

const NPM_REGISTRY = 'https://registry.npmjs.org';

/**
 * Fetch the latest published version of a package from the npm registry.
 * @param {string} packageName — scoped names like `@fiscozen/button` are OK
 * @returns {Promise<string|null|undefined>}
 *   - string  → latest published version
 *   - null    → package has never been published (404)
 *   - undefined → network/registry error
 */
async function fetchNpmVersion(packageName) {
  try {
    // Scoped packages need URL-encoding of the `/` → `%2f`
    const url = `${NPM_REGISTRY}/${packageName.replace('/', '%2f')}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.npm.install-v1+json' }, // smaller payload
      signal: AbortSignal.timeout(10_000),
    });
    if (res.status === 404) return null;
    if (!res.ok) return undefined;
    const data = await res.json();
    return data['dist-tags']?.latest ?? null;
  } catch {
    return undefined;
  }
}

/**
 * Fetch npm versions for all packages in parallel (with concurrency limit).
 * @param {Map<string, PkgInfo>} pkgs
 * @returns {Promise<Map<string, string|null|undefined>>} name → npmVersion
 */
async function fetchAllNpmVersions(pkgs) {
  /** @type {Map<string, string|null|undefined>} */
  const results = new Map();
  const CONCURRENCY = 8;
  const names = [...pkgs.keys()];

  for (let i = 0; i < names.length; i += CONCURRENCY) {
    const batch = names.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (name) => {
        const version = await fetchNpmVersion(name);
        return /** @type {const} */ ([name, version]);
      }),
    );
    for (const [name, version] of batchResults) {
      results.set(name, version);
    }
  }

  return results;
}

// ── Section 1: Unpublished Versions ─────────────────────────────────────────

async function sectionUnpublished(pkgs) {
  const result = {
    /** @type {Array<{name: string, localVersion: string, npmVersion: string|null, bumpType: string|null}>} */
    unpublished: [],
    /** @type {Array<{name: string, localVersion: string}>} */
    newPackages: [],
    /** @type {Array<{name: string, version: string}>} */
    upToDate: [],
    /** @type {string[]} */
    errors: [],
    totalReadyToPublish: 0,
  };

  if (!JSON_OUTPUT) {
    header('📤 Unpublished Versions (local vs. npm registry)');
    process.stdout.write(`  ${c.dim}Fetching versions from npm registry…${c.reset}`);
  }

  const npmVersions = await fetchAllNpmVersions(pkgs);

  if (!JSON_OUTPUT) {
    // Clear the "Fetching…" line
    process.stdout.write('\r' + ' '.repeat(60) + '\r');
  }

  for (const [name, info] of pkgs) {
    const npmVersion = npmVersions.get(name);

    if (npmVersion === undefined) {
      // Network/registry error
      result.errors.push(name);
      continue;
    }

    if (npmVersion === null) {
      // Never published
      result.newPackages.push({ name, localVersion: info.version });
      continue;
    }

    const cmp = compareSemver(info.version, npmVersion);
    if (cmp > 0) {
      // Local is ahead of npm → unpublished
      result.unpublished.push({
        name,
        localVersion: info.version,
        npmVersion,
        bumpType: inferBumpType(npmVersion, info.version),
      });
    } else {
      // Same or npm is ahead (shouldn't happen normally)
      result.upToDate.push({ name, version: info.version });
    }
  }

  // Sort: major bumps first, then minor, then patch, then alphabetical
  result.unpublished.sort((a, b) => {
    const pa = BUMP_PRIORITY[a.bumpType] || 0;
    const pb = BUMP_PRIORITY[b.bumpType] || 0;
    if (pa !== pb) return pb - pa;
    return a.name.localeCompare(b.name);
  });
  result.newPackages.sort((a, b) => a.name.localeCompare(b.name));

  result.totalReadyToPublish = result.unpublished.length + result.newPackages.length;

  if (JSON_OUTPUT) return result;

  // ── Human-readable output ──

  if (result.totalReadyToPublish === 0 && result.errors.length === 0) {
    console.log(`  ${c.green}✅ All packages are up-to-date on npm.${c.reset}`);
    console.log();
    return result;
  }

  if (result.totalReadyToPublish > 0) {
    console.log(
      `  ${c.bold}${c.cyan}${result.totalReadyToPublish}${c.reset}${c.bold} package(s) ready to publish${c.reset}` +
        (result.upToDate.length > 0
          ? `  ${c.dim}(${result.upToDate.length} already up-to-date)${c.reset}`
          : ''),
    );
    console.log();
  }

  // Unpublished (version bumped but not yet published)
  if (result.unpublished.length > 0) {
    console.log(
      `  ${'Package'.padEnd(30)} ${'Local'.padEnd(12)} ${'npm'.padEnd(12)} ${'Bump'}`,
    );
    console.log(`  ${line('─', 70)}`);

    for (const p of result.unpublished) {
      const typeColor =
        p.bumpType === 'major'
          ? c.red
          : p.bumpType === 'minor'
            ? c.yellow
            : p.bumpType === 'release'
              ? c.magenta
              : c.green;
      const typeIcon =
        p.bumpType === 'major'
          ? '🔴'
          : p.bumpType === 'minor'
            ? '🟡'
            : p.bumpType === 'release'
              ? '🟣'
              : '🟢';
      console.log(
        `  ${typeIcon} ${p.name.padEnd(28)} ${c.bold}${p.localVersion.padEnd(12)}${c.reset} ${c.dim}${p.npmVersion.padEnd(12)}${c.reset} ${typeColor}${p.bumpType || '?'}${c.reset}`,
      );
    }
    console.log();
  }

  // New packages (never published)
  if (result.newPackages.length > 0) {
    console.log(`  ${c.bold}New packages ${c.dim}(not yet on npm)${c.reset}:`);
    for (const p of result.newPackages) {
      console.log(
        `    🆕 ${p.name.padEnd(28)} ${c.bold}${p.localVersion}${c.reset}`,
      );
    }
    console.log();
  }

  // Errors
  if (result.errors.length > 0) {
    console.log(
      `  ${c.yellow}⚠ Could not fetch npm info for: ${result.errors.join(', ')}${c.reset}`,
    );
    console.log();
  }

  // Publish hint
  if (result.totalReadyToPublish > 0) {
    console.log(
      `  ${c.dim}Run ${c.reset}${c.cyan}pnpm changeset:publish${c.reset}${c.dim} to publish these versions to npm.${c.reset}`,
    );
    console.log();
  }

  return result;
}

// ── Section 2: Pending Release Preview ──────────────────────────────────────

async function sectionPending(pkgs, reverseDeps) {
  const changesets = await readPendingChangesets();

  const result = {
    changesetCount: changesets.length,
    directBumps: /** @type {Record<string, {type: string, newVersion: string, summaries: string[]}>} */ ({}),
    cascadeBumps: /** @type {Record<string, {newVersion: string, triggeredBy: string[]}>} */ ({}),
    warnings: /** @type {string[]} */ ([]),
    totalAffected: 0,
  };

  if (changesets.length === 0) {
    if (!JSON_OUTPUT) {
      header('📦 Pending Release Preview');
      console.log(
        `  ${c.green}No pending changesets.${c.reset} ` +
          `${c.dim}If versions were already bumped via ${c.reset}${c.cyan}changeset version${c.reset}${c.dim}, ` +
          `check the "Unpublished Versions" section above (or run with ${c.reset}${c.cyan}--unpublished${c.reset}${c.dim}).${c.reset}`,
      );
      console.log();
    }
    return result;
  }

  // 1. Aggregate direct bumps: highest bump type wins per package
  /** @type {Map<string, {type: string, summaries: string[]}>} */
  const directBumps = new Map();

  for (const cs of changesets) {
    for (const [pkg, type] of Object.entries(cs.packages)) {
      if (TOOLING_PACKAGES.has(pkg)) continue;

      const existing = directBumps.get(pkg);
      if (!existing) {
        directBumps.set(pkg, { type, summaries: [cs.summary] });
      } else {
        // Take the highest bump type
        if (BUMP_PRIORITY[type] > BUMP_PRIORITY[existing.type]) {
          existing.type = type;
        }
        if (cs.summary) existing.summaries.push(cs.summary);
      }
    }
  }

  // 2. Compute cascade
  const directlyBumped = new Set(directBumps.keys());
  const cascaded = computeCascade(directlyBumped, reverseDeps);

  // 3. Compute new versions
  for (const [pkg, info] of directBumps) {
    const pkgInfo = pkgs.get(pkg);
    const currentVersion = pkgInfo?.version || '0.0.0';
    const newVersion = bumpVersion(currentVersion, info.type);
    result.directBumps[pkg] = {
      type: info.type,
      newVersion,
      summaries: info.summaries,
    };
  }

  for (const [pkg, triggeredBy] of cascaded) {
    const pkgInfo = pkgs.get(pkg);
    const currentVersion = pkgInfo?.version || '0.0.0';
    const newVersion = bumpVersion(currentVersion, 'patch');
    result.cascadeBumps[pkg] = { newVersion, triggeredBy };
  }

  result.totalAffected =
    Object.keys(result.directBumps).length + Object.keys(result.cascadeBumps).length;

  // 4. Warnings
  for (const [pkg, info] of directBumps) {
    const pkgInfo = pkgs.get(pkg);
    if (!pkgInfo) {
      result.warnings.push(`⚠ Changeset references unknown package: ${pkg}`);
      continue;
    }
    const v = parseSemver(pkgInfo.version);
    if (v && v.major === 0 && info.type === 'minor') {
      result.warnings.push(
        `⚠ ${pkg}@${pkgInfo.version} is 0.x — a "minor" bump (→ ${bumpVersion(pkgInfo.version, 'minor')}) ` +
          `may be a breaking change for consumers per semver convention`,
      );
    }
    if (info.type === 'major') {
      const fanOut = transitiveConsumers(pkg, reverseDeps);
      result.warnings.push(
        `🔴 ${pkg} has a MAJOR bump — ${fanOut.size} package(s) depend on it transitively`,
      );
    }
  }

  // 5. Output
  if (JSON_OUTPUT) return result;

  header('📦 Pending Release Preview');
  console.log(
    `  ${c.cyan}${changesets.length}${c.reset} changeset(s) pending  →  ` +
      `${c.cyan}${directBumps.size}${c.reset} direct bump(s), ` +
      `${c.cyan}${cascaded.size}${c.reset} cascade bump(s)  =  ` +
      `${c.bold}${result.totalAffected} package(s) total${c.reset}`,
  );
  console.log();

  // Direct bumps
  if (directBumps.size > 0) {
    console.log(`  ${c.bold}Direct changes:${c.reset}`);
    const sorted = [...directBumps.entries()].sort(
      (a, b) => (BUMP_PRIORITY[b[1].type] || 0) - (BUMP_PRIORITY[a[1].type] || 0),
    );
    for (const [pkg, info] of sorted) {
      const pkgInfo = pkgs.get(pkg);
      const current = pkgInfo?.version || '?';
      const next = result.directBumps[pkg]?.newVersion || '?';
      const typeColor =
        info.type === 'major' ? c.red : info.type === 'minor' ? c.yellow : c.green;
      const typeIcon =
        info.type === 'major' ? '🔴' : info.type === 'minor' ? '🟡' : '🟢';

      console.log(
        `    ${typeIcon} ${pkg.padEnd(30)} ${c.dim}${current}${c.reset} → ${typeColor}${next}${c.reset}  ${c.dim}(${info.type})${c.reset}`,
      );
      for (const summary of info.summaries) {
        if (summary) {
          const short = summary.length > 80 ? summary.substring(0, 77) + '…' : summary;
          console.log(`       ${c.dim}${short}${c.reset}`);
        }
      }
    }
    console.log();
  }

  // Cascade bumps
  if (cascaded.size > 0) {
    console.log(`  ${c.bold}Cascade bumps ${c.dim}(patch via updateInternalDependencies)${c.reset}:`);
    const sorted = [...cascaded.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [pkg, triggeredBy] of sorted) {
      const pkgInfo = pkgs.get(pkg);
      const current = pkgInfo?.version || '?';
      const next = result.cascadeBumps[pkg]?.newVersion || '?';
      console.log(
        `    ↳ ${pkg.padEnd(30)} ${c.dim}${current}${c.reset} → ${c.cyan}${next}${c.reset}  ${c.dim}(because: ${triggeredBy.join(', ')})${c.reset}`,
      );
    }
    console.log();
  }

  // Warnings
  if (result.warnings.length > 0) {
    console.log(`  ${c.bold}${c.yellow}Warnings:${c.reset}`);
    for (const w of result.warnings) {
      console.log(`    ${w}`);
    }
    console.log();
  }

  return result;
}

// ── Section 3: Dependency Graph Analysis ────────────────────────────────────

function sectionGraph(pkgs, reverseDeps) {
  const result = {
    /** @type {Array<{name: string, version: string, directDeps: number, directConsumers: number, transitiveConsumers: number}>} */
    packages: [],
    /** @type {Array<{name: string, transitiveConsumers: number, consumers: string[]}>} */
    hubPackages: [],
  };

  // Compute stats for each package
  for (const [name, info] of pkgs) {
    const directConsumers = reverseDeps.get(name)?.size || 0;
    const transitive = transitiveConsumers(name, reverseDeps);
    result.packages.push({
      name,
      version: info.version,
      directDeps: info.deps.length,
      directConsumers,
      transitiveConsumers: transitive.size,
    });
  }

  result.packages.sort((a, b) => b.transitiveConsumers - a.transitiveConsumers);

  // Hub packages: those whose cascade affects ≥ 5 packages
  result.hubPackages = result.packages
    .filter((p) => p.transitiveConsumers >= 5)
    .map((p) => ({
      name: p.name,
      transitiveConsumers: p.transitiveConsumers,
      consumers: [...(transitiveConsumers(p.name, reverseDeps))].sort(),
    }));

  if (JSON_OUTPUT) return result;

  header('🔗 Dependency Graph Analysis');

  // Cascade potential ranking
  console.log(`  ${c.bold}Cascade potential${c.reset} ${c.dim}(packages ranked by transitive impact)${c.reset}`);
  console.log(
    `  ${'Package'.padEnd(30)} ${'Version'.padEnd(12)} ${'Direct↓'.padEnd(10)} ${'Direct↑'.padEnd(10)} ${'Cascade↑'}`,
  );
  console.log(`  ${line('─', 80)}`);

  for (const p of result.packages) {
    const cascadeColor =
      p.transitiveConsumers >= 15
        ? c.red
        : p.transitiveConsumers >= 5
          ? c.yellow
          : c.green;
    console.log(
      `  ${p.name.padEnd(30)} ${c.dim}${p.version.padEnd(12)}${c.reset} ${String(p.directDeps).padEnd(10)} ${String(p.directConsumers).padEnd(10)} ${cascadeColor}${p.transitiveConsumers}${c.reset}`,
    );
  }
  console.log();

  // Hub packages detail
  if (result.hubPackages.length > 0) {
    console.log(
      `  ${c.bold}${c.yellow}⚡ Hub packages${c.reset} ${c.dim}(a change here cascades to ≥ 5 packages)${c.reset}`,
    );
    for (const hub of result.hubPackages) {
      console.log(
        `    ${c.yellow}${hub.name}${c.reset} → cascades to ${c.bold}${hub.transitiveConsumers}${c.reset} packages`,
      );
      console.log(`      ${c.dim}${hub.consumers.join(', ')}${c.reset}`);
    }
    console.log();
  }

  // Legend
  console.log(`  ${c.dim}Legend: Direct↓ = deps this package has, Direct↑ = packages that depend on it, Cascade↑ = total transitive dependents${c.reset}`);
  console.log();

  return result;
}

// ── Section 4: Health Checks ────────────────────────────────────────────────

function sectionHealth(pkgs, reverseDeps) {
  const result = {
    /** @type {string[]} */
    warnings: [],
    /** @type {string[]} */
    info: [],
    /** @type {Array<{name: string, version: string}>} */
    preStablePackages: [],
    /** @type {Array<{peer: string, ranges: Record<string, string>}>} */
    peerMisalignment: [],
  };

  // 1. Detect 0.x packages (pre-1.0 / pre-stable)
  for (const [name, info] of pkgs) {
    const v = parseSemver(info.version);
    if (v && v.major === 0) {
      result.preStablePackages.push({ name, version: info.version });
      const consumers = reverseDeps.get(name)?.size || 0;
      if (consumers > 0) {
        result.warnings.push(
          `${name}@${info.version} is pre-1.0 and has ${consumers} direct consumer(s). ` +
            `Any "minor" bump may be breaking per semver convention.`,
        );
      }
    }
  }

  // 2. Peer dependency alignment check
  /** @type {Map<string, Map<string, string>>} peer-dep-name → Map<package-name, range> */
  const peerRanges = new Map();
  for (const [name, info] of pkgs) {
    for (const [peer, range] of Object.entries(info.peerDeps)) {
      if (!peerRanges.has(peer)) peerRanges.set(peer, new Map());
      peerRanges.get(peer).set(name, range);
    }
  }

  for (const [peer, rangeMap] of peerRanges) {
    const uniqueRanges = new Set(rangeMap.values());
    if (uniqueRanges.size > 1) {
      const detail = {};
      for (const [pkg, range] of rangeMap) {
        detail[pkg] = range;
      }
      result.peerMisalignment.push({ peer, ranges: detail });
      result.warnings.push(
        `Peer dependency "${peer}" has misaligned ranges across packages: ` +
          [...uniqueRanges].join(' vs '),
      );
    }
  }

  // 3. Detect packages with workspace:* deps pointing to non-existent packages
  for (const [name, info] of pkgs) {
    for (const dep of info.deps) {
      if (!pkgs.has(dep)) {
        result.warnings.push(
          `${name} depends on ${dep} which is not found in the workspace`,
        );
      }
    }
  }

  // 4. Consumer-side coherent update advisory
  //    When workspace:* is resolved to exact versions at publish time,
  //    partial updates in the consumer can lead to duplicate packages.
  //    Flag packages that share deep transitive deps (potential duplication risk).
  const hubPkgs = [...pkgs.entries()]
    .filter(([name]) => {
      const consumers = reverseDeps.get(name)?.size || 0;
      return consumers >= 5;
    })
    .map(([name]) => name);

  if (hubPkgs.length > 0) {
    result.info.push(
      `Hub packages (${hubPkgs.join(', ')}) are used by many packages. ` +
        `When publishing, the consumer app should update ALL packages together ` +
        `to avoid duplicate sub-dependencies (critical for Vue component libraries).`,
    );
  }

  // 5. Detect diamond dependencies (A → B → D and A → C → D)
  //    Not an error, but worth flagging — if the consumer partially updates,
  //    B and C might expect different versions of D.
  /** @type {Map<string, Set<string>>} package → set of packages it shares a dep with */
  const diamondWarnings = new Set();
  for (const [name, info] of pkgs) {
    if (info.deps.length < 2) continue;
    // Check if multiple deps of this package share a common deep dep
    const depTransitives = new Map();
    for (const dep of info.deps) {
      if (!pkgs.has(dep)) continue;
      const pkgDeps = pkgs.get(dep).deps;
      for (const transitive of pkgDeps) {
        if (!depTransitives.has(transitive)) depTransitives.set(transitive, []);
        depTransitives.get(transitive).push(dep);
      }
    }
    for (const [shared, owners] of depTransitives) {
      if (owners.length >= 2) {
        const key = `${name} → {${owners.sort().join(', ')}} → ${shared}`;
        diamondWarnings.add(key);
      }
    }
  }

  if (diamondWarnings.size > 0) {
    result.info.push(
      `${diamondWarnings.size} diamond dependency pattern(s) detected. ` +
        `This is normal in a monorepo, but the consumer must update all ` +
        `packages together to avoid version conflicts.`,
    );
  }

  if (JSON_OUTPUT) return result;

  header('🏥 Health Checks');

  // Pre-stable packages
  if (result.preStablePackages.length > 0) {
    console.log(`  ${c.bold}Pre-1.0 packages (0.x)${c.reset} ${c.dim}— API not yet considered stable${c.reset}`);
    for (const p of result.preStablePackages) {
      const consumers = reverseDeps.get(p.name)?.size || 0;
      const colour = consumers > 3 ? c.yellow : c.dim;
      console.log(
        `    ${colour}${p.name.padEnd(30)} ${p.version.padEnd(12)} ${consumers} consumer(s)${c.reset}`,
      );
    }
    console.log();
  }

  // Peer misalignment
  if (result.peerMisalignment.length > 0) {
    console.log(`  ${c.bold}${c.yellow}Peer dependency misalignment${c.reset}`);
    for (const { peer, ranges } of result.peerMisalignment) {
      console.log(`    ${c.yellow}${peer}${c.reset}:`);
      for (const [pkg, range] of Object.entries(ranges)) {
        console.log(`      ${pkg.padEnd(30)} ${c.dim}${range}${c.reset}`);
      }
    }
    console.log();
  }

  // Warnings
  if (result.warnings.length > 0) {
    console.log(`  ${c.bold}${c.yellow}Warnings:${c.reset}`);
    for (const w of result.warnings) {
      console.log(`    ⚠ ${w}`);
    }
    console.log();
  }

  // Info
  if (result.info.length > 0) {
    console.log(`  ${c.bold}ℹ Advisory:${c.reset}`);
    for (const i of result.info) {
      console.log(`    ${c.cyan}${i}${c.reset}`);
    }
    console.log();
  }

  if (result.warnings.length === 0 && result.peerMisalignment.length === 0) {
    console.log(`  ${c.green}✅ No issues detected.${c.reset}`);
    console.log();
  }

  return result;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const pkgs = await discoverPackages();
  const reverseDeps = buildReverseDeps(pkgs);

  const report = {};

  if (SHOW_ALL || SECTION_UNPUBLISHED) {
    report.unpublished = await sectionUnpublished(pkgs);
  }

  if (SHOW_ALL || SECTION_PENDING) {
    report.pending = await sectionPending(pkgs, reverseDeps);
  }

  if (SHOW_ALL || SECTION_GRAPH) {
    report.graph = sectionGraph(pkgs, reverseDeps);
  }

  if (SHOW_ALL || SECTION_HEALTH) {
    report.health = sectionHealth(pkgs, reverseDeps);
  }

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(report, null, 2));
  }

  // Exit code: non-zero if there are major bumps or critical warnings
  const hasMajor = Object.values(report.pending?.directBumps || {}).some(
    (b) => b.type === 'major',
  );
  if (hasMajor) {
    if (!JSON_OUTPUT) {
      console.log(
        `${c.red}${c.bold}⛔ Major version bumps detected — review carefully before releasing.${c.reset}`,
      );
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
