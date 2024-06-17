type AlertProps = {
  /**
   * Type of the topbar which dictates the appearance
   */
  type: 'info' | 'error' | 'danger' | 'warning' | 'success'
  /**
   * Style which dictates the action rendered
   */
  style?: 'default' | 'collapsable' | 'simple'
  /**
   * Action label
   */
  actionLabel?: string
  /**
   * Action tooltip
   */
  actionTooltip?: string
  /**
   * Size of the alert (applies only if style is simple)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Title of the alert (applies only if style is not simple)
   */
  title?: string
}

export { AlertProps }
