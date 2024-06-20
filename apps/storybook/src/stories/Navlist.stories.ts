import type { Meta, StoryObj } from '@storybook/vue3'

import { FzNavlist } from '@fiscozen/navlist'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: '@fiscozen/navlist/FzNavlist',
  component: FzNavlist,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof FzNavlist>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  args: {
    sections: [
      {
        label: 'Label 1',
        items: [
          {
            label: 'Item #1',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            summary: 'Item #2',
            subitems: [
              {
                label: 'Sub-Item #1',
                meta: {
                  path: '/foo',
                  name: 'foo'
                }
              },
              {
                label: 'Sub-Item #2',
                meta: {
                  path: '/foo',
                  name: 'foo'
                }
              }
            ]
          }
        ]
      },
      {
        label: 'Label 2',
        items: [
          {
            label: 'Item #1',
            disabled: true,
            meta: {
              path: '/foo',
              name: 'foo'
            }
          },
          {
            label: 'Item #2',
            meta: {
              path: '/foo',
              name: 'foo'
            }
          }
        ]
      }
    ]
  }
}
