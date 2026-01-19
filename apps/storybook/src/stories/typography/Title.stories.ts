import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { defineComponent, h } from 'vue'

interface TitleArgs {
  tag: 'h1' | 'h2' | 'h3'
  text: string
}

const TitleComponent = defineComponent({
  props: {
    tag: {
      type: String as () => 'h1' | 'h2' | 'h3',
      default: 'h1'
    },
    text: {
      type: String,
      default: 'Questo è un titolo'
    }
  },
  render() {
    return h(this.tag, this.text)
  }
})

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Typography/Titles',
  component: TitleComponent,
  tags: ['autodocs'],
  argTypes: {
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3'],
    },
    text: {
      control: 'text',
    },
  },
  args: {
    tag: 'h1',
    text: 'Questo è un titolo',
  }
} satisfies Meta<TitleArgs>

export default meta

type Story = StoryObj<TitleArgs>

export const H1: Story = {
  args: {
    tag: 'h1',
    text: 'Questo è un titolo H1',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { TitleComponent },
    template: '<TitleComponent :tag="args.tag" :text="args.text" />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify H1 title renders correctly', async () => {
      const heading = canvas.getByText('Questo è un titolo H1')
      await expect(heading).toBeInTheDocument()
      await expect(heading).toBeVisible()
    })
    
    await step('Verify H1 has correct tag name', async () => {
      const heading = canvas.getByText('Questo è un titolo H1')
      await expect(heading.tagName.toLowerCase()).toBe('h1')
    })
    
    await step('Verify H1 text content matches', async () => {
      const heading = canvas.getByText('Questo è un titolo H1')
      await expect(heading.textContent).toBe('Questo è un titolo H1')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { tag, text } = storyContext.args
          return `<${tag}>${text}</${tag}>`
        }
      }
    }
  }
}

export const H2: Story = {
  args: {
    tag: 'h2',
    text: 'Questo è un titolo H2',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { TitleComponent },
    template: '<TitleComponent :tag="args.tag" :text="args.text" />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify H2 title renders correctly', async () => {
      const heading = canvas.getByText('Questo è un titolo H2')
      await expect(heading).toBeInTheDocument()
      await expect(heading).toBeVisible()
    })
    
    await step('Verify H2 has correct tag name', async () => {
      const heading = canvas.getByText('Questo è un titolo H2')
      await expect(heading.tagName.toLowerCase()).toBe('h2')
    })
    
    await step('Verify H2 text content matches', async () => {
      const heading = canvas.getByText('Questo è un titolo H2')
      await expect(heading.textContent).toBe('Questo è un titolo H2')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { tag, text } = storyContext.args
          return `<${tag}>${text}</${tag}>`
        }
      }
    }
  }
}

export const H3: Story = {
  args: {
    tag: 'h3',
    text: 'Questo è un titolo H3',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { TitleComponent },
    template: '<TitleComponent :tag="args.tag" :text="args.text" />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify H3 title renders correctly', async () => {
      const heading = canvas.getByText('Questo è un titolo H3')
      await expect(heading).toBeInTheDocument()
      await expect(heading).toBeVisible()
    })
    
    await step('Verify H3 has correct tag name', async () => {
      const heading = canvas.getByText('Questo è un titolo H3')
      await expect(heading.tagName.toLowerCase()).toBe('h3')
    })
    
    await step('Verify H3 text content matches', async () => {
      const heading = canvas.getByText('Questo è un titolo H3')
      await expect(heading.textContent).toBe('Questo è un titolo H3')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { tag, text } = storyContext.args
          return `<${tag}>${text}</${tag}>`
        }
      }
    }
  }
}

export const H1vColorBlue: Story = {
  args: {
    tag: 'h1',
    text: 'Questo è un titolo H1 con v-color:blue',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { TitleComponent },
    template: '<TitleComponent :tag="args.tag" :text="args.text" v-color:blue />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify H1 with v-color:blue renders correctly', async () => {
      const heading = canvas.getByText('Questo è un titolo H1 con v-color:blue')
      await expect(heading).toBeInTheDocument()
      await expect(heading).toBeVisible()
    })
    
    await step('Verify H1 has correct tag name', async () => {
      const heading = canvas.getByText('Questo è un titolo H1 con v-color:blue')
      await expect(heading.tagName.toLowerCase()).toBe('h1')
    })
    
    await step('Verify v-color:blue directive applies text-blue-500 class (default weight)', async () => {
      const heading = canvas.getByText('Questo è un titolo H1 con v-color:blue')
      await expect(heading).toHaveClass('text-blue-500')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { tag, text } = storyContext.args
          return `<${tag} v-color:blue>${text}</${tag}>`
        }
      }
    }
  }
}

export const H1vColorPink400: Story = {
  args: {
    tag: 'h1',
    text: 'Questo è un titolo H1 con v-color:pink="400"',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { TitleComponent },
    template: '<TitleComponent :tag="args.tag" :text="args.text" v-color:pink="400" />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify H1 with v-color:pink="400" renders correctly', async () => {
      const heading = canvas.getByText('Questo è un titolo H1 con v-color:pink="400"')
      await expect(heading).toBeInTheDocument()
      await expect(heading).toBeVisible()
    })
    
    await step('Verify H1 has correct tag name', async () => {
      const heading = canvas.getByText('Questo è un titolo H1 con v-color:pink="400"')
      await expect(heading.tagName.toLowerCase()).toBe('h1')
    })
    
    await step('Verify v-color:pink="400" directive applies text-pink-400 class', async () => {
      const heading = canvas.getByText('Questo è un titolo H1 con v-color:pink="400"')
      await expect(heading).toHaveClass('text-pink-400')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { tag, text } = storyContext.args
          return `<${tag} v-color:pink="400">${text}</${tag}>`
        }
      }
    }
  }
}