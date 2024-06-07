import type { Meta, StoryObj } from '@storybook/vue3'
import { FzCard, FzCardColor } from '@fiscozen/card'


const meta = {
    title: 'Card',
    component: FzCard,
    tags: ['autodocs'],
} satisfies Meta<typeof FzCard>
export default meta

type CardStory = StoryObj<typeof FzCard>

const Template: CardStory = {
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
        template: `<FzCard v-bind="args" class="w-[500px] h-[500px] m-8" @click:primary="onPrimaryAction" @click:secondary="onSecondaryAction" @click:tertiary="onTertiaryAction"> 
                        <div> Content </div>
                    </FzCard>`
    }),
    args: {
        title: 'Title',
    },
}

export const BasicCard: CardStory = {
    ...Template,
    args: {
        ...Template.args,
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
}

export const CardPurple: CardStory = {
    ...CardWithActions,
    args: {
        ...CardWithActions.args,
        color: FzCardColor.Purple,
    }
}

export const CardOrange: CardStory = {
    ...CardWithActions,
    args: {
        ...CardWithActions.args,
        color: FzCardColor.Orange,
    }
}

export const CardBlue: CardStory = {
    ...CardWithActions,
    args: {
        ...CardWithActions.args,
        color: FzCardColor.Blue,
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
        template: `<FzCard v-bind="args" class="m-8" @click:primary="onPrimaryAction" @click:secondary="onSecondaryAction" @click:tertiary="onTertiaryAction"> 
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
    },
}