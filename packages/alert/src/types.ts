import { RouteLocationRaw } from 'vue-router'

type AlertProps = {
  /**
   * Type of the topbar which dictates the appearance
   */
  type: 'info' | 'error' | 'danger' | 'warning' | 'success'
  /**
   * Style which dictates the action rendered
   */
  alertStyle?: 'default' | 'collapsable' | 'simple'
  /**
   * Whether to render the button action
   */
  showButtonAction?: boolean
  /**
   * Button action label
   */
  buttonActionLabel?: string
  /**
   * Button action tooltip
   */
  buttonActionTooltip?: string
  /**
   * Whether to render the link action
   */
  showLinkAction?: boolean
  /**
   * Link action label
   */
  linkActionLabel?: string
  /**
   * Link action location (applies only if showLinkAction is true)
   */
  linkActionLocation?: RouteLocationRaw
  /**
   * Link action target, for example _blank
   */
  linkActionTarget?: string
  /**
   * Link action external, for redirecting to external links
   */
  linkActionExternal?: boolean
  /**
   * Size of the alert (applies only if style is simple)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Title of the alert (applies only if style is not simple)
   */
  title?: string
  /**
   * Default state of the alert (open/closed)
   */
  defaultOpen?: boolean
}

export { AlertProps }
