# @fiscozen/style

## 0.4.0

### Minor Changes

- 1c2baef: layout page-templates extraction — Phase 0 (§6.4): add a `desktop` breakpoint token (1200px) to the design-system scale, exposed both as `breakpoints.desktop` on the shared singleton and as a Tailwind `desktop:` screen. This gives consumers a shared 1200px breakpoint so they no longer need to mutate the shared `breakpoints` singleton (`breakpoints.lg`/`breakpoints.md = '1200px'`). A companion `no-restricted-syntax` guard in `@fiscozen/eslint-config` (private) flags the idiomatic `breakpoints.<key> =` / `breakpoints['<key>'] =` assignments — a best-effort lint speed-bump for the common case, not a hard guarantee (an aliased import or `Object.assign` can still slip past it, so code review remains the backstop).

## 0.3.0

### Minor Changes

- a26bc2c: Add v-color custom directive to span tag
