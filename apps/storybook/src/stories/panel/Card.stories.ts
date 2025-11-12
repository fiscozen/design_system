import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzCard } from '@fiscozen/card'
import { FzBadge } from '@fiscozen/badge'

const meta = {
  title: 'Panel/FzCard',
  component: FzCard,
  tags: ['autodocs'],
  argTypes: {
    // it will not be generated in the typescript definition probabily because it has '- ' in the name
    'header-content': {
      description: 'Slot for the header content, it will be displayed below the title'
    },
    color: {
      control: 'select',
      options: ['default', 'blue', 'orange', 'purple', 'grey', 'aliceblue'],
      description: 'Card background color variant. Note: "aliceblue" is deprecated, use "blue" instead.',
      table: {
        defaultValue: { summary: 'default' }
      }
    },
    hasInfoIcon: {
      control: 'boolean',
      description: 'Whether to show an info icon in the header',
      table: {
        defaultValue: { summary: 'false' }
      }
    },
    environment: {
      control: 'select',
      options: ['backoffice', 'frontoffice'],
      description: 'The environment context for the card buttons',
      table: {
        defaultValue: { summary: 'frontoffice' }
      }
    }
  }
} satisfies Meta<typeof FzCard>
export default meta

type CardStory = StoryObj<typeof FzCard>

const Template: CardStory = {
  render: (args) => ({
    components: { FzCard, FzBadge },
    setup() {
      return {
        args
      }
    },

    methods: {
      onPrimaryAction: () => console.log('Primary action clicked'),
      onSecondaryAction: () => console.log('Secondary action clicked'),
      onTertiaryAction: () => console.log('Tertiary action clicked'),
      onInfoClick: () => console.log('Info icon clicked')
    },
    template: `<FzCard v-bind="args" class="w-[500px] m-8" @fzprimary:click="onPrimaryAction" @fzsecondary:click="onSecondaryAction" @fztertiary:click="onTertiaryAction" @fzcard:click-info="onInfoClick"> 
                        <template #header>
                            <FzBadge color="warning"> Attesa Utente </FzBadge>
                        </template>
                        <div class="border-2 border-dashed border-grey-200 rounded p-16 flex items-center justify-center text-center h-full w-full">
                          <p class="text-grey-500 m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                          </p>
                        </div>
                    </FzCard>`
  }),
  args: {
    title: 'Title',
    contentClass: 'h-[250px]'
  }
}

export const BasicCard: CardStory = {
  ...Template,
  args: {
    ...Template.args
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify card container exists (section element with rounded class)
    const card = canvasElement.querySelector('section.rounded')
    await expect(card).toBeTruthy()
    
    // Verify title is rendered
    const title = canvas.getByText('Title')
    await expect(title).toBeInTheDocument()
    
    // Verify badge in header slot is rendered
    const badge = canvas.getByText('Attesa Utente')
    await expect(badge).toBeInTheDocument()
    
    // Verify content is rendered
    const content = canvas.getByText(/Lorem ipsum dolor sit amet/)
    await expect(content).toBeInTheDocument()
    
    // Verify default color (white background)
    await expect(card?.classList.contains('bg-core-white')).toBe(true)
    
    // Verify no action buttons are present (basic card has no actions)
    const buttons = canvas.queryAllByRole('button')
    await expect(buttons.length).toBe(0)
  }
}

export const CardWithActions: CardStory = {
  ...Template,
  args: {
    ...Template.args,
    primaryAction: {
      label: 'Action 1'
    },
    secondaryAction: {
      label: 'Action 2'
    },
    tertiaryAction: {
      icon: 'bell'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify all three action buttons are rendered
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
    
    // Verify primary action button
    const primaryBtn = canvas.getByText('Action 1')
    await expect(primaryBtn).toBeInTheDocument()
    await expect(primaryBtn.classList.contains('bg-blue-500')).toBe(true)
    
    // Verify secondary action button
    const secondaryBtn = canvas.getByText('Action 2')
    await expect(secondaryBtn).toBeInTheDocument()
    await expect(secondaryBtn.classList.contains('bg-core-white')).toBe(true)
    
    // Verify tertiary action button (icon button)
    const tertiaryBtn = buttons[2]
    const icon = tertiaryBtn.querySelector('svg')
    await expect(icon).toBeTruthy()
    await expect(tertiaryBtn.classList.contains('bg-transparent')).toBe(true)
    
    // Verify buttons are enabled
    buttons.forEach(button => {
      expect(button).toBeEnabled()
    })
  }
}

export const CardWithSecondaryActionOnly: CardStory = {
  ...Template,
  args: {
    ...Template.args,
    secondaryAction: {
      label: 'Secondary Action'
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify only one button is rendered (secondary)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(1)
    
    // Verify secondary action button
    const secondaryBtn = canvas.getByText('Secondary Action')
    await expect(secondaryBtn).toBeInTheDocument()
    await expect(secondaryBtn.classList.contains('bg-core-white')).toBe(true)
    await expect(secondaryBtn).toBeEnabled()
  }
}

export const CardWithPrimaryAndSecondary: CardStory = {
  ...Template,
  args: {
    ...Template.args,
    primaryAction: {
      label: 'Primary'
    },
    secondaryAction: {
      label: 'Secondary'
    }
  }
}

export const CardPurple: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'purple'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify card has purple color (background-pale-purple)
    const card = canvasElement.querySelector('.bg-background-pale-purple')
    await expect(card).toBeTruthy()
    
    // Verify title is present
    const title = canvas.getByText('Title')
    await expect(title).toBeInTheDocument()
    
    // Verify actions are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
  }
}

