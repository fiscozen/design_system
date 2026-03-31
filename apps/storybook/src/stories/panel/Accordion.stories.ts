import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import { ref } from 'vue'
import { FzAccordion, FzCollapse } from '@fiscozen/collapse'

const meta = {
  title: 'Panel/FzAccordion',
  component: FzAccordion,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
    },
  },
  args: {
    multiple: false,
  },
} satisfies Meta<typeof FzAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const ExclusiveMode: Story = {
  args: {
    multiple: false,
  },
  render: (args) => ({
    components: { FzAccordion, FzCollapse },
    setup() {
      const open1 = ref(false)
      const open2 = ref(false)
      const open3 = ref(false)
      return { args, open1, open2, open3 }
    },
    template: `
      <FzAccordion v-bind="args">
        <FzCollapse title="Section 1" icon="face-smile" subtitle="First section" v-model:open="open1">
          <template #content>
            <p>Content for section 1. Opening another section will close this one.</p>
          </template>
        </FzCollapse>
        <FzCollapse title="Section 2" icon="face-smile" subtitle="Second section" v-model:open="open2">
          <template #content>
            <p>Content for section 2.</p>
          </template>
        </FzCollapse>
        <FzCollapse title="Section 3" icon="face-smile" subtitle="Third section" v-model:open="open3">
          <template #content>
            <p>Content for section 3.</p>
          </template>
        </FzCollapse>
      </FzAccordion>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    const summaries = canvasElement.querySelectorAll('[data-e2e="summary"]')

    await step('Verify all panels start closed', async () => {
      const details = canvasElement.querySelectorAll('details')
      details.forEach((detail) => {
        expect(detail).not.toHaveAttribute('open')
      })
    })

    await step('Open first panel', async () => {
      await userEvent.click(summaries[0] as HTMLElement)
      await waitFor(() => {
        const details = canvasElement.querySelectorAll('details')
        expect(details[0]).toHaveAttribute('open')
      }, { timeout: 500 })
    })

    await step('Open second panel - first should close', async () => {
      await userEvent.click(summaries[1] as HTMLElement)
      await waitFor(() => {
        const details = canvasElement.querySelectorAll('details')
        expect(details[0]).not.toHaveAttribute('open')
        expect(details[1]).toHaveAttribute('open')
      }, { timeout: 500 })
    })

    await step('Open third panel - second should close', async () => {
      await userEvent.click(summaries[2] as HTMLElement)
      await waitFor(() => {
        const details = canvasElement.querySelectorAll('details')
        expect(details[1]).not.toHaveAttribute('open')
        expect(details[2]).toHaveAttribute('open')
      }, { timeout: 500 })
    })
  },
}

export const MultipleMode: Story = {
  args: {
    multiple: true,
  },
  render: (args) => ({
    components: { FzAccordion, FzCollapse },
    setup() {
      const open1 = ref(false)
      const open2 = ref(false)
      const open3 = ref(false)
      return { args, open1, open2, open3 }
    },
    template: `
      <FzAccordion v-bind="args">
        <FzCollapse title="Section 1" icon="face-smile" v-model:open="open1">
          <template #content>
            <p>Content for section 1. Multiple panels can be open at once.</p>
          </template>
        </FzCollapse>
        <FzCollapse title="Section 2" icon="face-smile" v-model:open="open2">
          <template #content>
            <p>Content for section 2.</p>
          </template>
        </FzCollapse>
        <FzCollapse title="Section 3" icon="face-smile" v-model:open="open3">
          <template #content>
            <p>Content for section 3.</p>
          </template>
        </FzCollapse>
      </FzAccordion>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    const summaries = canvasElement.querySelectorAll('[data-e2e="summary"]')

    await step('Open first panel', async () => {
      await userEvent.click(summaries[0] as HTMLElement)
      await waitFor(() => {
        const details = canvasElement.querySelectorAll('details')
        expect(details[0]).toHaveAttribute('open')
      }, { timeout: 500 })
    })

    await step('Open second panel - first stays open', async () => {
      await userEvent.click(summaries[1] as HTMLElement)
      await waitFor(() => {
        const details = canvasElement.querySelectorAll('details')
        expect(details[0]).toHaveAttribute('open')
        expect(details[1]).toHaveAttribute('open')
      }, { timeout: 500 })
    })

    await step('Open third panel - all three open', async () => {
      await userEvent.click(summaries[2] as HTMLElement)
      await waitFor(() => {
        const details = canvasElement.querySelectorAll('details')
        expect(details[0]).toHaveAttribute('open')
        expect(details[1]).toHaveAttribute('open')
        expect(details[2]).toHaveAttribute('open')
      }, { timeout: 500 })
    })
  },
}

export const ButtonVariantAccordion: Story = {
  args: {
    multiple: false,
  },
  render: (args) => ({
    components: { FzAccordion, FzCollapse },
    setup() {
      const open1 = ref(false)
      const open2 = ref(false)
      return { args, open1, open2 }
    },
    template: `
      <FzAccordion v-bind="args">
        <FzCollapse title="Item 1" variant="button" icon="face-smile" v-model:open="open1">
          <template #rightContent>
            <span class="text-sm text-grey-400">$99</span>
          </template>
          <template #content>
            <p>Button variant inside an accordion.</p>
          </template>
        </FzCollapse>
        <FzCollapse title="Item 2" variant="button" icon="face-smile" v-model:open="open2">
          <template #rightContent>
            <span class="text-sm text-grey-400">$149</span>
          </template>
          <template #content>
            <p>Another button-variant panel.</p>
          </template>
        </FzCollapse>
      </FzAccordion>
    `,
  }),
  play: async ({ canvasElement, step }) => {
    await step('Verify button variant layout', async () => {
      const headerWrappers = canvasElement.querySelectorAll('[data-e2e="header-wrapper"]')
      headerWrappers.forEach((wrapper) => {
        expect(wrapper).toHaveClass('items-center')
      })
    })
  },
}
