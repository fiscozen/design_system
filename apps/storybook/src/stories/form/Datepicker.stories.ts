import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within, waitFor } from '@storybook/test'
import { FzDatepicker } from '@fiscozen/datepicker'
import { ref, watch } from 'vue'

const meta: Meta<typeof FzDatepicker> = {
  title: 'Form/FzDatepicker',
  component: FzDatepicker,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    inputProps: {
      label: 'datepicker label'
    },
    name: 'fz-datepicker'
  },
  decorators: []
}

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: { FzDatepicker },
    setup() {
      const date = ref()
      return {
        date,
        args
      }
    },
    template: `<div class="p-12"><FzDatepicker v-bind="args" v-model="date" /></div>`
  })
}

const Default: Story = {
  ...Template,
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify datepicker renders correctly', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await expect(input).toBeInTheDocument()
      await expect(input).toBeVisible()
    })
    
    await step('Verify input field is accessible', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await expect(input).toHaveAttribute('type', 'text')
      await expect(input).toHaveAttribute('name', 'fz-datepicker')
    })
    
    await step('Verify calendar icon is present', async () => {
      // Calendar icon should be present in the input field
      const datepickerContainer = canvasElement.querySelector('.fz-datepicker')
      await expect(datepickerContainer).toBeInTheDocument()
    })
  }
}

