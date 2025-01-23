import type { Meta } from '@storybook/vue3'
import { FzLayout, FzLayoutProps } from '@fiscozen/layout'
import { FzBadge } from '@fiscozen/badge'
import { useBreakpoints } from '@fiscozen/composables'
import { breakpoints } from '@fiscozen/style'
import { FzButton } from '@fiscozen/button';

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

const oneColumn = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <div class="bg-blue-50 h-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const OneColumn = {
  render: oneColumn,
  args: {
    layout: 'oneColumn'
  }
}

const oneColumnHeader = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #header>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">header</FzBadge>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const OneColumnHeader = {
  render: oneColumnHeader,
  args: {
    layout: 'oneColumnHeader'
  }
}

const leftShoulder = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #sidebar>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">Sidebar</FzBadge>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const LeftShoulder = {
  render: leftShoulder,
  args: {
    layout: 'leftShoulder'
  }
}

const rightShoulder = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #sidebar="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">Sidebar</FzBadge>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const RightShoulder = {
  render: rightShoulder,
  args: {
    layout: 'rightShoulder'
  }
}

const twoColumns = (args: FzLayoutProps) => ({
  setup() {
    return { args }
  },
  components: { FzLayout, FzBadge },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #header>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">header</FzBadge>
        </div>
      </template>
      <template #left>
        <div class="h-[1000px] bg-blue-50 w-full flex justify-center items-center">
          <FzBadge color="info">left</FzBadge>
        </div>
      </template>
      <template #right>
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">right</FzBadge>
        </div>
      </template>
    </FzLayout>
  `
})

export const TwoColumns = {
  render: twoColumns,
  args: {
    layout: 'twoColumns'
  }
}

const multipleAreas = (args: FzLayoutProps) => ({
  setup() {
    const { isGreater, isSmaller } = useBreakpoints(breakpoints);
    return { args, isGreater, isSmaller }
  },
  components: { FzLayout, FzBadge, FzButton },
  template: `
    <FzLayout v-bind="args" class="bg-blue-100">
      <template #header="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center">
          <FzBadge color="info">Header</FzBadge>
        </div>
      </template>
      <template #sidebarTrigger="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center" @click="sidebarToggle()">
          <FzBadge color="info" :style="isGreater('sm').value ? 'transform: rotate(270deg)' : ''" class="whitespace-nowrap">Sidebar trigger</FzBadge>
        </div>
      </template>
      <template #sidebar="{sidebarToggle}">
        <div class="bg-blue-50 size-full flex justify-center items-center flex-col">
          <FzBadge color="info">Sidebar</FzBadge>
          <FzButton v-if="isSmaller('md').value" @click="sidebarToggle()" class="mt-8">close</FzButton>
        </div>
      </template>
      <div class="bg-blue-50 size-full flex justify-center items-center">
        <FzBadge color="info">Main</FzBadge>
      </div>
    </FzLayout>
  `
})

export const MultipleAreas = {
  render: multipleAreas,
  args: {
    layout: 'multipleAreas'
  }
}

export default meta
