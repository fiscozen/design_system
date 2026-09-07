/**
 * Corner radius, named after the design system's radius tokens.
 * `base` is 4px — the value the designs use for an image in a feed.
 */
type FzThumbnailRadius = "none" | "sm" | "base" | "lg" | "xl";

/**
 * Corner the `overlay` slot's content is pinned to.
 */
type FzThumbnailOverlayPosition =
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "center";

/**
 * Props for FzThumbnail.
 */
export interface FzThumbnailProps {
  /** URL of the image to show. */
  src: string;
  /**
   * The image's accessible name. Required on purpose: pass an explicit empty
   * string for a decorative image, so that the decision is visible at the call
   * site rather than forgotten.
   */
  alt: string;
  /**
   * Box width, as any CSS length (`'158px'`, `'100%'`, `'12rem'`).
   *
   * A prop rather than a class on purpose. This component hardwires no size, so
   * the caller has to supply one — but the consuming apps forbid `class` outright
   * at the organism, template and page layers, and `style` at every layer above
   * an atom. Deciding it inside the component is the only way those layers can
   * size a thumbnail at all. Same reasoning as `FzNavbar`'s `elevation`.
   *
   * A Tailwind class on the call site still works where the layer permits one,
   * and wins over this prop only if it beats an inline style — so pick one.
   */
  width?: string;
  /** Box height, as any CSS length. See `width`. */
  height?: string;
  /**
   * Box aspect ratio (`'16 / 9'`, `'1'`), for when only one dimension is known —
   * a thumbnail filling a column of unknown width, say. Ignored if both `width`
   * and `height` are set.
   */
  aspectRatio?: string;
  /** Corner radius. Defaults to `base` (4px). */
  radius?: FzThumbnailRadius;
  /** Draws a 1px `grey-100` border around the box. */
  bordered?: boolean;
  /**
   * Lays a translucent scrim over the image, so an action rendered in the
   * `overlay` slot stays legible on a light photo. Not drawn over the
   * placeholder, which is already a flat light surface.
   */
  scrim?: boolean;
  /**
   * Where the `overlay` slot's content sits inside the box, 8px in from the
   * chosen corner. `bottom-end` by default — the download button's place in the
   * chat feed; `top-end` is the composer's remove control.
   *
   * A prop for the same reason the dimensions are: the layers that may not write
   * a `class` would otherwise have no way to place an overlaid action. Content
   * that needs finer placement can still position itself, from a layer that
   * permits it.
   */
  overlayPosition?: FzThumbnailOverlayPosition;
  /**
   * Icon shown in place of the image when it fails to load. Any name in the
   * Font Awesome kit; `file` by default, since the kit has no image glyph.
   */
  placeholderIcon?: string;
  /** Native loading hint. `lazy` by default — a feed of images is the use case. */
  loading?: "lazy" | "eager";
}

export type { FzThumbnailRadius, FzThumbnailOverlayPosition };
