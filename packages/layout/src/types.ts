type FzLayoutProps = {
  layout:
    | "oneColumn"
    | "oneColumnHeader"
    | "twoColumns"
    | "leftShoulder"
    | "multipleAreas"
    | "rightShoulder"
    | "threeColumns";
  isViewport?: boolean;
  hasBottomBar?: boolean;
  /**
   * Opt out of the default `p-12` padding applied to every region.
   * Padding is on by default to preserve the existing spacing of current
   * consumers; set to `true` for full-bleed regions (e.g. page templates that
   * own their own padding).
   *
   * Note: scrollable regions (`fz-layout__main`/`left`/`right`/`sidebar` under
   * `fz-layout__overflow`) clip content at their edges (`overflow-auto`). With
   * padding removed, the consumer owns keeping focusable content clear of those
   * edges — add your own spacing (or `scroll-margin`) so keyboard focus rings
   * are not clipped against a scroll boundary.
   */
  disablePadding?: boolean;
};

export { FzLayoutProps };
