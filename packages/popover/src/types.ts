import type { FzFloatingPosition } from "@fiscozen/composables";

export interface FzPopoverProps {
  /**
   * Where the content sits relative to its anchor. Same vocabulary as
   * `FzFloating`, so migrating a call site is a copy of the prop.
   *
   * `auto` and `auto-vertical` (and their `-start` / `-end` variants) always take
   * the JS engine: "the side with the most space" needs measuring.
   *
   * @default 'bottom-start'
   */
  position?: FzFloatingPosition;
  /**
   * Gap between anchor and content, in px.
   * @default 4
   */
  offset?: number;
  /**
   * Give the content at least the anchor's width — what a select's listbox wants.
   * `anchor-size()` in the CSS engine, the measured opener rect in the JS one.
   */
  matchOpenerWidth?: boolean;
  /**
   * Anchor to this element instead of the `opener` slot. The equivalent of
   * `FzFloating`'s `overrideOpener` (and of `PopoverAnchor` in Reka UI): use it
   * when the thing that opens the popover is not the thing it should hang off.
   */
  anchor?: HTMLElement | null;
  /** Class applied to the content box. */
  contentClass?: string | string[] | Record<string, boolean>;
  /**
   * Force the JS engine even where the browser could do it in CSS. Escape hatch
   * for debugging and for visual tests that need to exercise the fallback.
   */
  forceFallback?: boolean;
}

export interface FzPopoverSlots {
  /**
   * The element the popover hangs off. Bind `toggle` (or `open` / `close`) to it —
   * the popover attaches no click handler of its own, so an opener that is not a
   * button keeps working.
   */
  opener(props: {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
  }): unknown;
  /** The floating content. */
  default(props: { isOpen: boolean; close: () => void }): unknown;
}

export interface FzPopoverEmits {
  /** Fired after the popover opened or closed, whatever the cause. */
  "fzpopover:toggle": [isOpen: boolean];
}
