import type { Meta, StoryObj } from '@storybook/vue3'
import { FzStepper } from '@fiscozen/stepper'
import { ref } from 'vue'

const meta: Meta<typeof FzStepper> = {
  title: 'Navigation/FzStepper',
  component: FzStepper,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const steps = [
      {
        title: 'Step 1',
        description: 'Description 1',
        status: 'completed'
      },
      {
        title: 'Step 2',
        description: 'Description 2'
      },
      {
        title: 'Step 3',
        description: 'Description 3',
        status: 'error'
      },
      {
        title: 'Step 4',
        description: 'Description 4',
        status: 'disabled'
      },
      {
        title: 'Step 5',
        description: 'Description 5'
      }
]

const Default: Story = {
  args: {
    steps,
  },
  decorators: [() => ({ template: '<div style="padding:20px;" class="h-screen"><story/></div>' })],
  render: (args) => ({
    components: { FzStepper },
    setup() {
      const activeStep = ref(1)
      return {
        args,
        activeStep
      }
    },
    template: `
      <div class="w-full flex flex-col items-center">
        <FzStepper v-bind="args" v-model:activeStep="activeStep" />
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  })
}

const NoProgress: Story = {
  args: {
    steps,
    disableProgressBar: true
  },
  decorators: [() => ({ template: '<div style="padding:20px;" class="h-screen"><story/></div>' })],
  render: (args) => ({
    components: { FzStepper },
    setup() {
      const activeStep = ref(1)
      return {
        args,
        activeStep
      }
    },
    template: `
      <div class="w-full flex flex-col items-center">
        <FzStepper v-bind="args" v-model:activeStep="activeStep" />
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  })
}

export { Default, NoProgress }

export default meta
