/**
 * Type definitions for the Fiscozen Progress component library.
 *
 * @module @fiscozen/progress/types
 */

import type { IconSize } from "@fiscozen/icons";

/**
 * Props for the FzProgress component.
 *
 * Loading spinner component with a fixed icon and spinning animation.
 * Exposes `role="status"` and an accessible label so the loading state is
 * announced by screen readers. Honors `prefers-reduced-motion`.
 *
 * @example
 * <FzProgress />
 * <FzProgress size="xl" label="Caricamento risultati…" />
 */
export interface FzProgressProps {
  /**
   * Size of the spinner
   * @default 'lg'
   */
  size?: IconSize;

  /**
   * Accessible label announced by screen readers via `role="status"`
   * (implicit `aria-live="polite"`). Also rendered as visually-hidden
   * text inside the component.
   * @default 'Caricamento…'
   */
  label?: string;
}

/**
 * Props for the FzProgressBar component.
 *
 * Visual progress bar displaying completion percentage within a customizable range.
 * Automatically calculates percentage position based on current value relative to min/max range.
 *
 * @example
 * <FzProgressBar :current="50" />
 * <FzProgressBar :current="30" :min="-15" :max="50" />
 */
export interface FzProgressBarProps {
  /**
   * Current progress value within the min-max range
   */
  current: number;

  /**
   * Maximum value for progress calculation
   * @default 100
   */
  max?: number;

  /**
   * Minimum value for progress calculation
   * @default 0
   */
  min?: number;

  /**
   * Accessible label announced by screen readers via `aria-label`.
   * Consumers should provide a meaningful, contextual label
   * (e.g. 'Caricamento file', 'Importazione clienti').
   * @default 'Avanzamento'
   */
  label?: string;

  /**
   * Optional human-readable text passed to `aria-valuetext`.
   * When provided, screen readers announce this string instead of the
   * raw `aria-valuenow` percentage. Useful for contextual progress
   * (e.g. 'Caricamento file 3 di 10', 'Passo 2 di 5').
   */
  valueText?: string;

  /**
   * Size of the progress bar
   * @default 'md'
   */
  size?: "sm" | "md";

  /**
   * Color variant of the progress indicator.
   *
   * Most colors map to literal Tailwind tokens (`bg-{color}-500`/`bg-{color}-100`).
   * Two values use semantic tokens to share the same palette as the rest of the
   * design system:
   * - `'yellow'` → `semantic-warning-*`
   * - `'red'`    → `semantic-error-*`
   *
   * @default 'purple'
   */
  color?: "purple" | "blue" | "orange" | "pink" | "yellow" | "grey" | "red";
}
