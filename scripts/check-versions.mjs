#!/usr/bin/env node

/**
 * Audit @fiscozen/* inter-package dependency freshness.
 *
 * For every package in packages/, compares each pinned @fiscozen/* dependency
 * version against the latest published version on npm.  Outputs a report
 * sorted by "drift" — the further a dependency is from latest, the higher
 * it appears.
 *
 * Drift is scored as:
 *   +100  major version behind
 *    +10  minor version behind
 *     +1  patch version behind
 *    +50  prerelease pinned while a stable latest exists
 *   +200  workspace:* that could not be resolved to a local version
 *
 * Note: workspace:* / workspace:^ dependencies are resolved to the current
 * version of the referenced package in the local source tree before comparison.
 *
 * Usage:
 *   node scripts/check-versions.mjs [--json]
 *
 * Options:
 *   --json   Output raw JSON instead of the human-readable table
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PACKAGES_DIR = join(import.meta.dirname, '..', 'packages');
const JSON_OUTPUT = process.argv.includes('--json');

// Tooling packages — not audited
const TOOLING_PACKAGES = new Set([
  '@fiscozen/eslint-config',
  '@fiscozen/prettier-config',
  '@fiscozen/tsconfig',
]);

// ── helpers ──────────────────────────────────────────────────────────────────

function isFiscozenPackage(name) {
  return name.startsWith('@fiscozen/');
}

/**
 * Fetch the latest published version (dist-tag "latest") from npm.
 */
async function fetchLatestVersion(packageName) {
  const url = `https://registry.npmjs.org/${packageName}/latest`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.version;
  } catch {
    return null;
  }
}

/**
 * Minimal semver parser.  Returns { major, minor, patch, prerelease } or null.
 * Handles versions like "1.2.3", "1.2.3-next.0", "1.0.0-alpha.1".
 */
function parseSemver(version) {
  if (!version || version.startsWith('workspace:')) return null;
  const clean = version.replace(/^[\^~>=<\s]+/, '');
  const m = clean.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] || null,
  };
}

/**
 * Compute a numeric "drift score" between a pinned version and the latest.
 * Higher = more outdated.  Returns 0 if up-to-date.
 */
function driftScore(pinned, latest) {
  if (!pinned || pinned.startsWith('workspace:')) return 200;

  const p = parseSemver(pinned);
  const l = parseSemver(latest);
  if (!p || !l) return 0;

  let score = 0;

  // Major / minor / patch deltas
  const dMajor = l.major - p.major;
  const dMinor = l.minor - p.minor;
  const dPatch = l.patch - p.patch;

  if (dMajor > 0) {
    score += dMajor * 100;
    // when major jumps, minor/patch deltas are always "behind"
    score += (l.minor) * 10;
    score += l.patch;
  } else if (dMajor === 0) {
    if (dMinor > 0) {
      score += dMinor * 10;
      score += l.patch;
    } else if (dMinor === 0) {
      if (dPatch > 0) score += dPatch;
    }
  }
  // negative deltas = pinned is *ahead* of latest (e.g. next tag) — score stays 0

  // Prerelease penalty: pinned is a prerelease but latest is stable
  if (p.prerelease && !l.prerelease) {
    score += 50;
  }

  return Math.max(score, 0);
}

/**
 * Human-readable drift label.
 */
function driftLabel(score) {
  if (score >= 200) return '⛔ workspace:^';
  if (score >= 100) return '🔴 major';
  if (score >= 50) return '🟠 prerelease';
  if (score >= 10) return '🟡 minor';
  if (score >= 1) return '🟢 patch';
  return '✅ up-to-date';
}

