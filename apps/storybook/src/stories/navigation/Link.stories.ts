import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { FzLink } from '@fiscozen/link'
import { vueRouter } from 'storybook-vue3-router'

type PlayFunctionContext = {
  args: any
  canvasElement: HTMLElement
  step: (name: string, fn: () => Promise<void>) => void | Promise<void>
}

const meta = {
  title: 'Navigation/FzLink',
  component: FzLink,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'danger']
    },
    linkStyle: {
      control: 'select',
      options: ['default', 'underline']
    },
    size: {
      control: 'select',
      options: ['sm', 'md']
    },
    disabled: {
      control: 'boolean'
    },
    external: {
      control: 'boolean'
    },
    target: {
      control: 'text'
    },
    replace: {
      control: 'boolean'
    }
  },
  args: {
    to: 'example',
    type: 'default',
    linkStyle: 'default',
    size: 'md',
    disabled: false,
    external: false,
    replace: false
  },
  decorators: [vueRouter()]
} satisfies Meta<typeof FzLink>

export default meta

type LinkStory = StoryObj<typeof FzLink>

const Template: LinkStory = {
  render: (args) => ({
    components: { FzLink },
    setup() {
      return { args }
    },
    template: `<FzLink v-bind="args">This is a link</FzLink>`
  }),
  args: {
    to: 'example',
    type: 'default',
    linkStyle: 'default',
    size: 'md'
  }
}

export const Default: LinkStory = {
  ...Template,
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      expect(link).toBeInTheDocument()
    })

    await step('Verify default classes', async () => {
      const link = canvasElement.querySelector('a')
      expect(link?.classList.contains('text-base')).toBe(true)
      expect(link?.classList.contains('leading-base')).toBe(true)
      expect(link?.classList.contains('text-blue-500')).toBe(true)
      expect(link?.classList.contains('hover:text-blue-600')).toBe(true)
      expect(link?.classList.contains('hover:underline')).toBe(true)
      expect(link?.classList.contains('focus:text-blue-600')).toBe(true)
    })

    await step('Verify accessibility', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      expect(link).toBeVisible()
    })
  }
}

export const Danger: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    type: 'danger'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    const canvas = within(canvasElement)

    await step('Verify danger type classes', async () => {
      const link = canvasElement.querySelector('a')
      expect(link?.classList.contains('text-semantic-error-200')).toBe(true)
      expect(link?.classList.contains('hover:text-semantic-error-300')).toBe(true)
      expect(link?.classList.contains('hover:underline')).toBe(true)
      expect(link?.classList.contains('focus:text-semantic-error-300')).toBe(true)
      expect(link?.classList.contains('text-blue-500')).toBe(false)
    })

    await step('Verify component renders', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      expect(link).toBeInTheDocument()
    })
  }
}

export const Underline: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    linkStyle: 'underline'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify underline style classes', async () => {
      const link = canvasElement.querySelector('a')
      expect(link?.classList.contains('underline')).toBe(true)
      expect(link?.classList.contains('text-blue-500')).toBe(true)
      expect(link?.classList.contains('hover:text-blue-600')).toBe(true)
      expect(link?.classList.contains('focus:text-blue-600')).toBe(true)
    })
  }
}

export const DangerUnderline: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    type: 'danger',
    linkStyle: 'underline'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify danger and underline classes', async () => {
      const link = canvasElement.querySelector('a')
      expect(link?.classList.contains('text-semantic-error-200')).toBe(true)
      expect(link?.classList.contains('underline')).toBe(true)
      expect(link?.classList.contains('hover:text-semantic-error-300')).toBe(true)
      expect(link?.classList.contains('focus:text-semantic-error-300')).toBe(true)
    })
  }
}

export const SizeSm: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'sm'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify sm size classes', async () => {
      const link = canvasElement.querySelector('a')
      expect(link?.classList.contains('text-sm')).toBe(true)
      expect(link?.classList.contains('leading-xs')).toBe(true)
    })
  }
}

export const SizeMd: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'md'
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify md size classes', async () => {
      const link = canvasElement.querySelector('a')
      expect(link?.classList.contains('text-base')).toBe(true)
      expect(link?.classList.contains('leading-base')).toBe(true)
    })
  }
}

export const Disabled: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify disabled renders as span', async () => {
      const span = canvasElement.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(canvasElement.querySelector('a')).toBeNull()
    })

    await step('Verify disabled classes', async () => {
      const span = canvasElement.querySelector('span')
      expect(span?.classList.contains('cursor-not-allowed')).toBe(true)
      expect(span?.classList.contains('text-blue-200')).toBe(true)
      expect(span?.classList.contains('text-base')).toBe(true)
      expect(span?.classList.contains('leading-base')).toBe(true)
    })

    await step('Verify accessibility attributes', async () => {
      const span = canvasElement.querySelector('span')
      expect(span?.getAttribute('aria-disabled')).toBe('true')
      expect(span?.getAttribute('role')).toBe('link')
      expect(span?.getAttribute('aria-label')).toBe('Link disabled')
    })
  }
}

export const DisabledDanger: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    type: 'danger',
    disabled: true
  },
  play: async ({ canvasElement, step }: PlayFunctionContext) => {
    await step('Verify disabled danger classes', async () => {
      const span = canvasElement.querySelector('span')
      expect(span?.classList.contains('text-semantic-error-100')).toBe(true)
      expect(span?.classList.contains('text-blue-200')).toBe(false)
      expect(span?.classList.contains('cursor-not-allowed')).toBe(true)
    })
  }
}
