import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { FzThumbnail } from '@fiscozen/thumbnail'
import { FzIconButton } from '@fiscozen/button'
import { FzContainer } from '@fiscozen/container'

/**
 * `FzThumbnail` shows an image from a URL cropped into a box **the caller sizes**.
 * It hardwires no dimension — that is what keeps it from repeating `FzAvatar`'s
 * mistake — but it takes the dimensions as *props*, because the consuming apps
 * forbid `class` at the organism, template and page layers.
 */
const meta = {
  title: 'Media/FzThumbnail',
  component: FzThumbnail,
  tags: ['autodocs'],
  parameters: {
    // `preview.ts` sets `layout: 'fullscreen'` globally, which leaves the canvas
    // with no padding at all — a thumbnail then sits at 0,0 against two edges
    // and reads as clipped. Other stories work around it with a `p-32` wrapper
    // in the template, but a DS story is meant to be class-free, and this is the
    // parameter that exists for it.
    layout: 'padded'
  },
  argTypes: {
    radius: {
      control: 'select',
      options: ['none', 'sm', 'base', 'lg', 'xl'],
      description: '`base` is 4px, the value the designs use for an image in a feed'
    },
    overlayPosition: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end', 'center'],
      description: "Where the `overlay` slot's content sits, 8px in from the corner"
    },
    loading: { control: 'inline-radio', options: ['lazy', 'eager'] },
    scrim: {
      control: 'boolean',
      description: 'Keeps an overlaid action legible on a light photo'
    },
    bordered: { control: 'boolean' },
    width: { control: 'text', description: 'Any CSS length' },
    height: { control: 'text', description: 'Any CSS length' },
    aspectRatio: { control: 'text', description: "e.g. '16 / 9'" }
  },
  args: {
    src: 'consultant.jpg',
    alt: 'Mario Rossi, commercialista',
    width: '158px',
    height: '108px'
  }
} satisfies Meta<typeof FzThumbnail>
export default meta

type ThumbnailStory = StoryObj<typeof meta>

