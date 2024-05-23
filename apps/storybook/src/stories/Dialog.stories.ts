import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import { FzDialog, FzSimpleDialog, FzDialogProps } from '@fiscozen/dialog'
import {FzButton} from '@fiscozen/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Dialog',
  component: FzDialog,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    isDrawer: { control: 'boolean' },
  },
  args: {}
} satisfies Meta<typeof FzDialog>

export default meta
type Story = StoryObj<typeof meta>

const simpleDialog = (args : FzDialogProps) => ({
  setup() {
    const dialog = ref<InstanceType<typeof FzSimpleDialog>>();
    return { args, dialog: dialog.value}
  },
  components: { FzDialog, FzSimpleDialog, FzButton },
  template: `
    <div class="w-screen h-screen">
      <FzButton @click="dialog.show()">Open Modal</FzButton>
      <FzSimpleDialog v-bind="args" ref="dialog"></FzSimpleDialog>
    </div>
  `
})

export const SimpleDialog = simpleDialog.bind({})
SimpleDialog.args = {
  title: 'Titolo',
  confirmLabel: 'Action 1',
  cancelLabel: 'Action 2',
}