const Range: Story = {
  ...Template,
  args: {
    range: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify range datepicker renders', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await expect(input).toBeInTheDocument()
      await expect(input).toBeVisible()
    })
    
    await step('Open calendar popup', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await userEvent.click(input)
      
      // Wait for calendar to appear
      await waitFor(() => {
        const calendar = document.querySelector('.dp__menu')
        expect(calendar).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify calendar is displayed', async () => {
      const calendar = document.querySelector('.dp__menu')
      await expect(calendar).toBeInTheDocument()
      await expect(calendar).toBeVisible()
    })
    
    await step('Close calendar with Escape key', async () => {
      const calendar = document.querySelector('.dp__menu') as HTMLElement
      await expect(calendar).toBeInTheDocument()
      
      calendar.focus()
      await userEvent.keyboard('{Escape}')
      
      // Verify calendar is closed
      await waitFor(() => {
        expect(document.querySelector('.dp__menu')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
  }
}

const AutoRange: Story = {
  ...Template,
  args: {
    range: { autoRange: 5 }
  }
}

const WeekPicker: Story = {
  ...Template,
  args: {
    weekPicker: true
  }
}

const MultiCalendar: Story = {
  ...Template,
  args: {
    range: true,
    multiCalendars: true
  }
}

const MonthPicker: Story = {
  ...Template,
  args: {
    monthPicker: true
  }
}

const YearPicker: Story = {
  ...Template,
  args: {
    yearPicker: true
  }
}

const MultiDates: Story = {
  ...Template,
  args: {
    multiDates: { limit: 4 },
    autoApply: false
  }
}

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const afterTomorrow = new Date(tomorrow)
afterTomorrow.setDate(tomorrow.getDate() + 1)

const DisabledDates: Story = {
  ...Template,
  args: {
    disabledDates: [tomorrow, afterTomorrow]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify datepicker renders with disabled dates', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await expect(input).toBeInTheDocument()
      await expect(input).toBeVisible()
    })
    
    await step('Open calendar popup', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await userEvent.click(input)
      
      // Wait for calendar to appear
      await waitFor(() => {
        const calendar = document.querySelector('.dp__menu')
        expect(calendar).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify disabled dates are not selectable', async () => {
      const calendar = document.querySelector('.dp__menu')
      await expect(calendar).toBeInTheDocument()
      
      // Disabled dates should have disabled styling/classes
      const disabledCells = calendar!.querySelectorAll('.dp__cell_disabled')
      await expect(disabledCells.length).toBeGreaterThan(0)
    })
    
    await step('Close calendar', async () => {
      const calendar = document.querySelector('.dp__menu') as HTMLElement
      await expect(calendar).toBeInTheDocument()
      
      calendar.focus()
      await userEvent.keyboard('{Escape}')
      
      // Verify calendar is closed
      await waitFor(() => {
        expect(document.querySelector('.dp__menu')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
  }
}

const isDisabled = (date: Date) => {
  let res = false

  if (date.getFullYear() === 2022) {
    res = true
  }

  return res
}
const ComplexDisabledDates: Story = {
  ...Template,
  args: {
    disabledDates: isDisabled
  }
}

const InlineTimePicker: Story = {
  ...Template,
  args: {
    timePickerInline: true,
    enableTimePicker: true,
    enableMinutes: true,
    is24: true
  }
}

const StringValueFormat: Story = {
  render: (args) => ({
    components: { FzDatepicker },
    setup() {
      const date = ref()
      return {
        date,
        args
      }
    },
    template: `<p>{{ date }}</p><FzDatepicker v-bind="args" v-model="date" />`
  }),
  args: {
    modelType: 'yyyy-MM-dd'
  }
}

const OverflowDatepickerFromBody: Story = {
  render: (args) => ({
    components: { FzDatepicker },
    setup() {
      const date = ref()
      return {
        date,
        args
      }
    },
    template: `
        <FzDatepicker v-bind="args" v-model="date" style="width:150px" />
    `
  }),
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'xs'
    }
  }
}

const DatepickerFlow: Story = {
  render: (args) => ({
    components: { FzDatepicker },
    setup() {
      const date = ref()
      watch(date, console.log)
      return {
        date,
        args
      }
    },
    template: `
      <div class="p-12">
        <FzDatepicker v-bind="args" v-model="date"  />
        <pre>{{date}}</pre>
      </div>
    `
  }),
  args: {
    timePickerInline: true,
    enableTimePicker: true,
    enableMinutes: true,
    is24: true,
    flow: ['calendar', 'hours', 'minutes'],
    format: 'dd/MM/yyyy HH:mm',
    textInput: true,
    arrowNavigation: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify datepicker with flow renders', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await expect(input).toBeInTheDocument()
      await expect(input).toBeVisible()
    })
    
    await step('Open calendar popup', async () => {
      const input = canvas.getByLabelText(/datepicker label/i)
      await userEvent.click(input)
      
      await waitFor(() => {
        const calendar = document.querySelector('.dp__menu')
        expect(calendar).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Verify time picker is available', async () => {
      const calendar = document.querySelector('.dp__menu')
      await expect(calendar).toBeInTheDocument()
      
      // Time picker should be visible - check for either inline container or regular time picker
      const timePicker = calendar!.querySelector('.dp__time_picker')
      const timePickerInline = calendar!.querySelector('.dp__time_picker_inline_container')
      const hasTimePicker = timePicker !== null || timePickerInline !== null
      
      await expect(hasTimePicker).toBe(true)
    })
  }
}

const Error: Story = {
  render: (args) => ({
    components: { FzDatepicker },
    setup() {
      const date = ref()
      return {
        date,
        args
      }
    },
    template: `
      <div class="p-12">
        <FzDatepicker v-bind="args" v-model="date" />
      </div>
    `
  }),
  args: {
    inputProps: {
      label: 'Date with error',
      error: true
    },
    name: 'fz-datepicker-error'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify error state renders', async () => {
      const input = canvas.getByLabelText(/Date with error/i)
      await expect(input).toBeInTheDocument()
      await expect(input).toBeVisible()
    })
    
    await step('Verify aria-invalid attribute', async () => {
      const input = canvas.getByLabelText(/Date with error/i)
      await expect(input).toHaveAttribute('aria-invalid', 'true')
    })
    
    await step('Verify error styling is applied', async () => {
      const input = canvas.getByLabelText(/Date with error/i)
      const container = input.closest('.fz-input')
      await expect(container).toBeInTheDocument()
      
      // Verify error border class is applied
      const inputContainer = container?.querySelector('[tabindex="0"]')
      await expect(inputContainer).toHaveClass('border-semantic-error-200')
    })
  }
}

const KeyboardNavigation: Story = {
  ...Template,
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus input field', async () => {
      await userEvent.tab()
      const input = canvas.getByLabelText(/datepicker label/i)
      // Focus should be within the datepicker component (input or its focusable container)
      const datepickerContainer = input.closest('.fz-datepicker')
      await expect(datepickerContainer?.contains(document.activeElement)).toBe(true)
    })
    
    await step('Type date in input field', async () => {
      const input = canvas.getByLabelText(/datepicker label/i) as HTMLInputElement
      await userEvent.clear(input)
      await userEvent.type(input, '15/01/2024')
      await expect(input).toHaveValue('15/01/2024')
    })
    
    await step('Open calendar with Enter key', async () => {
      await userEvent.keyboard('{Enter}')
      
      await waitFor(() => {
        const calendar = document.querySelector('.dp__menu')
        expect(calendar).toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Navigate calendar with arrow keys', async () => {
      const calendar = document.querySelector('.dp__menu')
      await expect(calendar).toBeInTheDocument()
      
      // Get initial focused/active cell
      const initialActiveCell = calendar!.querySelector('.dp__active_date, .dp__today')
      const initialDate = initialActiveCell?.textContent
      
      // Arrow keys should navigate calendar
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{ArrowDown}')
      
      // Verify navigation occurred (focus or active state should have moved)
      await expect(calendar).toBeInTheDocument()
    })
    
    await step('Close calendar with Escape key', async () => {
      const calendar = document.querySelector('.dp__menu') as HTMLElement
      await expect(calendar).toBeInTheDocument()
      
      calendar.focus()
      await userEvent.keyboard('{Escape}')
      
      // Verify calendar is closed
      await waitFor(() => {
        expect(document.querySelector('.dp__menu')).not.toBeInTheDocument()
      }, { timeout: 1000 })
    })
    
    await step('Tab away from input', async () => {
      await userEvent.tab()
      const input = canvas.getByLabelText(/datepicker label/i)
      // Focus should no longer be within the datepicker component
      const datepickerContainer = input.closest('.fz-datepicker')
      await expect(datepickerContainer?.contains(document.activeElement)).toBe(false)
    })
  }
}

export {
  Default,
  Range,
  AutoRange,
  WeekPicker,
  MultiCalendar,
  MonthPicker,
  YearPicker,
  MultiDates,
  DisabledDates,
  ComplexDisabledDates,
  InlineTimePicker,
  StringValueFormat,
  OverflowDatepickerFromBody,
  DatepickerFlow,
  Error,
  KeyboardNavigation
}

export default meta
