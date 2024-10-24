import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'
import FiscozenTheme from './FiscozenTheme'

addons.setConfig({
    theme: FiscozenTheme
});