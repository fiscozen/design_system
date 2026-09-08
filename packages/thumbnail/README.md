# @fiscozen/thumbnail

`FzThumbnail` — an image from a URL, cropped into a box the caller sizes.

The design system had no way to show an arbitrary image. `FzAvatar` is round and
owns its sizes; `FzRadioCard` and `FzCheckboxCard` render an illustration inside a
selectable card. This generalises that second pattern into a component of its own.

```vue
<FzThumbnail src="/receipt.jpg" alt="Scontrino di marzo" width="158px" height="108px" />
```

## The caller owns the box

`FzThumbnail` hardwires no dimension — that is the point, and it is what keeps it
from repeating `FzAvatar`'s mistake. Give it:

- `width` **and** `height`, or
- one of them plus `aspectRatio`.

With no dimension at all the box takes its container's width and the image's
*natural* aspect ratio. That is visible, not broken — but it is a size neither
you nor the design chose, and it is the one case where a load failure moves the
layout (see below). Give it a dimension.

**They are props, not classes, on purpose.** The consuming apps forbid `class`
outright at the organism, template and page layers, and `style` anywhere above an
atom, so a class-only sizing contract would make the component unusable exactly
where a page needs it. Deciding it inside the component is the only way that
capability exists for those layers — the same reasoning as `FzNavbar`'s
`elevation`. A Tailwind class still works where the layer permits one; pick one
mechanism or the other rather than both.

## Overlaying an action

The `overlay` slot sits above the image in a layer that is itself inert, with
pointer events handed back to its direct children — so the layer does not swallow
clicks meant for the thumbnail. `overlayPosition` pins the content 8px in from a
corner, again as a prop rather than a class, so a page can place an action too.

```vue
<FzThumbnail :src="attachment.url" alt="" width="100%" height="168px" scrim bordered>
  <template #overlay>
    <FzIconButton
      iconName="arrow-down-to-line"
      ariaLabel="Scarica"
      @click="download(attachment)"
    />
  </template>
</FzThumbnail>
```

Content that needs finer placement can still position itself, from a layer that
permits a class.

`scrim` lays `grey-500` at 20% over the image, so an overlaid control stays
legible on a light photo. Override the colour with `--fz-thumbnail-scrim` and the
20% with `--fz-thumbnail-scrim-opacity` — the colour goes through `var(--grey-500)`
rather than a baked `rgba()`, so retheming the token moves the scrim with every
other grey.

## A broken URL does not leave a hole in a sized box

On a load error the image is replaced by a placeholder — `placeholderIcon` on a
`grey-100` fill — that occupies the same box, and an `error` event fires with the
failing `src` so the caller can fall back to something else entirely. Changing
`src` clears the failure and retries.

**That holds as long as the box has a size of its own.** An unsized box is only
as tall as its content, and the placeholder — unlike an image — has no natural
ratio to supply one, so it collapses to the icon:

| unsized box, 600px container, 400×300 image | |
|---|---|
| image loads | 600×450 |
| image fails | 600×20 |

Which is the second reason to pass a dimension. Give the box a `height` or an
`aspectRatio` and the placeholder fills exactly the space the image did.

`error` reports a *load failure* and nothing else. An empty `src` shows the same
placeholder but fires no event — the image never mounted, so there was nothing to
fail. If you want one signal for "no image is showing", check `!src` alongside
`@error`.

Note the icon kit has no image, photo or camera glyph, so the default is `file`.

## `alt` is required

Not an optional prop that gets forgotten. Pass an explicit `alt=""` for a
decorative image, which makes that a visible decision at the call site.

The name survives a load failure. A native `<img>` whose URL 404s still exposes
its `alt` to a screen reader — the element is there, only the pixels are missing.
This component replaces the `<img>` with a placeholder div, so it re-applies the
name as `role="img"` + `aria-label` rather than letting it vanish. A decorative
`alt=""` stays silent, and so does an empty `src`: neither named anything.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `src` | `string` | — | Image URL. |
| `alt` | `string` | — | Accessible name. Required; `""` for decorative. |
| `width` | `string` | — | Any CSS length. |
| `height` | `string` | — | Any CSS length. |
| `aspectRatio` | `string` | — | e.g. `'16 / 9'`. Ignored when both dimensions are set. |
| `radius` | `'none' \| 'sm' \| 'base' \| 'lg' \| 'xl'` | `'base'` | `base` is 4px, the design's value. |
| `bordered` | `boolean` | `false` | 1px `grey-100` border. |
| `scrim` | `boolean` | `false` | Translucent overlay over the image only. |
| `overlayPosition` | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end' \| 'center'` | `'bottom-end'` | Where the `overlay` slot's content sits, 8px in. |
| `placeholderIcon` | `string` | `'file'` | Icon shown on load error. |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Native loading hint. |
| `imgProps` | `Omit<ImgHTMLAttributes, 'src' \| 'alt' \| 'loading' \| 'onError'>` | — | Extra attributes for the `<img>` (`referrerpolicy`, `crossorigin`, `decoding`, `srcset`…). A fallthrough attribute lands on the root box instead, so this is the way to reach the image. The four keys the component owns are excluded from the type, so naming one is a compile error rather than a silent no-op. |

| Event | Payload | |
|---|---|---|
| `error` | `string` | The `src` that failed to load. |

| Slot | |
|---|---|
| `overlay` | Rendered above the image and the scrim, in an inert layer. |
