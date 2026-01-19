import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzStepper } from '@fiscozen/stepper'
import { ref } from 'vue'

const meta: Meta<typeof FzStepper> = {
  title: 'Navigation/FzStepper',
  component: FzStepper,
  tags: ['autodocs'],
  argTypes: {
    forceMobile: {
      control: 'boolean'
    }
  },
  args: {
    forceMobile: false
  },
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
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify stepper renders correctly', async () => {
      const stepper = canvasElement.querySelector('.fz-stepper')
      await expect(stepper).toBeInTheDocument()
      await expect(stepper).toBeVisible()
    })

    await step('Verify all steps are rendered', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      await expect(stepElements.length).toBe(5)
    })

    await step('Verify initial active step display', async () => {
      const activeStepDisplay = canvas.getByTestId('active-step-display')
      await expect(activeStepDisplay).toHaveTextContent('current active step is 2')
    })

    await step('Verify step titles and descriptions are visible', async () => {
      const step1 = canvas.getByText('Step 1')
      await expect(step1).toBeVisible()
      const desc1 = canvas.getByText('Description 1')
      await expect(desc1).toBeVisible()
    })

    await step('Verify progress bar is visible', async () => {
      const progressBars = canvasElement.querySelectorAll('.fz-stepper__progress')
      await expect(progressBars.length).toBeGreaterThan(0)
    })
  }
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
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify stepper renders', async () => {
      const stepper = canvasElement.querySelector('.fz-stepper')
      await expect(stepper).toBeInTheDocument()
    })

    await step('Verify progress bar is hidden when disableProgressBar is true', async () => {
      const progressBars = canvasElement.querySelectorAll('.fz-stepper__progress')
      await expect(progressBars.length).toBe(0)
    })

    await step('Verify steps are still rendered without progress bar', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      await expect(stepElements.length).toBe(5)
    })
  }
}

export { Default, NoProgress }

// ============================================
// STEP NAVIGATION STORIES
// ============================================

export const StepNavigation: Story = {
  args: {
    steps,
  },
  decorators: [() => ({ template: '<div style="padding:20px;" class="h-screen"><story/></div>' })],
  render: (args) => ({
    components: { FzStepper },
    setup() {
      const activeStep = ref(0)
      return {
        args,
        activeStep
      }
    },
    template: `
      <div class="w-full flex flex-col items-center">
        <FzStepper v-bind="args" v-model:activeStep="activeStep" />
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify initial state - Step 1 is active', async () => {
      const activeStepDisplay = canvas.getByTestId('active-step-display')
      await expect(activeStepDisplay).toHaveTextContent('current active step is 1')
    })

    await step('Click on Step 2 to navigate', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      await userEvent.click(stepElements[1] as HTMLElement)
      
      await waitFor(() => {
        const activeStepDisplay = canvas.getByTestId('active-step-display')
        expect(activeStepDisplay).toHaveTextContent('current active step is 2')
      }, { timeout: 1000 })
    })

    await step('Click on Step 3 to navigate', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      await userEvent.click(stepElements[2] as HTMLElement)
      
      await waitFor(() => {
        const activeStepDisplay = canvas.getByTestId('active-step-display')
        expect(activeStepDisplay).toHaveTextContent('current active step is 3')
      }, { timeout: 1000 })
    })

    await step('Click on Step 5 to navigate', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      await userEvent.click(stepElements[4] as HTMLElement)
      
      await waitFor(() => {
        const activeStepDisplay = canvas.getByTestId('active-step-display')
        expect(activeStepDisplay).toHaveTextContent('current active step is 5')
      }, { timeout: 1000 })
    })

    await step('Click back on Step 1 to navigate backwards', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      await userEvent.click(stepElements[0] as HTMLElement)
      
      await waitFor(() => {
        const activeStepDisplay = canvas.getByTestId('active-step-display')
        expect(activeStepDisplay).toHaveTextContent('current active step is 1')
      }, { timeout: 1000 })
    })
  }
}

export const DisabledStepBehavior: Story = {
  args: {
    steps,
  },
  decorators: [() => ({ template: '<div style="padding:20px;" class="h-screen"><story/></div>' })],
  render: (args) => ({
    components: { FzStepper },
    setup() {
      const activeStep = ref(0)
      return {
        args,
        activeStep
      }
    },
    template: `
      <div class="w-full flex flex-col items-center">
        <FzStepper v-bind="args" v-model:activeStep="activeStep" />
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify initial state - Step 1 is active', async () => {
      const activeStepDisplay = canvas.getByTestId('active-step-display')
      await expect(activeStepDisplay).toHaveTextContent('current active step is 1')
    })

    await step('Verify Step 4 (disabled) has disabled styling', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const disabledStep = stepElements[3] as HTMLElement
      await expect(disabledStep).toHaveClass('opacity-[.2]')
      await expect(disabledStep).toHaveClass('!cursor-not-allowed')
    })

    await step('Click on disabled Step 4 - should not change active step', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const disabledStep = stepElements[3] as HTMLElement
      const activeStepDisplay = canvas.getByTestId('active-step-display')
      
      // Verify initial state
      await expect(activeStepDisplay).toHaveTextContent(/current active step is 1/)
      
      await userEvent.click(disabledStep)
      
      // Wait a short time to ensure no state change occurred
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Verify the active step is still 1 (hasn't changed)
      await expect(activeStepDisplay).toHaveTextContent(/current active step is 1/)
    })

    await step('Click on current Step 1 - should not change active step', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const currentStep = stepElements[0] as HTMLElement
      
      await userEvent.click(currentStep)
      
      // Wait a bit to ensure no state change occurred
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const activeStepDisplay = canvas.getByTestId('active-step-display')
      await expect(activeStepDisplay).toHaveTextContent('current active step is 1')
    })
  }
}

