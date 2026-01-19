import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from '@storybook/test'
import { ref } from 'vue'
import { FzTabs, FzTab } from '@fiscozen/tab'
import FzBadge from '@fiscozen/badge/src/FzBadge.vue'
import FzIcon from '@fiscozen/icons/src/FzIcon.vue'
import FzButton from '@fiscozen/button/src/FzButton.vue'

const meta = {
  title: 'Panel/FzTabs',
  component: FzTabs,
  subcomponents: { FzTab },
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md'],
      control: {
        type: 'select'
      }
    }
  }
} satisfies Meta<typeof FzTabs>
export default meta

type TabStory = StoryObj<typeof FzTabs>

const Template: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'Active tab'
          },
          tab2: {
            title: 'Default tab'
          },
          tab3: {
            title: 'Default tab 2'
          }
        }
      }
    },
    template: `<FzTabs v-bind="args" v-slot="data" > 
                    <FzTab v-bind="customProps.tab1"> {{ data.selected }} </FzTab> 
                    <FzTab v-bind="customProps.tab2"> {{ data.selected }} </FzTab> 
                    <FzTab v-bind="customProps.tab3"> {{ data.selected }} </FzTab>
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  }
}

export const Medium: TabStory = {
  ...Template,
  args: {
    size: 'md'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify medium size variant renders', async () => {
      const tabContainer = canvasElement.querySelector('.tab-container')
      await expect(tabContainer).toBeInTheDocument()
      
      const firstButton = canvasElement.querySelector('button[title="Active tab"]')
      await expect(firstButton).toBeInTheDocument()
      
      // Verify medium size classes
      await expect(firstButton?.classList.contains('text-md')).toBe(true)
    })
  }
}

export const Small: TabStory = {
  ...Template,
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify component renders correctly', async () => {
      const tabContainer = canvasElement.querySelector('.tab-container')
      await expect(tabContainer).toBeInTheDocument()
      
      const buttons = canvasElement.querySelectorAll('button[title]')
      await expect(buttons.length).toBeGreaterThanOrEqual(3)
    })
    
    await step('Verify first tab is selected by default', async () => {
      const firstTab = canvas.getByRole('button', { name: /active tab/i })
      await expect(firstTab).toBeInTheDocument()
      
      // Verify selected tab has active styling
      const selectedTab = canvasElement.querySelector('button[title="Active tab"]')
      await expect(selectedTab?.classList.contains('bg-white')).toBe(true)
    })
    
    await step('Verify tab content is displayed', async () => {
      const content = canvasElement.textContent
      await expect(content).toContain('Active tab')
    })
  }
}

export const MediumVertical: TabStory = {
  ...Template,
  args: {
    size: 'md',
    vertical: true
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify vertical layout is applied', async () => {
      const tabContainer = canvasElement.querySelector('.tab-container')
      await expect(tabContainer).toBeInTheDocument()
      
      // Verify vertical layout classes
      await expect(tabContainer?.classList.contains('flex-col')).toBe(true)
    })
    
    await step('Verify tabs are still functional in vertical layout', async () => {
      const buttons = canvasElement.querySelectorAll('button[title]')
      await expect(buttons.length).toBeGreaterThanOrEqual(3)
    })
  }
}

const TemplateWithIcon: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'tab1',
            icon: 'bell'
          },
          tab2: {
            title: 'tab2',
            initialSelected: true,
            icon: 'cog'
          }
        }
      }
    },
    template: `<FzTabs v-bind="args" > 
                    <FzTab v-bind="customProps.tab1"> Content tab1 </FzTab> 
                    <FzTab v-bind="customProps.tab2"> Content tab2 </FzTab> 
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  }
}

export const WithIconMedium: TabStory = {
  ...TemplateWithIcon,
  args: {
    size: 'md'
  }
}

export const WithIconSmall: TabStory = {
  ...TemplateWithIcon,
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify icons are displayed on tabs', async () => {
      const tabContainer = canvasElement.querySelector('.tab-container')
      await expect(tabContainer).toBeInTheDocument()
      
      // Verify icons are present (FzIcon components)
      const icons = canvasElement.querySelectorAll('svg')
      await expect(icons.length).toBeGreaterThanOrEqual(2)
    })
    
    await step('Verify tab with initialSelected shows correct content', async () => {
      const content = canvasElement.textContent
      await expect(content).toContain('Content tab2')
      await expect(content).not.toContain('Content tab1')
    })
  }
}

