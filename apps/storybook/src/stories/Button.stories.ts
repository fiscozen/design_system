import type { Meta, StoryObj } from '@storybook/vue3'

import { FzButton } from '@fiscozen/button'
import { FzIcon } from '@fiscozen/icons'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Button',
  component: FzButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'success', 'invisible'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: { variant: 'primary', disabled: false, label: 'This is a label' } // default value,
} satisfies Meta<typeof FzButton>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  args: {
    tooltip: 'Button',
    label: 'Primary Button'
  }
}

const primaryWithIcon = (args) => ({
  setup() {
    return { args }
  },
  components: { FzIcon, FzButton },
  template: `
    <div class="flex flex-row">
      <FzButton
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #before>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
      <FzButton
        class="ml-12"
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #after>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
    </div>
  `
})

export const PrimaryWithIcon = primaryWithIcon.bind({})

const secondaryWithIcon = (args) => ({
  setup() {
    return { args }
  },
  components: { FzIcon, FzButton },
  template: `
    <div class="flex flex-row">
      <FzButton
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #before>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
      <FzButton
        class="ml-12"
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #after>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
    </div>
  `
})

export const SecondaryWithIcon = secondaryWithIcon.bind({})
SecondaryWithIcon.args = {
  variant: 'secondary',
  tooltip: 'Secondary button',
  label: 'Secondary button'
}

const invisibleWithIcon = (args) => ({
  setup() {
    return { args }
  },
  components: { FzIcon, FzButton },
  template: `
    <div class="flex flex-row">
      <FzButton
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #before>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
      <FzButton
        class="ml-12"
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #after>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
    </div>
  `
})

export const InvisibleWithIcon = invisibleWithIcon.bind({})
InvisibleWithIcon.args = {
  variant: 'invisible',
  tooltip: 'Invisible button',
  label: 'Invisible button'
}

const dangerWithIcon = (args) => ({
  setup() {
    return { args }
  },
  components: { FzIcon, FzButton },
  template: `
    <div class="flex flex-row">
      <FzButton
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #before>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
      <FzButton
        class="ml-12"
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #after>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
    </div>
  `
})

export const DangerWithIcon = dangerWithIcon.bind({})
DangerWithIcon.args = {
  variant: 'danger',
  tooltip: 'Danger button',
  label: 'Danger button'
}

const successWithIcon = (args) => ({
  setup() {
    return { args }
  },
  components: { FzIcon, FzButton },
  template: `
    <div class="flex flex-row">
      <FzButton
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #before>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
      <FzButton
        class="ml-12"
        :disabled="args.disabled"
        :label="args.label"
        :size="args.size"
        :tooltip="args.tooltip"
        :variant="args.variant">
        <template #after>
          <FzIcon name="bell" size="lg"/> 
        </template>
      </FzButton>
    </div>
  `
})

export const SuccessWithIcon = successWithIcon.bind({})
SuccessWithIcon.args = {
  variant: 'success',
  tooltip: 'Success button',
  label: 'Success button'
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    tooltip: 'Secondary button',
    label: 'Secondary button'
  }
}

export const Invisible: Story = {
  args: {
    variant: 'invisible',
    tooltip: 'Invisible button',
    label: 'Invisible button'
  }
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    tooltip: 'Danger button',
    label: 'Danger button'
  }
}

export const Success: Story = {
  args: {
    variant: 'success',
    tooltip: 'Success button',
    label: 'Success button'
  }
}
