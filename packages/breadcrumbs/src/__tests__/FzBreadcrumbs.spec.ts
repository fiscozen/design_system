import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { RouteRecordRaw, createRouter, createWebHistory, useRoute, useRouter } from 'vue-router'

import { Breadcrumb, CustomRouteLocation, FzRouterBreadcrumbs } from '..'

const breadcrumbs: Breadcrumb<CustomRouteLocation>[] = [
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
  }
]

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
        <h3>Test links</h3>
        <div class="flex flex-row">
          <router-link class="px-4 underline" v-for="routeRec in routes" :to="routeRec.path">{{routeRec.name}}</router-link>
        </div>
    </div>
  `
}

const routes: RouteRecordRaw[] = [
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

const App = {
  components: { FzRouterBreadcrumbs },
  template: `
    <fz-router-breadcrumbs />
    <router-view />
  `
}

describe('FzRouterBreadcrumbs', () => {
  it('should match snapshot for static breadcrumbs', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(FzRouterBreadcrumbs, {
      props: {
        breadcrumbs
      },
      global: {
        plugins: [router]
      }
    })

    await flushPromises()
    expect(wrapper.html()).toMatchSnapshot()
    expect(
      wrapper.findComponent({ name: 'fz-breadcrumbs' }).findAllComponents({ name: 'router-link' })
    ).to.have.length(4)
  })

  it('should match snapshot for automatic breadcrumbs', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/foo/bar')
    await flushPromises()

    expect(wrapper.html()).toMatchSnapshot()
    expect(
      wrapper
        .findComponent({ name: 'fz-router-breadcrumbs' })
        .findComponent({ name: 'fz-breadcrumbs' })
        .findAllComponents({ name: 'router-link' })
    ).to.have.length(3)
  })
})
