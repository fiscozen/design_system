import type { Meta } from '@storybook/vue3'
import { vueRouter} from 'storybook-vue3-router';
import { useRoute, useRouter } from 'vue-router'

import { FzBreadcrumbs, Breadcrumb, CustomRouteLocation } from '@fiscozen/breadcrumbs'

const Page = {
  setup () {
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
        <h3>Test links</h3>
        <div class="flex flex-row">
          <router-link class="px-4 underline" v-for="routeRec in routes" :to="routeRec.path">{{routeRec.name}}</router-link>
        </div>
    </div>
  `
};
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
                    component: Page,
                }
              ]
          },
          {
              name: 'baz',
              path: '/foo/baz',
              component: Page,
          },
        ]
    },
]

// More on how to set up stories at: 
const meta = {
  title: 'BreadCrumbs',
  component: FzBreadcrumbs,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
  } // default value
} satisfies Meta<typeof FzBreadcrumbs>

export default meta




/**
 * STORYBOOK EXPORT
 */

/* Create story with StoryBook Args */
const withArgs = (args) => ({
  setup () {
    /* make `args` available within template */
    return { args }
  },
  components: { 'page': Page, 'FzBreadcrumbs': FzBreadcrumbs },
  /* create template and pass Storybook args to <router-view> using props */
  template: `
    <fz-breadcrumbs 
        :breadcrumbs="args.breadcrumbs" />
    <br/>
    <router-view />

  `
})

export const Default = withArgs.bind({})
/* args are passed to route component via <router-view> props */
Default.decorators = [
  vueRouter(
    routes,
    {
      initialRoute: '/foo'
    }
  )
]

export const Static = withArgs.bind({})
Static.args = {
  breadcrumbs: [
    {
      id: 'home',
      label: 'home',
      metadata: {
        name: 'home',
        path: '/'
      }
    },
    {
      id: 'foo',
      label: 'foo',
      metadata: {
        name: 'foo',
        path: '/foo'
      }
    },
    {
      id: 'bar',
      label: 'bar',
      metadata: {
        name: 'bar',
        path: '/foo/bar'
      }
    },
    {
      id: 'baz',
      label: 'baz',
      metadata: {
        name: 'baz',
        path: '/foo/baz'
      }
    },
  ]
}
Static.decorators = [
  vueRouter(
    routes,
    {
      initialRoute: '/foo'
    }
  )
]