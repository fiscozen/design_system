import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import { FzDialog, FzConfirmDialog, FzConfirmDialogProps } from '@fiscozen/dialog'
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
    closeOnBackdrop: { control: 'boolean' },
    footerEnabled: { control: 'boolean' },
  },
  args: {}
} satisfies Meta<typeof FzDialog>

export default meta
type Story = StoryObj<typeof meta>

const simpleDialog = (args : FzConfirmDialogProps) => ({
  setup() {
    const dialog = ref<InstanceType<typeof FzConfirmDialog>>();
    return { args, dialog: dialog.value}
  },
  components: { FzDialog, FzConfirmDialog, FzButton },
  template: `
    <div class="w-screen h-screen">
      <FzButton @click="dialog.show()">Open Modal</FzButton>
      <FzConfirmDialog v-bind="args" ref="dialog"></FzConfirmDialog>
    </div>
  `
})

export const SimpleDialog = simpleDialog.bind({})
SimpleDialog.args = {
  title: 'Titolo',
  confirmLabel: 'Action 1',
  cancelLabel: 'Action 2',
}
