import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from '@storybook/test'
import { FzIcon } from '@fiscozen/icons'
import { all, byPrefixAndName } from '@awesome.me/kit-8137893ad3/icons'
import { FzButton } from '@fiscozen/button'

const meta: Meta<typeof FzIcon> = {
  title: 'Media/FzIcon',
  component: FzIcon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: {
        type: 'text',
        default: 'bell'
      }
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

export const Primary: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify icon renders correctly', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toBeInTheDocument()
      await expect(iconContainer).toBeVisible()
    })
    
    await step('Verify icon SVG is present', async () => {
      const svg = canvasElement.querySelector('svg')
      await expect(svg).toBeInTheDocument()
      await expect(svg).toBeVisible()
    })
    
    await step('Verify icon has correct size classes', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      // Default size is 'lg', which should have w-[25px] h-[25px] classes
      await expect(iconContainer).toHaveClass('w-[25px]')
      await expect(iconContainer).toHaveClass('h-[25px]')
    })
    
    await step('Verify icon container has flex classes', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toHaveClass('flex')
      await expect(iconContainer).toHaveClass('items-center')
      await expect(iconContainer).toHaveClass('justify-center')
    })
  }
}

export const PreviewAllIcons: Story = {
  render: () => ({
    components: { FzIcon, FzButton },
    setup() {
      const mappedIconsByPrefix: {
        [key: string]: string[]
      } = {}

      all.forEach((icon) => {
        if (!mappedIconsByPrefix[icon.prefix]) {
          mappedIconsByPrefix[icon.prefix] = []
        }
        if (!mappedIconsByPrefix[icon.prefix].includes(icon.iconName))
          mappedIconsByPrefix[icon.prefix].push(icon.iconName)
      })

      return {
        mappedIconsByPrefix
      }
    },
    methods: {
      copyCode(icon: string, variant: string) {
        // add to clipboard the icon code
        const el = document.createElement('textarea')
        const value = `<FzIcon name="${icon}" variant="${variant}"/>`
        el.value = value
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)

        // show toast
        alert('Copied to clipboard: ' + value)
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
  }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify icon list header is present', async () => {
      const header = canvas.getByText('Icon List')
      await expect(header).toBeInTheDocument()
      await expect(header).toBeVisible()
    })
    
    await step('Verify instruction text is present', async () => {
      const instruction = canvas.getByText(/Click on the icon to copy the code/i)
      await expect(instruction).toBeInTheDocument()
    })
    
    await step('Verify at least one icon variant section is rendered', async () => {
      const variantHeaders = canvasElement.querySelectorAll('h2')
      await expect(variantHeaders.length).toBeGreaterThan(0)
    })
    
    await step('Verify icons are rendered in the preview', async () => {
      const iconContainers = canvasElement.querySelectorAll('div.flex.items-center.justify-center')
      // Should have multiple icons rendered
      await expect(iconContainers.length).toBeGreaterThan(0)
    })
    
    await step('Verify icon SVGs are present', async () => {
      const svgs = canvasElement.querySelectorAll('svg')
      await expect(svgs.length).toBeGreaterThan(0)
    })
  }
}

// ============================================
// SIZE VARIANTS
// ============================================

export const SizeXS: Story = {
  args: {
    name: 'bell',
    size: 'xs'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify XS size classes are applied', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toHaveClass('size-[12.5px]')
    })
    
    await step('Verify icon renders correctly', async () => {
      const svg = canvasElement.querySelector('svg')
      await expect(svg).toBeInTheDocument()
      await expect(svg).toBeVisible()
    })
  }
}

export const SizeSM: Story = {
  args: {
    name: 'bell',
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify SM size classes are applied', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toHaveClass('w-[15px]')
      await expect(iconContainer).toHaveClass('h-[15px]')
    })
  }
}

export const SizeMD: Story = {
  args: {
    name: 'bell',
    size: 'md'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify MD size classes are applied', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toHaveClass('w-[20px]')
      await expect(iconContainer).toHaveClass('h-[20px]')
    })
  }
}

export const SizeLG: Story = {
  args: {
    name: 'bell',
    size: 'lg'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify LG size classes are applied', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toHaveClass('w-[25px]')
      await expect(iconContainer).toHaveClass('h-[25px]')
    })
  }
}

// ============================================
// VARIANT STORIES
// ============================================

export const VariantFAR: Story = {
  args: {
    name: 'bell',
    variant: 'far'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify icon renders with FAR variant', async () => {
      const svg = canvasElement.querySelector('svg')
      await expect(svg).toBeInTheDocument()
      await expect(svg).toBeVisible()
    })
  }
}

export const VariantFAS: Story = {
  args: {
    name: 'bell',
    variant: 'fas'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify icon renders with FAS variant', async () => {
      const svg = canvasElement.querySelector('svg')
      await expect(svg).toBeInTheDocument()
      await expect(svg).toBeVisible()
    })
  }
}

// ============================================
// ACCESSIBILITY
// ============================================

export const Accessibility: Story = {
  args: {
    name: 'bell',
    size: 'lg'
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify icon container is present', async () => {
      const iconContainer = canvasElement.querySelector('div.flex')
      await expect(iconContainer).toBeInTheDocument()
    })
    
    await step('Verify icon SVG is present', async () => {
      const svg = canvasElement.querySelector('svg')
      await expect(svg).toBeInTheDocument()
    })
    
    await step('Verify icon is decorative (no aria-label needed for standalone icons)', async () => {
      // Icons are typically decorative and should be hidden from screen readers
      // when used standalone. If the icon has meaning, it should be wrapped in
      // a button or link with appropriate aria-label.
      const iconContainer = canvasElement.querySelector('div.flex')
      // Icon container should not have aria-label when used as decorative element
      await expect(iconContainer).not.toHaveAttribute('aria-label')
    })
  }
}
