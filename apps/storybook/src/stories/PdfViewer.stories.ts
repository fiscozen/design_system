import type { Meta, StoryObj } from '@storybook/vue3'
import { FzPdfViewer } from '@fiscozen/pdf-viewer'

const meta: Meta<typeof FzPdfViewer> = {
  title: '@fiscozen/pdf-viewer/FzPdfViewer',
  component: FzPdfViewer,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    src: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  }
}

export { Default }

export default meta
