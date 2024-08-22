import type { Meta, StoryObj } from '@storybook/vue3'
import { FzDatepicker } from '@fiscozen/datepicker'
import {ref} from 'vue'

const meta: Meta<typeof FzDatepicker> = {
  title: '@fiscozen/datepicker/FzDatepicker',
  component: FzDatepicker,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    inputProps: {
      label: 'datepicker label'
    }
  },
  decorators: []
}

type Story = StoryObj<typeof meta>

const Template: Story = {
  render: (args) => ({
    components: {FzDatepicker},
    setup() {
      const date = ref();
      return {
        date,
        args
      }
    },
    template: `<FzDatepicker v-bind="args" v-model="date" />`
  }),
}

const Default: Story = {
  ...Template,
  args: {},
}

const Range: Story = {
  ...Template,
  args: {
    range: true
  }
}

const AutoRange: Story = {
  ...Template,
  args: {
    range: { autoRange: 5},
  }
}

const WeekPicker: Story = {
  ...Template,
  args: {
    weekPicker: true,
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
    multiDates: {limit: 4},
    autoApply: false
  }
}

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1);
const afterTomorrow = new Date(tomorrow)
afterTomorrow.setDate(tomorrow.getDate() + 1);

const DisabledDates: Story = {
  ...Template,
  args: {
    disabledDates: [tomorrow, afterTomorrow]
  }
}

const isDisabled = (date: Date) => {
  let res = false;

  if (date.getFullYear() === 2022) {
    res = true;
  }

  return res;
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
    components: {FzDatepicker},
    setup() {
      const date = ref();
      return {
        date,
        args
      }
    },
    template: `<p>{{ date }}</p><FzDatepicker v-bind="args" v-model="date" />`
  }),
  args: {
    valueFormat: 'yyyy-MM-dd'
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
  StringValueFormat
}

export default meta
