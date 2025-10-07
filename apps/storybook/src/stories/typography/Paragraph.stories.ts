import type { Meta, StoryObj } from '@storybook/vue3'
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