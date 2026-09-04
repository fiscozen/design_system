# @fiscozen/avatar

## 1.0.2

### Patch Changes

- 92c1d3a: Paragraph line-heights no longer need `!important`. The card title and subtitle (`FzRadioCard`, `FzCheckboxCard`), the avatar title and subtitle, and the alert description all set their line-height with `!leading-[…]`. On the four that carry `text-sm`, that `!` was a workaround for `@fiscozen/style`'s `p.text-sm` default, which weighed (0,1,1) and beat any plain `leading-*` utility; now that the default is `p:where(.text-sm)` at (0,0,1), the utility wins on its own. The other four never needed it — they sit on paragraphs without `text-sm`, where only the element default competed and a plain utility already won — and were cargo-culted alongside.

  Rendered line-heights are unchanged: 20px on the titles and the alert description, 16px on the subtitles, measured on every one of the eight sites before and after. What changes is that a consumer can now override them — `!important` previously made these line-heights unreachable from the outside.

  These packages don't declare `@fiscozen/style` as a dependency; the consuming app supplies the stylesheet. Upgrading them without also upgrading `@fiscozen/style` to the release that carries the `p:where(.text-sm)` fix will render the `text-sm` subtitles at 18px instead of 16px.

## 1.0.1

### Patch Changes

- 41a084c: Prevent shrining of avatar image
