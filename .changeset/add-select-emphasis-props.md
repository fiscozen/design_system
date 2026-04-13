---
'@fiscozen/select': minor
'@fiscozen/input': minor
---

feat(FzSelect): add highlighted and aiReasoning visual emphasis props

Add `highlighted` and `aiReasoning` props to FzSelect, mirroring FzInput's emphasis API.
Both props reset to default on user selection or clear, emitting `update:highlighted` /
`update:aiReasoning` for v-model two-way binding.

Also adds `disableEmphasisReset` to FzInput to allow FzSelect to control the emphasis
lifecycle when using FzInput internally in filterable mode.
