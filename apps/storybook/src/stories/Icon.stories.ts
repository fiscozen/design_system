import type { Meta, StoryObj } from '@storybook/vue3'
import { FzIcon } from '@fiscozen/icons'
import {all} from '@awesome.me/kit-8137893ad3/icons'
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
      control: {
        type: 'select',
        options: ['xs', 'sm', 'md', 'lg'],
      }
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
        el.value = '<FzIcon :name="' + icon + '" size=\"lg\" :variant="'+variant+'"/>';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        // show toast
        alert('Copied to clipboard: <FzIcon :name="' + icon + '" size=\"lg\" :variant="'+variant+'"/>');
      }
    },
    template: `
      <div>
        <h1 class='font-bold px-10'>Icon List</h1>
        <div v-for="prefix in Object.keys(mappedIconsByPrefix)" :key="prefix" class="flex flex-row p-10">
          <h2>Variant: <b>{{prefix}}</b></h3>
          <div class='flex flex-row flex-wrap gap-20 overflow-hidden mt-20'>
            <div v-for="icon in mappedIconsByPrefix[prefix]" 
                :key="icon" 
                class='p-10 gap-4 rounded-base border-1 flex items-center flex-col justify-center w-128 h-128'>
              <FzIcon :name="icon" size="lg" :variant="prefix" />
              <span class='text-xs'>{{icon}} {{filter}}</span>
              <FzButton @click="copyCode(icon, prefix)" variant="secondary" size='sm'>Copy</FzButton>
            </div>
          </div>
        </div>
      </div>
    `
  })
}