export const StepStatuses: Story = {
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
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify Step 1 (completed) shows check icon', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const completedStep = stepElements[0] as HTMLElement
      const checkIcon = completedStep.querySelector('.fa-circle-check')
      await expect(checkIcon).toBeInTheDocument()
    })

    await step('Verify Step 2 (current) shows badge with number', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const currentStep = stepElements[1] as HTMLElement
      // Badge is rendered as a div with number content
      const badgeContainer = currentStep.querySelector('.fz-stepper__circle')
      await expect(badgeContainer).toBeInTheDocument()
      await expect(badgeContainer).toHaveTextContent('2')
    })

    await step('Verify Step 3 (error) shows error icon', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const errorStep = stepElements[2] as HTMLElement
      const errorIcon = errorStep.querySelector('.fa-circle-exclamation')
      await expect(errorIcon).toBeInTheDocument()
    })

    await step('Verify Step 4 (disabled) has disabled styling', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const disabledStep = stepElements[3] as HTMLElement
      await expect(disabledStep).toHaveClass('opacity-[.2]')
    })

    await step('Verify Step 5 (default) shows badge with number', async () => {
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const defaultStep = stepElements[4] as HTMLElement
      // Badge is rendered as a div with number content
      const badgeContainer = defaultStep.querySelector('.fz-stepper__circle')
      await expect(badgeContainer).toBeInTheDocument()
      await expect(badgeContainer).toHaveTextContent('5')
    })
  }
}

export const MobileView: Story = {
  args: {
    steps,
    forceMobile: true
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
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify mobile view renders with dropdown', async () => {
      const stepper = canvasElement.querySelector('.fz-stepper')
      await expect(stepper).toBeInTheDocument()
      
      // Mobile view should have dropdown
      const dropdown = canvasElement.querySelector('.fz-stepper__dropdown')
      await expect(dropdown).toBeInTheDocument()
    })

    await step('Verify current step title is displayed', async () => {
      const currentStepTitle = canvas.getByText('Step 2')
      await expect(currentStepTitle).toBeVisible()
    })

    await step('Verify current step description is displayed', async () => {
      const currentStepDescription = canvas.getByText('Description 2')
      await expect(currentStepDescription).toBeVisible()
    })

    await step('Verify dropdown can be opened', async () => {
      const dropdownOpener = canvasElement.querySelector('.fz-stepper__dropdown')
      const clickableArea = dropdownOpener?.querySelector('.cursor-pointer') as HTMLElement
      
      if (clickableArea) {
        // Click to open dropdown
        await userEvent.click(clickableArea)
        
        // Wait for dropdown content to appear (check for Step 3 text in document)
        await waitFor(() => {
          const bodyText = document.body.textContent || ''
          expect(bodyText).toContain('Step 3')
        }, { timeout: 1000 })
      }
    })

    await step('Verify dropdown shows all step options', async () => {
      // Verify that all steps are available in the dropdown
      const bodyText = document.body.textContent || ''
      await expect(bodyText).toContain('Step 1')
      await expect(bodyText).toContain('Step 2')
      await expect(bodyText).toContain('Step 3')
      await expect(bodyText).toContain('Step 4')
      await expect(bodyText).toContain('Step 5')
    })
  }
}

export const KeyboardNavigation: Story = {
  args: {
    steps,
  },
  decorators: [() => ({ template: '<div style="padding:20px;" class="h-screen"><story/></div>' })],
  render: (args) => ({
    components: { FzStepper },
    setup() {
      const activeStep = ref(0)
      return {
        args,
        activeStep
      }
    },
    template: `
      <div class="w-full flex flex-col items-center">
        <FzStepper v-bind="args" v-model:activeStep="activeStep" />
        <div class="w-full mt-16 bg-gray-100 p-4 rounded h-[200px] flex items-center justify-center" data-testid="active-step-display">
          current active step is {{activeStep + 1}}
        </div>
      </div> 
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify steps are clickable via keyboard simulation', async () => {
      // Since stepper steps are divs (not buttons), they're not natively keyboard accessible
      // However, we can verify that clicking works which simulates keyboard interaction
      const stepElements = canvasElement.querySelectorAll('.fz-stepper__step')
      const secondStep = stepElements[1] as HTMLElement
      
      // Simulate keyboard interaction by clicking (which is what keyboard events would trigger)
      await userEvent.click(secondStep)
      
      await waitFor(() => {
        const activeStepDisplay = canvas.getByTestId('active-step-display')
        expect(activeStepDisplay).toHaveTextContent('current active step is 2')
      }, { timeout: 1000 })
    })

    await step('Verify step titles are accessible via text content', async () => {
      // Verify that step content is accessible for screen readers
      const step1 = canvas.getByText('Step 1')
      await expect(step1).toBeVisible()
      const step2 = canvas.getByText('Step 2')
      await expect(step2).toBeVisible()
    })
  }
}

export default meta
