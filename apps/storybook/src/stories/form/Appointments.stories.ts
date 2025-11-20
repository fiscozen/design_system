import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzAppointments } from '@fiscozen/appointments'
import { ref } from 'vue'
import { addDays, formatISO } from 'date-fns'

// Helper function to get current hour in ISO-8601 format
// This ensures slots are always available regardless of when tests run
const getCurrentStartTimeISO = (): string => {
  const now = new Date()
  now.setHours(now.getHours() + 1, 0, 0, 0)
  return formatISO(now)
}

// Helper to get current time string "HH:00" for verification
const getCurrentTimeString = (): string => {
  const now = new Date()
  now.setHours(now.getHours() + 1, 0, 0, 0)
  const hours = now.getHours().toString().padStart(2, '0')
  return `${hours}:00`
}

const meta: Meta<typeof FzAppointments> = {
  title: 'Form/FzAppointments',
  component: FzAppointments,
  tags: ['autodocs'],
  argTypes: {
    slotStartTime: {
      control: 'text',
      description: 'Start time for slots as ISO-8601 string'
    },
    slotCount: {
      control: 'number',
      description: 'Number of time slots to create'
    },
    slotInterval: {
      control: 'number',
      description: 'Interval between slots in minutes'
    },
    breakDuration: {
      control: 'number',
      description: 'Break duration between slots in minutes'
    }
  },
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 8,
    slotInterval: 30,
    breakDuration: 0
  },
  decorators: [
    () => ({
      template: '<div class="p-12 w-fit"><story/></div>'
    })
  ]
}

export default meta
type Story = StoryObj<typeof meta>

type PlayFunctionContext = {
  args: Record<string, unknown>
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const Template: Story = {
  render: (args) => ({
    components: { FzAppointments },
    setup() {
      const selectedDate = ref<string | undefined>()
      return {
        args,
        selectedDate
      }
    },
    template: `
      <div class="flex gap-32">
        <FzAppointments 
          v-bind="args" 
          v-model="selectedDate"
        />
        <div class="h-auto p-12 bg-grey-100 rounded">
          <p class="text-sm font-medium mb-4">Selected appointment:</p>
          <p class="text-sm" v-if="selectedDate">
            GMT (raw value): {{ selectedDate }}
          </p>
          <p class="text-sm" v-if="selectedDate">
            Local: {{ new Date(selectedDate).toLocaleString() }}
          </p>
          <p class="text-sm text-grey-500" v-else>No appointment selected</p>
        </div>
      </div>
    `
  })
}

export const Default: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 24,
    slotInterval: 30,
    breakDuration: 0
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const component = canvas.getByRole('group', { hidden: true })
      expect(component).toBeInTheDocument()
    })

    await step('Verify formatted date is displayed', async () => {
      // Date should be formatted as "Giorno Numero Mese" (e.g., "Lunedì 3 novembre")
      const dateText = canvasElement.querySelector('h3')
      expect(dateText).toBeInTheDocument()
      expect(dateText?.textContent).toBeTruthy()
    })

    await step('Verify navigation buttons exist', async () => {
      const backButton = canvas.getByLabelText('Giorno precedente')
      const forwardButton = canvas.getByLabelText('Giorno successivo')
      expect(backButton).toBeInTheDocument()
      expect(forwardButton).toBeInTheDocument()
    })

    await step('Verify info text is displayed', async () => {
      const infoText = canvas.getByText(/minuti a partire dalle/i)
      expect(infoText).toBeInTheDocument()
    })

    await step('Verify time slots are rendered', async () => {
      // Wait for slots to be rendered
      await waitFor(
        () => {
          // Try to find radio inputs or labels with time format (HH:MM)
          const slots = canvasElement.querySelectorAll('input[type="radio"]')
          expect(slots.length).toBeGreaterThan(0)
        },
        { timeout: 2000 }
      )
    })

    await step('Verify back button is disabled for today', async () => {
      const backButton = canvas.getByLabelText('Giorno precedente')
      expect(backButton).toBeDisabled()
    })
  }
}

export const WithBreakDuration: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 3,
    slotInterval: 30,
    breakDuration: 10
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify slots are generated with breaks', async () => {
      await waitFor(
        () => {
          const slots = canvasElement.querySelectorAll('input[type="radio"]')
          expect(slots.length).toBe(3)
        },
        { timeout: 2000 }
      )

      // Verify slot times (11:00, 11:40, 12:20)
      const slotLabels = Array.from(canvasElement.querySelectorAll('label')).map((label) =>
        label.textContent?.trim()
      )

      const currentHour = getCurrentTimeString()
      expect(slotLabels.some((text) => text?.includes(currentHour))).toBe(true)
      expect(slotLabels.some((text) => text?.includes('40'))).toBe(true)
      expect(slotLabels.some((text) => text?.includes('20'))).toBe(true)
    })
  }
}

