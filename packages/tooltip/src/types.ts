import { FzFloatingPosition } from '@fiscozen/composables'

export type FzTooltipStatus = 'neutral' | 'informative' | 'positive' | 'alert' | 'error'

export interface FzTooltipProps {
  status: FzTooltipStatus
  position: FzFloatingPosition
  text?: string
  withIcon?: boolean
}
