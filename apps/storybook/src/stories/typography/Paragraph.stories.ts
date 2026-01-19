import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { defineComponent, h } from 'vue'

interface ParagraphArgs {
  text: string
}

const ParagraphComponent = defineComponent({
  props: {
    text: {
      type: String,
      default: 'Questo è un paragrafo'
    }
  },
  render() {
    return h('p', this.text)
  }
})

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Typography/Paragraphs',
  component: ParagraphComponent,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
    },
  },
  args: {
    text: 'Questo è un paragrafo',
  }
} satisfies Meta<ParagraphArgs>

export default meta

type Story = StoryObj<ParagraphArgs>

export const Paragraph: Story = {
  args: {
    text: 'Questo è un paragrafo',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: '<ParagraphComponent :text="args.text" />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify paragraph renders correctly', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo')
      await expect(paragraph).toBeInTheDocument()
      await expect(paragraph).toBeVisible()
    })
    
    await step('Verify paragraph has correct tag name', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo')
      await expect(paragraph.tagName.toLowerCase()).toBe('p')
    })
    
    await step('Verify paragraph text content matches', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo')
      await expect(paragraph.textContent).toBe('Questo è un paragrafo')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `<p>${text}</p>`
        }
      }
    }
  }
}

export const ASequenceOfParagraphs: Story = {
  args: {
    text: 'Questo è un paragrafo',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: `
      <ParagraphComponent :text="args.text" />
      <ParagraphComponent :text="args.text" />
      <ParagraphComponent :text="args.text" />
    `
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify all paragraphs render correctly', async () => {
      const paragraphs = canvas.getAllByText('Questo è un paragrafo')
      await expect(paragraphs.length).toBe(3)
      
      for (const paragraph of paragraphs) {
        await expect(paragraph).toBeInTheDocument()
        await expect(paragraph).toBeVisible()
        await expect(paragraph.tagName.toLowerCase()).toBe('p')
      }
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `
            <p>${text}</p>
            <p>${text}</p>
            <p>${text}</p>
          `
        }
      }
    }
  }
}

export const ParagraphDirectivesVBold: Story = {
  args: {
    text: 'Questo è un paragrafo con v-bold',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: '<ParagraphComponent :text="args.text" v-bold />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify paragraph with v-bold renders correctly', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-bold')
      await expect(paragraph).toBeInTheDocument()
      await expect(paragraph).toBeVisible()
    })
    
    await step('Verify v-bold directive applies font-semibold class', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-bold')
      await expect(paragraph).toHaveClass('font-semibold')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `<p v-bold>${text}</p>`
        }
      }
    }
  }
}

export const ParagraphDirectivesVSmall: Story = {
  args: {
    text: 'Questo è un paragrafo con v-small',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: '<ParagraphComponent :text="args.text" v-small />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify paragraph with v-small renders correctly', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-small')
      await expect(paragraph).toBeInTheDocument()
      await expect(paragraph).toBeVisible()
    })
    
    await step('Verify v-small directive applies text-sm class', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-small')
      await expect(paragraph).toHaveClass('text-sm')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `<p v-small>${text}</p>`
        }
      }
    }
  }
}

export const ParagraphDirectivesVBoldAndVSmall: Story = {
  args: {
    text: 'Questo è un paragrafo con v-bold e v-small',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: '<ParagraphComponent :text="args.text" v-bold v-small />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify paragraph with combined directives renders correctly', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-bold e v-small')
      await expect(paragraph).toBeInTheDocument()
      await expect(paragraph).toBeVisible()
    })
    
    await step('Verify v-bold directive applies font-semibold class', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-bold e v-small')
      await expect(paragraph).toHaveClass('font-semibold')
    })
    
    await step('Verify v-small directive applies text-sm class', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-bold e v-small')
      await expect(paragraph).toHaveClass('text-sm')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `<p v-bold v-small>${text}</p>`
        }
      }
    }
  }
}

export const ParagraphDirectivesVColorBlue: Story = {
  args: {
    text: 'Questo è un paragrafo con v-color:blue',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: '<ParagraphComponent :text="args.text" v-color:blue />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify paragraph with v-color:blue renders correctly', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-color:blue')
      await expect(paragraph).toBeInTheDocument()
      await expect(paragraph).toBeVisible()
    })
    
    await step('Verify v-color:blue directive applies text-blue-500 class (default weight)', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-color:blue')
      await expect(paragraph).toHaveClass('text-blue-500')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `<p v-color:blue>${text}</p>`
        }
      }
    }
  }
}

export const ParagraphDirectivesVColorPink400: Story = {
  args: {
    text: 'Questo è un paragrafo con v-color:pink="400"',
  },
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { ParagraphComponent },
    template: '<ParagraphComponent :text="args.text" v-color:pink="400" />'
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify paragraph with v-color:pink="400" renders correctly', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-color:pink="400"')
      await expect(paragraph).toBeInTheDocument()
      await expect(paragraph).toBeVisible()
    })
    
    await step('Verify v-color:pink="400" directive applies text-pink-400 class', async () => {
      const paragraph = canvas.getByText('Questo è un paragrafo con v-color:pink="400"')
      await expect(paragraph).toHaveClass('text-pink-400')
    })
  },
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: any) => {
          const { text } = storyContext.args
          return `<p v-color:pink="400">${text}</p>`
        }
      }
    }
  }
}