---
'@fiscozen/navbar': patch
---

Fix v0.2.0 CSS-variable defaults to match `@fiscozen/style` pixel spacing tokens (p-12 = 12px, h-56/w-56 = 56px, mr-32/mb-32 = 32px, gap-16 = 16px). The previous rem-based fallbacks (3rem/14rem/8rem/4rem) targeted stock Tailwind's scale, which made the navbar render ~4× larger than intended on consumers without explicit overrides — a visual regression vs. v0.1.x where the package emitted no competing CSS rules and the consumer's pixel-aligned Tailwind classes took effect directly. The variables themselves are unchanged; consumers that already set them via inline style or scoped CSS are unaffected.
