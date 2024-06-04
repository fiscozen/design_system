import type { Meta, StoryObj } from '@storybook/vue3'
import { FzCard } from '@fiscozen/card'
import { FzCardColor } from '@fiscozen/card/src/types'


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
        template: `<FzCard v-bind="args" class="min-w-[500px] min-h-[500px] m-8" > 
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
            label: 'Action 1',
            callback: () => {
                console.log('Primary action clicked')
            }
        },
        secondaryAction: {
            label: 'Action 2',
            callback: () => {
                console.log('Secondary action clicked')
            }
        },
        tertiaryAction: {
            icon: 'bell',
            callback: () => {
                console.log('Tertiary action clicked')
            }
        }
    }
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