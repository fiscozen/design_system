import type { Meta, StoryObj } from '@storybook/vue3-vite'
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
  }
}

export const CardWithSecondaryActionOnly: CardStory = {
  ...Template,
  args: {
    ...Template.args,
    secondaryAction: {
      label: 'Secondary Action'
    }
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
  }
}

export const CardOrange: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'orange'
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
  }
}

export const CardGrey: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    color: 'grey'
  }
}

export const CardWithInfoIcon: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    hasInfoIcon: true
  }
}

export const CardBackoffice: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    environment: 'backoffice'
  }
}

export const CardFrontoffice: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    environment: 'frontoffice'
  }
}

export const CardCollapsible: CardStory = {
  ...CardWithActions,
  args: {
    ...CardWithActions.args,
    collapsible: true,
    hasInfoIcon: true
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
  }
}