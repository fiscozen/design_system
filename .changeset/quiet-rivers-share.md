---
"@fiscozen/input": patch
---

FzInput: remove the `any` from `useInputStyle`'s props parameter. The composable only reads visual-state props (`variant`, `disabled`, `readonly`, `error`, `highlighted`, `aiReasoning`), none of which depend on the input `type`, so it now takes a `Pick`ed `ToRefs<FzInputStyleProps>` instead of `ToRefs<FzInputProps<any>>`. Type-level cleanup only — no API or runtime change.