export const CardOrange: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'orange'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify card has orange color (background-seashell)
    const card = canvasElement.querySelector('.bg-background-seashell')
    await expect(card).toBeTruthy()
    
    // Verify actions are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
  }
}

export const CardDefault: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'default'
  }
}

export const CardBlue: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'blue'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify card has blue color (background-alice-blue)
    const card = canvasElement.querySelector('.bg-background-alice-blue')
    await expect(card).toBeTruthy()
    
    // Verify actions are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
  }
}

export const CardGrey: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'grey'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify card has grey color (background-white-smoke)
    const card = canvasElement.querySelector('.bg-background-white-smoke')
    await expect(card).toBeTruthy()
    
    // Verify actions are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
  }
}

export const CardWithInfoIcon: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    hasInfoIcon: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify info icon button is present (4 buttons: 3 actions + 1 info icon)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(4)
    
    // Verify info icon is present
    const icons = canvasElement.querySelectorAll('svg')
    const infoIconExists = Array.from(icons).some(icon => {
      return icon.parentElement?.closest('button') !== null
    })
    await expect(infoIconExists).toBe(true)
    
    // Verify title is present
    const title = canvas.getByText('Title')
    await expect(title).toBeInTheDocument()
  }
}

export const CardBackoffice: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    environment: 'backoffice'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify buttons are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
    
    // Verify backoffice environment (buttons should have h-32 height)
    const primaryBtn = canvas.getByText('Action 1')
    await expect(primaryBtn.classList.contains('h-32')).toBe(true)
    
    // Verify card content is present
    const content = canvas.getByText(/Lorem ipsum dolor sit amet/)
    await expect(content).toBeInTheDocument()
  }
}

export const CardFrontoffice: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    environment: 'frontoffice'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify buttons are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
    
    // Verify frontoffice environment (buttons should have h-44 height)
    const primaryBtn = canvas.getByText('Action 1')
    await expect(primaryBtn.classList.contains('h-44')).toBe(true)
    
    // Verify card content is present
    const content = canvas.getByText(/Lorem ipsum dolor sit amet/)
    await expect(content).toBeInTheDocument()
  }
}

export const CardCollapsible: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    collapsible: true,
    hasInfoIcon: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify collapsible card has collapse/expand button (5 buttons: 3 actions + 1 info + 1 collapse)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(5)
    
    // Verify title is present
    const title = canvas.getByText('Title')
    await expect(title).toBeInTheDocument()
    
    // Verify content is initially visible
    const content = canvas.getByText(/Lorem ipsum dolor sit amet/)
    await expect(content).toBeInTheDocument()
    
    // Verify collapse icon is present
    const icons = canvasElement.querySelectorAll('svg')
    await expect(icons.length).toBeGreaterThan(0)
  }
}

export const StdCard: CardStory = {
  render: (args) => ({
    components: { FzCard },
    setup() {
      return {
        args
      }
    },

    methods: {
      onPrimaryAction: () => console.log('Primary action clicked'),
      onSecondaryAction: () => console.log('Secondary action clicked'),
      onTertiaryAction: () => console.log('Tertiary action clicked')
    },
    template: `<FzCard v-bind="args" class="m-8" @fzprimary:click="onPrimaryAction" @fzsecondary:click="onSecondaryAction" @fztertiary:click="onTertiaryAction"> 
                        <div> Some random content </div>
                    </FzCard>`
  }),
  args: {
    title: 'Title',
    primaryAction: {
      label: 'Action 1'
    },
    secondaryAction: {
      label: 'Action 2'
    },
    tertiaryAction: {
      icon: 'bell'
    }
  }
}

