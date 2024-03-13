import type { Meta } from '@storybook/vue3'
import { vueRouter } from 'storybook-vue3-router'
import { useRoute, useRouter } from 'vue-router'
import { FzNavlink, FzRouterNavlink } from '@fiscozen/navlink'

const Page = {
  setup() {
    const route = useRoute()
    const router = useRouter()

    const routes = router.getRoutes()

    return {
      route,
      routes
    }
  },
  template: `
    <div>
        <h2>Page {{ route.name }}</h2>                
        <pre>full path: {{route.fullPath}}</pre>
    </div>
  `
}
const routes = [
  {
    name: 'home',
    path: '/',
    component: Page,
    children: [
      {
        name: 'foo',
        path: '/foo',
        component: Page,
        children: [
          {
            name: 'bar',
            path: '/foo/bar',
            component: Page
          }
        ]
      },
      {
        name: 'baz',
        path: '/foo/baz',
        component: Page
      }
    ]
  }
]

// More on how to set up stories at:
const meta = {
  title: 'Navlink',
  component: FzNavlink,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {},
  args: { disabled: false, meta: { some: '' } } // default value
} satisfies Meta<typeof FzNavlink>

export default meta

/**
 * STORYBOOK EXPORT
 */

/* Create story with StoryBook Args */
const navlinkWithArgs = (args) => ({
  setup() {
    return { args }
  },
  components: { page: Page, FzNavlink },
  template: `
    <fz-navlink
      v-bind="args"></fz-navlink>
  `
})

export const SimpleNavlink = navlinkWithArgs.bind({})
SimpleNavlink.args = {
  label: 'Lorem ipsum'
}

export const IconNavlink = navlinkWithArgs.bind({})
IconNavlink.args = {
  iconName: 'bell',
  iconOnly: true
}

const navlinkRouterLink = (args) => ({
  setup() {
    return { args }
  },
  components: { page: Page, FzNavlink, FzRouterNavlink },
  template: `
    <fz-router-navlink
      :disabled="args.disabled"
      :meta="args.meta"
      :label="args.label"
      :icon-name="args.iconName"></fz-router-navlink>
    <br/>
    <router-view />
  `
})

export const RouterNavlink = navlinkRouterLink.bind({})
RouterNavlink.args = {
  label: 'router navlink',
  meta: {
    path: '/foo/bar'
  }
}
RouterNavlink.decorators = [
  vueRouter(routes, {
    initialRoute: '/foo'
  })
]