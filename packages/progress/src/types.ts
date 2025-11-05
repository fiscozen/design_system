/**
 * Type definitions for the Fiscozen Progress component library.
 *
 * @module @fiscozen/progress/types
 */

import type { IconProps } from "@fiscozen/icons";

/**
 * Props for the FzProgress component.
 *
 * Loading spinner component that wraps FzIcon with spinning animation.
 * Inherits all IconProps for size, color, and icon customization.
 *
 * @example
 * <FzProgress />
 * <FzProgress size="lg" variant="far" />
 */
export type FzProgressProps = IconProps;

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
   * Accessible label for screen readers
   * @default 'progress-bar'
   */
  name?: string;

  /**
   * Size of the progress bar
   * @default 'md'
   */
  size?: 'sm' | 'md';
}
