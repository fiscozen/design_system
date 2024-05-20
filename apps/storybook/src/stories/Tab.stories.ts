import type { Meta, StoryObj } from '@storybook/vue3'
import { FzTabs, FzTab } from '@fiscozen/tab'
import FzBadge from '@fiscozen/badge/src/FzBadge.vue'
import FzIcon from '@fiscozen/icons/src/FzIcon.vue'


const meta = {
    title: 'Tab',
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
                customProps:{
                    tab1: {
                        title: 'Active tab',
                    },
                    tab2: {
                        title: 'Default tab',
                    },
                    tab3: {
                        title: 'Default tab 2'
                    },
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
        size: 'sm',
    },
}

export const Medium: TabStory = {
    ...Template,
    args: {
        size: 'md'
    }
}

export const Small: TabStory = {
    ...Template,
    args: {
        size: 'sm'
    }
}

export const MediumVertical: TabStory = {
    ...Template,
    args: {
        size: 'md',
        vertical: true
    }
}

const TemplateWithIcon: TabStory = {
    render: (args) => ({
        components: { FzTabs, FzTab, FzBadge, FzIcon },
        setup() {
            return {
                args,
                customProps:{
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
        size: 'sm',
    },
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
    }
}

const TemplateWithBadge: TabStory = {
    render: (args) => ({
        components: { FzTabs, FzTab, FzBadge, FzIcon },
        setup() {
            return {
                args,
                customProps:{
                    tab1: {
                        title: 'tab1',
                        badgeContent: "testo"
                    },
                    tab2: {
                        title: 'tab2',
                        initialSelected: true,
                        badgeContent: "1"
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
        size: 'sm',
    },
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
    }
}

const TemplateWithOverflow: TabStory = {
    render: (args) => ({
        components: { FzTabs, FzTab, FzBadge, FzIcon },
        setup() {
            return {
                args,
                customProps:{
                    tab1: {
                        title: 'tab1',
                        badgeContent: "testo"
                    },
                    tab2: {
                        title: 'very long tab text',
                        initialSelected: true,
                        badgeContent: "1"
                    },
                    tab3: {
                        title: 'tab3',
                        badgeContent: "2"
                    },
                    tab4: {
                        title: 'tab4',
                        badgeContent: "3"
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
        size: 'sm',
    },
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
            return {
                args,
                customProps:{
                    tabs: [
                        {
                            title: 'tab1',
                            badgeContent: "testo"
                        },
                        {
                            title: 'very long tab text',
                            badgeContent: "1"
                        },
                        {
                            title: 'tab3',
                            badgeContent: "2"
                        },
                        {
                            title: 'tab4',
                            badgeContent: "3"
                        }
                    ]
                }
            }
        },
        template: `
            <div style='height:800px'>
                <FzTabs v-bind="args" > 
                    <FzTab v-for="tab in customProps.tabs" v-bind="tab"> Content {{tab.title}} </FzTab> 
                    <FzTab title="static tab"> Content tab static</FzTab>
                </FzTabs>
            </div>`
    }),
    args: {
        size: 'sm',
    },
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