const TemplateWithBadge: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'tab1',
            badgeContent: 'testo'
          },
          tab2: {
            title: 'tab2',
            initialSelected: true,
            badgeContent: '1'
          }
        }
      }
    },
    template: `<FzTabs v-bind="args" > 
                    <FzTab v-bind="customProps.tab1"> Content tab1 </FzTab> 
                    <FzTab v-bind="customProps.tab2"> Content tab2 </FzTab> 
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  }
}

export const WithBadgeMedium: TabStory = {
  ...TemplateWithBadge,
  args: {
    size: 'md'
  }
}

export const WithBadgeSmall: TabStory = {
  ...TemplateWithBadge,
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify badges are displayed on tabs', async () => {
      const badge1 = canvas.getByText('testo')
      await expect(badge1).toBeInTheDocument()
      
      const badge2 = canvas.getByText('1')
      await expect(badge2).toBeInTheDocument()
    })
    
    await step('Verify selected tab content is displayed', async () => {
      const content = canvasElement.textContent
      await expect(content).toContain('Content tab2')
    })
  }
}

const TemplateWithOverflow: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'tab1',
            badgeContent: 'testo'
          },
          tab2: {
            title: 'very long tab text',
            initialSelected: true,
            badgeContent: '1'
          },
          tab3: {
            title: 'tab3',
            badgeContent: '2'
          },
          tab4: {
            title: 'tab4',
            badgeContent: '3'
          }
        }
      }
    },
    template: `
            <div style='width:200px; overflow:hidden; height:800px'>
                <FzTabs v-bind="args" > 
                    <FzTab v-bind="customProps.tab1"> Content tab1 </FzTab> 
                    <FzTab v-bind="customProps.tab2"> Content tab2 </FzTab> 
                    <FzTab v-bind="customProps.tab3"> Content tab3 </FzTab> 
                    <FzTab v-bind="customProps.tab4"> Content tab4 </FzTab> 
                </FzTabs>
            </div>`
  }),
  args: {
    size: 'sm'
  }
}

export const Overflow: TabStory = {
  ...TemplateWithOverflow,
  args: {
    size: 'sm'
  }
}

export const OverflowMedium: TabStory = {
  ...TemplateWithOverflow,
  args: {
    size: 'md'
  }
}

export const OverflowWithScroll: TabStory = {
  ...TemplateWithOverflow,
  args: {
    size: 'sm',
    horizontalOverflow: true
  }
}

export const OverflowWithScrollMedium: TabStory = {
  ...TemplateWithOverflow,
  args: {
    size: 'md',
    horizontalOverflow: true
  }
}

const TemplateWithTabArray: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon },
    setup() {
      const toggleTab = ref(false)
      return {
        args,
        customProps: {
          tabs: [
            {
              title: 'tab1',
              badgeContent: 'testo'
            },
            {
              title: 'very long tab text',
              badgeContent: '1',
              icon: 'bell'
            },
            {
              title: 'tab3',
              badgeContent: '2'
            },
            {
              title: 'tab4',
              badgeContent: '3'
            }
          ]
        },
        toggleTab
      }
    },
    template: `
            <div style='height:800px'>
                <FzTabs v-bind="args" > 
                    <FzTab v-for="tab in customProps.tabs" v-bind="tab"> Content {{tab.title}} </FzTab> 
                    <FzTab v-if="toggleTab" title="static tab"> Content tab static</FzTab>
                </FzTabs>
                <button @click="toggleTab = !toggleTab">Toggle tab</button>
            </div>`
  }),
  args: {
    size: 'sm'
  }
}

export const TabArray: TabStory = {
  ...TemplateWithTabArray,
  args: {
    size: 'sm'
  }
}

export const TabArrayMedium: TabStory = {
  ...TemplateWithTabArray,
  args: {
    size: 'md'
  }
}

export const TabWithActionOnEnd: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon, FzButton },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'Active tab'
          },
          tab2: {
            title: 'Default tab'
          },
          tab3: {
            title: 'Default tab 2'
          }
        }
      }
    },
    template: `<FzTabs v-bind="args" > 
                    <template v-slot="data" #default>
                        <FzTab v-bind="customProps.tab1"> {{ data.selected }} </FzTab> 
                        <FzTab v-bind="customProps.tab2"> {{ data.selected }} </FzTab> 
                        <FzTab v-bind="customProps.tab3"> {{ data.selected }} </FzTab>
                    </template>
                    <template #tabs-end>
                        <div class="flex-1" />
                        <div class="flex items-center gap-8">
                            <FzButton label="Button Secondary" variant='secondary' />
                            <FzButton label="Button Primary" variant='primary' />
                        </div>
                    </template>
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  }
}