export const CardWithHeaderContent: CardStory = {
  render: (args) => ({
    components: { FzCard, FzBadge },
    setup() {
      return {
        args
      }
    },

    methods: {
      onPrimaryAction: () => console.log('Primary action clicked'),
      onSecondaryAction: () => console.log('Secondary action clicked'),
      onTertiaryAction: () => console.log('Tertiary action clicked')
    },
    template: `<FzCard v-bind="args" class="m-8" @fzprimary:click="onPrimaryAction" @fzsecondary:click="onSecondaryAction" @fztertiary:click="onTertiaryAction"> 
                        <template #header>
                            <FzBadge color="warning"> Attesa Utente </FzBadge>
                        </template>
                        <template #header-content>
                            <div class="flex border-t-1 p-16 justify-between">
                                <div> Wallet 1 </div>
                                <div> Wallet 2 </div>
                                <div> Wallet 3 </div>
                            </div>
                        </template>
                        <div> Content </div>
                    </FzCard>`
  }),
  args: {
    title: 'Title',
    primaryAction: {
      label: 'Action 1'
    },
    secondaryAction: {
      label: 'Action 2'
    },
    tertiaryAction: {
      icon: 'bell'
    },
    collapsible: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify title is present
    const title = canvas.getByText('Title')
    await expect(title).toBeInTheDocument()
    
    // Verify badge in header slot
    const badge = canvas.getByText('Attesa Utente')
    await expect(badge).toBeInTheDocument()
    
    // Verify header-content slot content (wallets)
    const wallet1 = canvas.getByText('Wallet 1')
    const wallet2 = canvas.getByText('Wallet 2')
    const wallet3 = canvas.getByText('Wallet 3')
    await expect(wallet1).toBeInTheDocument()
    await expect(wallet2).toBeInTheDocument()
    await expect(wallet3).toBeInTheDocument()
    
    // Verify main content
    const content = canvas.getByText('Content')
    await expect(content).toBeInTheDocument()
    
    // Verify buttons are present (4 buttons: 3 actions + 1 collapse)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(4)
  }
}

export const AlwaysAliveCard: CardStory = {
  render: (args) => ({
    components: { FzCard },
    setup() {
      return {
        args
      }
    },

    methods: {
      onPrimaryAction: () => console.log('Primary action clicked'),
      onSecondaryAction: () => console.log('Secondary action clicked'),
      onTertiaryAction: () => console.log('Tertiary action clicked')
    },
    template: `<FzCard v-bind="args" class="m-8" @fzprimary:click="onPrimaryAction" @fzsecondary:click="onSecondaryAction" @fztertiary:click="onTertiaryAction"> 
                        <div> Some random content </div>
                    </FzCard>`
  }),
  args: {
    title: 'Title',
    alwaysAlive: true,
    collapsible: true
  }
}

export const CardWithFooter: CardStory = {
  render: (args) => ({
    components: { FzCard, FzBadge },
    setup() {
      return {
        args
      }
    },

    template: `<FzCard v-bind="args" class="w-[500px] m-8">
                 <div> Content </div>
                 <template #footer>
                   Footer
                 </template>
               </FzCard>`
  }),
  args: {
    title: 'Title',
    collapsible: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify title is present
    const title = canvas.getByText('Title')
    await expect(title).toBeInTheDocument()
    
    // Verify content is present
    const content = canvas.getByText('Content')
    await expect(content).toBeInTheDocument()
    
    // Verify footer slot content
    const footer = canvas.getByText('Footer')
    await expect(footer).toBeInTheDocument()
    
    // Verify collapse button is present (1 button for collapsible)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(1)
  }
}

export const CardWithoutHeader: CardStory = {
  render: (args) => ({
    components: { FzCard },
    setup() {
      return {
        args
      }
    },

    template: `<FzCard v-bind="args" class="w-[500px] m-8">
                 <div> Content </div>
               </FzCard>`
  }),
  args: {
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify content is present
    const content = canvas.getByText('Content')
    await expect(content).toBeInTheDocument()
    
    // Verify no title is present
    const title = canvas.queryByText('Title')
    await expect(title).not.toBeInTheDocument()
    
    // Verify no buttons are present (no actions, no collapse)
    const buttons = canvas.queryAllByRole('button')
    await expect(buttons.length).toBe(0)
    
    // Verify card container exists (section element with rounded class)
    const card = canvasElement.querySelector('section.rounded')
    await expect(card).toBeTruthy()
  }
}