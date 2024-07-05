import type { Meta, StoryObj } from '@storybook/vue3'
import { FzToastQueue, enqueueToast } from '@fiscozen/toast'
import { FzButton } from '@fiscozen/button'

const meta: Meta<typeof FzToastQueue> = {
  title: '@fiscozen/toast/FzToastQueue',
  component: FzToastQueue,
  tags: ['autodocs'],
  argTypes: {
    
  },
  args: {
    
  },
  decorators: [
    () => ({
      components: {FzButton},
      setup() {
        function handleEnqueue(type: 'success' | 'warning' | 'success') {
          enqueueToast({ type, message: 'This is a toast.' })
        }

        return {
          handleEnqueue
        }
      },
      template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Success</FzButton>
          <FzButton @click="handleEnqueue('warning')">Warning</FzButton>
          <FzButton @click="handleEnqueue('error')" class="mb-6 mr-auto">Error</FzButton>
          <story/>
        </div>
      `
    })
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
  }
}

export { Default }

export default meta
