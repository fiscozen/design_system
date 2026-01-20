import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, fn } from '@storybook/test'

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

export const Horizontal: Story = {
  args: {
    onFznavbarMenuButtonClick: fn()
  },
  render: (args: FzNavbarProps) => ({
    setup() {
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: `
      <FzNavbar variant="horizontal" @fznavbar:menuButtonClick="args.onFznavbarMenuButtonClick">
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
  }),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify navbar renders correctly', async () => {
      const header = canvas.getByRole('banner')
      await expect(header).toBeInTheDocument()
      await expect(header).toBeVisible()
    })
    
    await step('Verify brand logo is present', async () => {
      // Check for SVG element (icon) or div containing icon
      const logo = canvasElement.querySelector('svg') || canvasElement.querySelector('div.flex.items-center')
      await expect(logo).toBeTruthy()
    })
    
    await step('Verify navigation links are present', async () => {
      const fattureButton = canvas.getByRole('button', { name: /fatture/i })
      await expect(fattureButton).toBeInTheDocument()
      
      const speseButton = canvas.getByRole('button', { name: /spese/i })
      await expect(speseButton).toBeInTheDocument()
    })
    
    await step('Verify semantic HTML structure', async () => {
      const header = canvas.getByRole('banner')
      await expect(header.tagName.toLowerCase()).toBe('header')
    })
    
    await step('Verify keyboard navigation', async () => {
      // Tab to first navigation button
      await userEvent.tab()
      const firstButton = canvas.getByRole('button', { name: /fatture/i })
      await expect(document.activeElement).toBe(firstButton)
    })
    
    await step('Verify menu button click handler (if menu button is visible)', async () => {
      // Menu button is only visible on mobile, so check if it exists
      const menuButton = canvasElement.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"]')
      if (menuButton) {
        await userEvent.click(menuButton as HTMLElement)
        // ROBUST CHECK: Verify handler WAS called
        await expect(args.onFznavbarMenuButtonClick).toHaveBeenCalled()
      }
    })
  }
}

export const Vertical: Story = {
  render: (args: FzNavbarProps) => ({
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
            <FzAvatar firstName="Consultant" lastName="User" src="consultant.jpg" />
          </template>
        </FzNavbar>
      </div>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify vertical navbar renders correctly', async () => {
      const header = canvas.getByRole('banner')
      await expect(header).toBeInTheDocument()
      await expect(header).toBeVisible()
    })
    
    await step('Verify brand logo is present', async () => {
      // Check for SVG element (icon) or div containing icon
      const logo = canvasElement.querySelector('svg') || canvasElement.querySelector('div.flex.items-center')
      await expect(logo).toBeTruthy()
    })
    
    await step('Verify navigation links are present', async () => {
      // Vertical navbar uses icon-only navlinks, so we check for links by their presence
      const navLinks = canvasElement.querySelectorAll('a[href], button')
      await expect(navLinks.length).toBeGreaterThan(0)
    })
    
    await step('Verify semantic HTML structure', async () => {
      const header = canvas.getByRole('banner')
      await expect(header.tagName.toLowerCase()).toBe('header')
    })
    
    await step('Verify keyboard navigation', async () => {
      const header = canvas.getByRole('banner')
      // Tab to first focusable element
      await userEvent.tab()
      // Focus should be on a navigation element
      const activeElement = document.activeElement
      await expect(activeElement).toBeInTheDocument()
      await expect(header.contains(activeElement) || activeElement === header).toBe(true)
    })
  }
}


export const CustomBreakpoints: Story = {
  render: (args: FzNavbarProps) => ({
    setup() {
      const breakpoints = {
        lg: '1200px' as `${number}px`,
        md: '900px' as `${number}px`,
        sm: '600px' as `${number}px`
      }
      args.breakpoints = breakpoints;
      return { args }
    },
    components: { FzNavbar, FzIcon, FzNavlink, FzIconButton, FzAvatar },
    template: `
      <FzNavbar variant="horizontal" :breakpoints="args.breakpoints">
        <template #brand-logo="{isMobile}">
          <FzIcon name="fiscozen" variant="fak" size="xl" class="text-core-black text-[32px] !w-[40px] ml-[-4px] cursor-pointer" /> 
        </template>
      </FzNavbar>
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify navbar with custom breakpoints renders', async () => {
      const header = canvas.getByRole('banner')
      await expect(header).toBeInTheDocument()
      await expect(header).toBeVisible()
    })
    
    await step('Verify brand logo is present', async () => {
      // Check for SVG element (icon) or div containing icon
      const logo = canvasElement.querySelector('svg') || canvasElement.querySelector('div.flex.items-center')
      await expect(logo).toBeTruthy()
    })
    
    await step('Verify semantic HTML structure', async () => {
      const header = canvas.getByRole('banner')
      await expect(header.tagName.toLowerCase()).toBe('header')
    })
  }
}
