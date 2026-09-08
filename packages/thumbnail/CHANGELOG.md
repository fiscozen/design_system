# @fiscozen/thumbnail

## 0.2.0

### Minor Changes

- 976684e: `FzThumbnail` — a new package, and the first way the design system can show an
  arbitrary image (LIB-2918).

  `<img>` is in `forbiddenTags` at every atomic-design layer, and until now there
  was nothing to compose in its place: the only three components that render one are
  `FzAvatar` — round, with hardwired sizes, built for people — and
  `FzRadioCard` / `FzCheckboxCard`, where the image is an illustration inside a
  selectable card. So any surface that had to show a user-uploaded image had neither
  a component nor a legal fallback. In the frontoffice customer chat that is a
  divergence already in production: image attachments render as file cards,
  indistinguishable from a document, and not even distinguishable iconographically
  because the icon kit has no image, photo or camera glyph. `FzThumbnail` extracts
  and generalises the card pattern (`imageUrl` + `imageAlt` + `object-cover`) rather
  than inventing anything.
  - **The caller imposes the dimensions**, so this does not repeat `FzAvatar`'s
    mistake of owning a size — but they are **props** (`width`, `height`,
    `aspectRatio`), not a class. The consuming apps forbid `class` outright at the
    organism, template and page layers and `style` above an atom, so a class-only
    sizing contract would make the component unusable exactly where a page needs it.
    Deciding it inside the component is the only way that capability exists for
    those layers — the same reasoning as `FzNavbar`'s `elevation`. A class from a
    layer that permits one still works. Left unsized, the box takes its container's
    width at the image's natural aspect ratio — visible, but a size nobody chose,
    and the one case where a load failure moves the layout.
  - **`alt` is required by the type**, with an explicit `alt=""` for decorative
    images: a decision visible at the call site rather than an optional prop that
    gets forgotten. A missing `alt` makes a screen reader announce the URL. The name
    also survives a load failure: a native `<img>` whose URL 404s still exposes its
    `alt` to assistive tech, so replacing the element with a placeholder re-applies
    the name as `role="img"` + `aria-label` rather than dropping it — otherwise a
    screen-reader user ends up worse off than a sighted one, who at least sees the
    placeholder icon. A decorative `alt=""` and an empty `src` stay silent; neither
    ever named anything.
  - **An `overlay` slot** for an action — the chat's download button, the composer's
    remove control. The layer is inert and hands pointer events back to its direct
    children, so it does not swallow clicks meant for the thumbnail, and
    `overlayPosition` pins the content to a corner without the call site writing a
    class either.
  - **A load error does not leave a hole in a sized box.** The placeholder —
    `placeholderIcon` on a `grey-100` fill, `file` by default since the kit has no
    image glyph — occupies the same box (an unsized box is only as tall as its
    content, and a placeholder has no intrinsic ratio to supply that height with, so
    there it collapses to the icon), and an `error` event carries the failing `src`
    so a caller can fall back to something else. A new `src` clears the failure and
    retries. `error`
    reports a load failure and only that: an empty `src` shows the same placeholder
    without firing anything, because the `<img>` never mounted, so a caller wanting
    one "nothing is showing" signal checks `!src` alongside `@error`.
  - **An optional scrim** (`grey-500` at 20%, overriding the design's
    `rgba(74, 85, 101, 0.2)` onto the DS palette), drawn over the image only, so an
    overlaid control stays legible on a light photo. Override the colour with
    `--fz-thumbnail-scrim` and the 20% with `--fz-thumbnail-scrim-opacity`.
  - **`imgProps` reaches the `<img>` itself** — `referrerpolicy`, `crossorigin`,
    `decoding`, `fetchpriority`, `srcset`, `sizes`. The component has a single root
    element, so a fallthrough attribute lands on the wrapping box, where
    `referrerpolicy` does nothing; without this prop the image is simply out of
    reach. Keeping `class` and listeners on the box is what a caller sizing or
    clicking a thumbnail wants, so the two go to different places on purpose.
    `src`, `alt`, `loading` and `onError` remain the component's own contract and are
    `Omit`ted from the prop's type, so naming one is a compile error rather than a
    silent no-op — `onError` in particular could not simply be documented as losing,
    since Vue's `mergeProps` chains listeners instead of replacing them.
    Use `:imgProps="{ referrerpolicy: 'no-referrer' }"` for a third-party host.
  - `radius` defaults to `base` — 4px, the designs' value — and `loading` to `lazy`.

  The scrim is declared in this package's stylesheet rather than as
  `bg-grey-500/20`, and that is not a style preference: the design system's colours
  resolve to `var(--grey-500, …)`, Tailwind cannot decompose a `var()` into
  channels, and an opacity modifier on a token colour therefore generates **no rule
  at all**. Verified against the DS preset with the Tailwind CLI. The 20% is an
  `opacity` declaration rather than a baked `rgba()` for the same kind of reason: an
  `rgba()` would freeze `--grey-500`'s fallback, leaving a retheming consumer with
  the scrim as the one grey that did not move.

  Unblocks LIB-2912 (`FzpChatAttachmentCard`), whose README documents the file-card
  fallback as temporary; nothing else about that component has to change.
