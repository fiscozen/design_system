import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayout } from '..'

describe.concurrent('FzLayout', () => {
  it('matches snaphost for multipleRows', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'multipleRows'
      },
      template: `
        <FzLayout layout="multipleRows">
          <div class="w-full h-full bg-red-100"></div>
          <div class="w-full h-full bg-green-100"></div>
          <div class="w-full h-full bg-orange-200"></div>
          <div class="w-full h-full bg-cyan-100"></div>
        </FzLayout>
      `
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for leftShoulder', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'leftShoulder'
      },
      template: `
        <FzLayout layout="leftShoulder">
          <div class="w-full h-full bg-red-100"></div>
          <div class="w-full h-full bg-green-100"></div>
        </FzLayout>
      `
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for twoColumns ', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'twoColumns'
      },
      template: `
        <FzLayout layout="twoColumns">
          <div class="w-full h-full bg-red-100"></div>
          <div class="w-full h-full bg-green-100"></div>
        </FzLayout>
      `
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for leftShoulderNavbar', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'leftShoulderNavbar'
      },
      template: `
        <FzLayout layout="leftShoulderNavbar">
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

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for rightShoulderNavbar', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'rightShoulderNavbar'
      },
      template: `
        <FzLayout layout="rightShoulderNavbar">
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

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for squares', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'squares'
      },
      template: `
        <FzLayout layout="squares">
          <div class="w-full h-full bg-red-100"></div>
          <div class="w-full h-full bg-green-100"></div>
          <div class="w-full h-full bg-orange-200"></div>
          <div class="w-full h-full bg-cyan-100"></div>
          <div class="w-full h-full bg-slate-100"></div>
          <div class="w-full h-full bg-purple-100"></div>
        </FzLayout>
      `
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