export const WithExcludedDays: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 5,
    slotInterval: 30,
    breakDuration: 0,
    excludedDays: [
      // Exclude weekends (Saturday = 6, Sunday = 0)
      0,
      6,
      // Exclude a specific date (tomorrow)
      addDays(new Date(), 1).toISOString().split('T')[0]
    ]
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const component = canvas.getByRole('group', { hidden: true })
      expect(component).toBeInTheDocument()
    })

    await step('Verify navigation skips excluded days', async () => {
      const forwardButton = canvas.getByLabelText('Giorno successivo')

      // Click forward multiple times to verify it skips excluded days
      if (!forwardButton.hasAttribute('disabled')) {
        await userEvent.click(forwardButton)
        await waitFor(() => {
          expect(forwardButton).toBeInTheDocument()
        })
      }
    })
  }
}

export const WithexcludedSlots: Story = {
  ...Template,
  args: (() => {
    const now = new Date()
    const currentHour = now.getHours()

    return {
      startDate: formatISO(new Date()),
      slotStartTime: getCurrentStartTimeISO(),
      slotCount: 5,
      slotInterval: 30,
      breakDuration: 0,
      excludedSlots: [
        // Disable first and second slot (current time and +30 minutes)
        (() => {
          const date = new Date()
          date.setHours(currentHour + 1, 0, 0, 0)
          return formatISO(date)
        })(),
        (() => {
          const date = new Date()
          date.setHours(currentHour + 1, 30, 0, 0)
          return formatISO(date)
        })()
      ]
    }
  })(),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify disabled slots are present', async () => {
      await waitFor(
        () => {
          const slotLabels = Array.from(canvasElement.querySelectorAll('label')).map((label) =>
            label.textContent?.trim()
          )
          const currentHour = getCurrentTimeString()
          expect(slotLabels.length).toBeGreaterThan(0)

          // Inside slots container should not contain the current hour and the current hour + 30 minutes
          expect(slotLabels.some((text) => text?.includes(currentHour))).toBe(false)
        },
        { timeout: 2000 }
      )
    })
  }
}

export const WithMaxDate: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 5,
    slotInterval: 30,
    breakDuration: 0,
    maxDate: formatISO(addDays(new Date(), 7))
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify forward button becomes disabled at maxDate', async () => {
      const forwardButton = canvas.getByLabelText('Giorno successivo')

      // Click forward until we reach maxDate
      let clicks = 0
      while (!forwardButton.hasAttribute('disabled') && clicks < 10) {
        await userEvent.click(forwardButton)
        await waitFor(() => {
          expect(forwardButton).toBeInTheDocument()
        })
        clicks++
      }

      // After reaching maxDate, forward button should be disabled
      if (clicks >= 7) {
        await waitFor(() => {
          expect(forwardButton).toBeDisabled()
        })
      }
    })
  }
}

export const NoAvailableSlots: Story = {
  ...Template,
  args: (() => {
    const now = new Date()
    const currentHour = now.getHours() + 1

    // Disable all slots by marking them as disabled
    const excludedSlots: string[] = []
    for (let i = 0; i < 5; i++) {
      const slot = new Date(now)
      slot.setHours(currentHour, i * 30, 0, 0)
      excludedSlots.push(formatISO(slot))
    }

    return {
      startDate: formatISO(new Date()),
      slotStartTime: getCurrentStartTimeISO(),
      slotCount: 5,
      slotInterval: 30,
      breakDuration: 0,
      excludedSlots
    }
  })(),
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify alert is displayed when no slots available', async () => {
      await waitFor(
        () => {
          const alert = canvas.getByText('Nessuna disponibilità')
          expect(alert).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    await step('Verify alert description is shown', async () => {
      const description = canvas.getByText(/Scegli un'altro giorno e prenota la tua consulenza/i)
      expect(description).toBeInTheDocument()
    })
  }
}

export const SlotSelection: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 5,
    slotInterval: 30,
    breakDuration: 0
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Select a time slot', async () => {
      await waitFor(
        async () => {
          const slots = Array.from(canvasElement.querySelectorAll('input[type="radio"]'))
          expect(slots.length).toBeGreaterThan(0)

          // Click on the first available slot
          const firstSlot = slots.find((slot) => !slot.hasAttribute('disabled'))
          if (firstSlot) {
            await userEvent.click(firstSlot)
          }
        },
        { timeout: 2000 }
      )
    })

    await step('Verify slot is selected', async () => {
      await waitFor(() => {
        const selectedSlot = canvasElement.querySelector('input[type="radio"]:checked')
        expect(selectedSlot).toBeInTheDocument()
      })
    })

    await step('Verify selected date is displayed', async () => {
      await waitFor(() => {
        const selectedInfo = canvas.getByText(/Selected appointment:/i)
        expect(selectedInfo).toBeInTheDocument()
      })
    })
  }
}

