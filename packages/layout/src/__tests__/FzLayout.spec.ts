import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzLayout } from '..'

describe.concurrent('FzLayout', () => {
  it('matches snaphost for oneColumn', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'oneColumn'
      },
      template: `
        <FzLayout v-bind="props">
          <div class="w-full h-full bg-red-100">main</div>
        </FzLayout>
      `
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for leftShoulder', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'leftShoulder'
      },
      template: `
        <FzLayout v-bind="props">
          <template #sidebar>
            <div class="bg-blue-50 size-full flex justify-center items-center">side</div>
          </template>
          <div class="bg-blue-50 size-full flex justify-center items-center">main</div>
        </FzLayout>
      `
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot for twoColumns ', async ({ expect }) => {
    const wrapper = mount(FzLayout, {
      props: {
        layout: 'twoColumns'
      },
      template: `
        <FzLayout layout="twoColumns">
          <template #header>
            <div class="bg-blue-50 size-full flex justify-center items-center">header</div>
          </template>
          <template #left>
            <div class="h-[1000px] bg-blue-50 w-full flex justify-center items-center">left</div>
          </template>
          <template #right>
            <div class="bg-blue-50 size-full flex justify-center items-center">right</div>
          </template>
        </FzLayout>
      `
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
