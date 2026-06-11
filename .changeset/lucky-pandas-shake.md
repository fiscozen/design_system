---
"@fiscozen/input": minor
"@fiscozen/select": patch
"@fiscozen/typeahead": patch
"@fiscozen/table": patch
---

FzInput: add `type="currency"` and step controls for `type="number"`; deprecate FzCurrencyInput

- `FzInput` now supports `type="currency"`: locale-aware currency formatting, min/max clamping, step quantization and a numeric v-model (`number | null | undefined`), powered by the new internal `useCurrencyInput` composable. The component is now generic over its `type` prop, so the v-model stays `string` for every other type.
- `type="number"` inputs show the same up/down step controls in place of the native browser spinners (stepping uses the native algorithm and respects `min`/`max`/`step`).
- `type="number"` inputs now rescue pasted content the native input would reject or blank out (e.g. Italian-formatted "1.234,56" or padded spreadsheet copies): it is normalized to a plain decimal string and replaces the whole value. Natively-valid clipboard text keeps the default browser behavior (cursor-position insertion); unparseable text is ignored, keeping the previous value. No decimal truncation or min/max clamping is applied — validation semantics stay native.
- New `FzInput` props: `min`, `max`, `step`, `forceStep`, `minimumFractionDigits`, `maximumFractionDigits`, `nullOnEmpty`, `zeroOnEmpty`, `stepUpAriaLabel`, `stepDownAriaLabel`.
- `type` now also accepts the native `search` and `file` types (rendered via passthrough).
- New exported types: `FzInputType`, `FzInputModelValue`, `FzInputInstance` (use the latter instead of `InstanceType<typeof FzInput>`, which no longer applies to generic components).
- `FzCurrencyInput` is now a deprecated thin wrapper around `<FzInput type="currency">` with unchanged behavior and API; it will be removed once all consumers have migrated.
- `@fiscozen/select`, `@fiscozen/typeahead`: internal `InstanceType<typeof FzInput>` usages replaced with `FzInputInstance`.
- `@fiscozen/table`: internal `compatConfig` assignment on FzInput adapted to the generic component type.
