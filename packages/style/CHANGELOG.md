# @fiscozen/style

## 0.5.0

### Minor Changes

- f11859d: Typography: `leading-*` and `tracking-*` utilities work on a small paragraph again. The element default was written as `p.text-sm`, which weighs (0,1,1) and beat every `leading-*` / `tracking-*` utility (0,1,0). A `<p class="text-sm leading-5">` measured 18px, not 20px — the class was there, valid, and did nothing, with no error and no missing class to notice. The rule is now `p:where(.text-sm)`, which weighs (0,0,1) like the element default it is, so a utility always wins by specificity rather than by luck of stylesheet order.

  The default itself is unchanged: a `<p class="text-sm">` — or a `<p v-small>` — still renders at 14px/18px with the same letter-spacing. What changes is who wins when a consumer asks for something else. Paragraphs that already carried a `leading-*` or `tracking-*` alongside `text-sm` now honour it; those are the only ones that move.

  Adds a named line-height scale from the `leading.*` tokens: `leading-xs` (16px) through `leading-9xl` (128px), mirroring the `text-*` keys. `leading-base` now says 20px on purpose, where `leading-5` says it only by rem coincidence. Tailwind's own `leading-4`, `leading-5`, `leading-relaxed` and friends are untouched — the scale is extended, not replaced.

  Element typography no longer evaporates outside `.global-theme`. The token custom properties are scoped to that class, and the hand-written `h1`/`h2`/`h3`/`p` rules referenced them without a fallback, so anywhere the class is missing those declarations still won the cascade and then resolved to `inherit`. Each one now carries the token value as a fallback, which makes no difference where `.global-theme` is applied and stops the silent degradation everywhere else.

  `letter-spacing` on the small paragraph is now a plain `0.07px`. It read as `var(--letter-spacing-sm, 0.07px)`, but no `letterSpacing` token exists in the design tokens, so the fallback was always the effective value; the declaration now says what it does, pending a real token.

## 0.4.0

### Minor Changes

- 1c2baef: layout page-templates extraction — Phase 0 (§6.4): add a `desktop` breakpoint token (1200px) to the design-system scale, exposed both as `breakpoints.desktop` on the shared singleton and as a Tailwind `desktop:` screen. This gives consumers a shared 1200px breakpoint so they no longer need to mutate the shared `breakpoints` singleton (`breakpoints.lg`/`breakpoints.md = '1200px'`). A companion `no-restricted-syntax` guard in `@fiscozen/eslint-config` (private) flags the idiomatic `breakpoints.<key> =` / `breakpoints['<key>'] =` assignments — a best-effort lint speed-bump for the common case, not a hard guarantee (an aliased import or `Object.assign` can still slip past it, so code review remains the backstop).

## 0.3.0

### Minor Changes

- a26bc2c: Add v-color custom directive to span tag
