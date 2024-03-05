import type { Meta } from '@storybook/vue3'
import { vueRouter} from 'storybook-vue3-router';
import { useRoute } from 'vue-router'

import { FzBreadcrumbs, Breadcrumb, CustomRouteLocation } from '@fiscozen/breadcrumbs'

const Page = {
  setup () {
    const route = useRoute()
    
    return {
        route,
    }
  },
  template: `
    <div>
        <h2>Page {{ route.name }}</h2>                
        <pre>full path: {{route.fullPath}}<pre/>
    </div>
  `
};
const routes = [
    {
        name: 'foo',
        path: '/foo',
        component: Page,
    },
    {
        name: 'bar',
        path: '/foo/bar',
        component: Page,
    },
    {
        name: 'baz',
        path: '/foo/bar/baz',
        component: Page,
    },
]

const breadcrumbs: Breadcrumb<CustomRouteLocation>[] = routes.map((el) => ({
    id: el.name,
    label: el.name,
    metadata: el    
}))

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'BreadCrumbs',
  component: FzBreadcrumbs,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
    breadcrumbs
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
      <router-view />
  `
})

export const Default = withArgs.bind({})
/* args are passed to route component via <router-view> props */
Default.args = {
  routerLinkParam: 'some-url-parameter',
}
Default.decorators = [
  vueRouter(
    routes,
    {
      initialRoute: '/foo'
    }
  )
]