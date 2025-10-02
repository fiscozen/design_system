import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { FzNavbar, FzNavbarProps } from '@fiscozen/navbar'
import { FzIcon } from '@fiscozen/icons'
import { FzNavlink } from '@fiscozen/navlink'
import { FzIconButton } from '@fiscozen/button'
import { FzAvatar } from '@fiscozen/avatar'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Navigation/FzNavbar',
  component: FzNavbar,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof FzNavbar>

export default meta
type Story = StoryObj<typeof meta>

const horizontalNavbar = (args: FzNavbarProps) => ({
  setup() {
    return { args }
  },
  components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
  template: `
    <FzNavbar>
      <template #brand-logo="{isMobile}">
        <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] ml-[-4px] cursor-pointer" /> 
      </template>

      <template #navigation>
        <FzNavlink label="Fatture" /> 
        <FzNavlink label="Spese" /> 
        <FzNavlink label="Corrispettivi" /> 
        <FzNavlink label="Adempimenti" /> 
        <FzNavlink label="Documenti" /> 
        <FzNavlink label="Dichiarazione" /> 
      </template>
      
      <template #notifications="{isHorizontal, isVertical, isMobile}">
        <FzIconButton  iconName="bell" variant="notification" tooltip="notifications" :disabled="false" />
      </template>
      <template #user-menu="{isHorizontal, isVertical, isMobile}">
        <FzAvatar v-if="isVertical" src="consultant.jpg" />
        <FzAvatar v-if="isHorizontal && !isMobile" firstName="Mario" lastName="Rossi" />
      </template>
    </FzNavbar>
  `
})

export const Horizontal = horizontalNavbar.bind({})

const verticalNavbar = (args: FzNavbarProps) => ({
  setup() {
    return { args }
  },
  components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
  template: `
    <div class="h-screen m-0">
      <FzNavbar variant="vertical">
        <template #brand-logo="{isMobile}">
          <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] ml-[-4px] cursor-pointer" /> 
        </template>

        <template #navigation>
          <FzNavlink iconName="suitcase" /> 
          <FzNavlink iconName="folder-user" /> 
          <FzNavlink iconName="credit-card" /> 
          <FzNavlink iconName="cart-shopping" /> 
          <FzNavlink iconName="calendar-lines" /> 
          <FzNavlink iconName="file-check" /> 
          <FzNavlink iconName="gear" /> 
          <FzNavlink iconName="screwdriver-wrench" /> 
        </template>
        
        <template #notifications="{isHorizontal, isVertical, isMobile}">
          <FzIconButton v-if="!isVertical" iconName="bell" variant="notification" tooltip="notifications" :disabled="false" />
        </template>
        <template #user-menu>
          <FzAvatar src="consultant.jpg" />
        </template>
      </FzNavbar>
    </div>
  `
})

export const Vertical = verticalNavbar.bind({})
