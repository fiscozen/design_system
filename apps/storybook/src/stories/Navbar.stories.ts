import type { Meta, StoryObj } from '@storybook/vue3'

import { FzNavbar } from '@fiscozen/navbar'
import { FzIcon } from '@fiscozen/icons'
import { FzNavlink } from '@fiscozen/navlink'
import { FzIconButton } from '@fiscozen/icon-button'
import { FzAvatar } from '@fiscozen/avatar'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Navbar',
  component: FzNavbar,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof FzNavbar>

export default meta
type Story = StoryObj<typeof meta>

const horizontalNavbar = (args) => ({
  setup() {
    return { args }
  },
  components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
  template: `
    <FzNavbar>
      <template #brand-logo="{isMobile}">
        <FzNavlink :iconOnly="true" iconName="fiscozen" iconVariant="fak" iconSize="xl" :class="{'!text-[20px]': !isMobile, '!text-[24px]': isMobile}" /> 
      </template>

      <template #navigation>
        <FzNavlink label="Fatture" /> 
        <FzNavlink label="Spese" /> 
        <FzNavlink label="Corrispettivi" /> 
        <FzNavlink label="Adempimenti" /> 
        <FzNavlink label="Documenti" /> 
        <FzNavlink label="Dichiarazione" /> 
      </template>
      
      <template #notifications>
        <FzIconButton iconName="bell" variant="notification" tooltip="notifications" :disabled="false" />
      </template>
      <template #user-menu>
        <FzAvatar src="consultant.jpg" />
      </template>
    </FzNavbar>
  `
})

export const Horizontal = horizontalNavbar.bind({})

const verticalNavbar = (args) => ({
  setup() {
    return { args }
  },
  components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
  template: `
    <div class="h-screen m-0">
      <FzNavbar variant="vertical">
        <template #brand-logo="{isMobile}">
          <FzNavlink :iconOnly="true" iconName="fiscozen" iconVariant="fak" iconSize="xl" :class="{'!text-[20px]': !isMobile, '!text-[24px]': isMobile}" /> 
        </template>

        <template #navigation>
          <FzNavlink :iconOnly="true" iconName="suitcase" /> 
          <FzNavlink :iconOnly="true" iconName="folder-user" /> 
          <FzNavlink :iconOnly="true" iconName="credit-card" /> 
          <FzNavlink :iconOnly="true" iconName="cart-shopping" /> 
          <FzNavlink :iconOnly="true" iconName="calendar-lines" /> 
          <FzNavlink :iconOnly="true" iconName="file-check" /> 
          <FzNavlink :iconOnly="true" iconName="gear" /> 
          <FzNavlink :iconOnly="true" iconName="screwdriver-wrench" /> 
        </template>
        
        <template #notifications>
          <FzIconButton iconName="bell" variant="notification" tooltip="notifications" :disabled="false" />
        </template>
        <template #user-menu>
          <FzAvatar src="consultant.jpg" />
        </template>
      </FzNavbar>
    </div>
  `
})

export const Vertical = verticalNavbar.bind({})
