import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from '@storybook/test'
import { FzContainer } from '@fiscozen/container'
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
      options: ['default', 'blue', 'orange', 'purple', 'grey', 'yellow', 'red', 'aliceblue'],
      description: 'Card background color variant. "yellow" uses semantic warning tint; "red" uses semantic error tint. "aliceblue" is deprecated, use "blue" instead.',
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
    components: { FzCard, FzBadge, FzContainer },
    setup() {
      return {
        args
      }
    },
    template: `<FzCard v-bind="args" class="w-[500px] m-8" @fzprimary:click="args.onFzprimaryClick" @fzsecondary:click="args.onFzsecondaryClick" @fztertiary:click="args.onFztertiaryClick" @fzcard:click-info="args.onFzcardClickInfo"> 
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
    contentClass: 'h-[250px]',
    onFzprimaryClick: fn(),
    onFzsecondaryClick: fn(),
    onFztertiaryClick: fn(),
    onFzcardClickInfo: fn()
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
    },
    onFzprimaryClick: fn(), // Create new spy instance for this story
    onFzsecondaryClick: fn(), // Create new spy instance for this story
    onFztertiaryClick: fn() // Create new spy instance for this story
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify all three action buttons are rendered', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(3)
      
      // Verify primary action button
      const primaryBtn = canvas.getByText('Action 1').closest('button')
      await expect(primaryBtn).toBeInTheDocument()
      await expect(primaryBtn?.classList.contains('bg-blue-500')).toBe(true)
      
      // Verify secondary action button
      const secondaryBtn = canvas.getByText('Action 2').closest('button')
      await expect(secondaryBtn).toBeInTheDocument()
      await expect(secondaryBtn?.classList.contains('bg-core-white')).toBe(true)
      
      // Verify tertiary action button (icon button)
      const tertiaryBtn = buttons.find(btn => btn.querySelector('svg'))
      await expect(tertiaryBtn).toBeTruthy()
      await expect(tertiaryBtn?.classList.contains('bg-transparent')).toBe(true)
      
      // Verify buttons are enabled
      buttons.forEach(button => {
        expect(button).toBeEnabled()
      })
    })
    
    await step('Click primary action button and verify handler is called', async () => {
      const primaryBtn = canvas.getByText('Action 1').closest('button')
      if (primaryBtn) {
        await userEvent.click(primaryBtn)
        await expect(args.onFzprimaryClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Click secondary action button and verify handler is called', async () => {
      const secondaryBtn = canvas.getByText('Action 2').closest('button')
      if (secondaryBtn) {
        await userEvent.click(secondaryBtn)
        await expect(args.onFzsecondaryClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Click tertiary action button and verify handler is called', async () => {
      const buttons = canvas.getAllByRole('button')
      const tertiaryBtn = buttons.find(btn => btn.querySelector('svg') && btn.textContent === '')
      if (tertiaryBtn) {
        await userEvent.click(tertiaryBtn)
        await expect(args.onFztertiaryClick).toHaveBeenCalledTimes(1)
      }
    })
  }
}

export const CardWithSecondaryActionOnly: CardStory = {
  ...Template,
  args: {
    ...Template.args,
    secondaryAction: {
      label: 'Secondary Action'
    },
    onFzsecondaryClick: fn() // Create new spy instance for this story
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify only one button is rendered (secondary)', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(1)
      
      // Verify secondary action button
      const secondaryBtn = canvas.getByText('Secondary Action').closest('button')
      await expect(secondaryBtn).toBeInTheDocument()
      await expect(secondaryBtn?.classList.contains('bg-core-white')).toBe(true)
      await expect(secondaryBtn).toBeEnabled()
    })
    
    await step('Click secondary action button and verify handler is called', async () => {
      const secondaryBtn = canvas.getByText('Secondary Action').closest('button')
      if (secondaryBtn) {
        await userEvent.click(secondaryBtn)
        await expect(args.onFzsecondaryClick).toHaveBeenCalledTimes(1)
      }
    })
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
    },
    onFzprimaryClick: fn(), // Create new spy instance for this story
    onFzsecondaryClick: fn() // Create new spy instance for this story
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify both action buttons are rendered', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(2)
      
      const primaryBtn = canvas.getByText('Primary').closest('button')
      await expect(primaryBtn).toBeInTheDocument()
      
      const secondaryBtn = canvas.getByText('Secondary').closest('button')
      await expect(secondaryBtn).toBeInTheDocument()
    })
    
    await step('Click primary action button and verify handler is called', async () => {
      const primaryBtn = canvas.getByText('Primary').closest('button')
      if (primaryBtn) {
        await userEvent.click(primaryBtn)
        await expect(args.onFzprimaryClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Click secondary action button and verify handler is called', async () => {
      const secondaryBtn = canvas.getByText('Secondary').closest('button')
      if (secondaryBtn) {
        await userEvent.click(secondaryBtn)
        await expect(args.onFzsecondaryClick).toHaveBeenCalledTimes(1)
      }
    })
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
    color: 'default',
    onFzprimaryClick: fn(), // Create new spy instance for this story
    onFzsecondaryClick: fn(), // Create new spy instance for this story
    onFztertiaryClick: fn() // Create new spy instance for this story
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify card has default color', async () => {
      const card = canvasElement.querySelector('section.rounded')
      await expect(card).toBeTruthy()
    })
    
    await step('Verify actions are present', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(3)
    })
    
    await step('Click primary action button and verify handler is called', async () => {
      const primaryBtn = canvas.getByText('Action 1').closest('button')
      if (primaryBtn) {
        await userEvent.click(primaryBtn)
        await expect(args.onFzprimaryClick).toHaveBeenCalledTimes(1)
      }
    })
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

export const CardYellow: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'yellow'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify card has yellow color (semantic-warning-50)
    const card = canvasElement.querySelector('.bg-semantic-warning-50')
    await expect(card).toBeTruthy()

    // Verify actions are present
    const buttons = canvas.getAllByRole('button')
    await expect(buttons.length).toBe(3)
  }
}

export const CardRed: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'red'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify card has red color (semantic-error-50)
    const card = canvasElement.querySelector('.bg-semantic-error-50')
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
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify info icon button is present (4 buttons: 3 actions + 1 info icon)', async () => {
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
    })
    
    await step('Click info icon button and verify handler is called', async () => {
      // Find the info icon button (it's typically the button with an info icon)
      const buttons = canvas.getAllByRole('button')
      // The info icon button is usually the one that's not one of the action buttons
      // We can identify it by finding a button that's not "Action 1", "Action 2", or the bell icon button
      const infoButton = buttons.find(btn => {
        const text = btn.textContent || ''
        return !text.includes('Action 1') && !text.includes('Action 2') && btn.querySelector('svg')
      })
      
      if (infoButton) {
        await userEvent.click(infoButton)
        await expect(args.onFzcardClickInfo).toHaveBeenCalledTimes(1)
      }
    })
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
    const primaryBtn = canvas.getByText('Action 1').closest('button')
    await expect(primaryBtn?.classList.contains('h-32')).toBe(true)
    
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
    const primaryBtn = canvas.getByText('Action 1').closest('button')
    await expect(primaryBtn?.classList.contains('h-44')).toBe(true)
    
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
    hasInfoIcon: true,
    defaultExpanded: true
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
    template: `<FzCard v-bind="args" class="m-8" @fzprimary:click="args.onFzprimaryClick" @fzsecondary:click="args.onFzsecondaryClick" @fztertiary:click="args.onFztertiaryClick"> 
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
    },
    onFzprimaryClick: fn(),
    onFzsecondaryClick: fn(),
    onFztertiaryClick: fn()
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify action buttons are rendered', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(3)
    })
    
    await step('Click primary action button and verify handler is called', async () => {
      const primaryBtn = canvas.getByText('Action 1').closest('button')
      if (primaryBtn) {
        await userEvent.click(primaryBtn)
        await expect(args.onFzprimaryClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Click secondary action button and verify handler is called', async () => {
      const secondaryBtn = canvas.getByText('Action 2').closest('button')
      if (secondaryBtn) {
        await userEvent.click(secondaryBtn)
        await expect(args.onFzsecondaryClick).toHaveBeenCalledTimes(1)
      }
    })
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
    template: `<FzCard v-bind="args" class="m-8" @fzprimary:click="args.onFzprimaryClick" @fzsecondary:click="args.onFzsecondaryClick" @fztertiary:click="args.onFztertiaryClick"> 
                        <div> Some random content </div>
                    </FzCard>`
  }),
  args: {
    title: 'Title',
    alwaysAlive: true,
    collapsible: true,
    onFzprimaryClick: fn(),
    onFzsecondaryClick: fn(),
    onFztertiaryClick: fn()
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify card renders with title', async () => {
      const title = canvas.getByText('Title')
      await expect(title).toBeInTheDocument()
    })
    
    await step('Verify content is present', async () => {
      const content = canvas.getByText('Some random content')
      await expect(content).toBeInTheDocument()
    })
    
    await step('Verify collapse button is present', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBe(1) // Only collapse button
    })
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
    collapsible: true,
    defaultExpanded: true
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

