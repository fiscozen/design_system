import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { FzDivider, FzDividerProps } from '@fiscozen/divider'
import { ref } from 'vue'

const meta: Meta<typeof FzDivider> = {
  title: 'Panel/FzDivider',
  component: FzDivider,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  decorators: []
}

type Story = StoryObj<typeof meta>

const simpleDivider = (args: FzDividerProps) => ({
  setup() {
    return { args }
  },
  components: { FzDivider },
  template: `
    <div class="w-screen h-screen">
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pulvinar et arcu eu dapibus. In posuere dictum mi convallis vestibulum. Sed sed lectus urna. Nulla sed velit maximus tellus commodo aliquam. Nullam id metus nunc. Integer hendrerit sagittis accumsan. Pellentesque accumsan a diam a bibendum. Mauris pellentesque ipsum mi, lacinia elementum mauris viverra sit amet. Morbi condimentum nisl vitae eros lobortis, ac accumsan elit vulputate. Fusce fringilla, mi et pharetra fermentum, nunc sapien suscipit ligula, elementum sollicitudin est orci sit amet orci. Aenean semper consequat odio et porta. Suspendisse ut scelerisque purus, ac pellentesque justo. Praesent a gravida ipsum. Maecenas elit lacus, consequat sit amet mauris et, imperdiet fringilla metus.
      </div>
      <FzDivider v-bind="args" />
      <div>
        Donec lacus sapien, semper ac rhoncus id, rutrum id eros. Nunc purus odio, dignissim dignissim erat id, tempor pulvinar est. Aenean faucibus eu mi quis placerat. Sed at magna vestibulum, tempus arcu sed, tristique nibh. Phasellus rutrum faucibus luctus. Sed pretium risus a dolor viverra, non pretium quam ornare. Mauris nulla arcu, tincidunt ac leo vitae, vestibulum iaculis turpis. In sed lectus diam. In ipsum nibh, egestas at convallis et, rutrum nec tellus. Nunc vitae scelerisque risus, rutrum pharetra enim. Pellentesque malesuada semper elit, convallis mattis est molestie aliquet. Curabitur ut sodales nibh. Phasellus sodales vulputate sem. Etiam in efficitur justo, vel placerat metus.
      </div>
    </div>
  `
})

const Default: Story = {
  args: {},
  render: simpleDivider
}

const WithLabel: Story = {
  args: { label: 'This is a label' },
  render: simpleDivider
}

export { Default, WithLabel }

export default meta