// Data URIs rather than fixture files: the point of the cropping story is the
// image's aspect ratio, and four SVGs express that without adding binaries to
// the repo. Write the payload with plain `#` and let `encodeURIComponent` escape
// it — pre-escaping it to `%23` here would get the `%` escaped in turn, and
// `url(%2523g)` resolves to nothing, so the rect would render with no fill at
// all. A perfectly valid, perfectly invisible SVG.
const svg = (w: number, h: number, from: string, to: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`
  )

const LIGHT = svg(400, 300, '#fffbf4', '#ffe7bd')
const DARK = svg(400, 300, '#1b214c', '#364299')
const WIDE = svg(1200, 200, '#eff1ff', '#5a6eff')
const TALL = svg(200, 1200, '#fff2ef', '#ff785a')

export const Default: ThumbnailStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const img = canvas.getByAltText('Mario Rossi, commercialista')
    await expect(img).toBeInTheDocument()
    await expect(img.getAttribute('src')).toBe('consultant.jpg')
    // Cropped, not squashed — the whole reason the box is the caller's.
    await expect(img).toHaveClass('object-cover')
    await expect(img.getAttribute('loading')).toBe('lazy')
  }
}

/**
 * A decorative image takes an explicit `alt=""`. The prop is required, so this is
 * a decision the call site had to make rather than one it forgot.
 */
export const Decorative: ThumbnailStory = {
  args: { alt: '' },
  play: async ({ canvasElement }) => {
    const img = canvasElement.querySelector('img')
    await expect(img).toBeInTheDocument()
    // Present and empty. A *missing* alt makes a screen reader read the URL out.
    await expect(img?.hasAttribute('alt')).toBe(true)
    await expect(img?.getAttribute('alt')).toBe('')
  }
}

/**
 * The image attachment as it appears in the customer chat feed: filling the
 * attachment column, a scrim so the control stays legible on a light photo, and
 * the download button pinned bottom-right — placed by `overlayPosition`, with no
 * class at the call site.
 */
export const WithDownloadAction: ThumbnailStory = {
  argTypes: { onDownload: { table: { disable: true } } },
  args: {
    src: LIGHT,
    alt: '',
    width: '100%',
    height: '168px',
    scrim: true,
    bordered: true,
    onDownload: fn()
  } as ThumbnailStory['args'],
  render: (args) => ({
    components: { FzThumbnail, FzIconButton },
    // Split the story's own spy out of the args before binding: `onDownload` is not
    // a component prop, so riding the `v-bind` it would land on the root box as a
    // DOM listener and show up in the autodocs table as if it were part of the API.
    setup: () => {
      const { onDownload, ...props } = args as Record<string, unknown>
      return { props, onDownload }
    },
    template: `
      <FzThumbnail v-bind="props">
        <template #overlay>
          <FzIconButton
            iconName="arrow-down-to-line"
            variant="secondary"
            ariaLabel="Scarica allegato"
            @click="onDownload"
          />
        </template>
      </FzThumbnail>`
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button', { name: 'Scarica allegato' })
    await expect(button).toBeVisible()

    await userEvent.click(button)
    await expect((args as Record<string, ReturnType<typeof fn>>).onDownload).toHaveBeenCalled()

    // The overlay layer covers the whole image, so it must not swallow clicks
    // that were meant for the thumbnail itself.
    const overlay = canvasElement.querySelector('[data-testid="fz-thumbnail-overlay"]')
    await expect(overlay).toBeInTheDocument()
    await expect(getComputedStyle(overlay as Element).pointerEvents).toBe('none')
    await expect(getComputedStyle(button).pointerEvents).not.toBe('none')

    // And the scrim really is translucent: `bg-grey-500/20` would have generated
    // no rule at all, because the DS colours resolve to `var(--grey-500, …)`.
    // Colour and opacity are separate declarations so that the colour can stay a
    // `var(--grey-500)` a consumer can retheme, rather than a frozen `rgba()`.
    const scrim = canvasElement.querySelector('[data-testid="fz-thumbnail-scrim"]')
    const scrimStyle = getComputedStyle(scrim as Element)
    await expect(scrimStyle.backgroundColor).toBe('rgb(89, 97, 103)')
    await expect(scrimStyle.opacity).toBe('0.2')
  }
}

/** `top-end` is the composer's remove control, on the pre-send preview. */
export const RemoveAction: ThumbnailStory = {
  argTypes: { onRemove: { table: { disable: true } } },
  args: {
    src: DARK,
    alt: '',
    width: '180px',
    height: '180px',
    overlayPosition: 'top-end',
    onRemove: fn()
  } as ThumbnailStory['args'],
  render: (args) => ({
    components: { FzThumbnail, FzIconButton },
    // Split the story's own spy out of the args before binding: `onRemove` is not
    // a component prop, so riding the `v-bind` it would land on the root box as a
    // DOM listener and show up in the autodocs table as if it were part of the API.
    setup: () => {
      const { onRemove, ...props } = args as Record<string, unknown>
      return { props, onRemove }
    },
    template: `
      <FzThumbnail v-bind="props">
        <template #overlay>
          <FzIconButton
            iconName="xmark"
            variant="secondary"
            ariaLabel="Rimuovi allegato"
            @click="onRemove"
          />
        </template>
      </FzThumbnail>`
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Rimuovi allegato' })
    await userEvent.click(button)
    await expect((args as Record<string, ReturnType<typeof fn>>).onRemove).toHaveBeenCalled()

    const overlay = canvasElement.querySelector('[data-testid="fz-thumbnail-overlay"]')
    await expect(overlay).toHaveClass('items-start')
    await expect(overlay).toHaveClass('justify-end')
  }
}

/**
 * A broken URL must not leave a hole in the layout: the placeholder occupies the
 * same box, and `error` fires so the caller can fall back to something else.
 */
export const LoadError: ThumbnailStory = {
  args: {
    src: 'does-not-exist.jpg',
    alt: 'Allegato non disponibile',
    width: '158px',
    height: '108px',
    onError: fn()
  } as ThumbnailStory['args'],
  play: async ({ args, canvasElement }) => {
    const placeholder = () =>
      canvasElement.querySelector('[data-testid="fz-thumbnail-placeholder"]')

    await waitFor(() => expect(placeholder()).toBeInTheDocument())
    await expect(canvasElement.querySelector('img')).toBeNull()
    await expect((args as Record<string, ReturnType<typeof fn>>).onError).toHaveBeenCalledWith(
      'does-not-exist.jpg'
    )

    // The box the caller asked for is still exactly that box.
    const root = canvasElement.querySelector('.fz-thumbnail') as HTMLElement
    const { width, height } = root.getBoundingClientRect()
    await expect(Math.round(width)).toBe(158)
    await expect(Math.round(height)).toBe(108)

    // A sighted user sees the placeholder icon and knows something is missing.
    // The screen-reader user has to be told the same thing: the name the caller
    // gave the image outlives the image itself.
    await expect(placeholder()).toHaveAttribute('role', 'img')
    await expect(placeholder()).toHaveAttribute('aria-label', 'Allegato non disponibile')
    await expect(within(canvasElement).getByRole('img')).toBeInTheDocument()
  }
}

/**
 * The same failure for a *decorative* image. `alt=""` was the caller saying the
 * image carries no information, and it failing does not turn it into something
 * worth announcing — so the placeholder stays out of the accessibility tree.
 */
export const DecorativeLoadError: ThumbnailStory = {
  args: {
    src: 'does-not-exist.jpg',
    alt: '',
    width: '158px',
    height: '108px'
  },
  play: async ({ canvasElement }) => {
    const placeholder = () =>
      canvasElement.querySelector('[data-testid="fz-thumbnail-placeholder"]')

    await waitFor(() => expect(placeholder()).toBeInTheDocument())
    await expect(placeholder()).not.toHaveAttribute('role')
    await expect(placeholder()).not.toHaveAttribute('aria-label')
    await expect(within(canvasElement).queryByRole('img')).toBeNull()
  }
}

/**
 * **What an unsized box actually does** — the case worth knowing before you leave
 * the dimensions off. The image is *not* invisible: `height: 100%` against an
 * auto-height parent is an indefinite percentage, so it resolves to `auto` and the
 * box takes the container's width at the image's natural aspect ratio.
 *
 * The catch is the failure case below it. The placeholder has no natural ratio to
 * fill an auto height with, so it collapses to its icon where the image did not —
 * the one place the "a broken URL leaves no hole" guarantee needs the caller to
 * have sized the box. Both are measured rather than described.
 */
export const Unsized: ThumbnailStory = {
  render: () => ({
    components: { FzThumbnail, FzContainer },
    setup: () => ({ src: LIGHT }),
    // No `width`, no `height`, no `aspectRatio` — and no class either, so the
    // measurements below come from the component's own defaults.
    template: `
      <FzContainer>
        <FzThumbnail :src="src" alt="Anteprima non dimensionata" loading="eager" />
        <FzThumbnail src="does-not-exist.jpg" alt="Allegato non disponibile" />
      </FzContainer>`
  }),
  play: async ({ canvasElement }) => {
    const boxes = () => canvasElement.querySelectorAll<HTMLElement>('.fz-thumbnail')
    await waitFor(() => expect(boxes()).toHaveLength(2))

    const [loaded, failed] = Array.from(boxes())

    // Neither box declares a dimension, so both are as wide as their container.
    // Asserting against the parent rather than a number keeps the story free of
    // a fixed width — which would be a class, which a DS story does not write.
    const available = (box: HTMLElement) => (box.parentElement as HTMLElement).clientWidth

    // 1. It loads: full container width, natural 400×300 ratio, fully visible.
    const img = canvasElement.querySelector('img') as HTMLImageElement
    await waitFor(() => expect(img.complete && img.naturalWidth > 0).toBe(true))

    const loadedRect = loaded.getBoundingClientRect()
    await expect(Math.round(loadedRect.width)).toBe(available(loaded))
    await expect(Math.round(loadedRect.height)).toBe(Math.round(loadedRect.width * (300 / 400)))
    await expect(loadedRect.height).toBeGreaterThan(0)

    // 2. It fails: same width, and a height that is now only the icon's. This is
    // the asymmetry — locked in so that giving the placeholder a size of its own
    // has to be a deliberate change to both this story and the unit test.
    await waitFor(() =>
      expect(failed.querySelector('[data-testid="fz-thumbnail-placeholder"]')).toBeInTheDocument()
    )
    const failedRect = failed.getBoundingClientRect()
    await expect(Math.round(failedRect.width)).toBe(available(failed))
    await expect(failedRect.height).toBeLessThan(loadedRect.height)
  }
}

/**
 * `imgProps` reaches the `<img>` itself. The component has a single root element,
 * so an attribute written on the call site would land on the wrapping box, where
 * `referrerpolicy` does nothing — this is the way past that. Use it to keep a
 * third-party image host from seeing where the request came from.
 */
export const ImageAttributes: ThumbnailStory = {
  args: {
    imgProps: { referrerpolicy: 'no-referrer', decoding: 'async' }
  } as ThumbnailStory['args'],
  play: async ({ canvasElement }) => {
    const img = () => canvasElement.querySelector('img')
    await waitFor(() => expect(img()).toBeInTheDocument())

    await expect(img()).toHaveAttribute('referrerpolicy', 'no-referrer')
    await expect(img()).toHaveAttribute('decoding', 'async')

    // On the image, not on the box — which is the whole reason the prop exists.
    const root = canvasElement.querySelector('.fz-thumbnail') as HTMLElement
    await expect(root).not.toHaveAttribute('referrerpolicy')
  }
}

/**
 * The cropping behaviour, which is the part a reviewer has to see: a light image,
 * a dark one, a very wide one and a very tall one, all in the same box. Every
 * thumbnail keeps the box and loses the overflow — none of them distorts.
 */
export const Cropping: ThumbnailStory = {
  render: () => ({
    components: { FzThumbnail, FzContainer },
    setup: () => ({ LIGHT, DARK, WIDE, TALL }),
    template: `
      <FzContainer horizontal gap="sm">
        <FzThumbnail :src="LIGHT" alt="Immagine chiara" width="158px" height="108px" />
        <FzThumbnail :src="DARK" alt="Immagine scura" width="158px" height="108px" />
        <FzThumbnail :src="WIDE" alt="Immagine molto larga" width="158px" height="108px" />
        <FzThumbnail :src="TALL" alt="Immagine molto alta" width="158px" height="108px" />
      </FzContainer>`
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const names = [
      'Immagine chiara',
      'Immagine scura',
      'Immagine molto larga',
      'Immagine molto alta'
    ]

    // Sample a pixel out of the decoded bitmap. Geometry and `object-fit` were
    // all this story used to assert, and they stayed green while every fixture
    // rendered as a fully transparent SVG — the gradient reference had been
    // double-escaped, which is valid markup that paints nothing. A box of the
    // right size containing no pixels is exactly the bug a cropping story exists
    // to catch, so measure the paint.
    const centrePixel = (img: HTMLImageElement) => {
      const c = document.createElement('canvas')
      c.width = 8
      c.height = 8
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, 0, 8, 8)
      return Array.from(ctx.getImageData(4, 4, 1, 1).data)
    }

    const samples: number[][] = []

    for (const name of names) {
      const img = canvas.getByAltText(name) as HTMLImageElement
      await waitFor(() => expect(img).toBeVisible())
      await waitFor(() => expect(img.complete && img.naturalWidth > 0).toBe(true))

      // Same box for all four, whatever the source's own ratio.
      const { width, height } = img.getBoundingClientRect()
      await expect(Math.round(width)).toBe(158)
      await expect(Math.round(height)).toBe(108)
      await expect(getComputedStyle(img).objectFit).toBe('cover')

      const [, , , alpha] = centrePixel(img)
      await expect(alpha).toBe(255)
      samples.push(centrePixel(img))
    }

    // Four visibly different images, not four copies of the same nothing.
    const distinct = new Set(samples.map((s) => s.join(',')))
    await expect(distinct.size).toBe(4)
  }
}

/**
 * With only one dimension known — a thumbnail filling a column of unknown width —
 * `aspectRatio` supplies the other, without needing an `aspect-*` utility at a
 * layer that may not write one.
 */
export const FromAspectRatio: ThumbnailStory = {
  args: {
    src: WIDE,
    alt: 'Immagine 16:9',
    width: '320px',
    height: undefined,
    aspectRatio: '16 / 9'
  },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.fz-thumbnail') as HTMLElement
    const { width, height } = root.getBoundingClientRect()
    await expect(Math.round(width)).toBe(320)
    await expect(Math.round(height)).toBe(180)
  }
}

/** Every radius, so the 4px default is visible next to the alternatives. */
export const AllRadii: ThumbnailStory = {
  render: () => ({
    components: { FzThumbnail, FzContainer },
    setup: () => ({ LIGHT, radii: ['none', 'sm', 'base', 'lg', 'xl'] as const }),
    template: `
      <FzContainer horizontal gap="sm">
        <FzThumbnail
          v-for="radius in radii"
          :key="radius"
          :src="LIGHT"
          :alt="'Raggio ' + radius"
          :radius="radius"
          width="108px"
          height="108px"
          bordered
        />
      </FzContainer>`
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByAltText('Raggio base')).toBeVisible()
    const base = canvasElement.querySelectorAll('.fz-thumbnail')[2] as HTMLElement
    await expect(getComputedStyle(base).borderRadius).toBe('4px')
  }
}

/**
 * The thumbnail itself is not interactive, so keyboard reachability is entirely
 * about the overlaid action: one Tab stop, activated by Enter.
 */
export const KeyboardNavigation: ThumbnailStory = {
  argTypes: { onDownload: { table: { disable: true } } },
  args: {
    src: LIGHT,
    alt: '',
    width: '100%',
    height: '168px',
    scrim: true,
    onDownload: fn()
  } as ThumbnailStory['args'],
  render: (args) => ({
    components: { FzThumbnail, FzIconButton },
    // Split the story's own spy out of the args before binding: `onDownload` is not
    // a component prop, so riding the `v-bind` it would land on the root box as a
    // DOM listener and show up in the autodocs table as if it were part of the API.
    setup: () => {
      const { onDownload, ...props } = args as Record<string, unknown>
      return { props, onDownload }
    },
    template: `
      <FzThumbnail v-bind="props">
        <template #overlay>
          <FzIconButton
            iconName="arrow-down-to-line"
            variant="secondary"
            ariaLabel="Scarica allegato"
            @click="onDownload"
          />
        </template>
      </FzThumbnail>`
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Scarica allegato' })

    await userEvent.tab()
    await waitFor(() => expect(button).toHaveFocus())

    await userEvent.keyboard('{Enter}')
    await expect((args as Record<string, ReturnType<typeof fn>>).onDownload).toHaveBeenCalled()

    // The image is decorative here, so it must not be a tab stop of its own.
    await userEvent.tab()
    await expect(button).not.toHaveFocus()
  }
}
