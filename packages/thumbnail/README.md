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

With no dimension at all the box collapses to zero and nothing is visible.

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
legible on a light photo. Override it with `--fz-thumbnail-scrim`.

## A broken URL does not leave a hole

On a load error the image is replaced by a placeholder — `placeholderIcon` on a
`grey-100` fill — that occupies the same box, and an `error` event fires with the
failing `src` so the caller can fall back to something else entirely. Changing
`src` clears the failure and retries.

Note the icon kit has no image, photo or camera glyph, so the default is `file`.

## `alt` is required

Not an optional prop that gets forgotten. Pass an explicit `alt=""` for a
decorative image, which makes that a visible decision at the call site.

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

| Event | Payload | |
|---|---|---|
| `error` | `string` | The `src` that failed to load. |

| Slot | |
|---|---|
| `overlay` | Rendered above the image and the scrim, in an inert layer. |
