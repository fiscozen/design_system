/**
 * Type definitions for the Fiscozen Link component library.
 * 
 * @module @fiscozen/link/types
 */

import { RouteLocationRaw } from 'vue-router'

/**
 * Base props shared between internal and external link variants.
 */
type FzLinkBaseProps = {
  /**
   * Visual variant indicating link purpose. Affects color scheme.
   * @default 'default'
   */
  type?: 'default' | 'danger'
  /**
   * Text decoration style. 'default' shows underline on hover, 'underline' always shows underline.
   * @default 'default'
   */
  linkStyle?: 'default' | 'underline'
  /**
   * Text size affecting font size and line height.
   * @default 'md'
   * @deprecated 'xs' is deprecated and will be mapped to 'sm'. Use 'sm' instead.
   * @deprecated 'lg' is deprecated and will be mapped to 'md'. Use 'md' instead.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Disables the link, rendering as non-interactive span with disabled styling.
   * @default false
   */
  disabled?: boolean
}

/**
 * Props for internal links (using vue-router).
 * 
 * When external is false or undefined, to accepts RouteLocationRaw
 * (string path or object with name, params, query, etc.).
 * 
 * @example
 * <FzLink to="/dashboard">Dashboard</FzLink>
 * 
 * @example
 * <FzLink :to="{ name: 'user', params: { id: 123 }}">User</FzLink>
 */
export type FzLinkInternalProps = FzLinkBaseProps & {
  /**
   * Destination route. Accepts vue-router RouteLocationRaw:
   * - String path: "/dashboard"
   * - Object with name: { name: 'user', params: { id: 123 } }
   * - Object with path: { path: '/search', query: { q: 'vue' } }
   */
  to: RouteLocationRaw
  /**
   * When false or undefined, link uses vue-router for internal navigation.
   * @default false
   */
  external?: false
  /**
   * Uses router.replace instead of router.push for navigation.
   * @default false
   */
  replace?: boolean
  /**
   * Target attribute for anchor tag (e.g., '_blank', '_self').
   * Can be used with router-link to open internal routes in new tab/window.
   */
  target?: string
}

/**
 * Props for external links (using anchor tag).
 * 
 * When external is true, to must be a string URL.
 * 
 * @example
 * <FzLink to="https://example.com" external>External Site</FzLink>
 * 
 * @example
 * <FzLink to="https://example.com" external target="_blank">Open in New Tab</FzLink>
 */
export type FzLinkExternalProps = FzLinkBaseProps & {
  /**
   * External URL as string. Must be a full URL (e.g., "https://example.com").
   */
  to: string
  /**
   * When true, link renders as anchor tag with href for external navigation.
   */
  external: true
  /**
   * Target attribute for anchor tag (e.g., '_blank', '_self').
   */
  target?: string
  /**
   * Replace is not applicable for external links.
   */
  replace?: never
}

/**
 * Props for the FzLink component.
 * 
 * A flexible link component that supports both internal routing (via vue-router)
 * and external navigation. Automatically renders as router-link for internal routes,
 * anchor tag for external URLs, or span when disabled.
 * 
 * TypeScript will enforce:
 * - Internal links (external=false or undefined): to accepts RouteLocationRaw (string or object)
 * - External links (external=true): to must be a string URL
 * 
 * @example
 * <FzLink to="/dashboard" size="md">Go to Dashboard</FzLink>
 * 
 * @example
 * <FzLink :to="{ name: 'user', params: { id: 123 }}">User Profile</FzLink>
 * 
 * @example
 * <FzLink to="https://example.com" external target="_blank">External Site</FzLink>
 */
export type FzLinkProps = FzLinkInternalProps | FzLinkExternalProps