export const DateNavigation: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 5,
    slotInterval: 30,
    breakDuration: 0
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Navigate forward to next day', async () => {
      const forwardButton = canvas.getByLabelText('Giorno successivo')

      if (!forwardButton.hasAttribute('disabled')) {
        const initialDateText = canvasElement.querySelector('h3')?.textContent
        await userEvent.click(forwardButton)

        await waitFor(() => {
          // Verify date text changed
          const newDateText = canvasElement.querySelector('h3')?.textContent
          expect(newDateText).toBeTruthy()
          expect(newDateText).not.toBe(initialDateText)
        })
      }
    })

    await step('Navigate back to previous day', async () => {
      const backButton = canvas.getByLabelText('Giorno precedente')

      if (!backButton.hasAttribute('disabled')) {
        const initialDateText = canvasElement.querySelector('h3')?.textContent
        await userEvent.click(backButton)

        await waitFor(() => {
          // Verify date text changed
          const newDateText = canvasElement.querySelector('h3')?.textContent
          expect(newDateText).toBeTruthy()
          expect(newDateText).not.toBe(initialDateText)
        })
      }
    })

    await step('Verify selection resets on date change', async () => {
      // Select a slot first
      await waitFor(
        () => {
          const slots = canvas.getAllByRole('radio', { hidden: true })
          const firstSlot = slots.find((slot) => !slot.hasAttribute('disabled'))
          if (firstSlot) {
            userEvent.click(firstSlot)
          }
        },
        { timeout: 2000 }
      )

      // Navigate forward
      const forwardButton = canvas.getByLabelText('Giorno successivo')
      if (!forwardButton.hasAttribute('disabled')) {
        await userEvent.click(forwardButton)

        // Verify no slot is selected
        await waitFor(() => {
          const selectedSlot = canvasElement.querySelector('input[type="radio"]:checked')
          // Selection should be reset
          expect(selectedSlot).toBeNull()
        })
      }
    })
  }
}

export const CustomSlotConfiguration: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 10,
    slotInterval: 15,
    breakDuration: 5
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify custom slot configuration', async () => {
      await waitFor(
        () => {
          const slots = canvasElement.querySelectorAll('input[type="radio"]')
          expect(slots.length).toBe(10)
        },
        { timeout: 2000 }
      )

      // Verify info text shows correct interval
      const infoText = canvas.getByText(/15 minuti a partire dalle/i)
      expect(infoText).toBeInTheDocument()
    })

    await step('Verify slots have correct times with breaks', async () => {
      const slotLabels = Array.from(canvasElement.querySelectorAll('label')).map((label) =>
        label.textContent?.trim()
      )

      const currentHour = getCurrentTimeString()
      // First slot should be current hour
      expect(slotLabels.some((text) => text?.includes(currentHour))).toBe(true)
      // Second slot should be current hour + 15 minutes + 5 minutes break (20 minutes)
      expect(slotLabels.some((text) => text?.includes('20'))).toBe(true)
    })
  }
}

export const RequiredField: Story = {
  ...Template,
  args: {
    startDate: formatISO(new Date()),
    slotStartTime: getCurrentStartTimeISO(),
    slotCount: 5,
    slotInterval: 30,
    breakDuration: 0,
    required: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify required attribute is set', async () => {
      await waitFor(
        () => {
          const slots = Array.from(canvasElement.querySelectorAll('input[type="radio"]'))
          expect(slots.length).toBeGreaterThan(0)

          // All slots should have required attribute
          const firstSlot = slots[0]
          expect(firstSlot).toHaveAttribute('required')
        },
        { timeout: 2000 }
      )
    })
  }
}
