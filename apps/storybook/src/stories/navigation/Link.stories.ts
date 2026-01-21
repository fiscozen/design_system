import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from '@storybook/test'
import { FzLink } from '@fiscozen/link'
import { vueRouter } from 'storybook-vue3-router'

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
    // Use @click.prevent to stop navigation during play function tests.
    // This prevents the browser from navigating away (especially for external links),
    // which would close the WebSocket connection and cause test failures.
    template: `<FzLink 
      v-bind="args"
      @click.prevent="!args.disabled && args.onClick && args.onClick($event)"
    >This is a link</FzLink>`
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
  args: {
    ...Template.args,
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify component renders', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await expect(link).toBeInTheDocument()
    })

    await step('Verify default classes', async () => {
      const link = canvasElement.querySelector('a')
      await expect(link?.classList.contains('text-base')).toBe(true)
      await expect(link?.classList.contains('leading-base')).toBe(true)
      await expect(link?.classList.contains('text-blue-500')).toBe(true)
      await expect(link?.classList.contains('hover:text-blue-600')).toBe(true)
      await expect(link?.classList.contains('hover:underline')).toBe(true)
      await expect(link?.classList.contains('focus:text-blue-600')).toBe(true)
    })

    await step('Verify accessibility', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await expect(link).toBeVisible()
    })

    await step('Verify click handler IS called when link is clicked', async () => {
      // Reset spy to ensure clean state
      args.onClick.mockClear()
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await userEvent.click(link)
      
      // ROBUST CHECK: Verify the click spy WAS called (may be called multiple times due to router-link behavior)
      await expect(args.onClick).toHaveBeenCalled()
    })
  }
}

export const Danger: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    type: 'danger',
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify danger type classes', async () => {
      const link = canvasElement.querySelector('a')
      await expect(link?.classList.contains('text-semantic-error-200')).toBe(true)
      await expect(link?.classList.contains('hover:text-semantic-error-300')).toBe(true)
      await expect(link?.classList.contains('hover:underline')).toBe(true)
      await expect(link?.classList.contains('focus:text-semantic-error-300')).toBe(true)
      await expect(link?.classList.contains('text-blue-500')).toBe(false)
    })

    await step('Verify component renders', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await expect(link).toBeInTheDocument()
    })

    await step('Verify click handler IS called when danger link is clicked', async () => {
      // Reset spy to ensure clean state
      args.onClick.mockClear()
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await userEvent.click(link)
      
      // ROBUST CHECK: Verify the click spy WAS called (may be called multiple times due to router-link behavior)
      await expect(args.onClick).toHaveBeenCalled()
    })
  }
}

export const Underline: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    linkStyle: 'underline'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify underline style classes', async () => {
      const link = canvasElement.querySelector('a')
      await expect(link?.classList.contains('underline')).toBe(true)
      await expect(link?.classList.contains('text-blue-500')).toBe(true)
      await expect(link?.classList.contains('hover:text-blue-600')).toBe(true)
      await expect(link?.classList.contains('focus:text-blue-600')).toBe(true)
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
  play: async ({ canvasElement, step }) => {
    await step('Verify danger and underline classes', async () => {
      const link = canvasElement.querySelector('a')
      await expect(link?.classList.contains('text-semantic-error-200')).toBe(true)
      await expect(link?.classList.contains('underline')).toBe(true)
      await expect(link?.classList.contains('hover:text-semantic-error-300')).toBe(true)
      await expect(link?.classList.contains('focus:text-semantic-error-300')).toBe(true)
    })
  }
}

export const SizeSm: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify sm size classes', async () => {
      const link = canvasElement.querySelector('a')
      await expect(link?.classList.contains('text-sm')).toBe(true)
      await expect(link?.classList.contains('leading-xs')).toBe(true)
    })
  }
}

export const SizeMd: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    size: 'md'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify md size classes', async () => {
      const link = canvasElement.querySelector('a')
      await expect(link?.classList.contains('text-base')).toBe(true)
      await expect(link?.classList.contains('leading-base')).toBe(true)
    })
  }
}

export const Disabled: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    disabled: true
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify disabled renders as span', async () => {
      const span = canvasElement.querySelector('span')
      await expect(span).toBeInTheDocument()
      await expect(canvasElement.querySelector('a')).toBeNull()
      await expect(canvasElement.querySelector('router-link')).toBeNull()
    })

    await step('Verify disabled classes', async () => {
      const span = canvasElement.querySelector('span')
      await expect(span?.classList.contains('cursor-not-allowed')).toBe(true)
      await expect(span?.classList.contains('text-blue-200')).toBe(true)
      await expect(span?.classList.contains('text-base')).toBe(true)
      await expect(span?.classList.contains('leading-base')).toBe(true)
    })

    await step('Verify accessibility attributes', async () => {
      const span = canvasElement.querySelector('span')
      await expect(span?.getAttribute('aria-disabled')).toBe('true')
      await expect(span?.getAttribute('role')).toBe('link')
      await expect(span?.getAttribute('aria-label')).toBe('Link disabled')
    })

    await step('Verify disabled link does not navigate (renders as span, not clickable link)', async () => {
      const span = canvasElement.querySelector('span')
      await expect(span).toBeInTheDocument()
      // Span has no href attribute, confirming it's not a navigable link
      await expect(span?.hasAttribute('href')).toBe(false)
      // Span is not a router-link
      await expect(span?.tagName.toLowerCase()).toBe('span')
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
  play: async ({ canvasElement, step }) => {
    await step('Verify disabled danger classes', async () => {
      const span = canvasElement.querySelector('span')
      await expect(span?.classList.contains('text-semantic-error-100')).toBe(true)
      await expect(span?.classList.contains('text-blue-200')).toBe(false)
      await expect(span?.classList.contains('cursor-not-allowed')).toBe(true)
    })

    await step('Verify disabled danger link does not navigate (renders as span, not clickable link)', async () => {
      const span = canvasElement.querySelector('span')
      await expect(span).toBeInTheDocument()
      // Span has no href attribute, confirming it's not a navigable link
      await expect(span?.hasAttribute('href')).toBe(false)
      // Span is not a router-link
      await expect(span?.tagName.toLowerCase()).toBe('span')
    })
  }
}

export const ExternalLink: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    external: true,
    to: 'https://example.com',
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Verify external link renders as anchor tag', async () => {
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await expect(link).toBeInTheDocument()
      await expect(link).toHaveAttribute('href', 'https://example.com')
    })

    await step('Verify click handler IS called when external link is clicked', async () => {
      // Reset spy to ensure clean state
      args.onClick.mockClear()
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await userEvent.click(link)
      
      // ROBUST CHECK: Verify the click spy WAS called (may be called multiple times due to anchor tag behavior)
      await expect(args.onClick).toHaveBeenCalled()
    })
  }
}

export const KeyboardNavigation: LinkStory = {
  ...Template,
  args: {
    ...Template.args,
    onClick: fn()
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab to focus link', async () => {
      await userEvent.tab()
      const link = canvas.getByRole('link', { name: 'This is a link' })
      await expect(document.activeElement).toBe(link)
    })

    await step('Activate link with Enter key and verify handler called', async () => {
      // Reset spy to ensure clean state
      args.onClick.mockClear()
      const link = canvas.getByRole('link', { name: 'This is a link' })
      link.focus()
      await userEvent.keyboard('{Enter}')
      
      // ROBUST CHECK: Verify the click spy WAS called (may be called multiple times due to router-link behavior)
      await expect(args.onClick).toHaveBeenCalled()
    })
  }
}
