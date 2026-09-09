---
"@fiscozen/layout": patch
---

`layouts.json` declares a `$schema` that resolves, and the manifest is now validated
against it (LIB-3025).

The manifest pointed `$schema` at
`raw.githubusercontent.com/fiscozen/claude-plugin-agentic-design/main/docs/ds-layouts.schema.json`.
That repo is private, so the URL answers **404**: a file in a public package carried a
pointer no reader and no editor could follow.

Worse, nothing honoured the declaration. `layouts.manifest.spec.ts` never resolved or
validated the schema — it only cited it in a failure message, and its shape assertions
were written by hand. The contract was a claim with no check behind it, and a reader had
no way to tell it from a live one.

- **The contract is vendored** at `packages/layout/ds-layouts.schema.json`, and `$schema`
  points at it relatively. A sibling file resolves offline, resolves inside the sparse
  clone consumers read the manifest from, and always resolves to the same revision as the
  manifest beside it — three things a URL tracking `main` does not do.
- **The spec validates the manifest against it** with ajv, replacing the hand-written
  shape assertions. Because the schema closes `additionalProperties`, a misspelled or
  invented field now fails the test naming the field — the case the hand-written
  assertions could not see. The rules stricter than the contract (`whenToUse` long enough
  to decide from, `since` semver, gaps listed whenever `composeOnly.safe` is false, a
  `nestWithin` host that is a shell in this manifest) stay as explicit assertions.
- **The copy is checked, not trusted.** The agentic-design plugin owns the contract — it
  is the engine that reads the manifest and decides what conformance means, for any design
  system, so ownership stays there. The spec compares the vendored copy byte for byte
  against the installed plugin's copy, which is why the copy is verbatim down to its `$id`
  (an identifier, which JSON Schema does not require to be fetchable). With no plugin
  installed the check reports on stderr that it did not run, rather than passing quietly.

No layout entry changed, and consumers pinned to a manifest declaring the old `$schema`
keep working: the engine never reads that field.
