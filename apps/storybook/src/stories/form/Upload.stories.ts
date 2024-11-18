import type { Meta, StoryObj } from '@storybook/vue3'
import { FzUpload } from '@fiscozen/upload'
import { ref } from 'vue'

const meta: Meta<typeof FzUpload> = {
  title: 'Form/FzUpload',
  component: FzUpload,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md']
    }
  },
  args: {
    id: 'example-id'
  },
  decorators: [
    () => ({
      setup() {
        const files = ref([])
        return { files }
      },
      template: `
      <div class="p-16 max-w-[400px]">
        <story v-model="files" @fzupload:change="(e) => console.log(e)"/>
        <h3 class="mt-10">v-model:</h3>
        <ul>
          <li v-for="file in files">{{ file.name }}</li>
        </ul>
      </div>
    `
    })
  ]
}

type Story = StoryObj<typeof meta>

const Default: Story = {
  render: (args) => ({
    components: { FzUpload },
    setup() {
      const files = ref([
        new File([], 'test-image1.png'),
        new File([], 'test-image2.png'),
        new File([], 'test-image3.png')
      ])
      return { files, args }
    },
    template: `
      <FzUpload v-bind="args" v-model="files"/>
    `
  })
}

const Multiple: Story = {
  args: {
    multiple: true
  }
}

export { Default, Multiple }

export default meta
