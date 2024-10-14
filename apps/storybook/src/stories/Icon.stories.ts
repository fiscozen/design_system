import type { Meta, StoryObj } from '@storybook/vue3'
import { FzIcon } from '@fiscozen/icons'
import { all, byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons'
import { FzButton } from '@fiscozen/button'

const meta: Meta<typeof FzIcon> = {
  title: '@fiscozen/icon/FzIcon',
  component: FzIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: {
        type: 'text',
        default: 'bell'
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg']
    },
    variant: {
      control: 'select',
      options: Object.keys(byPrefixAndName)
    }
  },
  args: {
    name: 'bell',
    size: 'lg'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const PreviewAllIcons: Story = {
  render: () => ({
    components: { FzIcon, FzButton },
    setup() {
      const mappedIconsByPrefix : {
        [key:string]: string[]
      } = {}

      all.forEach(icon => {
        if (!mappedIconsByPrefix[icon.prefix]) {
          mappedIconsByPrefix[icon.prefix] = []
        }
        if(!mappedIconsByPrefix[icon.prefix].includes(icon.iconName)) 
          mappedIconsByPrefix[icon.prefix].push(icon.iconName)
      })

      return {
        mappedIconsByPrefix
      }
    },  
    methods: {
      copyCode(icon : string, variant: string) {
        // add to clipboard the icon code
        const el = document.createElement('textarea');
        const value = `<FzIcon name="${icon}" variant="${variant}"/>`;
        el.value = value;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        // show toast
        alert('Copied to clipboard: ' + value);
      }
    },
    template: `
      <div>
        <h1 class='font-bold px-10 text-3xl mb-10'>Icon List</h1>
        <p class='px-10'> Click on the icon to copy the code </p>
        <div v-for="prefix in Object.keys(mappedIconsByPrefix)" :key="prefix" class="flex flex-col p-10 gap-10 mb-10">
          <h2 class="text-xl">Variant: <b>{{prefix}}</b></h2>
          <div class='flex flex-row flex-wrap gap-20 overflow-hidden mt-20'>
            <div v-for="icon in mappedIconsByPrefix[prefix]" 
                :key="icon" 
                @click="copyCode(icon, prefix)"
                class='p-10 gap-4 rounded-base border-1 flex items-center flex-col justify-center w-128 h-128 hover:bg-grey-100 cursor-pointer'>
              <FzIcon :name="icon" :size="size" :variant="prefix" />
              <span class='text-xs'>{{icon}} {{filter}}</span>
            </div>
          </div>
        </div>
      </div>
    `
  })
}