// ANSI colours (disabled when piping / --json)
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
};

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Discover packages
  const entries = await readdir(PACKAGES_DIR, { withFileTypes: true });
  const packageDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  // 2. Fetch latest npm versions in parallel
  if (!JSON_OUTPUT) process.stderr.write('Fetching latest npm versions…\n');

  /** @type {Record<string, string>} */
  const latestVersions = {};

  /** @type {Record<string, any>} local package.json cache */
  const localPackages = {};

  await Promise.all(
    packageDirs.map(async (dir) => {
      const pkgJsonPath = join(PACKAGES_DIR, dir, 'package.json');
      try {
        const raw = await readFile(pkgJsonPath, 'utf-8');
        const pkg = JSON.parse(raw);
        localPackages[dir] = pkg;
        const latest = await fetchLatestVersion(pkg.name);
        if (latest) latestVersions[pkg.name] = latest;
      } catch {
        /* skip */
      }
    })
  );

  // 3. Build a name → local version map so workspace:* deps can be resolved
  /** @type {Record<string, string>} */
  const localVersions = {};
  for (const dir of packageDirs) {
    const pkg = localPackages[dir];
    if (pkg?.name && pkg?.version) {
      localVersions[pkg.name] = pkg.version;
    }
  }

  // 4. Collect mismatches
  /** @type {Array<{consumer: string, dep: string, pinned: string, latest: string, score: number}>} */
  const mismatches = [];
  let totalDeps = 0;
  let upToDate = 0;

  for (const dir of packageDirs) {
    const pkg = localPackages[dir];
    if (!pkg) continue;

    const deps = pkg.dependencies || {};
    for (const [name, rawVersion] of Object.entries(deps)) {
      if (!isFiscozenPackage(name) || TOOLING_PACKAGES.has(name)) continue;

      totalDeps++;

      // Resolve workspace protocol to the actual local version
      let version = rawVersion;
      if (rawVersion.startsWith('workspace:')) {
        const localVer = localVersions[name];
        if (localVer) {
          version = localVer;
        }
        // If the local version can't be found, fall through with the
        // original string so it still shows up as a warning.
      }

      const latest = latestVersions[name];
      if (!latest) {
        mismatches.push({
          consumer: pkg.name,
          dep: name,
          pinned: rawVersion,
          latest: '(not on npm)',
          score: 0,
        });
        continue;
      }

      const score = driftScore(version, latest);
      const displayPinned = version !== rawVersion ? `${rawVersion} → ${version}` : rawVersion;
      if (score > 0) {
        mismatches.push({
          consumer: pkg.name,
          dep: name,
          pinned: displayPinned,
          latest,
          score,
        });
      } else {
        upToDate++;
      }
    }
  }

  // Sort: highest drift first, then by consumer name for stability
  mismatches.sort((a, b) => b.score - a.score || a.consumer.localeCompare(b.consumer));

  // 5. Output
  if (JSON_OUTPUT) {
    console.log(JSON.stringify({ totalDeps, upToDate, mismatches }, null, 2));
    return;
  }

  // ── Summary ──
  console.log();
  console.log(
    `${c.bold}Dependency freshness audit${c.reset}  —  ` +
      `${totalDeps} @fiscozen/* deps across ${Object.keys(localPackages).length} packages`
  );
  console.log(
    `  ${c.green}✅ ${upToDate} up-to-date${c.reset}   ` +
      `${c.yellow}⚠  ${mismatches.length} outdated${c.reset}`
  );
  console.log();

  if (mismatches.length === 0) {
    console.log(`${c.green}All @fiscozen/* dependencies are up-to-date!${c.reset}`);
    return;
  }

  // ── Per-dependency aggregate: which dep is most commonly outdated ──
  /** @type {Record<string, {count: number, maxScore: number, totalScore: number}>} */
  const depStats = {};
  for (const m of mismatches) {
    if (!depStats[m.dep]) depStats[m.dep] = { count: 0, maxScore: 0, totalScore: 0 };
    depStats[m.dep].count++;
    depStats[m.dep].maxScore = Math.max(depStats[m.dep].maxScore, m.score);
    depStats[m.dep].totalScore += m.score;
  }

  const depRanking = Object.entries(depStats)
    .sort(([, a], [, b]) => b.totalScore - a.totalScore)
    .map(([dep, stats]) => ({
      dep,
      latest: latestVersions[dep] || '?',
      ...stats,
    }));

  console.log(`${c.bold}Most outdated dependencies (aggregate)${c.reset}`);
  console.log(`${'─'.repeat(80)}`);
  console.log(
    `  ${'Dependency'.padEnd(30)} ${'Latest'.padEnd(18)} ${'Consumers'.padEnd(10)} ${'Total drift'}`
  );
  console.log(`${'─'.repeat(80)}`);
  for (const r of depRanking) {
    const colour = r.maxScore >= 100 ? c.red : r.maxScore >= 10 ? c.yellow : c.green;
    console.log(
      `  ${colour}${r.dep.padEnd(30)}${c.reset} ${r.latest.padEnd(18)} ${String(r.count).padEnd(10)} ${r.totalScore}`
    );
  }

  // ── Detailed table sorted by drift ──
  console.log();
  console.log(`${c.bold}Detailed mismatches (sorted by drift)${c.reset}`);
  console.log(`${'─'.repeat(100)}`);
  console.log(
    `  ${'Consumer'.padEnd(28)} ${'Dependency'.padEnd(28)} ${'Pinned'.padEnd(18)} ${'Latest'.padEnd(18)} ${'Drift'}`
  );
  console.log(`${'─'.repeat(100)}`);

  for (const m of mismatches) {
    const label = driftLabel(m.score);
    const colour =
      m.score >= 200
        ? c.red
        : m.score >= 100
          ? c.red
          : m.score >= 50
            ? c.magenta
            : m.score >= 10
              ? c.yellow
              : c.green;

    console.log(
      `  ${m.consumer.padEnd(28)} ${colour}${m.dep.padEnd(28)}${c.reset} ` +
        `${c.dim}${m.pinned.padEnd(18)}${c.reset} ${m.latest.padEnd(18)} ${label} ${c.dim}(${m.score})${c.reset}`
    );
  }

  console.log(`${'─'.repeat(100)}`);
  console.log();

  // ── Exit code: non-zero if critical drift exists ──
  const maxScore = mismatches.reduce((max, m) => Math.max(max, m.score), 0);
  if (maxScore >= 100) {
    console.log(
      `${c.red}${c.bold}⛔ Critical drift detected (score ≥ 100). ` +
        `Consider running: node scripts/pin-versions.mjs${c.reset}`
    );
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
