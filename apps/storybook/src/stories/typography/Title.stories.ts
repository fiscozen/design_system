import type { Meta, StoryObj } from '@storybook/vue3'
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

export const Default: Story = {
  render: (args) => ({
    setup() {
      return { args }
    },
    components: { TitleComponent },
    template: '<TitleComponent :tag="args.tag" :text="args.text" />'
  }),
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
