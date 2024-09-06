import { RouteLocationRaw } from 'vue-router'

type FzLinkProps = {
  /**
   * Route Location the link should navigate to when clicked on.
   */
  to: RouteLocationRaw
  /**
   * Calls `router.replace` instead of `router.push`.
   */
  replace?: boolean
  /**
   * The purpose of the link
   */
  type?: 'default' | 'danger'
  /**
   * The appearance of the link
   */
  style?: 'default' | 'underline'
  /**
   * Size of the link
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Whether the link is disabled
   */
  disabled?: boolean
  /**
   * Target of the link
   */
  target?: string
  /**
   * Whether the link is for an external page or not
   */
  external?: boolean
}

export { FzLinkProps }
