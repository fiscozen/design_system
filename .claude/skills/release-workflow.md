---
name: release-workflow
description: Changeset creation, release analysis with release-check.mjs, version coordination and cascade effects
---

# Release Workflow

## Adding a Changeset

After modifying any `packages/*/src/` code:

```bash
pnpm changeset
```

This creates a `.changeset/{random-name}.md` file with YAML frontmatter:

```markdown
---
"@fiscozen/button": minor
"@fiscozen/icons": patch
---

Description of the change.
```

**Bump type guidance:**
- `patch` — Bug fixes, internal refactors, no API change
- `minor` — New features, new props/events/slots (backwards compatible)
- `major` — Breaking changes (removed props, changed types, removed exports)

Pre-push hook enforces that `packages/*/src/` changes have accompanying changesets.

## Release Analysis Tool

`scripts/release-check.mjs` provides 4 analysis sections. Always run before suggesting a release.

### Unpublished Versions

```bash
pnpm release:check:unpublished
```

Compares local `package.json` versions against the npm registry. Shows packages ready to publish, sorted by bump type (major > minor > patch).

### Pending Release Preview

```bash
pnpm release:check:pending
```

Parses all `.changeset/*.md` files and simulates version bumps. Key output:
- **Direct bumps** — packages named in changesets
- **Cascade bumps** — packages that depend on bumped packages (automatic patch bumps due to `updateInternalDependencies: "patch"` in changeset config)
- **Warnings** — pre-1.0 packages with minor bumps, major bumps with high cascade count

### Dependency Graph

```bash
pnpm release:check:graph
```

Shows the internal dependency graph ranked by "cascade potential" (transitive consumer count). **Hub packages** (>= 5 transitive dependents) are flagged — changes to these cascade widely.

Key hub packages in this repo:
- `@fiscozen/style` — consumed by nearly all packages (design tokens)
- `@fiscozen/composables` — shared Vue composables
- `@fiscozen/icons` — icon system

### Health Checks

```bash
pnpm release:check:health
```

Detects:
- Pre-1.0 (0.x) packages with consumers — flag for stabilization
- Peer dependency misalignment across packages
- Missing workspace dependencies
- Diamond dependency patterns

## Publishing (CI-ONLY)

Publishing is done in CI, never locally. The workflow:

1. `pnpm changeset:version` — bumps all package.json versions based on changesets
2. `pnpm changeset:publish` — publishes to npm

Both commands are blocked by Claude Code's settings and hooks.

## Coordination Checklist

Before a release:
- [ ] `pnpm release:check` shows no unexpected cascade effects
- [ ] All hub package changes have been reviewed for downstream impact
- [ ] No pre-1.0 packages being bumped to major without stabilization plan
- [ ] Peer dependency alignment verified via health check
- [ ] All tests pass (unit + storybook)
- [ ] MDX documentation updated for any public API changes