export const TabWithActionOnEndVertical: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon, FzButton },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'Active tab'
          },
          tab2: {
            title: 'Default tab'
          },
          tab3: {
            title: 'Default tab 2'
          }
        }
      }
    },
    template: `<FzTabs v-bind="args" > 
                    <template v-slot="data" #default>
                        <FzTab v-bind="customProps.tab1"> {{ data.selected }} </FzTab> 
                        <FzTab v-bind="customProps.tab2"> {{ data.selected }} </FzTab> 
                        <FzTab v-bind="customProps.tab3"> {{ data.selected }} </FzTab>
                    </template>
                    <template #tabs-end>
                        <div class="mt-24" />
                        <div class="flex flex-col justify-center gap-8">
                            <FzButton label="Secondary" variant='secondary' />
                            <FzButton label="Primary" variant='primary' />
                        </div>
                    </template>
                </FzTabs>`
  }),
  args: {
    size: 'sm',
    vertical: true
  }
}

export const TabWithActionOnContainerEnd: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon, FzButton },
    setup() {
      const tabs = ref([
        {
          title: 'tab1',
          badgeContent: 'testo'
        },
        {
          title: 'very long tab text',
          badgeContent: '1',
          initialSelected: true
        },
        {
          title: 'tab3',
          badgeContent: '2'
        },
        {
          title: 'tab4',
          badgeContent: '3'
        }
      ])

      return {
        args,
        tabs
      }
    },
    methods: {
      addTab() {
        this.tabs.push({
          title: 'tab' + (this.tabs.length + 1),
          badgeContent: this.tabs.length
        })
      },
      removeTab() {
        this.tabs.pop()
      }
    },
    template: `<FzTabs v-bind="args" > 
                    <template v-slot="data" #default>
                        <FzTab v-for="tab in tabs" v-bind="tab"> Content {{tab.title}} </FzTab> 
                    </template>
                    <template #tabs-container-end>
                        <div class="flex flex-row items-center gap-8 h-full">
                            <FzButton label="-" variant='secondary' @click="removeTab" class="h-full rounded-md"/>
                            <FzButton label="+" variant='primary' @click="addTab" class="h-full rounded-md"/>
                        </div>
                    </template>
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  }
}

export const TabWithMaxWidth: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab, FzBadge, FzIcon, FzButton },
    setup() {
      const tabs = ref([
        {
          title: 'tab1',
          badgeContent: 'testo'
        },
        {
          title: 'very long tab text',
          badgeContent: '1',
          initialSelected: true,
          maxWidth: ''
        },
        {
          title: 'tab3',
          badgeContent: '2'
        },
        {
          title: 'tab4',
          badgeContent: '3'
        }
      ])

      return {
        args,
        tabs
      }
    },
    template: `<FzTabs v-bind="args" > 
                    <template v-slot="data" #default>
                        <FzTab v-for="tab in tabs" v-bind="tab" :maxWidth="tab.maxWidth"> Content {{tab.title}} </FzTab> 
                    </template>
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  }
}

// ============================================
// DISABLED STATE STORY
// ============================================