export const KeyboardNavigation: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    onFzprimaryClick: fn(), // Create new spy instance for this story
    onFzsecondaryClick: fn() // Create new spy instance for this story
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Focus primary action button and activate with Enter key', async () => {
      const primaryBtn = canvas.getByText('Action 1').closest('button')
      if (primaryBtn) {
        primaryBtn.focus()
        await expect(document.activeElement).toBe(primaryBtn)
        await userEvent.keyboard('{Enter}')
        await expect(args.onFzprimaryClick).toHaveBeenCalledTimes(1)
      }
    })
    
    await step('Focus secondary button and activate with Space key', async () => {
      const secondaryBtn = canvas.getByText('Action 2').closest('button')
      if (secondaryBtn) {
        secondaryBtn.focus()
        await expect(document.activeElement).toBe(secondaryBtn)
        await userEvent.keyboard(' ')
        await expect(args.onFzsecondaryClick).toHaveBeenCalledTimes(1)
      }
    })
  }
}

export const CardWithLongTitle: CardStory = {
  render: (args) => ({
    components: { FzCard, FzBadge },
    setup() {
      return {
        args
      }
    },
    template: `<FzCard v-bind="args" class="w-[500px] m-8" @fzprimary:click="args.onFzprimaryClick" @fzcard:click-info="args.onFzcardClickInfo"> 
                        <template #header>
                          <FzContainer horizontal layout="expand-first">
                            <FzBadge color="warning"> Badge </FzBadge>
                          </FzContainer> 
                        </template>
                        <p class="text-grey-800 m-0">
                          Questo esempio dimostra come il titolo molto lungo vada automaticamente a capo 
                          quando raggiunge la larghezza massima disponibile del container.
                        </p>
                    </FzCard>`
  }),
  args: {
    title: 'Questo è un titolo estremamente lungo che dovrebbe andare a capo automaticamente quando raggiunge la larghezza massima del container della card per dimostrare la funzionalità di text wrapping',
    primaryAction: {
      label: 'Conferma'
    },
    hasInfoIcon: true,
    color: 'blue',
    onFzprimaryClick: fn(),
    onFzcardClickInfo: fn()
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify card container exists', async () => {
      const card = canvasElement.querySelector('section.rounded')
      await expect(card).toBeTruthy()
    })
    
    await step('Verify title is rendered and contains expected text', async () => {
      const titleElement = canvasElement.querySelector('h2')
      await expect(titleElement).toBeTruthy()
      await expect(titleElement?.textContent).toContain('Questo è un titolo estremamente lungo')
      
      // Verify title has proper wrapping classes
      await expect(titleElement?.classList.contains('break-words')).toBe(true)
      await expect(titleElement?.classList.contains('overflow-wrap-anywhere')).toBe(true)
    })
    
    await step('Verify badge is present', async () => {
      const badge = canvas.getByText('Badge')
      await expect(badge).toBeInTheDocument()
    })
    
    await step('Verify buttons are present', async () => {
      const buttons = canvas.getAllByRole('button')
      await expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
    
    await step('Verify content is rendered', async () => {
      const content = canvas.getByText(/Questo esempio dimostra/)
      await expect(content).toBeInTheDocument()
    })
    
    await step('Click primary action button and verify handler is called', async () => {
      const primaryBtn = canvas.getByText('Conferma').closest('button')
      if (primaryBtn) {
        await userEvent.click(primaryBtn)
        await expect(args.onFzprimaryClick).toHaveBeenCalledTimes(1)
      }
    })
  }
}