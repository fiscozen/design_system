/**
 * Environment context for avatar sizing and spacing
 */
export type Environment = 'backoffice' | 'frontoffice'

/**
 * Avatar shape variant
 */
export type Variant = 'default' | 'square'

/**
 * Size of avatar. Deprecated - use environment instead.
 */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Props for FzAvatar component
 */
export interface FzAvatarProps {
  /**
   * First name of customer/consultant
   */
  firstName: string
  /**
   * Last name of customer/consultant
   */
  lastName: string
  /**
   * Size of avatar. Deprecated - use environment instead.
   * @deprecated Use environment prop instead
   */
  size?: AvatarSize
  /**
   * Image source URL, if available. Avatar will default to initials placeholder if this is not provided.
   */
  src?: string
  /**
   * Overrides initials placeholder calculated from firstName and lastName
   */
  initials?: string
  /**
   * Environment context for avatar sizing and spacing
   * - backoffice: 32px avatar, 8px gap, smaller text
   * - frontoffice: 44px avatar, 12px gap, larger text
   */
  environment?: Environment
  /**
   * Avatar shape variant
   * - default: circular (border-radius: 50%)
   * - square: rounded corners (border-radius: 8px)
   */
  variant?: Variant
  /**
   * Optional title text displayed next to avatar
   */
  title?: string
  /**
   * Optional subtitle text displayed below title
   */
  subtitle?: string
}