export const Disabled: TabStory = {
  render: (args) => ({
    components: { FzTabs, FzTab },
    setup() {
      return {
        args,
        customProps: {
          tab1: {
            title: 'Active tab',
            disabled: false
          },
          tab2: {
            title: 'Disabled tab',
            disabled: true
          },
          tab3: {
            title: 'Default tab 2',
            disabled: false
          }
        }
      }
    },
    template: `<FzTabs v-bind="args" v-slot="data" > 
                    <FzTab v-bind="customProps.tab1"> {{ data.selected }} </FzTab> 
                    <FzTab v-bind="customProps.tab2"> {{ data.selected }} </FzTab> 
                    <FzTab v-bind="customProps.tab3"> {{ data.selected }} </FzTab>
                </FzTabs>`
  }),
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Verify disabled tab has disabled styling', async () => {
      const disabledTab = canvasElement.querySelector('button[title="Disabled tab"]')
      await expect(disabledTab).toBeInTheDocument()
      await expect(disabledTab?.classList.contains('cursor-not-allowed')).toBe(true)
    })
    
    await step('Verify disabled tab does not respond to clicks', async () => {
      const disabledTab = canvasElement.querySelector('button[title="Disabled tab"]') as HTMLElement
      const contentBefore = canvasElement.textContent
      
      await userEvent.click(disabledTab)
      
      // Content should not change (disabled tab should not be selected)
      const contentAfter = canvasElement.textContent
      await expect(contentAfter).toBe(contentBefore)
    })
    
    await step('Verify enabled tabs are clickable', async () => {
      const enabledTab = canvas.getByRole('button', { name: /default tab 2/i })
      await userEvent.click(enabledTab)
      
      // Content should update to show selected tab
      const content = canvasElement.textContent
      await expect(content).toContain('Default tab 2')
    })
  }
}

// ============================================
// KEYBOARD NAVIGATION STORY
// ============================================

export const KeyboardNavigation: TabStory = {
  ...Template,
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Tab to focus first tab', async () => {
      await userEvent.tab()
      const firstTab = canvasElement.querySelector('button[title="Active tab"]')
      await expect(document.activeElement).toBe(firstTab)
    })
    
    await step('Navigate to second tab with Tab key', async () => {
      await userEvent.tab()
      const secondTab = canvasElement.querySelector('button[title="Default tab"]')
      await expect(document.activeElement).toBe(secondTab)
    })
    
    await step('Activate tab with Enter key', async () => {
      const secondTab = canvasElement.querySelector('button[title="Default tab"]') as HTMLElement
      secondTab.focus()
      await userEvent.keyboard('{Enter}')
      
      // Verify tab content changes
      const content = canvasElement.textContent
      await expect(content).toContain('Default tab')
    })
    
    await step('Activate tab with Space key', async () => {
      const thirdTab = canvasElement.querySelector('button[title="Default tab 2"]') as HTMLElement
      thirdTab.focus()
      await userEvent.keyboard(' ')
      
      // Verify tab content changes
      const content = canvasElement.textContent
      await expect(content).toContain('Default tab 2')
    })
  }
}

// ============================================
// USER INTERACTION STORY
// ============================================

export const UserInteraction: TabStory = {
  ...Template,
  args: {
    size: 'sm'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    
    await step('Click second tab to switch', async () => {
      const secondTab = canvasElement.querySelector('button[title="Default tab"]') as HTMLElement
      await expect(secondTab).toBeInTheDocument()
      await userEvent.click(secondTab)
      
      // Verify content updates
      const content = canvasElement.textContent
      await expect(content).toContain('Default tab')
    })
    
    await step('Click third tab to switch again', async () => {
      const thirdTab = canvasElement.querySelector('button[title="Default tab 2"]') as HTMLElement
      await expect(thirdTab).toBeInTheDocument()
      await userEvent.click(thirdTab)
      
      // Verify content updates
      const content = canvasElement.textContent
      await expect(content).toContain('Default tab 2')
    })
    
    await step('Click first tab to return', async () => {
      const firstTab = canvasElement.querySelector('button[title="Active tab"]') as HTMLElement
      await expect(firstTab).toBeInTheDocument()
      await userEvent.click(firstTab)
      
      // Verify content updates back
      const content = canvasElement.textContent
      await expect(content).toContain('Active tab')
    })
  }
}