import { library } from '@fortawesome/fontawesome-svg-core'
import { all } from '@awesome.me/kit-8137893ad3/icons'
import FzIcon from './FzIcon.vue'

const IconPlugin = {
  install(app) {
    library.add(...all)
    app.component('fz-icon', FzIcon)
  }
}

export { FzIcon, IconPlugin }

export type { IconVariant, IconSize } from './types'
