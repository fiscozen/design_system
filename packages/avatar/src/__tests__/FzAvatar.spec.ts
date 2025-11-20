import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { FzAvatar } from '..'

describe.concurrent('FzAvatar', () => {
  it('image matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi',
        src: 'https://example.com',
        size: 'xl'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('placeholder matches snapshot', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render image source prop', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi',
        src: 'https://example.com'
      }
    })

    expect(wrapper.html()).toContain('https://example.com')
  })

  it('should render placeholder initials', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi'
      }
    })

    expect(wrapper.html()).toContain('MR')
  })

  it('should render size', async ({ expect }) => {
    const wrapper = mount(FzAvatar, {
      props: {
        firstName: 'Mario',
        lastName: 'Rossi',
        src: 'https://example.com',
        size: 'xl'
      },
      attachTo: document.body
    })

    expect(wrapper.find('img').classes()).toContain('size-44')
  })

  describe('environment prop', () => {
    it('should use frontoffice by default', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com'
        },
        attachTo: document.body
      })

      const container = wrapper.find('div')
      expect(container.classes()).toContain('gap-12')
      const img = wrapper.find('img')
      expect(img.classes()).toContain('size-44')
    })

    it('should apply backoffice environment classes', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com',
          environment: 'backoffice'
        },
        attachTo: document.body
      })

      const container = wrapper.find('div')
      expect(container.classes()).toContain('gap-8')
      const img = wrapper.find('img')
      expect(img.classes()).toContain('size-32')
    })

    it('should apply frontoffice environment classes', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com',
          environment: 'frontoffice'
        },
        attachTo: document.body
      })

      const container = wrapper.find('div')
      expect(container.classes()).toContain('gap-12')
      const img = wrapper.find('img')
      expect(img.classes()).toContain('size-44')
    })

    it('should apply backoffice size to placeholder', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          environment: 'backoffice'
        },
        attachTo: document.body
      })

      const placeholder = wrapper.find('[title="Mario Rossi"]')
      expect(placeholder.classes()).toContain('size-32')
    })

    it('should apply frontoffice size to placeholder', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          environment: 'frontoffice'
        },
        attachTo: document.body
      })

      const placeholder = wrapper.find('[title="Mario Rossi"]')
      expect(placeholder.classes()).toContain('size-44')
    })
  })

  describe('variant prop', () => {
    it('should use default (circular) variant by default', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com'
        },
        attachTo: document.body
      })

      const img = wrapper.find('img')
      expect(img.classes()).toContain('rounded-full')
      expect(img.classes()).not.toContain('rounded-[8px]')
    })

    it('should apply square variant classes', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          src: 'https://example.com',
          variant: 'square'
        },
        attachTo: document.body
      })

      const img = wrapper.find('img')
      expect(img.classes()).toContain('rounded-[8px]')
      expect(img.classes()).not.toContain('rounded-full')
    })

    it('should apply square variant to placeholder', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          variant: 'square'
        },
        attachTo: document.body
      })

      const placeholder = wrapper.find('[data-testid="avatar-placeholder"]')
      expect(placeholder.classes()).toContain('rounded-[8px]')
      expect(placeholder.classes()).not.toContain('rounded-full')
    })
  })

  describe('title and subtitle props', () => {
    it('should render title when provided', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title'
        }
      })

      expect(wrapper.html()).toContain('Title')
      const title = wrapper.find('p')
      expect(title.text()).toBe('Title')
    })

    it('should render subtitle when provided', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          subtitle: 'Subtitle'
        }
      })

      expect(wrapper.html()).toContain('Subtitle')
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.some((p) => p.text() === 'Subtitle')).toBe(true)
    })

    it('should render both title and subtitle', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle'
        }
      })

      expect(wrapper.html()).toContain('Title')
      expect(wrapper.html()).toContain('Subtitle')
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs.length).toBe(2)
      expect(paragraphs[0].text()).toBe('Title')
      expect(paragraphs[1].text()).toBe('Subtitle')
    })

    it('should not render text container when title and subtitle are not provided', async ({
      expect
    }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi'
        }
      })

      const textContainer = wrapper.find('.flex.flex-col')
      expect(textContainer.exists()).toBe(false)
    })

    it('should apply backoffice text classes', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle',
          environment: 'backoffice'
        },
        attachTo: document.body
      })

      const textContainer = wrapper.find('.flex.flex-col')
      expect(textContainer.classes()).toContain('gap-0')

      const title = wrapper.findAll('p')[0]
      expect(title.classes()).toContain('text-sm')
      expect(title.classes()).toContain('!leading-[16px]')
    })

    it('should apply frontoffice text classes', async ({ expect }) => {
      const wrapper = mount(FzAvatar, {
        props: {
          firstName: 'Mario',
          lastName: 'Rossi',
          title: 'Title',
          subtitle: 'Subtitle',
          environment: 'frontoffice'
        },
        attachTo: document.body
      })

      const textContainer = wrapper.find('.flex.flex-col')
      expect(textContainer.classes()).toContain('gap-[2px]')

      const title = wrapper.findAll('p')[0]
      expect(title.classes()).toContain('text-base')
      expect(title.classes()).toContain('!leading-[20px]')
    })
  })
})
