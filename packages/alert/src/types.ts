import { RouteLocationRaw } from 'vue-router'
import { ButtonEnvironment } from '@fiscozen/button'

type AlertVariant = 'accordion' | 'background' | 'text'

type AlertProps = {
  /**
   * Tone of the alert which dictates the appearance
   */
  tone: 'info' | 'error' | 'danger' | 'warning' | 'success'
  /**
   * @deprecated Use the variant prop instead. This prop will be removed in a future version.
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
   * Whether the alert is dismissible
   */
  isDismissible?: boolean
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
   * @deprecated Use the environment prop instead. This prop will be removed in a future version.
   * Size of the alert (applies only if style is simple)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Environment of the alert 
   */
  environment?: ButtonEnvironment
  /**
   * Title of the alert (applies only if style is not simple)
   */
  title?: string
  /**
   * Default state of the alert (open/closed)
   */
  defaultOpen?: boolean
  /**
   * Variant of the alert.
   * - background: always expanded, optional title and actions; tone sets background and border
   * - accordion: collapsible content; tone sets background and border
   * - text: description only (no title, no actions, not collapsible, not dismissible);
   *   transparent background (tone ignored); icon size is `sm` when environment is backoffice, `md` otherwise
   */
  variant?: AlertVariant
}

export { AlertProps, AlertVariant }
