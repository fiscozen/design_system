import type { Meta, StoryObj } from '@storybook/vue3'
import { FzLayout, FzLayoutProps } from '@fiscozen/layout'

const meta: Meta<typeof FzLayout> = {
  title: '@fiscozen/layout/FzLayout',
  component: FzLayout,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: [
    () => ({
      template: `
      <div class="opacity">
        <div>
          <story /> 
        </div>
      </div>
      `
    })
  ]
}

const leftShoulder = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <div class="w-full h-full bg-red-100"></div>
      <div class="w-full h-full bg-green-100"></div>
    </FzLayout>
  `
})

export const LeftShoulder = {
  render: leftShoulder,
  args: {
    layout: 'leftShoulder'
  }
}

const twoColumns = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <div class="w-full h-full bg-red-100"></div>
      <div class="w-full h-full bg-green-100"></div>
    </FzLayout>
  `
})

export const TwoColumns = {
  render: twoColumns,
  args: {
    layout: 'twoColumns'
  }
}


const multipleRows = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <div class="w-full h-full bg-red-100"></div>
      <div class="w-full h-full bg-green-100"></div>
      <div class="w-full h-full bg-orange-200"></div>
      <div class="w-full h-full bg-cyan-100"></div>
    </FzLayout>
  `
})

const leftShoulderNavbar = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <template #navbar>
        <div class="w-full h-full bg-red-100"></div>
      </template>
      <template #header>
        <div class="w-full h-full bg-green-100"></div>
      </template>
      <template #left-shoulder>
        <div class="w-full h-full bg-orange-200"></div>
      </template>
      <template #default>
        <div class="w-full h-full bg-cyan-100"></div>
      </template>
    </FzLayout>
  `
})

export const LeftShoulderNavbar = {
  render: leftShoulderNavbar,
  args: {
    layout: 'leftShoulderNavbar'
  }
}

const rightShoulderNavbar = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <template #navbar>
        <div class="w-full h-full bg-red-100"></div>
      </template>
      <template #header>
        <div class="w-full h-full bg-green-100"></div>
      </template>
      <template #right-shoulder>
        <div class="w-full h-full bg-orange-200"></div>
      </template>
      <template #default>
        <div class="w-full h-full bg-cyan-100"></div>
      </template>
    </FzLayout>
  `
})

export const RightShoulderNavbar = {
  render: rightShoulderNavbar,
  args: {
    layout: 'rightShoulderNavbar'
  }
}

export const MultipleRows = {
  render: multipleRows,
  args: {
    layout: 'multipleRows'
  }
}

const squares = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: {FzLayout},
  template: `
    <FzLayout v-bind="args">
      <div class="w-full h-full bg-red-100"></div>
      <div class="w-full h-full bg-green-100"></div>
      <div class="w-full h-full bg-orange-200"></div>
      <div class="w-full h-full bg-cyan-100"></div>
      <div class="w-full h-full bg-slate-100"></div>
      <div class="w-full h-full bg-purple-100"></div>
    </FzLayout>
  `
})

export const Squares = {
  render: squares,
  args: {
    layout: 'squares'
  }
}

export default meta
