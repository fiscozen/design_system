import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'

import { FzDialog, FzConfirmDialog, FzConfirmDialogProps } from '@fiscozen/dialog'
import { FzButton } from '@fiscozen/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: '@fiscozen/dialog/FzDialog',
  component: FzDialog,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    isDrawer: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' }
  },
  args: {}
} satisfies Meta<typeof FzDialog>

export default meta

const simpleDialog = (args: FzConfirmDialogProps) => ({
  setup() {
    const dialog = ref<InstanceType<typeof FzConfirmDialog>>()
    return { args, dialog: dialog.value }
  },
  components: { FzDialog, FzConfirmDialog, FzButton },
  template: `
    <div class="w-screen h-screen">
      <FzButton @click="dialog.show()">Open Modal</FzButton>
      <FzDialog v-bind="args" ref="dialog"><template #header>{{args.title}}</template></FzDialog>
    </div>
  `
})

export const SimpleDialog = {
  render: simpleDialog,
  args: {
    title: 'Titolo'
  }
}
