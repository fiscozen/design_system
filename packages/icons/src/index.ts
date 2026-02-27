import { Plugin } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { all } from '@awesome.me/kit-8137893ad3/icons'
import FzIcon from './FzIcon.vue'
import FzIconBackground from './FzIconBackground.vue'

const IconPlugin : Plugin = {
  install(app) {
    // @ts-ignore
    library.add(...all)
    app.component('fz-icon', FzIcon)
    app.component('fz-icon-background', FzIconBackground)
  }
}

export { FzIcon, FzIconBackground, IconPlugin }

export type { IconVariant, IconSize, IconProps, IconBackgroundProps } from './types'
