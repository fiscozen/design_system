import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzAlert } from '..'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ name: '', path: '/example', component: () => {} }]
})

describe.concurrent('FzAlert', () => {
  it('matches info alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches error alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches warning alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches success alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches info collapsable alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'collapsable',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches error collapsable alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'collapsable',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger collapsable alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'collapsable',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches warning collapsable alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'collapsable',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches success collapsable alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'collapsable',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches info simple alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'simple',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches error simple alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'simple',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches danger simple alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'simple',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches warning simple alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'simple',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches success simple alert', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        style: 'simple',
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches success alert with button and link', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        buttonActionLabel: 'Button action here',
        showLinkAction: true,
        linkActionLabel: 'This is a link',
        linkActionLocation: '/example'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches success alert with link only', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        showButtonAction: false,
        showLinkAction: true,
        linkActionLabel: 'This is a link',
        linkActionLocation: '/example'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches success alert with link only and target prop', async ({ expect }) => {
    const wrapper = mount(FzAlert, {
      props: {
        type: 'info',
        title: 'Title here',
        showButtonAction: false,
        showLinkAction: true,
        linkActionLabel: 'This is a link',
        linkActionLocation: '/example',
        linkActionTarget: '_blank'
      },
      slots: {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
