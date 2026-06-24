---
"@fiscozen/radio": patch
---

fix(FzRadioCard): render identically under a hostile global stylesheet

Three issues caused `FzRadioCard` to render differently when the host
application ships a global stylesheet (e.g. Bootstrap) than it did in a clean
environment:

1. **Native radio leaked.** The input was collapsed only by the Tailwind
   utilities `h-0 w-0 absolute` (specificity `(0,1,0)`); the matching
   `.fz-hidden-input` rule lived in a `<style scoped>` block in `FzRadio.vue` and
   never applied to the card. A host `input[type="radio"]` rule `(0,1,1)` then
   overrode the utilities and the native control reappeared. Fixed by adding a
   hardened, non-scoped `.fz-hidden-input` rule to the shared `fz-radio.css`
   (already imported by the card) with `!important`, so the input stays
   collapsed regardless of host CSS load order or specificity.

2. **Subtitle gained a top margin.** The subtitle carried a `mt-4` class that was
   already a no-op (overridden by `!m-0`; spacing comes from the flex `gap-4`),
   but it collided with Bootstrap's `.mt-4` utility (`margin-top: 1.5rem
   !important`), which won by load order and pushed the subtitle down. Removed
   the dead `mt-4` class.

3. **Card gained a bottom margin.** The card container is a `<label>`, and
   Bootstrap's reboot applies `label { margin-bottom: .5rem }`. Added `m-0` to
   the label (a class selector outranks the element rule) to reset it.
