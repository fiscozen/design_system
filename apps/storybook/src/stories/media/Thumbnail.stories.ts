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
// the repo. `#` has to be escaped, or it terminates the URI.
const svg = (w: number, h: number, from: string, to: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      `</linearGradient></defs><rect width="${w}" height="${h}" fill="url(%23g)"/></svg>`
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
    setup: () => ({ args }),
    template: `
      <FzThumbnail v-bind="args">
        <template #overlay>
          <FzIconButton
            iconName="arrow-down-to-line"
            ariaLabel="Scarica allegato"
            @click="args.onDownload"
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
    const scrim = canvasElement.querySelector('[data-testid="fz-thumbnail-scrim"]')
    const bg = getComputedStyle(scrim as Element).backgroundColor
    await expect(bg).toBe('rgba(89, 97, 103, 0.2)')
  }
}

/** `top-end` is the composer's remove control, on the pre-send preview. */
export const RemoveAction: ThumbnailStory = {
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
    setup: () => ({ args }),
    template: `
      <FzThumbnail v-bind="args">
        <template #overlay>
          <FzIconButton
            iconName="xmark"
            variant="secondary"
            ariaLabel="Rimuovi allegato"
            @click="args.onRemove"
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

    for (const name of names) {
      const img = canvas.getByAltText(name)
      await waitFor(() => expect(img).toBeVisible())
      // Same box for all four, whatever the source's own ratio.
      const { width, height } = img.getBoundingClientRect()
      await expect(Math.round(width)).toBe(158)
      await expect(Math.round(height)).toBe(108)
      await expect(getComputedStyle(img).objectFit).toBe('cover')
    }
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
    setup: () => ({ args }),
    template: `
      <FzThumbnail v-bind="args">
        <template #overlay>
          <FzIconButton
            iconName="arrow-down-to-line"
            ariaLabel="Scarica allegato"
            @click="args.onDownload"
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
