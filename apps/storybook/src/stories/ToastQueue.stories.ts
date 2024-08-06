import type { Meta, StoryObj } from '@storybook/vue3'
import { FzToastQueue, FzToastQueueProps, enqueueToast } from '@fiscozen/toast'
import { FzButton } from '@fiscozen/button'
import { ref } from 'vue'

const meta: Meta<typeof FzToastQueue> = {
  title: '@fiscozen/toast/FzToastQueue',
  tags: ['autodocs'],
  component: FzToastQueue,
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'right']
    }
  }
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
  },
  render: (args: FzToastQueueProps) => ({
    components: {FzToastQueue, FzButton},
    setup: () => {
      function handleEnqueue(type: 'success' | 'warning' | 'success') {
        enqueueToast({ type, message: 'This is a toast.' })
      }

      function handleEnqueueLong(type: 'success' | 'warning' | 'success') {
        enqueueToast({ type, message: 'This is a long long long long long long long long long long long long long long long long long long long long long long long long long toast.' })
      }

      return {
        handleEnqueue,
        handleEnqueueLong,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Success</FzButton>
          <FzButton @click="handleEnqueue('warning')">Warning</FzButton>
          <FzButton @click="handleEnqueue('error')" class="mb-6">Error</FzButton>
          <FzButton @click="handleEnqueueLong('error')" class="mb-6 mr-auto">Error long</FzButton>
          <FzToastQueue v-bind="args" />
        </div>
      `
  })
}

const CustomQueue: Story = {
  args: {
  },
  render: (args: FzToastQueueProps) => ({
    components: {FzToastQueue, FzButton},
    setup: () => {
      const toasts = ref([]);

      function handleEnqueue(type: 'success' | 'warning' | 'success') {
        enqueueToast({ type, message: 'This is a toast.' }, toasts)
      }

      function handleEnqueueLong(type: 'success' | 'warning' | 'success') {
        enqueueToast({ 
          type,
          message: 'This is a long long long long long long long long long long long long long long long long long long long long long long long long long toast.',
        }, toasts)
      }

      return {
        handleEnqueue,
        handleEnqueueLong,
        toasts,
        args
      }
    },
    template: `
        <div class="h-screen flex m-20 gap-8 items-start">
          <FzButton @click="handleEnqueue('success')">Success</FzButton>
          <FzButton @click="handleEnqueue('warning')">Warning</FzButton>
          <FzButton @click="handleEnqueue('error')" class="mb-6">Error</FzButton>
          <FzButton @click="handleEnqueueLong('error')" class="mb-6 mr-auto">Error long</FzButton>
          <FzToastQueue :toasts="toasts" v-bind="args" />
        </div>
      `
  })
}

export { Default, CustomQueue }

export default meta
